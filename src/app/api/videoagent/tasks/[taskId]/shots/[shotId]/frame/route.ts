import { NextRequest } from 'next/server';

type Params = { params: Promise<{ taskId: string; shotId: string }> };

// 开发 Mock：frame 和 clip 都返回 picsum 图片
async function serveImage(_req: NextRequest, { params }: Params) {
  const { shotId } = await params;
  return Response.redirect(`https://picsum.photos/seed/frame${shotId}/640/360`, 302);
}

export const GET = serveImage;
