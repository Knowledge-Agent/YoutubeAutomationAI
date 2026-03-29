import { and, count, desc, eq, gte, lt, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import { aiTask, credit } from '@/config/db/schema';
import { AITaskStatus } from '@/extensions/ai';
import { appendUserToResult, User } from '@/shared/models/user';

import { consumeCredits, CreditStatus } from './credit';

export type AITask = typeof aiTask.$inferSelect & {
  user?: User;
};
export type NewAITask = typeof aiTask.$inferInsert;
export type UpdateAITask = Partial<Omit<NewAITask, 'id' | 'createdAt'>>;

export async function createAITask(newAITask: NewAITask) {
  const result = await db().transaction(async (tx: any) => {
    // 1. create task record
    const [taskResult] = await tx.insert(aiTask).values(newAITask).returning();

    if (newAITask.costCredits && newAITask.costCredits > 0) {
      // 2. consume credits
      const consumedCredit = await consumeCredits({
        userId: newAITask.userId,
        credits: newAITask.costCredits,
        scene: newAITask.scene,
        description: `generate ${newAITask.mediaType}`,
        metadata: JSON.stringify({
          type: 'ai-task',
          mediaType: taskResult.mediaType,
          taskId: taskResult.id,
        }),
        tx,
      });

      // 3. update task record with consumed credit id
      if (consumedCredit && consumedCredit.id) {
        taskResult.creditId = consumedCredit.id;
        await tx
          .update(aiTask)
          .set({ creditId: consumedCredit.id })
          .where(eq(aiTask.id, taskResult.id));
      }
    }

    return taskResult;
  });

  return result;
}

export async function findAITaskById(id: string) {
  const [result] = await db().select().from(aiTask).where(eq(aiTask.id, id));
  return result;
}

export async function updateAITaskById(id: string, updateAITask: UpdateAITask) {
  const result = await db().transaction(async (tx: any) => {
    // task failed, Revoke credit consumption record
    if (updateAITask.status === AITaskStatus.FAILED && updateAITask.creditId) {
      // get consumed credit record
      const [consumedCredit] = await tx
        .select()
        .from(credit)
        .where(eq(credit.id, updateAITask.creditId));
      if (consumedCredit && consumedCredit.status === CreditStatus.ACTIVE) {
        const consumedItems = JSON.parse(consumedCredit.consumedDetail || '[]');

        // console.log('consumedItems', consumedItems);

        // add back consumed credits
        await Promise.all(
          consumedItems.map((item: any) => {
            if (item && item.creditId && item.creditsConsumed > 0) {
              return tx
                .update(credit)
                .set({
                  remainingCredits: sql`${credit.remainingCredits} + ${item.creditsConsumed}`,
                })
                .where(eq(credit.id, item.creditId));
            }
          })
        );

        // delete consumed credit record
        await tx
          .update(credit)
          .set({
            status: CreditStatus.DELETED,
          })
          .where(eq(credit.id, updateAITask.creditId));
      }
    }

    // update task
    const [result] = await tx
      .update(aiTask)
      .set(updateAITask)
      .where(eq(aiTask.id, id))
      .returning();

    return result;
  });

  return result;
}

export async function getAITasksCount({
  userId,
  chatId,
  status,
  mediaType,
  provider,
}: {
  userId?: string;
  chatId?: string;
  status?: string;
  mediaType?: string;
  provider?: string;
}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(aiTask)
    .where(
      and(
        userId ? eq(aiTask.userId, userId) : undefined,
        chatId ? eq(aiTask.chatId, chatId) : undefined,
        mediaType ? eq(aiTask.mediaType, mediaType) : undefined,
        provider ? eq(aiTask.provider, provider) : undefined,
        status ? eq(aiTask.status, status) : undefined
      )
    );

  return result?.count || 0;
}

export async function getAITasksCountByDateRange({
  userId,
  mediaType,
  dateFrom,
  dateTo,
}: {
  userId: string;
  mediaType: string;
  dateFrom: Date;
  dateTo: Date;
}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(aiTask)
    .where(
      and(
        eq(aiTask.userId, userId),
        eq(aiTask.mediaType, mediaType),
        gte(aiTask.createdAt, dateFrom),
        lt(aiTask.createdAt, dateTo)
      )
    );

  return result?.count || 0;
}

export async function getAITasks({
  userId,
  chatId,
  status,
  mediaType,
  provider,
  page = 1,
  limit,
  getUser = false,
}: {
  userId?: string;
  chatId?: string;
  status?: string;
  mediaType?: string;
  provider?: string;
  page?: number;
  limit?: number;
  getUser?: boolean;
}): Promise<AITask[]> {
  let query = db()
    .select()
    .from(aiTask)
    .where(
      and(
        userId ? eq(aiTask.userId, userId) : undefined,
        chatId ? eq(aiTask.chatId, chatId) : undefined,
        mediaType ? eq(aiTask.mediaType, mediaType) : undefined,
        provider ? eq(aiTask.provider, provider) : undefined,
        status ? eq(aiTask.status, status) : undefined
      )
    )
    .orderBy(desc(aiTask.createdAt));

  if (typeof limit === 'number') {
    query = query.limit(limit).offset((page - 1) * limit);
  }

  const result = await query;

  if (getUser) {
    return appendUserToResult(result);
  }

  return result;
}
