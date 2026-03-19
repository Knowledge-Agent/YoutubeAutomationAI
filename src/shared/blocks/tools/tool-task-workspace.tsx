'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowUp,
  Clock3,
  FolderOpen,
  ImagePlus,
  LoaderCircle,
  MessageSquare,
  Play,
  RefreshCcw,
  Sparkles,
  Star,
  Video,
  Wand2,
} from 'lucide-react';
import { toast } from 'sonner';

import { usePathname, useRouter } from '@/core/i18n/navigation';
import { AIMediaType, AITaskStatus } from '@/extensions/ai/types';
import { ImageUploader, ImageUploaderValue } from '@/shared/blocks/common';
import {
  AssistantModelOption,
  AssistantModelPicker,
  AssistantTaskCardData,
} from '@/shared/components/assistant-ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';
import { useAppContext } from '@/shared/contexts/app';
import { useToolCatalog } from '@/shared/hooks/use-tool-catalog';
import { cn } from '@/shared/lib/utils';
import type {
  ToolMode,
  ToolModelDefinition,
  ToolOptionDefinition,
  ToolSurface,
} from '@/shared/types/ai-tools';

import { ToolModeRail } from './tool-mode-rail';

type ToolTaskRecord = {
  id: string;
  status: string;
  provider: string;
  model: string;
  scene?: string | null;
  prompt: string | null;
  taskInfo: string | null;
  createdAt?: string;
  creditCost?: number;
};

function formatModeLabel(mode: ToolMode) {
  return mode
    .split('-')
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');
}

function formatTaskStatus(status: string): AssistantTaskCardData['status'] {
  switch (status) {
    case AITaskStatus.SUCCESS:
      return 'success';
    case AITaskStatus.FAILED:
      return 'failed';
    case AITaskStatus.CANCELED:
      return 'canceled';
    case AITaskStatus.PROCESSING:
      return 'processing';
    case AITaskStatus.PENDING:
    default:
      return 'pending';
  }
}

function isTerminal(status: string) {
  return (
    status === AITaskStatus.SUCCESS ||
    status === AITaskStatus.FAILED ||
    status === AITaskStatus.CANCELED
  );
}

function parseTaskInfo(value: string | null): any {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('failed to parse task info:', error);
    return null;
  }
}

function buildTaskCard({
  task,
  model,
}: {
  task: ToolTaskRecord;
  model?: ToolModelDefinition;
}): AssistantTaskCardData {
  const taskInfo = parseTaskInfo(task.taskInfo);
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

  return {
    id: task.id,
    prompt: task.prompt || 'Generation request',
    title: model?.label,
    status: formatTaskStatus(task.status),
    modeLabel: formatModeLabel(
      (task.scene as ToolMode) || model?.modeSupport[0] || 'chat'
    ),
    providerLabel: 'APIMart',
    modelLabel: model?.label ?? task.model,
    createdAtLabel: task.createdAt
      ? new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(task.createdAt))
      : undefined,
    errorMessage: taskInfo?.errorMessage,
    assets: [...imageAssets, ...videoAssets],
    progress:
      task.status === AITaskStatus.PENDING
        ? 18
        : task.status === AITaskStatus.PROCESSING
          ? 62
          : task.status === AITaskStatus.SUCCESS
            ? 100
            : undefined,
  };
}

function getDefaultMode(surface: ToolSurface): ToolMode {
  return surface === 'image' ? 'text-to-image' : 'text-to-video';
}

function getDefaultPromptIdeas(surface: ToolSurface) {
  return surface === 'image'
    ? [
        'Streetwear portrait with sharp rim light and reflective chrome',
        'Minimal product hero shot with soft shadow on stone surface',
        'Animated poster scene for a sci-fi city at dusk',
      ]
    : [
        'Vertical trailer for a sneaker drop at golden hour',
        'Drone reveal of a cliffside hotel with bold text moments',
        'Cinematic cooking close-ups with warm tungsten lighting',
      ];
}

