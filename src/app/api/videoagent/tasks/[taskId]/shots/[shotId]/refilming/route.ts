import { NextRequest } from 'next/server';

type Params = { params: Promise<{ taskId: string; shotId: string }> };

// POST /api/videoagent/tasks/[taskId]/shots/[shotId]/refilming
export async function POST(_req: NextRequest, { params }: Params) {
  const { shotId } = await params;
  return Response.json({ shot_id: shotId, status: 'ok' });
}
