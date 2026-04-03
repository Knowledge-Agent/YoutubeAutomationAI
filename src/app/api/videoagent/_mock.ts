// VideoRemaker Mock 状态机 & 数据
// 供各 Route Handler 共用；使用 globalThis 保证 HMR 后状态不丢失

import type { ImageReviewData, ResultData, ReviewData, TaskStatusData } from '@/shared/blocks/video-remaker/types';

// ─── 静态数据 ─────────────────────────────────────────────────────────────────

const SHOTS_COUNT = 5;

const IDENTITY_ANCHORS = [
  {
    id: '角色A',
    bio_features: '琥珀色瞳孔、高鼻梁、左颧骨小疤痕、宽眉距、方形下颌轮廓',
    initial_state: '黑色西装，深色短发',
  },
  {
    id: '角色B',
    bio_features: '深棕色瞳孔、细长眼型、小巧鼻尖、圆形面部轮廓、薄唇',
    initial_state: '白色连衣裙，紫色麻花辫',
  },
];

const IMAGE_PROMPTS = [
  '清晨阳光下，街道转角处，角色A身着黑色西装站立，回头望向镜头，表情沉静，背景是模糊的城市建筑轮廓。浅景深，暖色调。',
  '室内昏黄灯光，角色B坐在咖啡馆木椅上，双手捧杯，目视前方，紫色麻花辫搭在左肩。背景虚化的咖啡馆陈设。',
  '夜晚霓虹街道，角色A（换成红色夹克）与角色B并排走过，俯瞰机位，湿润路面反射灯光，两人轮廓清晰。',
  '空旷仓库内，角色A近景正面，微微皱眉，背景是金属架与阴影。硬光侧打，高对比黑白倾向调色。',
  '日落海边，角色B独自站在礁石上，面朝大海，海风吹起发丝，暖橙色逆光剪影，远景宽画幅。',
];

const VIDEO_PROMPTS = [
  '镜头从背后缓缓推近，角色慢慢转头，停在四分之三侧脸，镜头微微下移聚焦眼神。手持轻微晃动感。',
  '固定机位，紫色麻花辫女孩缓缓将咖啡杯放回桌面，抬起头，嘴角浮现若有若无的微笑，镜头轻推。',
  '从高处俯拍开始，镜头平移跟随两人步伐，维持等距，画面随脚步有节奏地微晃，雨后积水倒影闪烁。',
  '镜头锁定方形下颌男子面部，从胸口仰拍至眼神，焦点拉至眼睛时短暂定格，气氛紧张肃杀。',
  '宽画幅固定镜头，逆光剪影女子站立不动，海浪声中发丝飘动，画面保持静态，仅自然光线流动变化。',
];

const SAMPLE_VIDEOS = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/movie.mp4',
];

function shotId(n: number) {
  return String(n).padStart(2, '0');
}

export function frameUrl(sid: string) {
  return `https://picsum.photos/seed/frame${sid}/640/360`;
}

export function refUrl(sid: string) {
  return `https://picsum.photos/seed/ref${sid}/640/360`;
}

export function videoUrl(sid: string) {
  return SAMPLE_VIDEOS[(parseInt(sid, 10) - 1) % SAMPLE_VIDEOS.length];
}

// ─── 状态机 ───────────────────────────────────────────────────────────────────

type TaskState = {
  status: TaskStatusData['status'];
  stage: TaskStatusData['stage'];
  progress: number;
  shots_count: number | null;
  pollCount: number;
  // 允许每个分镜单独覆盖 prompt
  shotOverrides: Record<string, { image_prompt?: string; video_prompt?: string }>;
};

// 使用 globalThis 保证 Next.js HMR 热重载后状态不丢失
declare global {
  // eslint-disable-next-line no-var
  var __videoagentMockTasks: Map<string, TaskState> | undefined;
}

const tasks: Map<string, TaskState> =
  globalThis.__videoagentMockTasks ?? new Map();
globalThis.__videoagentMockTasks = tasks;

const ANALYZE_STEPS: Array<Pick<TaskState, 'stage' | 'progress' | 'shots_count'>> = [
  { stage: 'splitter',  progress: 10,  shots_count: null },
  { stage: 'splitter',  progress: 25,  shots_count: SHOTS_COUNT },
  { stage: 'modeler',   progress: 45,  shots_count: SHOTS_COUNT },
  { stage: 'modeler',   progress: 60,  shots_count: SHOTS_COUNT },
  { stage: 'architect', progress: 75,  shots_count: SHOTS_COUNT },
  { stage: 'architect', progress: 90,  shots_count: SHOTS_COUNT },
];
const IMAGING_STEPS  = [15, 35, 55, 75, 90];
const FILMING_STEPS  = [10, 30, 50, 70, 88];

