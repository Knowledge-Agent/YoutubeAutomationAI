import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import {
  convertToModelMessages,
  createIdGenerator,
  generateId,
  streamText,
  UIMessage,
} from 'ai';

import { ChatStatus, createChat, findChatById, updateChat } from '@/shared/models/chat';
import {
  ChatMessageStatus,
  createChatMessage,
  getRecentChatMessages,
  NewChatMessage,
} from '@/shared/models/chat_message';
import { getAllConfigs } from '@/shared/models/config';
import { createUserProject } from '@/shared/models/project';

export async function streamApimartUIResponse({
  messages,
  model,
}: {
  messages: UIMessage[];
  model: string;
}) {
  const configs = await getAllConfigs();
  const apiKey = configs.apimart_api_key;
  const baseURL = configs.apimart_base_url || 'https://api.apimart.ai/v1';

  if (!apiKey) {
    throw new Error('apimart_api_key is not set');
  }

  const provider = createOpenRouter({
    apiKey,
    baseURL,
  });

  const response = streamText({
    model: provider.chat(model),
    messages: convertToModelMessages(messages),
  });

  return response.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: createIdGenerator({ size: 16 }),
  });
}

export async function streamPersistedChatResponse({
  chatId,
  message,
  model,
  user,
  metadata,
}: {
  chatId: string;
  message: UIMessage;
  model: string;
  user: { id: string };
  metadata?: Record<string, unknown>;
}) {
  const chat = await findChatById(chatId);
  if (chat && chat.userId !== user.id) {
    throw new Error('no permission to access this chat');
  }

  const provider = 'apimart';
  const currentTime = new Date();
  const messageParts = Array.isArray(message.parts) ? message.parts : [];
  const firstTextPart = messageParts.find(
    (part) => part.type === 'text' && typeof part.text === 'string'
  ) as { text?: string } | undefined;
  const chatTitle = (firstTextPart?.text || 'New chat').slice(0, 100);

  if (!chat) {
    const project = await createUserProject({
      userId: user.id,
      title: chatTitle,
    });

    await createChat({
      id: chatId,
      userId: user.id,
      projectId: project.id,
      status: ChatStatus.CREATED,
      createdAt: currentTime,
      updatedAt: currentTime,
      model,
      provider,
      title: chatTitle,
      parts: JSON.stringify(messageParts),
      metadata: metadata ? JSON.stringify(metadata) : null,
      content: JSON.stringify(message),
    });
  } else if (!chat.projectId) {
    const project = await createUserProject({
      userId: user.id,
      title: chat.title || chatTitle,
    });

    await updateChat(chat.id, {
      projectId: project.id,
      updatedAt: new Date(),
    });
  }

  const userMessage: NewChatMessage = {
    id: generateId().toLowerCase(),
    chatId,
    userId: user.id,
    status: ChatMessageStatus.CREATED,
    createdAt: currentTime,
    updatedAt: currentTime,
    role: 'user',
    parts: JSON.stringify(messageParts),
    metadata: metadata ? JSON.stringify(metadata) : null,
    model,
    provider,
  };
  await createChatMessage(userMessage);

  const recentMessages = await getRecentChatMessages({
    chatId,
    userId: user.id,
    status: ChatMessageStatus.CREATED,
    limit: 50,
  });

  const uiMessages = recentMessages.map((item) => ({
    id: item.id,
    role: item.role,
    parts: item.parts ? JSON.parse(item.parts) : [],
  })) as UIMessage[];

  const configs = await getAllConfigs();
  const apiKey = configs.apimart_api_key;
  const baseURL = configs.apimart_base_url || 'https://api.apimart.ai/v1';

  if (!apiKey) {
    throw new Error('apimart_api_key is not set');
  }

  const openai = createOpenRouter({
    apiKey,
    baseURL,
  });

  const result = streamText({
    model: openai.chat(model),
    messages: convertToModelMessages(uiMessages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: uiMessages,
    generateMessageId: createIdGenerator({
      size: 16,
    }),
    onFinish: async ({ messages }) => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role !== 'assistant') {
        return;
      }

      const assistantMessage: NewChatMessage = {
        id: generateId().toLowerCase(),
        chatId,
        userId: user.id,
        status: ChatMessageStatus.CREATED,
        createdAt: new Date(),
        updatedAt: new Date(),
        model,
        provider,
        parts: JSON.stringify(lastMessage.parts),
        role: 'assistant',
      };
      await createChatMessage(assistantMessage);
      await updateChat(chatId, {
        model,
        provider,
        updatedAt: new Date(),
      });
    },
  });
}
