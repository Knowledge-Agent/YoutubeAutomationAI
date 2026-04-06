import { generateId } from 'ai';

import { AIMediaType } from '@/extensions/ai';
import { updateAITaskById } from '@/shared/models/ai_task';
import {
  Chat,
  ChatStatus,
  createChat,
  findChatById,
  updateChat,
} from '@/shared/models/chat';
import {
  ChatMessageStatus,
  createChatMessage,
  NewChatMessage,
} from '@/shared/models/chat_message';
import { createToolTask } from '@/shared/services/tool-tasks';

const TOOL_SURFACES = ['image', 'video'] as const;
const TOOL_MODES = [
  'text-to-image',
  'image-to-image',
  'text-to-video',
  'image-to-video',
] as const;

export type ToolChatSurface = (typeof TOOL_SURFACES)[number];
export type ToolChatMode = (typeof TOOL_MODES)[number];

export interface ToolChatContext {
  source: 'tool';
  toolSurface: ToolChatSurface;
  toolMode: ToolChatMode;
  toolModel?: string;
  toolOptions?: Record<string, unknown>;
}

export interface ToolChatMetadata extends ToolChatContext {
  model?: string;
  toolPrompt?: string;
  latestTaskId?: string;
  latestTaskStatus?: string;
}

export function isToolChatSurface(value: string): value is ToolChatSurface {
  return TOOL_SURFACES.includes(value as ToolChatSurface);
}

export function isToolChatMode(value: string): value is ToolChatMode {
  return TOOL_MODES.includes(value as ToolChatMode);
}

