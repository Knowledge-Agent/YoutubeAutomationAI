import { NextRequest } from 'next/server';
import * as mock from '../../../_mock';

type Params = { params: Promise<{ taskId: string }> };

// GET /api/videoagent/tasks/[taskId]/review
export async function GET(_req: NextRequest, { params }: Params) {
  const { taskId } = await params;
  return Response.json(mock.getReview(taskId));
}
