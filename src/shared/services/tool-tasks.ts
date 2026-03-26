import { AIMediaType, AITaskStatus } from '@/extensions/ai';
import { AI_CREDITS_ENABLED, getAICreditCost } from '@/shared/lib/ai-credits';
import { getUuid } from '@/shared/lib/hash';
import {
  createAITask,
  findAITaskById,
  updateAITaskById,
} from '@/shared/models/ai_task';
import { getRemainingCredits } from '@/shared/models/credit';
import { getAIService } from '@/shared/services/ai';
import { getToolModelById } from '@/shared/services/apimart/catalog';
import { assertGenerationQuota } from '@/shared/services/generation-quota';

const FALLBACK_COSTS: Partial<Record<string, number>> = {
  'text-to-image': 2,
  'image-to-image': 4,
  'text-to-video': 6,
  'image-to-video': 8,
  'video-to-video': 10,
};

function hasImageUrls(options?: Record<string, unknown>) {
  return Array.isArray(options?.image_urls) && options.image_urls.length > 0;
}

function hasVideoUrls(options?: Record<string, unknown>) {
  return Array.isArray(options?.video_urls) && options.video_urls.length > 0;
}

export function validateToolTaskInput({
  mediaType,
  scene,
  model,
  options,
}: {
  mediaType: AIMediaType;
  scene: string;
  model: string;
  options?: Record<string, unknown>;
}) {
  const modelDefinition = getToolModelById(model);
  if (!modelDefinition) {
    throw new Error('unsupported model');
  }

  if (!modelDefinition.modeSupport.includes(scene as any)) {
    throw new Error('unsupported scene');
  }

  if (modelDefinition.mediaType !== mediaType) {
    throw new Error('model does not match mediaType');
  }

  if (scene === 'image-to-image' && !hasImageUrls(options)) {
    throw new Error('reference image is required');
  }

  if (scene === 'video-to-video' && !hasVideoUrls(options)) {
    throw new Error('reference video is required');
  }

  if (scene === 'image-to-video' && !hasImageUrls(options)) {
    throw new Error('reference image is required');
  }

  return modelDefinition;
}

export function getCreditCost({
  modelId,
  scene,
}: {
  modelId: string;
  scene: string;
}) {
  const model = getToolModelById(modelId);
  return (
    model?.creditCostByMode?.[scene as keyof typeof model.creditCostByMode] ??
    FALLBACK_COSTS[scene] ??
    2
  );
}

export async function createToolTask({
  userId,
  chatId,
  mediaType,
  scene,
  model,
  prompt,
  options,
}: {
  userId: string;
  chatId?: string;
  mediaType: AIMediaType;
  scene: string;
  model: string;
  prompt: string;
  options?: Record<string, unknown>;
}) {
  const aiService = await getAIService();
  const provider = aiService.getProvider('apimart');
  if (!provider) {
    throw new Error('apimart provider is not configured');
  }

  validateToolTaskInput({
    mediaType,
    scene,
    model,
    options,
  });

  const costCredits = getAICreditCost(getCreditCost({ modelId: model, scene }));

  if (AI_CREDITS_ENABLED) {
    const remainingCredits = await getRemainingCredits(userId);
    if (remainingCredits < costCredits) {
      throw new Error('insufficient credits');
    }
  }

  await assertGenerationQuota({
    userId,
    mediaType,
  });

  const result = await provider.generate({
    params: {
      mediaType,
      model,
      prompt,
      options: {
        ...options,
        scene,
      },
    },
  });

  if (!result.taskId) {
    throw new Error('apimart task creation failed');
  }

  return await createAITask({
    id: getUuid(),
    userId,
    chatId: chatId ?? null,
    mediaType,
    provider: provider.name,
    model,
    prompt,
    scene,
    options: options ? JSON.stringify(options) : null,
    status: result.taskStatus,
    costCredits,
    taskId: result.taskId,
    taskInfo: result.taskInfo ? JSON.stringify(result.taskInfo) : null,
    taskResult: result.taskResult ? JSON.stringify(result.taskResult) : null,
  });
}

export async function refreshToolTask({
  taskId,
  userId,
}: {
  taskId: string;
  userId: string;
}) {
  const task = await findAITaskById(taskId);
  if (!task || !task.taskId) {
    throw new Error('task not found');
  }

  if (task.userId !== userId) {
    throw new Error('no permission');
  }

  const aiService = await getAIService();
  const provider = aiService.getProvider(task.provider);
  if (!provider?.query) {
    throw new Error('invalid ai provider');
  }

  const result = await provider.query({
    taskId: task.taskId,
    mediaType: task.mediaType,
    model: task.model,
  });

  const nextTaskInfo = result.taskInfo ? JSON.stringify(result.taskInfo) : null;
  const nextTaskResult = result.taskResult
    ? JSON.stringify(result.taskResult)
    : null;

  const shouldUpdate =
    task.status !== result.taskStatus ||
    task.taskInfo !== nextTaskInfo ||
    task.taskResult !== nextTaskResult;

  if (shouldUpdate) {
    await updateAITaskById(task.id, {
      status: result.taskStatus,
      taskInfo: nextTaskInfo,
      taskResult: nextTaskResult,
      creditId: task.creditId,
    });
  }

  return {
    ...task,
    status: result.taskStatus,
    taskInfo: nextTaskInfo,
    taskResult: nextTaskResult,
  };
}

export function isTerminalTaskStatus(status: string) {
  return (
    status === AITaskStatus.SUCCESS ||
    status === AITaskStatus.FAILED ||
    status === AITaskStatus.CANCELED
  );
}
