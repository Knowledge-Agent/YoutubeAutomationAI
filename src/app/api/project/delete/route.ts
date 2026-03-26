import { respData, respErr } from '@/shared/lib/resp';
import {
  createUserProject,
  findProjectById,
  getProjects,
  ProjectStatus,
  softDeleteProject,
} from '@/shared/models/project';
import { getUserInfo } from '@/shared/models/user';

export async function POST(req: Request) {
  try {
    const { projectId, createFallback } = await req.json();

    if (!projectId) {
      return respErr('projectId is required');
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

    await softDeleteProject(projectId);

    let nextProject = null;

    if (createFallback) {
      const [existingProject] = await getProjects({
        userId: user.id,
        status: ProjectStatus.CREATED,
        limit: 1,
      });

      nextProject =
        existingProject ||
        (await createUserProject({
          userId: user.id,
          title: '',
        }));
    }

    return respData({
      projectId,
      nextProject,
    });
  } catch (e: any) {
    console.log('delete project failed:', e);
    return respErr(`delete project failed: ${e.message}`);
  }
}
