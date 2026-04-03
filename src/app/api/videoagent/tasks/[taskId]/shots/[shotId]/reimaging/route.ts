import { NextRequest } from 'next/server';

type Params = { params: Promise<{ taskId: string; shotId: string }> };

// POST /api/videoagent/tasks/[taskId]/shots/[shotId]/reimaging
export async function POST(_req: NextRequest, { params }: Params) {
  const { shotId } = await params;
  // 模拟重新生成参考图耗时由 polling 驱动，这里直接返回 ok
  return Response.json({ shot_id: shotId, status: 'ok' });
}
