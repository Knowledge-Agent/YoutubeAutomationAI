import { NextRequest } from 'next/server';
import * as mock from '../../../_mock';

type Params = { params: Promise<{ taskId: string }> };

// POST /api/videoagent/tasks/[taskId]/imaging
export async function POST(_req: NextRequest, { params }: Params) {
  const { taskId } = await params;
  return Response.json(mock.triggerImaging(taskId));
}
