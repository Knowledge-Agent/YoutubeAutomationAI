// VideoRemaker API 调用封装
// 所有请求均指向后端 NEXT_PUBLIC_VIDEOAGENT_API_URL（默认 http://localhost:8000）

import type {
  ResultData,
  ReviewData,
  TaskStatusData,
} from './types';

function baseUrl(): string {
  return process.env.NEXT_PUBLIC_VIDEOAGENT_API_URL ?? 'http://localhost:8000';
}

export async function createTask(videoPath: string): Promise<{ task_id: string; status: string }> {
  const res = await fetch(`${baseUrl()}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ video_path: videoPath }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? `创建任务失败 (${res.status})`);
  }
  return res.json();
}

export async function getTaskStatus(taskId: string): Promise<TaskStatusData> {
  const res = await fetch(`${baseUrl()}/tasks/${taskId}`);
  if (!res.ok) throw new Error(`查询任务失败 (${res.status})`);
  return res.json();
}

export async function getReview(taskId: string): Promise<ReviewData> {
  const res = await fetch(`${baseUrl()}/tasks/${taskId}/review`);
  if (!res.ok) throw new Error(`获取审核数据失败 (${res.status})`);
  return res.json();
}

export async function patchShot(
  taskId: string,
  shotId: string,
  data: { image_prompt?: string; video_prompt?: string },
): Promise<{ shot_id: string; image_prompt: string; video_prompt: string }> {
  const res = await fetch(`${baseUrl()}/tasks/${taskId}/shots/${shotId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`保存提示词失败 (${res.status})`);
  return res.json();
}

export async function triggerSynthesize(taskId: string): Promise<{ task_id: string; status: string }> {
  const res = await fetch(`${baseUrl()}/tasks/${taskId}/synthesize`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`触发生成失败 (${res.status})`);
  return res.json();
}

export async function getResult(taskId: string): Promise<ResultData> {
  const res = await fetch(`${baseUrl()}/tasks/${taskId}/result`);
  if (!res.ok) throw new Error(`获取结果失败 (${res.status})`);
  return res.json();
}

export function frameUrl(taskId: string, shotId: string): string {
  return `${baseUrl()}/tasks/${taskId}/shots/${shotId}/frame`;
}

export function refUrl(taskId: string, shotId: string): string {
  return `${baseUrl()}/tasks/${taskId}/shots/${shotId}/ref`;
}

export function videoUrl(taskId: string, shotId: string): string {
  return `${baseUrl()}/tasks/${taskId}/shots/${shotId}/video`;
}
