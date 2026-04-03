import { NextRequest } from 'next/server';

type Params = { params: Promise<{ taskId: string; shotId: string }> };

const SAMPLE_VIDEOS = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/movie.mp4',
];

// 开发 Mock：ref 返回 picsum 图片；HEAD 请求用于 polling 就绪检测
export async function GET(_req: NextRequest, { params }: Params) {
  const { shotId } = await params;
  return Response.redirect(`https://picsum.photos/seed/ref${shotId}/640/360`, 302);
}

// screen-image-review / screen-imaging 用 HEAD 轮询图片就绪状态，直接返回 200
export async function HEAD(_req: NextRequest, _ctx: Params) {
  return new Response(null, { status: 200 });
}
