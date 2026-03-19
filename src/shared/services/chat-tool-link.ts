import { generateId } from 'ai';

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

const TOOL_SURFACES = ['image', 'video'] as const;
const TOOL_MODES = [
  'text-to-image',
  'image-to-image',
  'text-to-video',
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
}: {
  currentMetadata: string | null | undefined;
  context: ToolChatContext;
  model: string;
}) {
  return {
    ...safeParseMetadata(currentMetadata),
    ...context,
    model,
  };
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

    chat = await updateChat(chat.id, {
      metadata: JSON.stringify(
        mergeToolMetadata({
          currentMetadata: chat.metadata,
          context,
          model,
        })
      ),
      updatedAt: new Date(),
    });
  } else {
    const currentTime = new Date();
    const initialParts = trimmedPrompt ? buildUserMessageParts(trimmedPrompt) : [];

    chat = await createChat({
      id: generateId().toLowerCase(),
      userId,
      status: ChatStatus.CREATED,
      createdAt: currentTime,
      updatedAt: currentTime,
      model,
      provider,
      title: (trimmedPrompt || `${surface} ${mode}`).slice(0, 100),
      parts: initialParts.length > 0 ? JSON.stringify(initialParts) : '[]',
      metadata: JSON.stringify(
        mergeToolMetadata({
          currentMetadata: null,
          context,
          model,
        })
      ),
      content: trimmedPrompt
        ? JSON.stringify({
            text: trimmedPrompt,
          })
        : null,
    });

    created = true;
  }

  if (!chat) {
    throw new Error('failed to create or resume chat');
  }

  const shouldAppendPrompt = Boolean(trimmedPrompt) && (appendPrompt || created);

  if (shouldAppendPrompt) {
    await appendToolPromptMessage({
      chatId: chat.id,
      userId,
      model,
      provider,
      prompt: trimmedPrompt,
      metadata: mergeToolMetadata({
        currentMetadata: chat.metadata,
        context,
        model,
      }),
    });

    chat = await updateChat(chat.id, {
      updatedAt: new Date(),
      parts: JSON.stringify(buildUserMessageParts(trimmedPrompt)),
      content: JSON.stringify({
        text: trimmedPrompt,
      }),
    });
  }

  return {
    chat,
    created,
    appendedPrompt: shouldAppendPrompt,
  };
}
