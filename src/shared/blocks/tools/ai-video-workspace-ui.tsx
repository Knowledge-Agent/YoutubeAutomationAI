'use client';

import { useState, type FormEvent } from 'react';
import {
  ArrowUp,
  ChevronDown,
  Clapperboard,
  Clock3,
  FolderOpen,
  ImagePlus,
  Monitor,
  PanelTopClose,
  Play,
  RefreshCcw,
  Sparkles,
  Star,
  Video,
  Wand2,
  WandSparkles,
  X,
} from 'lucide-react';

import { ToolModeRail } from '@/shared/blocks/tools/tool-mode-rail';
import { Response } from '@/shared/components/ai-elements/response';

const historyTabs = ['All', 'Video', 'Image'];
const generationModes = ['AI Video', 'AI Image'] as const;
const workflowModes = [
  'Text/Image to Video',
  'Text to Video',
  'Image to Video',
] as const;
const aspectRatios = ['16:9', '9:16', '1:1', '4:3', '3:4'] as const;
const durations = [
  '1s',
  '2s',
  '3s',
  '4s',
  '5s',
  '6s',
  '7s',
  '8s',
  '9s',
  '10s',
  '11s',
  '12s',
  '13s',
  '14s',
  '15s',
  '16s',
] as const;
const resolutions = ['360p', '540p', '720p', '1080p', '2K'] as const;

const motionPresets = [
  {
    title: 'Smooth cinematic',
    description: 'Balanced camera motion for scenes and talking shots',
  },
  {
    title: 'Action motion',
    description: 'Fast movement with stronger energy and punch',
  },
  {
    title: 'Product orbit',
    description: 'Slow turntable orbit for product and showcase clips',
  },
];

const providerModels = [
  {
    provider: 'Pollo AI',
    badge: 'New',
    tag: 'Audio',
    models: [
      {
        title: 'Pollo 2.0',
        description:
          'Balanced quality and prompt following for daily video generation',
        meta: '70 sec · 10+ credits',
        selected: true,
      },
      {
        title: 'Pollo Turbo',
        description: 'Faster previews and quick social clips',
        meta: '35 sec · 6+ credits',
      },
    ],
  },
  {
    provider: 'Google',
    tag: 'Audio',
    models: [
      {
        title: 'Veo 3 Fast',
        description: 'Google motion model for reliable prompt following',
        meta: '90 sec · 8+ credits',
      },
    ],
  },
  {
    provider: 'Sora',
    tag: 'Audio',
    models: [
      {
        title: 'Sora Cinematic',
        description: 'High-detail story scenes with stronger atmosphere',
        meta: '240 sec · 16+ credits',
      },
    ],
  },
  {
    provider: 'Wan AI',
    tag: 'Audio',
    models: [
      {
        title: 'Wan Narrative',
        description: 'Prompt-tuned shots for story and dialogue scenes',
        meta: '140 sec · 9+ credits',
      },
    ],
  },
  {
    provider: 'Kling AI',
    badge: 'New',
    models: [
      {
        title: 'Kling 3.0',
        description: 'High-fidelity motion and camera path control',
        meta: '180 sec · 14+ credits',
      },
    ],
  },
  {
    provider: 'Seedance',
    tag: 'Audio',
    models: [
      {
        title: 'Seedance Motion',
        description: 'Balanced social-video output with strong style prompts',
        meta: '120 sec · 8+ credits',
      },
    ],
  },
  {
    provider: 'Hailuo AI',
    models: [
      {
        title: 'Hailuo Scene',
        description: 'Fast concept output for rough motion passes',
        meta: '75 sec · 5+ credits',
      },
    ],
  },
  {
    provider: 'Vidu AI',
    badge: 'New',
    models: [
      {
        title: 'Vidu Q3 Pro',
        description: 'Best overall quality for polished cinematic output',
        meta: '240 sec · 15+ credits',
      },
      {
        title: 'Vidu Q2 Turbo',
        description: 'Fast, stable, motion-heavy video',
        meta: '120 sec · 1+ credits',
      },
      {
        title: 'Vidu Q2 Pro',
        description: 'Cinematic quality with highest detail',
        meta: '180 sec · 4+ credits',
      },
      {
        title: 'Vidu Q1',
        description: 'Precise control over video motion',
        meta: '360 sec · 30+ credits',
      },
      {
        title: 'Vidu 2.0',
        description: 'Enhanced quality and speed',
        meta: '60 sec · 10+ credits',
      },
    ],
  },
];

