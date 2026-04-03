import { NextRequest } from 'next/server';

type Params = { params: Promise<{ taskId: string; shotId: string }> };

const SAMPLE_VIDEOS = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/movie.mp4',
];

// 开发 Mock：返回示例视频；HEAD 用于 polling 就绪检测
export async function GET(_req: NextRequest, { params }: Params) {
  const { shotId } = await params;
  const url = SAMPLE_VIDEOS[(parseInt(shotId, 10) - 1) % SAMPLE_VIDEOS.length];
  return Response.redirect(url, 302);
}

// screen-generating 用 HEAD 轮询视频就绪状态，直接返回 200
export async function HEAD(_req: NextRequest, _ctx: Params) {
  return new Response(null, { status: 200 });
}
