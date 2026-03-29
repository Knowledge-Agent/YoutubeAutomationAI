'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UIMessage } from '@ai-sdk/react';
import { ThreadPrimitive } from '@assistant-ui/react';
import { DefaultChatTransport } from 'ai';
import { ArrowUp, FolderOpen, LoaderCircle, Star } from 'lucide-react';
import { toast } from 'sonner';

import {
  ToolControlBar,
  type ToolControlValue,
} from '@/shared/blocks/tools/tool-control-bar';
import {
  AssistantTaskCard,
  AssistantTaskFeedItem,
  AssistantWorkspaceThread,
  imageTaskToolUI,
  useAssistantWorkspaceRuntime,
  videoTaskToolUI,
  type AssistantTaskCardData,
} from '@/shared/components/assistant-ui';
import { useAppContext } from '@/shared/contexts/app';
import { useChatContext } from '@/shared/contexts/chat';
import { useToolCatalog } from '@/shared/hooks/use-tool-catalog';
import { AI_CREDITS_ENABLED } from '@/shared/lib/ai-credits';
import { getGenerationLimitCopy } from '@/shared/lib/generation-limit';
import { cn } from '@/shared/lib/utils';
import type { ToolMode } from '@/shared/types/ai-tools';
import { Chat } from '@/shared/types/chat';

import { ChatHeader } from './header';
import { ChatReferenceImageSlots } from './reference-image-slots';

