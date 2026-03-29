import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { aiTask, projectFavorite } from '@/config/db/schema';

export type ProjectFavorite = typeof projectFavorite.$inferSelect;
export type NewProjectFavorite = typeof projectFavorite.$inferInsert;

export async function createProjectFavorite(
  newFavorite: NewProjectFavorite
): Promise<ProjectFavorite> {
  const [result] = await db()
    .insert(projectFavorite)
    .values(newFavorite)
    .returning();

  return result;
}

export async function deleteProjectFavorite(id: string) {
  const [result] = await db()
    .delete(projectFavorite)
    .where(eq(projectFavorite.id, id))
    .returning();

  return result;
}

export async function findProjectFavoriteByTaskId({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) {
  const [result] = await db()
    .select()
    .from(projectFavorite)
    .where(
      and(
        eq(projectFavorite.projectId, projectId),
        eq(projectFavorite.taskId, taskId)
      )
    );

  return result;
}

export async function getProjectFavorites({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  return await db()
    .select({
      favorite: projectFavorite,
      task: aiTask,
    })
    .from(projectFavorite)
    .innerJoin(aiTask, eq(projectFavorite.taskId, aiTask.id))
    .where(
      and(
        eq(projectFavorite.projectId, projectId),
        eq(projectFavorite.userId, userId)
      )
    )
    .orderBy(desc(projectFavorite.createdAt));
}
