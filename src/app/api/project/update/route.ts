import { respData, respErr } from '@/shared/lib/resp';
import { findProjectById, updateProject } from '@/shared/models/project';
import { getUserInfo } from '@/shared/models/user';

export async function POST(req: Request) {
  try {
    const { projectId, title } = await req.json();

    if (!projectId) {
      return respErr('projectId is required');
    }

    if (!title || !String(title).trim()) {
      return respErr('title is required');
    }

    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const project = await findProjectById(projectId);
    if (!project) {
      return respErr('project not found');
    }

    if (project.userId !== user.id) {
      return respErr('no permission to access this project');
    }

    const result = await updateProject(projectId, {
      title: String(title).trim(),
      updatedAt: new Date(),
    });

    return respData(result);
  } catch (e: any) {
    console.log('update project failed:', e);
    return respErr(`update project failed: ${e.message}`);
  }
}