function safeParseMetadata(value: unknown) {
  if (!value) {
    return {};
  }

  if (typeof value === 'object') {
    return value as Record<string, unknown>;
  }

  if (typeof value !== 'string') {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function formatModeLabel(value: string) {
  return value
    .split('-')
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');
}

type ChatToolTaskRecord = {
  id: string;
  status: string;
  provider: string;
  model: string;
  scene?: string | null;
  prompt: string | null;
  options?: string | null;
  taskInfo?: string | null;
  taskResult?: string | null;
  createdAt?: string | Date | null;
  creditCost?: number | null;
};

function createPendingTaskRecord({
  prompt,
  mode,
  model,
  options,
}: {
  prompt: string;
  mode: string;
  model: string;
  options: Record<string, unknown>;
}): ChatToolTaskRecord {
  return {
    id: `local-pending-${crypto.randomUUID()}`,
    status: 'pending',
    provider: 'apimart',
    model,
    scene: mode,
    prompt,
    options: JSON.stringify(options),
    taskInfo: JSON.stringify({
      progress: 12,
    }),
    createdAt: new Date().toISOString(),
  };
}

function classifyToolInputIntent(text: string): 'generate' | 'chat' {
  const normalized = text.trim().toLowerCase();

  if (!normalized) {
    return 'generate';
  }

  const generateSignals = [
    '生成',
    '重新生成',
    '再生成',
    '继续生成',
    '继续给我生成',
    '来一个',
    '再来一个',
    '做一个',
    '做一版',
    '创建',
    '改成',
    '换成',
    '加一个镜头',
    '补充一个',
    'generate',
    'regenerate',
    'create',
    'make a',
    'make another',
    'add a shot',
    'add a drone shot',
  ];

  const chatSignals = [
    '为什么',
    '为啥',
    '怎么',
    '分析',
    '解释',
    '脚本',
    '文案',
    '建议',
    '思路',
    '优化',
    '总结',
    '失败',
    '哪里不对',
    '有什么问题',
    '帮我想',
    'chat',
    'why',
    'how',
    'analyze',
    'explain',
    'script',
    'outline',
    'idea',
    'ideas',
    'suggest',
    'improve',
  ];

  if (generateSignals.some((signal) => normalized.includes(signal))) {
    return 'generate';
  }

  if (
    chatSignals.some((signal) => normalized.includes(signal)) ||
    normalized.endsWith('?') ||
    normalized.endsWith('？')
  ) {
    return 'chat';
  }

  return 'generate';
}

function isTerminalTaskStatus(status: string) {
  return status === 'success' || status === 'failed' || status === 'canceled';
}

function parseJson(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeTaskErrorMessage(errorMessage: unknown) {
  if (typeof errorMessage !== 'string') {
    return undefined;
  }

  const normalized = errorMessage.trim();
  if (!normalized) {
    return undefined;
  }

  const lower = normalized.toLowerCase();
  const shouldSuggestSwitchModel =
    normalized.includes('服务暂时不可用') ||
    normalized.includes('稍后重试') ||
    normalized.includes('请重试') ||
    lower.includes('service unavailable') ||
    lower.includes('temporarily unavailable') ||
    lower.includes('model is overloaded') ||
    lower.includes('upstream error') ||
    lower.includes('provider unavailable');

  if (shouldSuggestSwitchModel) {
    return '当前模型暂不可用，请切换模型重试';
  }

  return normalized;
}

function buildTaskCard(task: ChatToolTaskRecord): AssistantTaskCardData {
  const taskInfo = parseJson(task.taskInfo || null);
  const imageAssets = Array.isArray(taskInfo?.images)
    ? taskInfo.images
        .map((item: any, index: number) =>
          item?.imageUrl
            ? {
                id: `${task.id}-image-${index}`,
                kind: 'image' as const,
                url: item.imageUrl,
                alt: task.prompt || 'Generated image',
              }
            : null
        )
        .filter(Boolean)
    : [];
  const videoAssets = Array.isArray(taskInfo?.videos)
    ? taskInfo.videos
        .map((item: any, index: number) =>
          item?.videoUrl
            ? {
                id: `${task.id}-video-${index}`,
                kind: 'video' as const,
                url: item.videoUrl,
                thumbnailUrl: item.thumbnailUrl,
                alt: task.prompt || 'Generated video',
              }
            : null
        )
        .filter(Boolean)
    : [];

  const normalizedStatus: AssistantTaskCardData['status'] =
    task.status === 'success' ||
    task.status === 'failed' ||
    task.status === 'canceled' ||
    task.status === 'processing' ||
    task.status === 'pending'
      ? task.status
      : 'pending';

  return {
    id: task.id,
    prompt: task.prompt || 'Generation request',
    status: normalizedStatus,
    modeLabel: task.scene ? formatModeLabel(task.scene) : undefined,
    providerLabel: 'YouTube Automation AI',
    modelLabel: task.model,
    createdAtLabel: task.createdAt
      ? new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(task.createdAt))
      : undefined,
    errorMessage: normalizeTaskErrorMessage(taskInfo?.errorMessage),
    assets: [...imageAssets, ...videoAssets],
    progress:
      typeof taskInfo?.progress === 'number'
        ? taskInfo.progress
        : task.status === 'pending'
          ? 18
          : task.status === 'processing'
            ? 62
            : task.status === 'success'
              ? 100
              : undefined,
  };
}

const toolChatTabs = ['All', 'Image', 'Video'] as const;
type ToolChatTab = (typeof toolChatTabs)[number];
const toolChatActions = [{ label: 'Favorites', icon: Star }] as const;

function getTaskTab(task: ChatToolTaskRecord): ToolChatTab {
  if (task.scene?.includes('image')) {
    return 'Image';
  }

  if (task.scene?.includes('video')) {
    return 'Video';
  }

  return 'All';
}

export function ChatBox({
  initialChat,
  initialMessages,
  initialPrompt,
  initialTask,
  initialTasks = [],
}: {
  initialChat?: Chat;
  initialMessages?: UIMessage[];
  initialPrompt?: string;
  initialTask?: ChatToolTaskRecord | null;
  initialTasks?: ChatToolTaskRecord[];
}) {
  const router = useRouter();
  const { setChat } = useChatContext();
  const { showGenerationLimitModal } = useAppContext();
  const { models } = useToolCatalog('chat');
  const [chatState, setChatState] = useState(initialChat);
  const [selectedModelId, setSelectedModelId] = useState(
    initialChat?.model ?? ''
  );
  const seededTasks =
    initialTasks.length > 0 ? initialTasks : initialTask ? [initialTask] : [];
  const [tasks, setTasks] = useState<ChatToolTaskRecord[]>(seededTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    seededTasks[0]?.id ?? ''
  );
  const [activeToolTab, setActiveToolTab] = useState<ToolChatTab>('All');
  const [favoriteTaskIds, setFavoriteTaskIds] = useState<string[]>([]);
  const [isFavoritePending, setIsFavoritePending] = useState(false);
  const metadata = useMemo(
    () => safeParseMetadata(chatState?.metadata),
    [chatState?.metadata]
  );
  const isToolChat = metadata.source === 'tool';
  const toolSurface =
    typeof metadata.toolSurface === 'string' ? metadata.toolSurface : '';
  const toolMode =
    typeof metadata.toolMode === 'string' ? metadata.toolMode : '';
  const toolPromptFromMetadata =
    typeof metadata.toolPrompt === 'string' ? metadata.toolPrompt : '';
  const toolModelFromMetadata =
    typeof metadata.toolModel === 'string' ? metadata.toolModel : '';
  const toolOptionsFromMetadata =
    metadata.toolOptions && typeof metadata.toolOptions === 'object'
      ? (metadata.toolOptions as Record<string, unknown>)
      : {};
  const toolCatalogSurface = toolSurface === 'video' ? 'video' : 'image';
  const { models: toolModels, loading: toolCatalogLoading } =
    useToolCatalog(toolCatalogSurface);
  const [toolPrompt, setToolPrompt] = useState(toolPromptFromMetadata);
  const [toolModeState, setToolModeState] = useState(toolMode);
  const [toolModelId, setToolModelId] = useState(toolModelFromMetadata);
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);
  const toolGenerationLockRef = useRef(false);
  const [draftSourceTaskId, setDraftSourceTaskId] = useState<string>(
    seededTasks[0]?.id ?? ''
  );
  const [isDraftDirty, setIsDraftDirty] = useState(false);
  const [toolOptions, setToolOptions] = useState<Record<string, unknown>>(
    toolOptionsFromMetadata
  );
  const availableToolModes = useMemo(
    () =>
      Array.from(
        new Set(
          toolModels
            .flatMap((model) => model.modeSupport)
            .filter((item) => item !== 'chat')
        )
      ) as ToolMode[],
    [toolModels]
  );
  const availableToolModels = useMemo(
    () =>
      toolModels.filter((model) =>
        toolModeState
          ? model.modeSupport.includes(toolModeState as ToolMode)
          : true
      ),
    [toolModeState, toolModels]
  );
  const selectedToolModel = useMemo(
    () => toolModels.find((model) => model.id === toolModelId),
    [toolModelId, toolModels]
  );
  const imageReferenceRequired =
    toolModeState === 'image-to-image' || toolModeState === 'image-to-video';
  const imageUrls = Array.isArray(toolOptions.image_urls)
    ? (toolOptions.image_urls as string[])
    : [];
  const canGenerateToolTask = Boolean(
    toolPrompt.trim() &&
      toolModeState &&
      toolModelId &&
      (!imageReferenceRequired || imageUrls.length > 0) &&
      !toolCatalogLoading &&
      !isGeneratingTask
  );
  const toolInputIntent = useMemo(
    () => classifyToolInputIntent(toolPrompt),
    [toolPrompt]
  );
  const visibleTasks = useMemo(
    () =>
      activeToolTab === 'All'
        ? tasks
        : tasks.filter((task) => getTaskTab(task) === activeToolTab),
    [activeToolTab, tasks]
  );
  const latestTask = visibleTasks[0] ?? null;
  const selectedTask =
    visibleTasks.find((task) => task.id === selectedTaskId) ??
    latestTask ??
    null;
  const isSelectedTaskFavorited = Boolean(
    selectedTask?.id && favoriteTaskIds.includes(selectedTask.id)
  );
  const toggleFavoriteTaskRef = useRef<() => void>(() => {});
  const createTaskFromPayload = useCallback(
    async ({
      prompt,
      mode,
      taskModelId,
      options,
    }: {
      prompt: string;
      mode: string;
      taskModelId: string;
      options: Record<string, unknown>;
    }) => {
      if (toolGenerationLockRef.current) {
        return;
      }

      if (!isToolChat || !chatState?.id) {
        return;
      }

      const trimmedPrompt = prompt.trim();
      if (!trimmedPrompt) {
        toast.error('Prompt is required.');
        return;
      }

      const chatModel = selectedModelId || chatState.model || models[0]?.id;
      if (!chatModel) {
        toast.error('Chat model is required.');
        return;
      }

      if (!mode) {
        toast.error('Generation mode is required.');
        return;
      }

      if (!taskModelId) {
        toast.error('Generation model is required.');
        return;
      }

      const requiresImageReference =
        mode === 'image-to-image' || mode === 'image-to-video';
      const nextImageUrls = Array.isArray(options.image_urls)
        ? options.image_urls
        : [];

      if (requiresImageReference && nextImageUrls.length === 0) {
        toast.error('Reference image is required.');
        return;
      }

      try {
        toolGenerationLockRef.current = true;
        setIsGeneratingTask(true);
        const shouldKeepCurrentTaskVisible = selectedTask?.status === 'success';
        const shouldAutoSelectNewTask = !shouldKeepCurrentTaskVisible;
        const optimisticTask = createPendingTaskRecord({
          prompt: trimmedPrompt,
          mode,
          model: taskModelId,
          options,
        });
        setTasks((current) => [
          optimisticTask,
          ...current.filter((task) => task.id !== optimisticTask.id),
        ]);
        if (shouldAutoSelectNewTask) {
          setSelectedTaskId(optimisticTask.id);
          setDraftSourceTaskId(optimisticTask.id);
        }

        const resp = await fetch('/api/chat/tool-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: chatState.id,
            prompt: trimmedPrompt,
            surface: toolSurface,
            mode,
            model: chatModel,
            toolModel: taskModelId,
            toolOptions: options,
          }),
        });

        if (!resp.ok) {
          throw new Error(`request failed with status: ${resp.status}`);
        }

        const json = (await resp.json()) as {
          code: number;
          message?: string;
          data?: {
            metadata?: Record<string, unknown> | null;
            task?: ChatToolTaskRecord;
          };
        };

        if (
          json.code === -2 ||
          json.message === 'daily_generation_limit_reached'
        ) {
          showGenerationLimitModal(
            getGenerationLimitCopy(
              toolSurface === 'image' ? 'image' : 'video'
            )
          );
          setTasks((current) =>
            current.filter((task) => task.id !== optimisticTask.id)
          );
          return;
        }

        if (json.code !== 0 || !json.data?.task) {
          throw new Error(json.message || 'failed to start generation');
        }

        setTasks((current) => [
          json.data!.task!,
          ...current.filter(
            (task) =>
              task.id !== json.data!.task!.id && task.id !== optimisticTask.id
          ),
        ]);
        if (shouldAutoSelectNewTask) {
          setSelectedTaskId(json.data.task.id);
          setDraftSourceTaskId(json.data.task.id);
        }
        setIsDraftDirty(false);

        if (json.data.metadata && chatState) {
          setChatState({
            ...chatState,
            metadata: json.data.metadata,
          });
        }

        router.refresh();
      } catch (error: any) {
        setTasks((current) =>
          current.filter((task) => !task.id.startsWith('local-pending-'))
        );
        toast.error(error.message || 'failed to start generation');
      } finally {
        toolGenerationLockRef.current = false;
        setIsGeneratingTask(false);
      }
    },
    [
      chatState,
      isToolChat,
      models,
      router,
      selectedModelId,
      selectedTask?.status,
      selectedTaskId,
      showGenerationLimitModal,
      toolSurface,
    ]
  );
  const applyDraftFromTask = useCallback(
    (task: ChatToolTaskRecord | null) => {
      if (!task) {
        setToolPrompt(toolPromptFromMetadata);
        setToolModeState(toolMode);
        setToolModelId(toolModelFromMetadata);
        setToolOptions(toolOptionsFromMetadata);
        setDraftSourceTaskId('');
        setIsDraftDirty(false);
        return;
      }

      setToolPrompt(task.prompt || '');
      if (task.scene) {
        setToolModeState(task.scene);
      }
      if (task.model) {
        setToolModelId(task.model);
      }

      const parsedOptions = parseJson(task.options || null);
      setToolOptions(
        parsedOptions && typeof parsedOptions === 'object'
          ? (parsedOptions as Record<string, unknown>)
          : {}
      );
      setDraftSourceTaskId(task.id);
      setIsDraftDirty(false);
    },
    [
      toolMode,
      toolModelFromMetadata,
      toolOptionsFromMetadata,
      toolPromptFromMetadata,
    ]
  );
  const handleRepromptTask = useCallback(
    (task?: ChatToolTaskRecord | null) => {
      const nextTask = task ?? selectedTask;
      if (!nextTask) {
        return;
      }

      setSelectedTaskId(nextTask.id);
      applyDraftFromTask(nextTask);
    },
    [applyDraftFromTask, selectedTask]
  );
  const handleRegenerateTask = useCallback(
    async (task?: ChatToolTaskRecord | null) => {
      const nextTask = task ?? selectedTask;
      if (!nextTask) {
        return;
      }

      const parsedOptions = parseJson(nextTask.options || null);
      await createTaskFromPayload({
        prompt: nextTask.prompt || '',
        mode: nextTask.scene || '',
        taskModelId: nextTask.model,
        options:
          parsedOptions && typeof parsedOptions === 'object'
            ? (parsedOptions as Record<string, unknown>)
            : {},
      });
    },
    [createTaskFromPayload, selectedTask]
  );
  const taskCards = useMemo(
    () =>
      visibleTasks.map((task) => ({
        task,
        card: buildTaskCard(task),
      })),
    [visibleTasks]
  );
  const orderedTaskCards = useMemo(() => [...taskCards].reverse(), [taskCards]);
  const latestTaskCard = taskCards[0]?.card ?? null;
  const toolChatHeader = useMemo(() => {
    if (!isToolChat) {
      return latestTaskCard ? (
        <div className="mx-auto w-full max-w-[1040px]">
          <AssistantTaskCard task={latestTaskCard} />
        </div>
      ) : null;
    }

    return null;
  }, [isToolChat, latestTaskCard]);
  const toolChatContent = useMemo(() => {
    if (!isToolChat) {
      return;
    }

    if (!taskCards.length) {
      return (
        <AssistantTaskFeedItem>
          <div className="rounded-[22px] border border-dashed border-white/8 bg-[#181922] px-5 py-8 text-sm text-zinc-500">
            No generation results yet.
          </div>
        </AssistantTaskFeedItem>
      );
    }

    return (
      <>
        {orderedTaskCards.map(({ task, card }) => (
          <AssistantTaskFeedItem key={task.id}>
            <AssistantTaskCard
              task={card}
              onReprompt={() => handleRepromptTask(task)}
              onRegenerate={() => handleRegenerateTask(task)}
            />
          </AssistantTaskFeedItem>
        ))}
      </>
    );
  }, [handleRegenerateTask, handleRepromptTask, isToolChat, orderedTaskCards]);

  const runtime = useAssistantWorkspaceRuntime({
    id: chatState?.id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest({ messages, id, body }) {
        const extraBody = body ?? {};

        return {
          body: {
            ...extraBody,
            chatId: id,
            model: selectedModelId || chatState?.model || models[0]?.id,
            message: messages[messages.length - 1],
          },
        };
      },
    }),
  });

  useEffect(() => {
    if (chatState) {
      setChat(chatState);
    }
  }, [chatState, setChat]);

  useEffect(() => {
    if (!selectedModelId && chatState?.model) {
      setSelectedModelId(chatState.model);
      return;
    }

    if (!selectedModelId && models[0]?.id) {
      setSelectedModelId(models[0].id);
    }
  }, [chatState?.model, models, selectedModelId]);

  useEffect(() => {
    if (!isToolChat) {
      return;
    }

    if (!selectedTaskId) {
      applyDraftFromTask(null);
    }
  }, [applyDraftFromTask, isToolChat, selectedTaskId]);

  useEffect(() => {
    if (!isToolChat) {
      return;
    }

    if (
      toolModeState &&
      !availableToolModes.includes(toolModeState as ToolMode)
    ) {
      setToolModeState(availableToolModes[0] ?? toolModeState);
    }
  }, [availableToolModes, isToolChat, toolModeState]);

  useEffect(() => {
    if (!isToolChat) {
      return;
    }

    if (
      !toolModelId ||
      !availableToolModels.some((model) => model.id === toolModelId)
    ) {
      setToolModelId(availableToolModels[0]?.id ?? '');
    }
  }, [availableToolModels, isToolChat, toolModelId]);

  useEffect(() => {
    if (!selectedTaskId) {
      return;
    }

    const nextTask = tasks.find((task) => task.id === selectedTaskId);
    if (!nextTask) {
      return;
    }

    // Rehydrate only when the user explicitly changes selection or after
    // Reset, not when background polling mutates the selected task.
    if (draftSourceTaskId !== nextTask.id) {
      applyDraftFromTask(nextTask);
    }
  }, [applyDraftFromTask, draftSourceTaskId, selectedTaskId, tasks]);

  useEffect(() => {
    if (visibleTasks.length === 0) {
      if (selectedTaskId) {
        setSelectedTaskId('');
      }
      return;
    }

    const hasSelectedTask = visibleTasks.some(
      (task) => task.id === selectedTaskId
    );
    if (!selectedTaskId || !hasSelectedTask) {
      setSelectedTaskId(visibleTasks[0].id);
    }
  }, [selectedTaskId, visibleTasks]);

  useEffect(() => {
    const activeTaskIds = tasks
      .filter((task) => !isTerminalTaskStatus(task.status))
      .map((task) => task.id);

    if (activeTaskIds.length === 0) {
      return;
    }

    const interval = window.setInterval(
      async () => {
        await Promise.all(
          activeTaskIds.map(async (taskId) => {
            try {
              const resp = await fetch(`/api/tools/tasks/${taskId}`);
              if (!resp.ok) {
                if (resp.status === 404) {
                  setTasks((current) =>
                    current.filter((task) => task.id !== taskId)
                  );
                  return;
                }

                throw new Error(`request failed with status: ${resp.status}`);
              }

              const json = (await resp.json()) as {
                code: number;
                data?: ChatToolTaskRecord;
                message?: string;
              };

              if (
                json.code !== 0 ||
                !json.data ||
                json.message === 'task not found'
              ) {
                if (json.message === 'task not found') {
                  setTasks((current) =>
                    current.filter((task) => task.id !== taskId)
                  );
                  return;
                }

                throw new Error(json.message || 'failed to refresh task');
              }

              setTasks((current) =>
                current.map((task) => (task.id === taskId ? json.data! : task))
              );
            } catch (error) {
              console.error('refresh task in chat detail failed:', error);
            }
          })
        );
      },
      toolSurface === 'video' ? 12000 : 5000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [tasks, toolSurface]);

  const handleGenerateToolTask = useCallback(async () => {
    await createTaskFromPayload({
      prompt: toolPrompt,
      mode: toolModeState,
      taskModelId: toolModelId,
      options: toolOptions,
    });
  }, [
    createTaskFromPayload,
    toolModeState,
    toolModelId,
    toolOptions,
    toolPrompt,
  ]);
  const handleToolInputSubmitIntent = useCallback(() => {
    if (!isToolChat) {
      return false;
    }

    if (toolInputIntent !== 'generate') {
      return false;
    }

    void handleGenerateToolTask();
    return true;
  }, [handleGenerateToolTask, isToolChat, toolInputIntent]);
  const toggleFavoriteTask = useCallback(async () => {
    if (!chatState?.projectId || !selectedTask?.id) {
      toast.error('Project or task is not ready yet.');
      return;
    }

    try {
      setIsFavoritePending(true);
      const resp = await fetch('/api/project/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'toggle',
          projectId: chatState.projectId,
          taskId: selectedTask.id,
        }),
      });
      const json = await resp.json();

      if (!resp.ok || json.code !== 0) {
        throw new Error(json.message || 'failed to toggle favorite');
      }

      setFavoriteTaskIds((current) =>
        json.data?.favorited
          ? Array.from(new Set([...current, selectedTask.id]))
          : current.filter((id) => id !== selectedTask.id)
      );
    } catch (error: any) {
      toast.error(error.message || 'failed to toggle favorite');
    } finally {
      setIsFavoritePending(false);
    }
  }, [chatState?.projectId, selectedTask]);

  useEffect(() => {
    toggleFavoriteTaskRef.current = () => {
      void toggleFavoriteTask();
    };
  }, [toggleFavoriteTask]);

  useEffect(() => {
    if (!chatState?.projectId) {
      return;
    }

    const controller = new AbortController();

    void (async () => {
      try {
        const resp = await fetch('/api/project/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'list',
            projectId: chatState.projectId,
          }),
          signal: controller.signal,
        });
        const json = await resp.json();

        if (!resp.ok || json.code !== 0) {
          throw new Error(json.message || 'failed to load favorites');
        }

        setFavoriteTaskIds(
          Array.isArray(json.data)
            ? json.data
                .map((item: any) => item?.task?.id)
                .filter(
                  (value: unknown): value is string => typeof value === 'string'
                )
            : []
        );
      } catch (error: any) {
        if (controller.signal.aborted) {
          return;
        }

        console.error('load project favorites failed:', error);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [chatState?.projectId]);

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#111217]">
      <ChatHeader />
      <div className="min-h-0 flex-1 overflow-hidden px-3 py-2 lg:px-5 lg:py-3">
        <div className="mx-auto flex h-full min-h-0 max-w-[1180px] flex-col gap-2 lg:gap-3">
          <AssistantWorkspaceThread
            runtime={runtime}
            composerActionSlot={
              isToolChat ? (
                <>
                  <ThreadPrimitive.If running={false}>
                    <button
                      type="button"
                      onClick={(event) => {
                        if (toolInputIntent === 'generate') {
                          void handleGenerateToolTask();
                          return;
                        }

                        const form = event.currentTarget.closest('form');
                        form?.requestSubmit();
                      }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-950 shadow-lg shadow-black/20 transition hover:bg-zinc-100 disabled:bg-white/6 disabled:text-zinc-500"
                      disabled={
                        toolInputIntent === 'generate'
                          ? !canGenerateToolTask
                          : isGeneratingTask
                      }
                    >
                      {isGeneratingTask ? (
                        <LoaderCircle className="size-4.5 animate-spin" />
                      ) : (
                        <ArrowUp className="size-4.5" />
                      )}
                    </button>
                  </ThreadPrimitive.If>
                  <ThreadPrimitive.If running>
                    <button
                      type="button"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/8 text-zinc-400 shadow-lg shadow-black/20"
                      disabled
                    >
                      <LoaderCircle className="size-4.5 animate-spin" />
                    </button>
                  </ThreadPrimitive.If>
                </>
              ) : undefined
            }
            composerFooter={
              isToolChat && AI_CREDITS_ENABLED ? (
                <span className="pr-2 text-[15px] text-zinc-500">
                  {selectedToolModel?.creditCostByMode?.[
                    toolModeState as ToolMode
                  ] ?? 0}{' '}
                  Credits
                </span>
              ) : undefined
            }
            composerPlaceholder={
              isToolChat
                ? 'Enter your idea to generate'
                : 'Ask about scripts, workflows, prompts, or growth ideas'
            }
            composerShowAttachmentButton
            composerSubmitDisabled={isGeneratingTask}
            composerSubmitIntent={
              isToolChat ? handleToolInputSubmitIntent : undefined
            }
            composerLeading={
              isToolChat && imageReferenceRequired ? (
                <ChatReferenceImageSlots
                  value={imageUrls}
                  onChange={(nextUrls) => {
                    setToolOptions((current) => ({
                      ...current,
                      image_urls: nextUrls,
                    }));
                    setIsDraftDirty(true);
                  }}
                />
              ) : undefined
            }
            composerToolbar={
              isToolChat &&
              (toolSurface === 'image' || toolSurface === 'video') ? (
                <ToolControlBar
                  className="w-full"
                  surface={toolCatalogSurface}
                  value={{
                    mode: toolModeState,
                    modelId: toolModelId,
                    options: toolOptions,
                  }}
                  onChange={(nextValue: ToolControlValue) => {
                    setToolModeState(nextValue.mode);
                    setToolModelId(nextValue.modelId);
                    setToolOptions(nextValue.options);
                    setIsDraftDirty(true);
                  }}
                  allowedModes={
                    toolSurface === 'image'
                      ? ['text-to-image', 'image-to-image']
                      : ['text-to-video', 'image-to-video']
                  }
                />
              ) : undefined
            }
            initialComposerValue={isToolChat ? toolPrompt : initialPrompt}
            onComposerValueChange={
              isToolChat
                ? (value) => {
                    setToolPrompt(value);
                    setIsDraftDirty(true);
                  }
                : undefined
            }
            toolUIs={[imageTaskToolUI, videoTaskToolUI]}
            hideUserMessages={isToolChat}
            contentSlot={toolChatContent ?? undefined}
            headerSlot={toolChatHeader ?? undefined}
            autoScrollKey={taskCards[0]?.task.id ?? taskCards.length}
            emptyDescription="Your latest generation and assistant replies will appear here."
            emptyTitle={chatState?.title || 'Start the conversation'}
            suggestions={
              isToolChat
                ? undefined
                : [
                    {
                      label: 'Rewrite my thumbnail prompt',
                      prompt:
                        'Rewrite my thumbnail prompt to improve click-through rate.',
                    },
                    {
                      label: 'Plan a faceless channel',
                      prompt:
                        'Plan a faceless YouTube channel workflow using image and video generation.',
                    },
                    {
                      label: 'Generate better hooks',
                      prompt:
                        'Give me 10 stronger hooks for a YouTube automation video.',
                    },
                  ]
            }
            viewportClassName="bg-transparent"
            className="rounded-none border-none bg-transparent shadow-none"
          />
        </div>
      </div>
    </div>
  );
}
