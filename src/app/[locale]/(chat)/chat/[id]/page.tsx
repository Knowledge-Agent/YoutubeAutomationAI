import { UIMessage } from 'ai';
import { setRequestLocale } from 'next-intl/server';

import { redirect } from '@/core/i18n/navigation';
import { ChatBox } from '@/shared/blocks/chat/box';
import { findAITaskById } from '@/shared/models/ai_task';
import { getAITasks } from '@/shared/models/ai_task';
import { ChatMessageStatus, getChatMessages } from '@/shared/models/chat_message';
import { findChatById } from '@/shared/models/chat';
import { findProjectById } from '@/shared/models/project';
import { getUserInfo } from '@/shared/models/user';

function safeParseJson(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const user = await getUserInfo();
  if (!user) {
    redirect({
      href: `/sign-in?callbackUrl=${encodeURIComponent(`/chat/${id}`)}`,
      locale,
    });
  }
  const viewer = user!;

  const chat = await findChatById(id);
  if (!chat || chat.userId !== viewer.id) {
    redirect({ href: '/chat', locale });
  }

  const messages = await getChatMessages({
    chatId: id,
    userId: viewer.id,
    status: ChatMessageStatus.CREATED,
    limit: 100,
  });

  const initialMessages: UIMessage[] = messages.map((message) => ({
    id: message.id,
    role: message.role as UIMessage['role'],
    parts: safeParseJson(message.parts) ?? [],
  }));

  const initialChat = {
    id: chat.id,
    projectId: chat.projectId,
    title: chat.title,
    createdAt: chat.createdAt,
    model: chat.model,
    provider: chat.provider,
    parts: safeParseJson(chat.parts),
    metadata: safeParseJson(chat.metadata),
    content: safeParseJson(chat.content),
  };
  const project =
    chat.projectId ? await findProjectById(chat.projectId) : undefined;
  const initialChatWithProject = {
    ...initialChat,
    projectTitle: project?.title || chat.title || 'Untitled Project',
  };

  const chatMetadata =
    initialChat.metadata && typeof initialChat.metadata === 'object'
      ? (initialChat.metadata as Record<string, unknown>)
      : null;
  const latestTaskId =
    chatMetadata && typeof chatMetadata.latestTaskId === 'string'
      ? chatMetadata.latestTaskId
      : '';
  const task = latestTaskId ? await findAITaskById(latestTaskId) : null;
  const tasks = await getAITasks({
    chatId: id,
    userId: viewer.id,
    limit: 50,
  });
  const initialTask =
    task && task.userId === viewer.id
      ? {
          id: task.id,
          status: task.status,
          provider: task.provider,
          model: task.model,
          scene: task.scene,
          prompt: task.prompt,
          options: task.options,
          taskInfo: task.taskInfo,
          taskResult: task.taskResult,
          createdAt: task.createdAt,
          creditCost: task.costCredits,
        }
      : null;
  const initialTasks = tasks.map((item) => ({
    id: item.id,
    status: item.status,
    provider: item.provider,
    model: item.model,
    scene: item.scene,
    prompt: item.prompt,
    options: item.options,
    taskInfo: item.taskInfo,
    taskResult: item.taskResult,
    createdAt: item.createdAt,
    creditCost: item.costCredits,
  }));

  return (
    <ChatBox
      initialChat={initialChatWithProject}
      initialMessages={initialMessages}
      initialTask={initialTask}
      initialTasks={initialTasks}
    />
  );
}