function safeParseMetadata(value: string | null | undefined) {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function buildUserMessageParts(prompt: string) {
  return [
    {
      type: 'text',
      text: prompt,
    },
  ];
}

function mergeToolMetadata({
  currentMetadata,
  context,
  model,
  prompt,
  latestTaskId,
  latestTaskStatus,
}: {
  currentMetadata: string | null | undefined;
  context: ToolChatContext;
  model: string;
  prompt?: string;
  latestTaskId?: string;
  latestTaskStatus?: string;
}) {
  const current = safeParseMetadata(currentMetadata);

  return {
    ...current,
    ...context,
    model,
    toolPrompt: prompt ?? current.toolPrompt,
    latestTaskId: latestTaskId ?? current.latestTaskId,
    latestTaskStatus: latestTaskStatus ?? current.latestTaskStatus,
  };
}

function getToolMediaType(surface: ToolChatSurface) {
  return surface === 'image' ? AIMediaType.IMAGE : AIMediaType.VIDEO;
}

async function appendToolPromptMessage({
  chatId,
  userId,
  model,
  provider,
  prompt,
  metadata,
}: {
  chatId: string;
  userId: string;
  model: string;
  provider: string;
  prompt: string;
  metadata: Record<string, unknown>;
}) {
  const currentTime = new Date();
  const parts = buildUserMessageParts(prompt);

  const newMessage: NewChatMessage = {
    id: generateId().toLowerCase(),
    chatId,
    userId,
    status: ChatMessageStatus.CREATED,
    createdAt: currentTime,
    updatedAt: currentTime,
    role: 'user',
    parts: JSON.stringify(parts),
    metadata: JSON.stringify(metadata),
    model,
    provider,
  };

  await createChatMessage(newMessage);

  return {
    currentTime,
    parts,
  };
}

export async function createOrResumeToolChat({
  chatId,
  userId,
  prompt,
  surface,
  mode,
  model,
  toolModel,
  toolOptions,
  appendPrompt = true,
}: {
  chatId?: string;
  userId: string;
  prompt?: string;
  surface: ToolChatSurface;
  mode: ToolChatMode;
  model: string;
  toolModel?: string;
  toolOptions?: Record<string, unknown>;
  appendPrompt?: boolean;
}): Promise<{
  chat: Chat;
  created: boolean;
  appendedPrompt: boolean;
}> {
  const trimmedPrompt = prompt?.trim() ?? '';

  if (!chatId && !trimmedPrompt) {
    throw new Error('prompt is required when creating a tool chat');
  }

  const provider = 'apimart';
  const context: ToolChatContext = {
    source: 'tool',
    toolSurface: surface,
    toolMode: mode,
    toolModel: toolModel || model,
    toolOptions: toolOptions || {},
  };

  let chat: Chat | undefined;
  let created = false;

  if (chatId) {
    chat = await findChatById(chatId);

    if (!chat) {
      throw new Error('chat not found');
    }

    if (chat.userId !== userId) {
      throw new Error('no permission to access this chat');
    }
  } else {
    chat = await createChat({
      id: generateId().toLowerCase(),
      userId,
      status: ChatStatus.CREATED,
      createdAt: new Date(),
      updatedAt: new Date(),
      model,
      provider,
      title: `${surface === 'image' ? 'Image' : 'Video'} Generator`,
      parts: '[]',
      metadata: JSON.stringify(
        mergeToolMetadata({
          currentMetadata: null,
          context,
          model,
          prompt: trimmedPrompt || undefined,
        })
      ),
      content: null,
    });

    created = true;
  }

  if (!chat) {
    throw new Error('failed to create or resume chat');
  }

  const shouldAppendPrompt =
    Boolean(trimmedPrompt) && (appendPrompt || created);
  const nextMetadata = mergeToolMetadata({
    currentMetadata: chat.metadata,
    context,
    model,
    prompt: trimmedPrompt || undefined,
  });

  if (shouldAppendPrompt) {
    await appendToolPromptMessage({
      chatId: chat.id,
      userId,
      model,
      provider,
      prompt: trimmedPrompt,
      metadata: nextMetadata,
    });

    chat = await updateChat(chat.id, {
      updatedAt: new Date(),
      metadata: JSON.stringify(nextMetadata),
      parts: JSON.stringify(buildUserMessageParts(trimmedPrompt)),
      content: JSON.stringify({
        text: trimmedPrompt,
      }),
    });
  } else if (!created) {
    chat = await updateChat(chat.id, {
      metadata: JSON.stringify(nextMetadata),
      updatedAt: new Date(),
    });
  }

  return {
    chat,
    created,
    appendedPrompt: shouldAppendPrompt,
  };
}

export async function ensureToolChat({
  chatId,
  userId,
  surface,
  mode,
  model,
  toolModel,
  toolOptions,
}: {
  chatId?: string;
  userId: string;
  surface: ToolChatSurface;
  mode: ToolChatMode;
  model: string;
  toolModel?: string;
  toolOptions?: Record<string, unknown>;
}) {
  const context: ToolChatContext = {
    source: 'tool',
    toolSurface: surface,
    toolMode: mode,
    toolModel: toolModel || model,
    toolOptions: toolOptions || {},
  };

  if (chatId) {
    const chat = await findChatById(chatId);

    if (!chat) {
      throw new Error('chat not found');
    }

    if (chat.userId !== userId) {
      throw new Error('no permission to access this chat');
    }

    const metadata = mergeToolMetadata({
      currentMetadata: chat.metadata,
      context,
      model,
    });

    return await updateChat(chat.id, {
      metadata: JSON.stringify(metadata),
      updatedAt: new Date(),
    });
  }

  return await createChat({
    id: generateId().toLowerCase(),
    userId,
    status: ChatStatus.CREATED,
    createdAt: new Date(),
    updatedAt: new Date(),
    model,
    provider: 'apimart',
    title: `${surface === 'image' ? 'Image' : 'Video'} Generator`,
    parts: '[]',
    metadata: JSON.stringify(
      mergeToolMetadata({
        currentMetadata: null,
        context,
        model,
      })
    ),
    content: null,
  });
}

export async function startToolChatSession({
  chatId,
  userId,
  prompt,
  surface,
  mode,
  model,
  toolModel,
  toolOptions,
  appendPrompt = true,
}: {
  chatId?: string;
  userId: string;
  prompt: string;
  surface: ToolChatSurface;
  mode: ToolChatMode;
  model: string;
  toolModel?: string;
  toolOptions?: Record<string, unknown>;
  appendPrompt?: boolean;
}) {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    throw new Error('prompt is required');
  }

  const normalizedToolModel = toolModel || model;
  const normalizedToolOptions = toolOptions || {};

  if (chatId) {
    const existingChat = await findChatById(chatId);
    if (!existingChat) {
      throw new Error('chat not found');
    }

    if (existingChat.userId !== userId) {
      throw new Error('no permission to access this chat');
    }
  }

  const task = await createToolTask({
    userId,
    mediaType: getToolMediaType(surface),
    scene: mode,
    model: normalizedToolModel,
    prompt: trimmedPrompt,
    options: normalizedToolOptions,
  });

  const session = await createOrResumeToolChat({
    chatId,
    userId,
    prompt: trimmedPrompt,
    surface,
    mode,
    model,
    toolModel: normalizedToolModel,
    toolOptions: normalizedToolOptions,
    appendPrompt,
  });

  await updateAITaskById(task.id, {
    chatId: session.chat.id,
  });

  const metadata = mergeToolMetadata({
    currentMetadata: session.chat.metadata,
    context: {
      source: 'tool',
      toolSurface: surface,
      toolMode: mode,
      toolModel: normalizedToolModel,
      toolOptions: normalizedToolOptions,
    },
    model,
    prompt: trimmedPrompt,
    latestTaskId: task.id,
    latestTaskStatus: task.status,
  });

  const chat = await updateChat(session.chat.id, {
    metadata: JSON.stringify(metadata),
    updatedAt: new Date(),
  });

  return {
    chat,
    task,
    created: session.created,
    appendedPrompt: session.appendedPrompt,
  };
}
