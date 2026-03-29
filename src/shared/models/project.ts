import { generateId } from 'ai';
import { and, count, desc, eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { project } from '@/config/db/schema';

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;
export type UpdateProject = Partial<Omit<NewProject, 'id' | 'createdAt'>>;

export enum ProjectStatus {
  CREATED = 'created',
  DELETED = 'deleted',
}

export async function createProject(newProject: NewProject): Promise<Project> {
  const [result] = await db().insert(project).values(newProject).returning();

  return result;
}

export async function createUserProject({
  userId,
  title,
}: {
  userId: string;
  title: string;
}) {
  const currentTime = new Date();

  return createProject({
    id: generateId().toLowerCase(),
    userId,
    status: ProjectStatus.CREATED,
    title: title.trim() || 'Untitled Project',
    createdAt: currentTime,
    updatedAt: currentTime,
  });
}

export async function findProjectById(id: string): Promise<Project> {
  const [result] = await db().select().from(project).where(eq(project.id, id));

  return result;
}

export async function updateProject(
  id: string,
  updateProjectData: UpdateProject
): Promise<Project> {
  const [result] = await db()
    .update(project)
    .set(updateProjectData)
    .where(eq(project.id, id))
    .returning();

  return result;
}

export async function softDeleteProject(id: string): Promise<Project> {
  return updateProject(id, {
    status: ProjectStatus.DELETED,
    updatedAt: new Date(),
  });
}

export async function getProjects({
  userId,
  status,
  page = 1,
  limit = 30,
}: {
  userId?: string;
  status?: ProjectStatus;
  page?: number;
  limit?: number;
}): Promise<Project[]> {
  return await db()
    .select()
    .from(project)
    .where(
      and(
        userId ? eq(project.userId, userId) : undefined,
        status ? eq(project.status, status) : undefined
      )
    )
    .orderBy(desc(project.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);
}

export async function getProjectsCount({
  userId,
  status,
}: {
  userId?: string;
  status?: ProjectStatus;
}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(project)
    .where(
      and(
        userId ? eq(project.userId, userId) : undefined,
        status ? eq(project.status, status) : undefined
      )
    );

  return result?.count || 0;
}
