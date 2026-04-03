import { NextRequest } from 'next/server';

type Params = { params: Promise<{ taskId: string; shotId: string }> };

// 开发 Mock：clip 与 frame 使用相同 seed 图片
export async function GET(_req: NextRequest, { params }: Params) {
  const { shotId } = await params;
  return Response.redirect(`https://picsum.photos/seed/frame${shotId}/640/360`, 302);
}
