// VideoRemaker 前端类型定义
// 对应后端 api/server.py 返回的数据结构

export type TaskStatus =
  | 'running'
  | 'review_ready'
  | 'synthesizing'
  | 'completed'
  | 'failed';

export type TaskStage = 'splitter' | 'modeler' | 'architect' | 'synthesis';

export type Screen = 'create' | 'analyzing' | 'review' | 'generating' | 'result';

export interface TaskStatusData {
  task_id: string;
  status: TaskStatus;
  stage: TaskStage | null;
  progress: number;
  shots_count: number | null;
  error: string | null;
}

export interface IdentityAnchor {
  id: string;
  bio_features: string;
  initial_state: string;
}

export interface ReviewShot {
  shot_id: string;
  start_sec: number;
  end_sec: number;
  frame_url: string;
  image_prompt: string;
  video_prompt: string;
}

export interface ReviewData {
  task_id: string;
  identity_anchors: IdentityAnchor[];
  shots: ReviewShot[];
}

export interface ResultShot {
  shot_id: string;
  start_sec: number;
  end_sec: number;
  image_prompt: string;
  video_prompt: string;
  frame_url: string;
  ref_image_url: string;
  output_video_url: string;
}

export interface ResultData {
  task_id: string;
  status: 'completed';
  shots: ResultShot[];
}
