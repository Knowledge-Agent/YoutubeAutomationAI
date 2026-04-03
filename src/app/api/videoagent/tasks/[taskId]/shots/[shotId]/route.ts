import { NextRequest } from 'next/server';
import * as mock from '../../../../_mock';

type Params = { params: Promise<{ taskId: string; shotId: string }> };

// PATCH /api/videoagent/tasks/[taskId]/shots/[shotId]
export async function PATCH(req: NextRequest, { params }: Params) {
  const { taskId, shotId } = await params;
  const body = await req.json();
  return Response.json(mock.patchShot(taskId, shotId, body));
}
