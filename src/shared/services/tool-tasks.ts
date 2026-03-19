import { AIMediaType, AITaskStatus } from '@/extensions/ai';
import { getUuid } from '@/shared/lib/hash';
import {
  createAITask,
  findAITaskById,
  updateAITaskById,
} from '@/shared/models/ai_task';
import { getRemainingCredits } from '@/shared/models/credit';
import { getAIService } from '@/shared/services/ai';
import { getToolModelById } from '@/shared/services/apimart/catalog';

const FALLBACK_COSTS: Partial<Record<string, number>> = {
  'text-to-image': 2,
  'image-to-image': 4,
  'text-to-video': 6,
  'image-to-video': 8,
  'video-to-video': 10,
};

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
  mediaType,
  scene,
  model,
  prompt,
  options,
}: {
  userId: string;
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

  const remainingCredits = await getRemainingCredits(userId);
  const costCredits = getCreditCost({ modelId: model, scene });

  if (remainingCredits < costCredits) {
    throw new Error('insufficient credits');
  }

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
