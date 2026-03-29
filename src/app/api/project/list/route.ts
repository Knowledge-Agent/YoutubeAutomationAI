import { respData, respErr } from '@/shared/lib/resp';
import { getProjects, ProjectStatus } from '@/shared/models/project';
import { getUserInfo } from '@/shared/models/user';

export async function POST() {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const projects = await getProjects({
      userId: user.id,
      status: ProjectStatus.CREATED,
      limit: 50,
    });

    return respData(projects);
  } catch (e: any) {
    console.log('list projects failed:', e);
    return respErr(`list projects failed: ${e.message}`);
  }
}
