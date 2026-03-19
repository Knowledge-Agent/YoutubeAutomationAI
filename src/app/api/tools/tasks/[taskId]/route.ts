import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { refreshToolTask } from '@/shared/services/tool-tasks';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    if (!taskId) {
      return respErr('taskId is required');
    }

    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const task = await refreshToolTask({
      taskId,
      userId: user.id,
    });

    return respData(task);
  } catch (e: any) {
    console.log('refresh tool task failed:', e);
    return respErr(e.message);
  }
}
