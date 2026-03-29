import { generateId } from 'ai';

import { respData, respErr } from '@/shared/lib/resp';
import { findAITaskById } from '@/shared/models/ai_task';
import { findProjectById } from '@/shared/models/project';
import {
  createProjectFavorite,
  deleteProjectFavorite,
  findProjectFavoriteByTaskId,
  getProjectFavorites,
} from '@/shared/models/project_favorite';
import { getUserInfo } from '@/shared/models/user';

export async function POST(req: Request) {
  try {
    const { action, projectId, taskId } = await req.json();

    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    if (!projectId) {
      return respErr('projectId is required');
    }

    const project = await findProjectById(projectId);
    if (!project) {
      return respErr('project not found');
    }

    if (project.userId !== user.id) {
      return respErr('no permission to access this project');
    }

    if (action === 'list') {
      const favorites = await getProjectFavorites({
        projectId,
        userId: user.id,
      });

      return respData(favorites);
    }

    if (!taskId) {
      return respErr('taskId is required');
    }

    const task = await findAITaskById(taskId);
    if (!task) {
      return respErr('task not found');
    }

    if (task.userId !== user.id) {
      return respErr('no permission to access this task');
    }

    const existing = await findProjectFavoriteByTaskId({
      projectId,
      taskId,
    });

    if (action === 'toggle') {
      if (existing) {
        await deleteProjectFavorite(existing.id);
        return respData({ favorited: false, taskId });
      }

      await createProjectFavorite({
        id: generateId().toLowerCase(),
        userId: user.id,
        projectId,
        taskId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return respData({ favorited: true, taskId });
    }

    return respErr('invalid action');
  } catch (e: any) {
    console.log('project favorites failed:', e);
    return respErr(`project favorites failed: ${e.message}`);
  }
}