export function ToolTaskWorkspace({
  surface,
  initialPrompt = '',
  initialMode,
}: {
  surface: ToolSurface;
  initialPrompt?: string;
  initialMode?: ToolMode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { models: toolModels, options, loading } = useToolCatalog(surface);
  const { models: chatModels } = useToolCatalog('chat');
  const { user, isCheckSign, setIsShowSignModal, fetchUserCredits } =
    useAppContext();

  const [mode, setMode] = useState<ToolMode>(
    initialMode ?? getDefaultMode(surface)
  );
  const [modelId, setModelId] = useState('');
  const [prompt, setPrompt] = useState(initialPrompt.trim());
  const [modelOptions, setModelOptions] = useState<
    Record<string, string | number | boolean | string[]>
  >({});
  const [tasks, setTasks] = useState<ToolTaskRecord[]>([]);
  const [, setReferenceImageItems] = useState<
    ImageUploaderValue[]
  >([]);
  const [referenceImageUrls, setReferenceImageUrls] = useState<string[]>([]);
  const [referenceVideoUrl, setReferenceVideoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const availableModes = useMemo(
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

  const availableModels = useMemo(
    () => toolModels.filter((item) => item.modeSupport.includes(mode)),
    [mode, toolModels]
  );

  const selectedModel = useMemo(
    () => availableModels.find((item) => item.id === modelId),
    [availableModels, modelId]
  );

  const pickerModels = useMemo<AssistantModelOption[]>(
    () =>
      availableModels.map((item) => ({
        id: item.id,
        label: item.label,
        provider: item.provider,
        providerLabel: 'APIMart',
        description: item.description,
        surface,
        modes: item.modeSupport,
        meta: item.creditCostByMode?.[mode]
          ? `${item.creditCostByMode[mode]} credits`
          : undefined,
      })),
    [availableModels, mode, surface]
  );

  const visibleOptions = useMemo<ToolOptionDefinition[]>(
    () =>
      (selectedModel?.supportedOptions ?? [])
        .map((key) => options[key])
        .filter(Boolean)
        .filter((option) => option.type !== 'image_urls' && option.type !== 'video_urls'),
    [options, selectedModel]
  );

  const costCredits = selectedModel?.creditCostByMode?.[mode] ?? 0;
  const promptIdeas = getDefaultPromptIdeas(surface);
  const remainingCredits = user?.credits?.remainingCredits ?? 0;
  const latestTask = tasks[0];
  const latestTaskCard = latestTask
    ? buildTaskCard({
        task: latestTask,
        model: toolModels.find((item) => item.id === latestTask.model),
      })
    : null;
  const resultMaxWidth =
    surface === 'image' ? 'max-w-[1040px]' : 'max-w-[1120px]';
  const composerMaxWidth =
    surface === 'image' ? 'max-w-[980px]' : 'max-w-[1020px]';
  const chatHref = useMemo(() => {
    const params = new URLSearchParams();
    if (prompt.trim()) {
      params.set('prompt', prompt.trim());
    }
    params.set('surface', surface);
    params.set('mode', mode);
    return `/chat${params.toString() ? `?${params.toString()}` : ''}`;
  }, [mode, prompt, surface]);
  const canSubmit =
    Boolean(prompt.trim()) &&
    Boolean(selectedModel) &&
    !submitting &&
    !isCheckSign &&
    (mode !== 'image-to-image' || referenceImageUrls.length > 0) &&
    (mode !== 'video-to-video' || Boolean(referenceVideoUrl));

  const updateMode = useCallback(
    (nextMode: ToolMode) => {
      setMode(nextMode);

      const params = new URLSearchParams(window.location.search);
      params.set('mode', nextMode);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router]
  );

  useEffect(() => {
    if (!availableModes.includes(mode) && availableModes[0]) {
      setMode(availableModes[0]);
    }
  }, [availableModes, mode]);

  useEffect(() => {
    if (!availableModels.find((item) => item.id === modelId) && availableModels[0]) {
      setModelId(availableModels[0].id);
    }
  }, [availableModels, modelId]);

  useEffect(() => {
    if (selectedModel?.defaultOptions) {
      setModelOptions(selectedModel.defaultOptions);
    } else {
      setModelOptions({});
    }
  }, [selectedModel?.id]);

  const handleReferenceImagesChange = useCallback((items: ImageUploaderValue[]) => {
    setReferenceImageItems(items);
    setReferenceImageUrls(
      items
        .filter((item) => item.status === 'uploaded' && item.url)
        .map((item) => item.url as string)
    );
  }, []);

  const refreshTask = useCallback(
    async (taskId: string) => {
      const resp = await fetch(`/api/tools/tasks/${taskId}`);
      if (!resp.ok) {
        throw new Error(`request failed with status: ${resp.status}`);
      }

      const json = (await resp.json()) as {
        code: number;
        message?: string;
        data?: ToolTaskRecord;
      };

      if (json.code !== 0 || !json.data) {
        throw new Error(json.message || 'failed to refresh task');
      }

      setTasks((current) =>
        current.map((task) => (task.id === taskId ? json.data! : task))
      );

      if (isTerminal(json.data.status)) {
        await fetchUserCredits();
      }
    },
    [fetchUserCredits]
  );

  useEffect(() => {
    const activeTaskIds = tasks
      .filter((task) => !isTerminal(task.status))
      .map((task) => task.id);

    if (activeTaskIds.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      activeTaskIds.forEach((taskId) => {
        refreshTask(taskId).catch((error) => {
          console.error('refresh task failed:', error);
        });
      });
    }, surface === 'video' ? 12000 : 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [refreshTask, surface, tasks]);

  const handleSubmit = async () => {
    if (!user) {
      setIsShowSignModal(true);
      return;
    }

    if (remainingCredits < costCredits) {
      toast.error('Insufficient credits. Please top up before generating.');
      return;
    }

    if (!selectedModel) {
      toast.error('Please select a model.');
      return;
    }

    if (mode === 'image-to-image' && referenceImageUrls.length === 0) {
      toast.error('Upload at least one reference image.');
      return;
    }

    if (mode === 'video-to-video' && !referenceVideoUrl.trim()) {
      toast.error('Provide a reference video URL.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        mediaType: surface === 'image' ? AIMediaType.IMAGE : AIMediaType.VIDEO,
        scene: mode,
        model: selectedModel.id,
        prompt: prompt.trim(),
        options: {
          ...modelOptions,
          ...(referenceImageUrls.length > 0 ? { image_urls: referenceImageUrls } : {}),
          ...(referenceVideoUrl.trim()
            ? { video_urls: [referenceVideoUrl.trim()] }
            : {}),
        },
      };

      const resp = await fetch('/api/tools/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(`request failed with status: ${resp.status}`);
      }

      const json = (await resp.json()) as {
        code: number;
        message?: string;
        data?: ToolTaskRecord;
      };

      if (json.code !== 0 || !json.data) {
        throw new Error(json.message || 'failed to create task');
      }

      setTasks((current) => [json.data!, ...current]);
      await fetchUserCredits();
      toast.success(
        surface === 'image'
          ? 'Image generation started'
          : 'Video generation started'
      );
    } catch (error: any) {
      console.error('create task failed:', error);
      toast.error(error.message || 'failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenInChat = async () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      toast.error('Enter a prompt first.');
      return;
    }

    if (!user) {
      router.push(chatHref);
      return;
    }

    try {
      const resp = await fetch('/api/chat/from-tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          surface,
          mode,
          model: chatModels[0]?.id || 'gpt-4o',
          toolModel: selectedModel?.id,
          toolOptions: modelOptions,
          appendPrompt: true,
        }),
      });

      if (!resp.ok) {
        throw new Error(`request failed with status: ${resp.status}`);
      }

      const json = (await resp.json()) as {
        code: number;
        message?: string;
        data?: { path?: string };
      };

      if (json.code !== 0 || !json.data?.path) {
        throw new Error(json.message || 'failed to open chat');
      }

      router.push(json.data.path);
    } catch (error: any) {
      console.error('open chat from tool failed:', error);
      toast.error(error.message || 'failed to open chat');
    }
  };

  return (
    <div className="relative grid w-full items-start gap-6 lg:grid-cols-[72px_minmax(0,1fr)]">
      <div className="self-start">
        <ToolModeRail
          items={availableModes.map((item) => ({
            key: item,
            title:
              item === 'text-to-image'
                ? 'Txt2Img'
                : item === 'image-to-image'
                  ? 'Img2Img'
                  : item === 'text-to-video'
                    ? 'Txt2Vid'
                    : item === 'image-to-video'
                      ? 'Img2Vid'
                      : 'Vid2Vid',
            icon:
              item.includes('image') && surface === 'video'
                ? ImagePlus
                : surface === 'image'
                  ? Sparkles
                  : Video,
            href: undefined,
            active: item === mode,
            onClick: () => updateMode(item),
          }))}
        />
      </div>

      <div className="min-w-0">
        <div className="mx-auto mb-4 flex max-w-[1120px] flex-wrap items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-6">
            <button className="relative pb-1 text-sm font-medium text-white">
              Recent
              <span className="absolute inset-x-0 -bottom-3 h-px bg-white/80" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button className="flex h-8 items-center gap-1.5 rounded-xl border border-white/8 bg-[#161821] px-2.5 text-[12px] font-medium text-zinc-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-white">
              <Star className="size-4" />
              Favorites
            </button>
            <button className="flex h-8 items-center gap-1.5 rounded-xl border border-white/8 bg-[#161821] px-2.5 text-[12px] font-medium text-zinc-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-white">
              <FolderOpen className="size-4" />
              Assets
            </button>
          </div>
        </div>

        <div className="flex min-h-[calc(100vh-110px)] flex-col">
          {latestTaskCard ? (
            <section
              className={cn(
                'relative mx-auto w-full overflow-hidden rounded-[30px] border border-white/8 bg-[#1b1c23] px-4 py-4 shadow-[0_20px_44px_rgba(0,0,0,0.2)] md:px-4.5',
                resultMaxWidth
              )}
            >
              <div
                className={cn(
                  'pointer-events-none absolute inset-0',
                  surface === 'image'
                    ? 'bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_24%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.06),transparent_20%)]'
                    : 'bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.08),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent_20%)]'
                )}
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/0 via-white/14 to-white/0" />

              <div className="relative flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span
                  className={cn(
                    'inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-semibold',
                    surface === 'image'
                      ? 'bg-emerald-400/10 text-emerald-300'
                      : 'bg-fuchsia-400/10 text-fuchsia-300'
                  )}
                >
                  A
                </span>
                <span className="font-medium text-zinc-200">
                  {latestTaskCard.providerLabel || 'APIMart'}
                </span>
                {latestTaskCard.modeLabel ? (
                  <span className="rounded-lg border border-white/8 bg-white/5 px-2.5 py-1 text-zinc-400">
                    {latestTaskCard.modeLabel}
                  </span>
                ) : null}
                {latestTaskCard.modelLabel ? (
                  <span className="rounded-lg border border-white/8 bg-white/5 px-2.5 py-1 text-zinc-400">
                    {latestTaskCard.modelLabel}
                  </span>
                ) : null}
                {latestTaskCard.createdAtLabel ? (
                  <span>{latestTaskCard.createdAtLabel}</span>
                ) : null}
                <span
                  className={cn(
                    'rounded-lg border border-white/8 px-2.5 py-1 uppercase',
                    latestTaskCard.status === 'success'
                      ? 'bg-emerald-400/10 text-emerald-300'
                      : latestTaskCard.status === 'failed'
                        ? 'bg-rose-500/10 text-rose-300'
                        : 'bg-white/5 text-zinc-400'
                  )}
                >
                  {latestTaskCard.status}
                </span>
              </div>

              <div className="relative mt-3 text-[15px] leading-7 text-zinc-200">
                <p className="text-[15px] leading-7 text-zinc-200">
                  {latestTaskCard.prompt}
                </p>
              </div>

              <div
                className={cn(
                  'relative mt-3 rounded-[22px] border border-white/10 bg-[#14151b] p-1 shadow-[0_22px_40px_rgba(0,0,0,0.22)]',
                  surface === 'image' ? 'max-w-[164px]' : 'max-w-[184px]'
                )}
              >
                {latestTaskCard.assets?.[0] ? (
                  latestTaskCard.assets[0].kind === 'video' ? (
                    <div className="group relative overflow-hidden rounded-[18px]">
                      <div className="relative aspect-[4/4.45] overflow-hidden">
                        <img
                          src={
                            latestTaskCard.assets[0].thumbnailUrl ||
                            latestTaskCard.assets[0].url
                          }
                          alt={
                            latestTaskCard.assets[0].alt ||
                            'Generated video result'
                          }
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
                        <button className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-950 shadow-xl shadow-black/30 transition group-hover:scale-105">
                            <Play className="ml-0.5 size-4.5 fill-current" />
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-[18px]">
                      <img
                        src={latestTaskCard.assets[0].url}
                        alt={
                          latestTaskCard.assets[0].alt ||
                          'Generated image result'
                        }
                        className="aspect-square w-full object-cover"
                      />
                    </div>
                  )
                ) : (
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-[18px] text-zinc-500',
                      surface === 'image' ? 'aspect-square' : 'aspect-[4/4.45]'
                    )}
                  >
                    <LoaderCircle
                      className={cn(
                        'size-8',
                        latestTaskCard.status === 'processing' && 'animate-spin'
                      )}
                    />
                  </div>
                )}
              </div>

              {typeof latestTaskCard.progress === 'number' &&
              latestTaskCard.status !== 'success' &&
              latestTaskCard.status !== 'failed' ? (
                <div className="relative mt-3 max-w-[360px]">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Progress</span>
                    <span>{latestTaskCard.progress}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/8">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        surface === 'image' ? 'bg-emerald-400' : 'bg-fuchsia-400'
                      )}
                      style={{ width: `${latestTaskCard.progress}%` }}
                    />
                  </div>
                </div>
              ) : null}

              {latestTaskCard.errorMessage ? (
                <div className="relative mt-3 rounded-2xl border border-rose-500/18 bg-rose-500/8 px-4 py-3 text-sm text-rose-200">
                  {latestTaskCard.errorMessage}
                </div>
              ) : null}

              <div className="relative mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/8 bg-white/5 px-3 text-[11px] font-medium text-zinc-200 transition hover:bg-white/8 hover:text-white"
                  onClick={() => setPrompt(latestTaskCard.prompt)}
                >
                  <Wand2 className="size-4" />
                  Reprompt
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/8 bg-white/5 px-3 text-[11px] font-medium text-zinc-200 transition hover:bg-white/8 hover:text-white"
                  onClick={handleSubmit}
                >
                  <RefreshCcw className="size-4" />
                  Regenerate
                </button>
              </div>
            </section>
          ) : (
            <section
              className={cn(
                'mx-auto flex min-h-[300px] items-center justify-center rounded-[30px] border border-dashed border-white/8 bg-[#171820] px-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
                resultMaxWidth
              )}
            >
              <div className="max-w-[420px] text-center">
                <div
                  className={cn(
                    'mx-auto flex h-16 w-16 items-center justify-center rounded-full',
                    surface === 'image'
                      ? 'bg-emerald-500/12 text-emerald-300'
                      : 'bg-pink-500/12 text-pink-400'
                  )}
                >
                  {surface === 'image' ? (
                    <ImagePlus className="size-7" />
                  ) : (
                    <Video className="size-7" />
                  )}
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                  {surface === 'image'
                    ? 'Your generated images will appear here'
                    : 'Your generated videos will appear here'}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-500">
                  Submit a prompt from the composer below and the task card will
                  update as APIMart processes it.
                </p>
              </div>
            </section>
          )}

          <div className={cn('mx-auto mt-auto w-full pt-5 pb-12', composerMaxWidth)}>
            <section className="flex flex-wrap items-start gap-2 rounded-[22px] border border-white/8 bg-[#171821]/92 px-3 py-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.16)] backdrop-blur-sm">
              <button
                type="button"
                onClick={() => {
                  setPrompt('');
                  setReferenceImageItems([]);
                  setReferenceImageUrls([]);
                  setReferenceVideoUrl('');
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/5 text-zinc-300 transition hover:bg-white/8 hover:text-white"
              >
                <RefreshCcw className="size-4" />
              </button>
              {promptIdeas.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  className="rounded-full border border-white/8 bg-[#22232e] px-4 py-2 text-sm text-zinc-300 transition hover:bg-[#2a2b36] hover:text-white"
                  onClick={() => setPrompt(idea)}
                >
                  {idea}
                </button>
              ))}
            </section>

            <div className="relative mt-3">
              <section className="w-full rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(33,34,44,0.98),rgba(28,29,37,0.98))] px-4 py-3.5 shadow-[0_22px_48px_rgba(0,0,0,0.24)] transition focus-within:border-cyan-300/18 focus-within:shadow-[0_24px_60px_rgba(34,211,238,0.16)]">
                {mode === 'image-to-image' || mode === 'image-to-video' ? (
                  <div className="mb-4 rounded-[22px] border border-white/8 bg-[#171821] p-3">
                    <ImageUploader
                      allowMultiple={mode === 'image-to-image'}
                      className="w-full"
                      emptyHint="Upload reference images"
                      maxImages={mode === 'image-to-image' ? 4 : 1}
                      maxSizeMB={8}
                      onChange={handleReferenceImagesChange}
                      title="Reference Images"
                    />
                  </div>
                ) : null}

                {mode === 'video-to-video' ? (
                  <div className="mb-4 rounded-[22px] border border-white/8 bg-[#171821] p-3">
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Reference Video URL
                    </label>
                    <Textarea
                      className="min-h-24 border-white/8 bg-white/5 text-zinc-100"
                      onChange={(event) => setReferenceVideoUrl(event.target.value)}
                      placeholder="Paste a video URL that APIMart can access"
                      value={referenceVideoUrl}
                    />
                  </div>
                ) : null}

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-dashed border-white/12 bg-[#171821] text-zinc-500">
                    {surface === 'image' ? (
                      <Sparkles className="size-5" />
                    ) : (
                      <Video className="size-5" />
                    )}
                  </div>
                  <textarea
                    className="min-h-[68px] w-full resize-none border-none bg-transparent px-0 py-1 text-[15px] leading-7 text-zinc-200 outline-none placeholder:text-zinc-500/80"
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder={
                      surface === 'image'
                        ? 'Describe the image you want to create'
                        : 'Describe the video you want to create'
                    }
                    value={prompt}
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/6 pt-3">
                  <div className="flex flex-wrap gap-2">
                    {availableModes.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => updateMode(item)}
                        className={cn(
                          'rounded-xl border px-3 py-2 text-sm transition',
                          item === mode
                            ? 'border-cyan-400/16 bg-cyan-400/10 text-cyan-300'
                            : 'border-white/8 bg-[#262734] text-zinc-300 hover:bg-[#2d2e3b]'
                        )}
                      >
                        {formatModeLabel(item)}
                      </button>
                    ))}

                    <AssistantModelPicker
                      compact
                      models={pickerModels}
                      onSelect={setModelId}
                      selectedModelId={modelId}
                      triggerClassName="h-11 rounded-[16px] border-white/8 bg-[#262734] px-4 text-sm font-medium text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                    />

                    {visibleOptions
                      .filter((option) => option.type === 'select')
                      .map((option) => (
                        <Select
                          key={option.key}
                          onValueChange={(value) =>
                            setModelOptions((current) => ({
                              ...current,
                              [option.key]: value,
                            }))
                          }
                          value={String(
                            modelOptions[option.key] ??
                              option.defaultValue ??
                              ''
                          )}
                        >
                          <SelectTrigger className="h-11 min-w-[110px] rounded-[16px] border-white/8 bg-[#262734] px-4 text-sm font-medium text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                            <SelectValue placeholder={option.label} />
                          </SelectTrigger>
                          <SelectContent>
                            {option.options?.map((choice) => (
                              <SelectItem key={choice.value} value={choice.value}>
                                {choice.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ))}

                    {visibleOptions
                      .filter((option) => option.type === 'boolean')
                      .map((option) => (
                        <div
                          key={option.key}
                          className="inline-flex h-11 items-center gap-2 rounded-[16px] border border-white/8 bg-[#262734] px-4 text-sm font-medium text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                        >
                          <span>{option.label}</span>
                          <Switch
                            checked={Boolean(modelOptions[option.key])}
                            onCheckedChange={(checked) =>
                              setModelOptions((current) => ({
                                ...current,
                                [option.key]: checked,
                              }))
                            }
                          />
                        </div>
                      ))}
                  </div>

                  <div className="ml-auto flex items-center gap-3 text-sm text-zinc-500">
                    <button
                      type="button"
                      onClick={handleOpenInChat}
                      className="inline-flex h-11 items-center gap-2 rounded-[16px] border border-white/8 bg-[#262734] px-4 text-sm font-medium text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:bg-[#2d2e3b] hover:text-white"
                    >
                      <MessageSquare className="size-4" />
                      Open in Chat
                    </button>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="size-4" />
                      {costCredits} Credits
                    </span>
                    <button
                      type="button"
                      disabled={!canSubmit || loading}
                      onClick={handleSubmit}
                      className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-full transition',
                        canSubmit && !loading
                          ? 'bg-white text-zinc-950 shadow-lg shadow-black/20 hover:bg-zinc-100'
                          : 'bg-white/5 text-zinc-500 hover:bg-white/8'
                      )}
                    >
                      <ArrowUp className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-zinc-500">
                  {isCheckSign
                    ? 'Checking account...'
                    : user
                      ? `Remaining credits: ${remainingCredits}`
                      : 'Sign in to start generating'}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
