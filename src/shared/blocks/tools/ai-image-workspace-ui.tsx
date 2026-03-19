'use client';

import { useState, type FormEvent } from 'react';
import {
  ArrowUp,
  FolderOpen,
  ImageIcon,
  RefreshCcw,
  Search,
  Sparkles,
  Star,
  Wand2,
  WandSparkles,
  X,
} from 'lucide-react';

import { ToolModeRail } from '@/shared/blocks/tools/tool-mode-rail';
import { Response } from '@/shared/components/ai-elements/response';

const historyTabs = ['All', 'Image', 'Video'];
const styleGrid = [
  {
    title: 'Auto',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Anime',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Ultra Realism',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Soft Bloom',
    image:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Pastel Story',
    image:
      'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Portrait Pop',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
];

const providerModels = [
  {
    provider: 'Pollo AI',
    active: true,
    models: [
      {
        title: 'Pollo Image 2.0',
        description: 'Supports photorealistic, prompt-following visuals',
        meta: '20 sec · 2+ credits',
      },
      {
        title: 'Pollo Image 1.6',
        description: 'Advanced and versatile model for daily generation',
        meta: '45 sec · 4+ credits',
        selected: true,
      },
    ],
  },
  { provider: 'Google', active: false, models: [] },
  { provider: 'Seedream', active: false, models: [] },
  { provider: 'Midjourney', active: false, models: [] },
  { provider: 'Wan AI', active: false, models: [] },
  { provider: 'Flux AI', active: false, models: [] },
  { provider: 'OpenAI', active: false, models: [] },
  { provider: 'Kling AI', active: false, models: [] },
];

export function AiImageWorkspaceUi({
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
  const [activeHistory, setActiveHistory] = useState('All');
  const [activeStyle, setActiveStyle] = useState('Auto');
  const [modelPanelOpen, setModelPanelOpen] = useState(false);
  const [stylePanelOpen, setStylePanelOpen] = useState(false);
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

  return (
    <div className="relative grid w-full items-start gap-6 lg:grid-cols-[72px_minmax(0,1fr)]">
      <div className="self-start">
        <ToolModeRail
          items={[
            {
              key: 'text-to-image',
              title: 'Txt2Img',
              icon: ImageIcon,
              href: '/ai-image-generator',
              active: true,
            },
            {
              key: 'img-to-img',
              title: 'Img2Img',
              icon: Sparkles,
              href: '/ai-image-generator',
            },
            {
              key: 'effects',
              title: 'Effects',
              icon: WandSparkles,
              href: '/ai-image-generator',
            },
          ]}
        />
      </div>

      <div className="min-w-0">
        <div className="mx-auto mb-4 flex max-w-[1040px] flex-wrap items-center justify-between gap-2 pb-2">
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
            <section className="relative mx-auto w-full max-w-[1040px] overflow-hidden rounded-[30px] border border-white/8 bg-[#1b1c23] px-4 py-4 shadow-[0_20px_44px_rgba(0,0,0,0.2)] md:px-4.5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_24%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.06),transparent_20%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/0 via-white/14 to-white/0" />

              <div className="relative flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-emerald-400/10 px-2 text-[11px] font-semibold text-emerald-300">
                  P
                </span>
                <span className="font-medium text-zinc-200">Pollo.ai</span>
                <span className="rounded-lg border border-white/8 bg-white/5 px-2.5 py-1 text-zinc-400">
                  Text to Image
                </span>
                <span className="rounded-lg border border-white/8 bg-white/5 px-2.5 py-1 text-zinc-400">
                  Pollo Image 1.6
                </span>
                <span>03-16 22:08</span>
              </div>

              <div className="relative mt-3 text-[15px] leading-7 text-zinc-200">
                <Response className="text-[15px] leading-7 text-zinc-200">
                  {generatedPrompt}
                </Response>
              </div>

              <div className="relative mt-3 max-w-[164px] rounded-[22px] border border-white/10 bg-[#14151b] p-1 shadow-[0_22px_40px_rgba(0,0,0,0.22)]">
                <div className="overflow-hidden rounded-[18px]">
                  <img
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80"
                    alt="Generated image result"
                    className="aspect-square w-full object-cover"
                  />
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
            <section className="mx-auto flex min-h-[300px] max-w-[1040px] items-center justify-center rounded-[30px] border border-dashed border-white/8 bg-[#171820] px-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="max-w-[420px] text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-300">
                  <ImageIcon className="size-7" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                  Your generated image will appear here
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-500">
                  Start from the bottom composer, then submit your prompt to
                  render the first result.
                </p>
              </div>
            </section>
          )}

          <div className="mt-auto pt-5 pb-12">
            <section className="mx-auto flex w-full max-w-[980px] flex-wrap items-start gap-2 rounded-[22px] border border-white/8 bg-[#171821]/92 px-3 py-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.16)] backdrop-blur-sm">
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/5 text-zinc-300 transition hover:bg-white/8 hover:text-white">
                <RefreshCcw className="size-4" />
              </button>
              {['Album Cover', 'Neon Phone Clash', 'Into the Wild'].map(
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

            <form
              onSubmit={handleComposerSubmit}
              className="mx-auto mt-3 w-full max-w-[980px] rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(33,34,44,0.98),rgba(28,29,37,0.98))] px-4 py-3.5 shadow-[0_22px_48px_rgba(0,0,0,0.24)] transition focus-within:border-emerald-300/18 focus-within:shadow-[0_24px_60px_rgba(15,118,110,0.18)]"
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
                  placeholder="Describe what you want to create"
                  className="min-h-[68px] w-full resize-none border-none !bg-transparent px-0 py-1 text-[15px] leading-7 text-zinc-200 outline-none placeholder:text-zinc-500/80"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2.5">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-xl border border-emerald-400/12 bg-[#262734] px-3 py-2 text-sm text-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                    AI Image
                  </span>
                  <button
                    type="button"
                    className="rounded-xl border border-white/8 bg-[#262734] px-3 py-2 text-sm text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:bg-[#2d2e3b]"
                    onClick={() => setModelPanelOpen((value) => !value)}
                  >
                    Pollo Image 1.6
                  </button>
                  <span className="rounded-xl border border-white/8 bg-[#262734] px-3 py-2 text-sm text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                    1:1
                  </span>
                  <button
                    type="button"
                    className="rounded-xl border border-white/8 bg-[#262734] px-3 py-2 text-sm text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:bg-[#2d2e3b]"
                    onClick={() => setStylePanelOpen(true)}
                  >
                    {activeStyle}
                  </button>
                </div>
                <div className="ml-auto flex items-center gap-3 text-sm text-zinc-500">
                  <span>4 Credits</span>
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

      {modelPanelOpen ? (
        <div className="fixed inset-0 z-30 flex items-start justify-center bg-black/35 px-6 py-20 backdrop-blur-[3px]">
          <div className="w-full max-w-4xl rounded-[30px] border border-white/8 bg-[#1b1c25] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div className="mb-4 flex items-center justify-between rounded-[22px] bg-[#171821] px-5 py-4">
              <div>
                <div className="text-sm font-medium text-zinc-500">Model</div>
                <div className="mt-1 text-xl font-semibold tracking-tight text-white">
                  Select an image model
                </div>
              </div>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-zinc-400 transition hover:bg-white/8 hover:text-white"
                onClick={() => setModelPanelOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="grid grid-cols-[230px_minmax(0,1fr)] gap-4">
              <div className="space-y-2 rounded-[24px] bg-[#171821] p-3">
                <div className="px-2 py-1 text-sm font-medium text-zinc-500">
                  Providers
                </div>
                {providerModels.map((group) => (
                  <button
                    key={group.provider}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left text-sm transition ${group.active ? 'border-white/10 bg-[#242532] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)]' : 'border-transparent text-zinc-400 hover:border-white/6 hover:bg-white/5 hover:text-white'}`}
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-xs font-semibold">
                      {group.provider.charAt(0)}
                    </span>
                    <span>{group.provider}</span>
                  </button>
                ))}
              </div>
              <div className="rounded-[24px] bg-[#171821] p-4">
                <div className="mb-3 text-sm font-medium text-zinc-500">
                  Available models
                </div>
                <div className="space-y-3">
                  {providerModels[0].models.map((model) => (
                    <button
                      key={model.title}
                      className={`w-full rounded-[22px] border p-4 text-left transition ${model.selected ? 'border-white/12 bg-white/10 shadow-[0_14px_32px_rgba(0,0,0,0.16)]' : 'border-white/8 bg-white/5 hover:bg-white/8'}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-base font-medium text-white">
                          {model.title}
                        </div>
                        {model.selected ? (
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
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {stylePanelOpen ? (
        <div className="fixed inset-0 z-40 bg-black/45 px-6 py-6 backdrop-blur-[3px]">
          <div className="mx-auto flex h-full max-w-[1320px] flex-col rounded-[30px] border border-white/8 bg-[#1b1c25] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 px-7 py-5">
              <div>
                <div className="text-sm font-medium text-zinc-500">Styles</div>
                <h3 className="mt-1 text-[1.85rem] font-semibold tracking-tight text-white">
                  Select Styles
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-[320px] items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 text-zinc-500">
                  <span>Search style here</span>
                  <Search className="size-5" />
                </div>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-zinc-400 transition hover:bg-white/8 hover:text-white"
                  onClick={() => setStylePanelOpen(false)}
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 px-7 pt-5">
              {[
                'Popular',
                'Portrait',
                'Cinematic',
                'Illustration',
                'Anime',
              ].map((tag, index) => (
                <button
                  key={tag}
                  className={`rounded-full border px-4 py-2 text-sm transition ${index === 0 ? 'border-white/12 bg-white text-zinc-950' : 'border-white/8 bg-white/5 text-zinc-300 hover:bg-white/8 hover:text-white'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="grid flex-1 gap-4 overflow-y-auto p-6 md:grid-cols-4">
              {styleGrid.map((style) => (
                <button
                  key={style.title}
                  className={`overflow-hidden rounded-[22px] border transition ${activeStyle === style.title ? 'border-pink-500 shadow-[0_0_0_1px_rgba(236,72,153,0.5)]' : 'border-white/8 hover:border-white/12'}`}
                  onClick={() => {
                    setActiveStyle(style.title);
                    setStylePanelOpen(false);
                  }}
                >
                  <div className="relative aspect-[4/4.5] overflow-hidden">
                    <img
                      src={style.image}
                      alt={style.title}
                      className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/20 to-transparent px-4 py-5 text-left">
                      <div className="text-lg font-semibold text-white">
                        {style.title}
                      </div>
                      <div className="mt-1 text-sm text-zinc-300">
                        Style preset
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
