import { and, count, desc, eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { chat } from '@/config/db/schema';

import { appendUserToResult, User } from './user';

export type Chat = typeof chat.$inferSelect & {
  user?: User;
};
export type NewChat = typeof chat.$inferInsert;
export type UpdateChat = Partial<Omit<NewChat, 'id' | 'createdAt'>>;
export type ToolChatIds = {
  image?: string;
  video?: string;
};

export enum ChatStatus {
  PENDING = 'pending',
  CREATED = 'created',
  DELETED = 'deleted',
}

export async function createChat(newChat: NewChat): Promise<Chat> {
  const [result] = await db().insert(chat).values(newChat).returning();

  return result;
}

export async function getChats({
  userId,
  status,
  page = 1,
  limit = 30,
  getUser = false,
}: {
  userId?: string;
  status?: ChatStatus;
  page?: number;
  limit?: number;
  getUser?: boolean;
}): Promise<Chat[]> {
  const result = await db()
    .select()
    .from(chat)
    .where(
      and(
        userId ? eq(chat.userId, userId) : undefined,
        status ? eq(chat.status, status) : undefined
      )
    )
    .orderBy(desc(chat.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  if (getUser) {
    return appendUserToResult(result);
  }

  return result;
}

export async function getChatsCount({
  userId,
  status,
}: {
  userId?: string;
  status?: ChatStatus;
}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(chat)
    .where(
      and(
        userId ? eq(chat.userId, userId) : undefined,
        status ? eq(chat.status, status) : undefined
      )
    );

  return result?.count || 0;
}

export async function findChatById(id: string): Promise<Chat> {
  const [result] = await db().select().from(chat).where(eq(chat.id, id));

  return result;
}

export async function findLatestChatByProjectId({
  projectId,
  userId,
  status = ChatStatus.CREATED,
}: {
  projectId: string;
  userId: string;
  status?: ChatStatus;
}): Promise<Chat | undefined> {
  const [result] = await db()
    .select()
    .from(chat)
    .where(
      and(
        eq(chat.projectId, projectId),
        eq(chat.userId, userId),
        status ? eq(chat.status, status) : undefined
      )
    )
    .orderBy(desc(chat.updatedAt), desc(chat.createdAt))
    .limit(1);

  return result;
}

export async function updateChat(
  id: string,
  updateChat: UpdateChat
): Promise<Chat> {
  const [result] = await db()
    .update(chat)
    .set(updateChat)
    .where(eq(chat.id, id))
    .returning();

  return result;
}

function safeParseMetadata(value: string | null | undefined) {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export async function getToolChatIdsByUserId(
  userId: string
): Promise<ToolChatIds> {
  const chats = await getChats({
    userId,
    status: ChatStatus.CREATED,
    limit: 100,
  });

  const toolChatIds: ToolChatIds = {};

  for (const item of chats) {
    const metadata = safeParseMetadata(item.metadata);
    if (metadata.source !== 'tool') {
      continue;
    }

    if (metadata.toolSurface === 'image' && !toolChatIds.image) {
      toolChatIds.image = item.id;
    }

    if (metadata.toolSurface === 'video' && !toolChatIds.video) {
      toolChatIds.video = item.id;
    }

    if (toolChatIds.image && toolChatIds.video) {
      break;
    }
  }

  return toolChatIds;
}
