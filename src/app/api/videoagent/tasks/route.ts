import { NextRequest } from 'next/server';
import * as mock from '../_mock';

// POST /api/videoagent/tasks
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return Response.json(mock.createTask(body.youtube_url));
}