function getOrCreate(taskId: string): TaskState {
  if (!tasks.has(taskId)) {
    tasks.set(taskId, {
      status: 'running',
      stage: 'splitter',
      progress: 0,
      shots_count: null,
      pollCount: 0,
      shotOverrides: {},
    });
  }
  return tasks.get(taskId)!;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export function createTask(_youtubeUrl?: string): { task_id: string; status: string } {
  const task_id = `vid_mock_${Date.now().toString(36)}`;
  tasks.set(task_id, {
    status: 'running',
    stage: 'downloading',
    progress: 0,
    shots_count: null,
    pollCount: 0,
    shotOverrides: {},
  });
  return { task_id, status: 'running' };
}

export function getTaskStatus(taskId: string): TaskStatusData {
  const t = getOrCreate(taskId);
  t.pollCount += 1;

  if (t.status === 'running') {
    if (t.pollCount === 1) {
      t.stage = 'downloading';
      t.progress = 5;
      t.shots_count = null;
    } else {
      const analyzeIndex = Math.min(t.pollCount - 2, ANALYZE_STEPS.length - 1);
      const step = ANALYZE_STEPS[analyzeIndex];
      t.stage = step.stage;
      t.progress = step.progress;
      t.shots_count = step.shots_count;
    }
    if (t.pollCount > ANALYZE_STEPS.length + 1) {
      t.status = 'review_ready';
      t.progress = 100;
      t.shots_count = SHOTS_COUNT;
    }
  } else if (t.status === 'imaging') {
    t.progress = IMAGING_STEPS[Math.min(t.pollCount - 1, IMAGING_STEPS.length - 1)];
    if (t.pollCount > IMAGING_STEPS.length) {
      t.status = 'image_review_ready';
      t.progress = 100;
    }
  } else if (t.status === 'filming') {
    t.progress = FILMING_STEPS[Math.min(t.pollCount - 1, FILMING_STEPS.length - 1)];
    if (t.pollCount > FILMING_STEPS.length) {
      t.status = 'completed';
      t.progress = 100;
    }
  }

  return {
    task_id: taskId,
    status: t.status,
    stage: t.stage,
    progress: t.progress,
    shots_count: t.shots_count,
    error: null,
  };
}

export function getReview(taskId: string): ReviewData {
  const t = getOrCreate(taskId);
  return {
    task_id: taskId,
    identity_anchors: IDENTITY_ANCHORS,
    shots: Array.from({ length: SHOTS_COUNT }, (_, i) => {
      const n = i + 1;
      const sid = shotId(n);
      const ov = t.shotOverrides[sid] ?? {};
      return {
        shot_id: sid,
        start_sec: i * 4.2,
        end_sec: (n) * 4.2,
        frame_url: frameUrl(sid),
        image_prompt: ov.image_prompt ?? IMAGE_PROMPTS[i] ?? IMAGE_PROMPTS[0],
        video_prompt: ov.video_prompt ?? VIDEO_PROMPTS[i] ?? VIDEO_PROMPTS[0],
      };
    }),
  };
}

export function patchShot(
  taskId: string,
  sid: string,
  data: { image_prompt?: string; video_prompt?: string },
): { shot_id: string; image_prompt: string; video_prompt: string } {
  const t = getOrCreate(taskId);
  t.shotOverrides[sid] = { ...t.shotOverrides[sid], ...data };
  const i = parseInt(sid, 10) - 1;
  return {
    shot_id: sid,
    image_prompt: t.shotOverrides[sid].image_prompt ?? IMAGE_PROMPTS[i] ?? IMAGE_PROMPTS[0],
    video_prompt: t.shotOverrides[sid].video_prompt ?? VIDEO_PROMPTS[i] ?? VIDEO_PROMPTS[0],
  };
}

export function triggerImaging(taskId: string): { task_id: string; status: string } {
  const t = getOrCreate(taskId);
  t.status = 'imaging';
  t.stage = 'imaging';
  t.progress = 0;
  t.pollCount = 0;
  return { task_id: taskId, status: 'imaging' };
}

export function getImageReview(taskId: string): ImageReviewData {
  const t = getOrCreate(taskId);
  return {
    task_id: taskId,
    shots: Array.from({ length: SHOTS_COUNT }, (_, i) => {
      const n = i + 1;
      const sid = shotId(n);
      const ov = t.shotOverrides[sid] ?? {};
      return {
        shot_id: sid,
        start_sec: i * 4.2,
        end_sec: n * 4.2,
        frame_url: frameUrl(sid),
        ref_image_url: refUrl(sid),
        image_prompt: ov.image_prompt ?? IMAGE_PROMPTS[i] ?? IMAGE_PROMPTS[0],
      };
    }),
  };
}

export function triggerFilming(taskId: string): { task_id: string; status: string } {
  const t = getOrCreate(taskId);
  t.status = 'filming';
  t.stage = 'filming';
  t.progress = 0;
  t.pollCount = 0;
  return { task_id: taskId, status: 'filming' };
}

export function getResult(taskId: string): ResultData {
  const t = getOrCreate(taskId);
  return {
    task_id: taskId,
    status: 'completed',
    shots: Array.from({ length: SHOTS_COUNT }, (_, i) => {
      const n = i + 1;
      const sid = shotId(n);
      const ov = t.shotOverrides[sid] ?? {};
      return {
        shot_id: sid,
        start_sec: i * 4.2,
        end_sec: n * 4.2,
        image_prompt: ov.image_prompt ?? IMAGE_PROMPTS[i] ?? IMAGE_PROMPTS[0],
        video_prompt: ov.video_prompt ?? VIDEO_PROMPTS[i] ?? VIDEO_PROMPTS[0],
        frame_url: frameUrl(sid),
        ref_image_url: refUrl(sid),
        output_video_url: videoUrl(sid),
      };
    }),
  };
}
