import { UIMessage } from 'ai';
import { setRequestLocale } from 'next-intl/server';

import { redirect } from '@/core/i18n/navigation';
import { ChatBox } from '@/shared/blocks/chat/box';
import { getAITasks } from '@/shared/models/ai_task';
import { findChatById } from '@/shared/models/chat';
import {
  ChatMessageStatus,
  getChatMessages,
  getRecentChatMessages,
} from '@/shared/models/chat_message';
import { findProjectById } from '@/shared/models/project';
import { getUserInfo } from '@/shared/models/user';

const TOOL_CHAT_INITIAL_MESSAGE_LIMIT = 20;
const TOOL_CHAT_INITIAL_TASK_LIMIT = 12;

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

  const metadata = safeParseJson(chat.metadata);
  const isToolChat =
    metadata &&
    typeof metadata === 'object' &&
    (metadata as Record<string, unknown>).source === 'tool';

  const [messages, project, tasks] = await Promise.all([
    isToolChat
      ? getRecentChatMessages({
          chatId: id,
          userId: viewer.id,
          status: ChatMessageStatus.CREATED,
          limit: TOOL_CHAT_INITIAL_MESSAGE_LIMIT,
        })
      : getChatMessages({
          chatId: id,
          userId: viewer.id,
          status: ChatMessageStatus.CREATED,
        }),
    chat.projectId ? findProjectById(chat.projectId) : Promise.resolve(undefined),
    isToolChat
      ? getAITasks({
          userId: viewer.id,
          chatId: id,
          limit: TOOL_CHAT_INITIAL_TASK_LIMIT,
        })
      : Promise.resolve([]),
  ]);

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
    metadata,
    content: safeParseJson(chat.content),
  };
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
  const task =
    tasks.find((item) => item.id === latestTaskId) ??
    (latestTaskId ? null : tasks[0] ?? null);
  const initialTask =
    task
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