export function AiVideoWorkspaceUi({
  initialPrompt = '',
}: {
  initialPrompt?: string;
}) {
  const normalizedInitialPrompt = initialPrompt.trim();
  const [, setDraftPrompt] = useState(normalizedInitialPrompt);
  const [generatedPrompt, setGeneratedPrompt] = useState(
    normalizedInitialPrompt
  );
  const [composerInput, setComposerInput] = useState(normalizedInitialPrompt);
  const [activeGenerationMode, setActiveGenerationMode] =
    useState<(typeof generationModes)[number]>('AI Video');
  const [activeWorkflowMode, setActiveWorkflowMode] = useState<
    (typeof workflowModes)[number]
  >('Text/Image to Video');
  const [activeProvider, setActiveProvider] = useState('Vidu AI');
  const [selectedModel, setSelectedModel] = useState('Vidu Q3 Pro');
  const [selectedAspectRatio, setSelectedAspectRatio] =
    useState<(typeof aspectRatios)[number]>('16:9');
  const [selectedDuration, setSelectedDuration] =
    useState<(typeof durations)[number]>('5s');
  const [selectedResolution, setSelectedResolution] =
    useState<(typeof resolutions)[number]>('540p');
  const [activeHistory, setActiveHistory] = useState('All');
  const [activePreset, setActivePreset] = useState('Smooth cinematic');
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [workflowMenuOpen, setWorkflowMenuOpen] = useState(false);
  const [modelPanelOpen, setModelPanelOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [presetPanelOpen, setPresetPanelOpen] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(
    Boolean(normalizedInitialPrompt)
  );

  const runGeneration = (nextPrompt: string) => {
    const normalizedPrompt = nextPrompt.trim();
    if (!normalizedPrompt) {
      return;
    }

    setDraftPrompt(normalizedPrompt);
    setGeneratedPrompt(normalizedPrompt);
    setComposerInput(normalizedPrompt);
    setHasGenerated(true);
  };

  const handleComposerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runGeneration(composerInput);
  };

  const canSubmit = composerInput.trim().length > 0;
  const activeModels =
    providerModels.find((group) => group.provider === activeProvider)?.models ??
    [];

  return (
    <div className="relative grid w-full items-start gap-6 lg:grid-cols-[72px_minmax(0,1fr)]">
      <div className="self-start">
        <ToolModeRail
          items={[
            {
              key: 'text-to-video',
              title: 'Txt2Vid',
              icon: Video,
              href: '/ai-video-generator',
              active: true,
            },
            {
              key: 'image-to-video',
              title: 'Img2Vid',
              icon: ImagePlus,
              href: '/ai-video-generator',
            },
            {
              key: 'effects',
              title: 'Effects',
              icon: WandSparkles,
              href: '/ai-video-generator',
            },
          ]}
        />
      </div>

      <div className="min-w-0">
        <div className="mx-auto mb-4 flex max-w-[1120px] flex-wrap items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-6">
            {historyTabs.map((tab) => (
              <button
                key={tab}
                className={`relative pb-1 text-sm font-medium transition ${
                  tab === activeHistory
                    ? 'text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                onClick={() => setActiveHistory(tab)}
              >
                {tab}
                {tab === activeHistory ? (
                  <span className="absolute inset-x-0 -bottom-3 h-px bg-white/80" />
                ) : null}
              </button>
            ))}
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
          {hasGenerated ? (
            <section className="relative mx-auto w-full max-w-[1120px] overflow-hidden rounded-[30px] border border-white/8 bg-[#1b1c23] px-4 py-4 shadow-[0_20px_44px_rgba(0,0,0,0.2)] md:px-4.5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.08),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent_20%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/0 via-white/14 to-white/0" />

              <div className="relative flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-fuchsia-400/10 px-2 text-[11px] font-semibold text-fuchsia-300">
                  P
                </span>
                <span className="font-medium text-zinc-200">Pollo.ai</span>
                <span className="rounded-lg border border-white/8 bg-white/5 px-2.5 py-1 text-zinc-400">
                  Text to Video
                </span>
                <span className="rounded-lg border border-white/8 bg-white/5 px-2.5 py-1 text-zinc-400">
                  {selectedModel}
                </span>
                <span>03-17 12:12</span>
              </div>

              <div className="relative mt-3 text-[15px] leading-7 text-zinc-200">
                <Response className="text-[15px] leading-7 text-zinc-200">
                  {generatedPrompt}
                </Response>
              </div>

              <div className="relative mt-3 max-w-[184px] rounded-[22px] border border-white/10 bg-[#14151b] p-1 shadow-[0_22px_40px_rgba(0,0,0,0.22)]">
                <div className="group relative overflow-hidden rounded-[18px]">
                  <div className="relative aspect-[4/4.45] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80"
                      alt="Generated video result"
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
              </div>

              <div className="relative mt-3 flex flex-wrap items-center gap-2">
                <button className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/8 bg-white/5 px-3 text-[11px] font-medium text-zinc-200 transition hover:bg-white/8 hover:text-white">
                  <Wand2 className="size-4" />
                  Reprompt
                </button>
                <button className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/8 bg-white/5 px-3 text-[11px] font-medium text-zinc-200 transition hover:bg-white/8 hover:text-white">
                  <RefreshCcw className="size-4" />
                  Regenerate
                </button>
              </div>
            </section>
          ) : (
            <section className="mx-auto flex min-h-[300px] max-w-[1120px] items-center justify-center rounded-[30px] border border-dashed border-white/8 bg-[#171820] px-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="max-w-[420px] text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/12 text-pink-400">
                  <Video className="size-7" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                  Your generated video will appear here
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-500">
                  Start from the bottom composer, then submit your prompt to
                  render the first preview.
                </p>
              </div>
            </section>
          )}

          <div className="mx-auto mt-auto w-full max-w-[1020px] pt-5 pb-12">
            <section className="flex flex-wrap items-start gap-2 rounded-[22px] border border-white/8 bg-[#171821]/92 px-3 py-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.16)] backdrop-blur-sm">
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/5 text-zinc-300 transition hover:bg-white/8 hover:text-white">
                <RefreshCcw className="size-4" />
              </button>
              {['Drone Reveal', 'Fashion Editorial', 'Product Orbit'].map(
                (idea) => (
                  <button
                    key={idea}
                    className="rounded-full border border-white/8 bg-[#22232e] px-4 py-2 text-sm text-zinc-300 transition hover:bg-[#2a2b36] hover:text-white"
                    onClick={() => setComposerInput(idea)}
                  >
                    {idea}
                  </button>
                )
              )}
            </section>

            <div className="relative mt-3">
              {modelPanelOpen ? (
                <div className="absolute right-0 bottom-full z-30 mb-4 flex max-h-[560px] w-full flex-col overflow-hidden rounded-[28px] border border-white/8 bg-[#1b1c25] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-zinc-500">
                        Models
                      </div>
                      <div className="mt-1 text-xl font-semibold tracking-tight text-white">
                        Select a video model
                      </div>
                    </div>
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-zinc-400 transition hover:bg-white/8 hover:text-white"
                      onClick={() => setModelPanelOpen(false)}
                    >
                      <X className="size-4.5" />
                    </button>
                  </div>
                  <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[250px_minmax(0,1fr)]">
                    <div className="space-y-2 overflow-y-auto rounded-[24px] bg-[#171821] p-3">
                      {providerModels.map((group) => (
                        <button
                          key={group.provider}
                          className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left text-sm transition ${
                            group.provider === activeProvider
                              ? 'border-white/10 bg-[#242532] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)]'
                              : 'border-transparent text-zinc-400 hover:border-white/6 hover:bg-white/5 hover:text-white'
                          }`}
                          onClick={() => setActiveProvider(group.provider)}
                        >
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-xs font-semibold">
                            {group.provider.charAt(0)}
                          </span>
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="truncate">{group.provider}</span>
                            {'badge' in group && group.badge ? (
                              <span className="rounded-[10px] bg-lime-500 px-2 py-0.5 text-[10px] font-semibold text-[#112200]">
                                {group.badge}
                              </span>
                            ) : null}
                            {'tag' in group && group.tag ? (
                              <span className="rounded-[10px] bg-black/25 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
                                {group.tag}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="overflow-y-auto rounded-[24px] bg-[#171821] p-4">
                      <div className="space-y-3">
                        {activeModels.length > 0 ? (
                          activeModels.map((model) => (
                            <button
                              key={model.title}
                              className={`w-full rounded-[22px] border p-4 text-left transition ${
                                selectedModel === model.title
                                  ? 'border-white/12 bg-white/10 shadow-[0_14px_32px_rgba(0,0,0,0.16)]'
                                  : 'border-white/8 bg-white/5 hover:bg-white/8'
                              }`}
                              onClick={() => {
                                setSelectedModel(model.title);
                                setModelPanelOpen(false);
                              }}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-base font-medium text-white">
                                  {model.title}
                                </div>
                                {selectedModel === model.title ? (
                                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-950">
                                    Selected
                                  </span>
                                ) : null}
                              </div>
                              <div className="mt-1 text-sm leading-6 text-zinc-500">
                                {model.description}
                              </div>
                              <div className="mt-3 text-xs tracking-[0.12em] text-zinc-500 uppercase">
                                {model.meta}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="rounded-[22px] border border-white/8 bg-white/5 p-4 text-sm text-zinc-500">
                            No models available for this provider yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {modeMenuOpen ? (
                <div className="absolute bottom-full left-0 z-20 mb-4 w-[252px] rounded-[24px] border border-white/8 bg-[#1b1c25] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                  <div className="space-y-2">
                    {generationModes.map((mode) => (
                      <button
                        key={mode}
                        className={`flex w-full items-center gap-3 rounded-[18px] px-4 py-4 text-left text-[18px] font-medium transition ${
                          activeGenerationMode === mode
                            ? 'bg-[#2a2b36] text-white'
                            : 'text-zinc-300 hover:bg-[#242532] hover:text-white'
                        }`}
                        onClick={() => {
                          setActiveGenerationMode(mode);
                          setModeMenuOpen(false);
                        }}
                      >
                        {mode === 'AI Video' ? (
                          <Clapperboard className="size-6" />
                        ) : (
                          <ImagePlus className="size-6" />
                        )}
                        <span>{mode}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {workflowMenuOpen ? (
                <div className="absolute bottom-full left-[162px] z-20 mb-4 w-[280px] rounded-[24px] border border-white/8 bg-[#1b1c25] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                  <div className="space-y-2">
                    {workflowModes.map((mode) => (
                      <button
                        key={mode}
                        className={`flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-sm font-medium transition ${
                          activeWorkflowMode === mode
                            ? 'bg-[#2a2b36] text-white'
                            : 'text-zinc-300 hover:bg-[#242532] hover:text-white'
                        }`}
                        onClick={() => {
                          setActiveWorkflowMode(mode);
                          setWorkflowMenuOpen(false);
                        }}
                      >
                        <Sparkles className="size-4" />
                        <span>{mode}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {settingsPanelOpen ? (
                <div className="absolute bottom-full left-[468px] z-20 mb-4 w-full max-w-[620px] rounded-[28px] border border-white/8 bg-[#1b1c25] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                  <div className="mb-3 text-[15px] font-medium text-zinc-500">
                    Aspect Ratio
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 rounded-[20px] bg-[#242532] p-2.5">
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio}
                        className={`flex flex-col items-center gap-1.5 rounded-[16px] px-3 py-3 text-sm transition ${
                          selectedAspectRatio === ratio
                            ? 'bg-[#3a3b46] text-white'
                            : 'text-zinc-300 hover:bg-[#31323d] hover:text-white'
                        }`}
                        onClick={() => setSelectedAspectRatio(ratio)}
                      >
                        <Monitor className="size-4.5" />
                        <span>{ratio}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 mb-3 text-[15px] font-medium text-zinc-500">
                    Video Length
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 rounded-[20px] bg-[#242532] p-2.5">
                    {durations.map((duration) => (
                      <button
                        key={duration}
                        className={`rounded-[16px] px-3 py-3 text-center text-sm transition ${
                          selectedDuration === duration
                            ? 'bg-[#3a3b46] text-white'
                            : 'text-zinc-300 hover:bg-[#31323d] hover:text-white'
                        }`}
                        onClick={() => setSelectedDuration(duration)}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 mb-3 text-[15px] font-medium text-zinc-500">
                    Resolution
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 rounded-[20px] bg-[#242532] p-2.5">
                    {resolutions.map((resolution) => (
                      <button
                        key={resolution}
                        className={`rounded-[16px] px-3 py-3 text-center text-sm transition ${
                          selectedResolution === resolution
                            ? 'bg-[#3a3b46] text-white'
                            : 'text-zinc-300 hover:bg-[#31323d] hover:text-white'
                        }`}
                        onClick={() => setSelectedResolution(resolution)}
                      >
                        {resolution}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {presetPanelOpen ? (
                <div className="absolute right-0 bottom-full z-20 mb-4 w-full max-w-[360px] rounded-[24px] border border-white/8 bg-[#1b1c25] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-medium text-zinc-500">
                      Motion preset
                    </div>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-zinc-400 transition hover:bg-white/8 hover:text-white"
                      onClick={() => setPresetPanelOpen(false)}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {motionPresets.map((preset) => (
                      <button
                        key={preset.title}
                        className={`w-full rounded-[18px] border p-3 text-left transition ${
                          activePreset === preset.title
                            ? 'border-white/12 bg-white/10 shadow-[0_14px_32px_rgba(0,0,0,0.16)]'
                            : 'border-white/8 bg-white/5 hover:bg-white/8'
                        }`}
                        onClick={() => {
                          setActivePreset(preset.title);
                          setPresetPanelOpen(false);
                        }}
                      >
                        <div className="text-sm font-medium text-white">
                          {preset.title}
                        </div>
                        <div className="mt-1 text-xs leading-5 text-zinc-500">
                          {preset.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <form
                onSubmit={handleComposerSubmit}
                className="w-full rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(33,34,44,0.98),rgba(28,29,37,0.98))] px-4 py-3.5 shadow-[0_22px_48px_rgba(0,0,0,0.24)] transition focus-within:border-fuchsia-300/18 focus-within:shadow-[0_24px_60px_rgba(168,85,247,0.18)]"
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-dashed border-white/12 bg-[#171821] text-zinc-500 transition hover:bg-[#1c1d26] hover:text-zinc-300"
                  >
                    <span className="text-3xl font-light">+</span>
                  </button>
                  <textarea
                    value={composerInput}
                    onChange={(e) => setComposerInput(e.target.value)}
                    placeholder="Enter your idea to generate"
                    className="min-h-[68px] w-full resize-none border-none !bg-transparent px-0 py-1 text-[15px] leading-7 text-zinc-200 outline-none placeholder:text-zinc-500/80"
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2.5">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="inline-flex h-11 items-center gap-2 rounded-[16px] border border-fuchsia-400/12 bg-[#262734] px-4 text-sm font-medium text-fuchsia-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:bg-[#2d2e3b]"
                      onClick={() => {
                        setWorkflowMenuOpen(false);
                        setSettingsPanelOpen(false);
                        setPresetPanelOpen(false);
                        setModelPanelOpen(false);
                        setModeMenuOpen((value) => !value);
                      }}
                    >
                      <Clapperboard className="size-4.5" />
                      {activeGenerationMode}
                      <ChevronDown className="size-4 text-fuchsia-300/80" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center gap-2 rounded-[16px] border border-white/8 bg-[#262734] px-4 text-sm font-medium text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:bg-[#2d2e3b]"
                      onClick={() => {
                        setModeMenuOpen(false);
                        setSettingsPanelOpen(false);
                        setPresetPanelOpen(false);
                        setModelPanelOpen(false);
                        setWorkflowMenuOpen((value) => !value);
                      }}
                    >
                      <PanelTopClose className="size-4.5 text-zinc-300" />
                      {activeWorkflowMode}
                      <ChevronDown className="size-4 text-zinc-400" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center gap-2 rounded-[16px] border border-white/8 bg-[#262734] px-4 text-sm font-medium text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:bg-[#2d2e3b]"
                      onClick={() => {
                        setModeMenuOpen(false);
                        setWorkflowMenuOpen(false);
                        setSettingsPanelOpen(false);
                        setPresetPanelOpen(false);
                        setModelPanelOpen((value) => !value);
                      }}
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#11131a] text-[13px] font-semibold text-[#38bdf8]">
                        V
                      </span>
                      {selectedModel}
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center gap-4 rounded-[16px] border border-white/8 bg-[#262734] px-4 text-sm font-medium text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:bg-[#2d2e3b]"
                      onClick={() => {
                        setModeMenuOpen(false);
                        setWorkflowMenuOpen(false);
                        setModelPanelOpen(false);
                        setPresetPanelOpen(false);
                        setSettingsPanelOpen((value) => !value);
                      }}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Monitor className="size-4 text-zinc-300" />
                        {selectedAspectRatio}
                      </span>
                      <span className="h-5 w-px bg-white/10" />
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="size-4 text-zinc-300" />
                        {selectedDuration}
                      </span>
                      <span className="h-5 w-px bg-white/10" />
                      <span>{selectedResolution}</span>
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-white/8 bg-[#262734] text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:bg-[#2d2e3b]"
                      onClick={() => {
                        setModeMenuOpen(false);
                        setWorkflowMenuOpen(false);
                        setModelPanelOpen(false);
                        setSettingsPanelOpen(false);
                        setPresetPanelOpen((value) => !value);
                      }}
                    >
                      <span className="text-xl leading-none text-zinc-300">
                        ...
                      </span>
                    </button>
                  </div>
                  <div className="ml-auto flex items-center gap-3 text-sm text-zinc-500">
                    <span>10 Credits</span>
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                        canSubmit
                          ? 'bg-white text-zinc-950 shadow-lg shadow-black/20 hover:bg-zinc-100'
                          : 'bg-white/5 text-zinc-500 hover:bg-white/8'
                      }`}
                    >
                      <ArrowUp className="size-4" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
