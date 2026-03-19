'use client';

import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ImageIcon,
  MoreHorizontal,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

import { useRouter } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';

const featuredRows = [
  {
    title: 'Dreamy Fashion Editorial Sets',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
    accent: 'SOFT EDITORIAL',
    subtitle: 'Pollo Image 1.6',
  },
  {
    title: 'Stylized Character Posters in Minutes',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    accent: 'ANIME LOOKS',
    subtitle: 'Popular preset',
  },
  {
    title: 'Photoreal Product Shots With Better Lighting',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    accent: 'PRODUCT HERO',
    subtitle: 'Commercial quality',
  },
  {
    title: 'Consistent Scene Design for Storyboards',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    accent: 'STORY PANELS',
    subtitle: 'Story visuals',
  },
];

const toolCards = [
  'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
];

const promptIdeas = [
  'Streetwear portrait with sharp rim light and reflective chrome',
  'Minimal product hero shot with soft shadow on stone surface',
  'Animated poster scene for a sci-fi city at dusk',
];

export function AiImageHubUi() {
  const [prompt, setPrompt] = useState('');
  const router = useRouter();

  const hasPrompt = prompt.trim().length > 0;

  const startGeneration = () => {
    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt) return;
    router.push(
      `/ai-image-generator?view=detail&mode=text-to-image&prompt=${encodeURIComponent(normalizedPrompt)}`
    );
  };

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-[38px] border border-white/8 bg-[#1b1b24] px-6 pt-6 pb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:px-7 md:pt-7 md:pb-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_18%,rgba(16,185,129,0.18),transparent_26%),radial-gradient(circle_at_24%_82%,rgba(14,165,233,0.08),transparent_32%)]" />

        <div className="relative flex min-h-[278px] flex-col justify-between gap-8">
          <div className="flex items-start gap-5">
            <button
              type="button"
              className="-rotate-[4deg] mt-2 flex h-[96px] w-[82px] shrink-0 items-center justify-center rounded-[18px] border border-dashed border-white/12 bg-white/[0.04] text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              <ImageIcon className="size-7" />
            </button>

            <div className="min-w-0 flex-1">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your idea to generate"
                style={{ backgroundColor: 'transparent' }}
                className="min-h-[168px] w-full resize-none border-none !bg-transparent p-0 pt-4 text-[20px] leading-9 font-medium tracking-tight text-zinc-200 outline-none placeholder:text-zinc-500/85 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-2.5">
            <button
              type="button"
              className="inline-flex h-14 items-center gap-2 rounded-[16px] border border-white/5 bg-[#262633] px-4 text-[14px] font-medium text-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:border-white/8 hover:bg-[#2c2d39]"
            >
              <ImageIcon className="size-4" />
              AI Image
              <ChevronDown className="size-4 text-emerald-300/80" />
            </button>

            <button
              type="button"
              className="inline-flex h-14 items-center gap-2 rounded-[16px] border border-white/5 bg-[#262633] px-4 text-[14px] font-medium text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:border-white/8 hover:bg-[#2c2d39]"
            >
              <Sparkles className="size-4 text-zinc-300" />
              Text to Image
              <ChevronDown className="size-4 text-zinc-400" />
            </button>

            <button
              type="button"
              className="inline-flex h-14 items-center gap-2 rounded-[16px] border border-white/5 bg-[#262633] px-4 text-[14px] font-medium text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:border-white/8 hover:bg-[#2c2d39]"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#11131a] text-[12px] font-semibold text-[#9ee37d]">
                P
              </span>
              Pollo Image 1.6
            </button>

            <button
              type="button"
              className="inline-flex h-14 items-center gap-2 rounded-[16px] border border-white/5 bg-[#262633] px-4 text-[14px] font-medium text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:border-white/8 hover:bg-[#2c2d39]"
            >
              1:1
              <ChevronDown className="size-4 text-zinc-400" />
            </button>

            <button
              type="button"
              className="inline-flex h-14 w-14 items-center justify-center rounded-[16px] border border-white/5 bg-[#262633] text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:border-white/8 hover:bg-[#2c2d39] hover:text-white"
            >
              <MoreHorizontal className="size-4.5" />
            </button>

            <div className="ml-auto flex items-center gap-5 pl-4 text-[15px] text-zinc-500">
              <span>4 Credits</span>
              <button
                type="button"
                onClick={startGeneration}
                className={cn(
                  'flex h-16 w-16 items-center justify-center rounded-full border transition',
                  hasPrompt
                    ? 'border-white bg-white text-zinc-950 shadow-lg shadow-black/20 hover:bg-zinc-100'
                    : 'border-white/8 bg-white/5 text-zinc-500 hover:bg-white/8 hover:text-zinc-300'
                )}
              >
                <ArrowUp className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/6 bg-[#252632] text-zinc-300 transition hover:bg-[#2b2c37]">
          <RefreshCw className="size-4" />
        </button>
        {promptIdeas.map((chip) => (
          <button
            key={chip}
            type="button"
            className="rounded-full border border-white/6 bg-[#252632] px-4.5 py-2.5 text-sm text-zinc-300 transition hover:bg-[#2b2c37]"
            onClick={() => setPrompt(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      <section className="rounded-[30px] border border-white/8 bg-[#171821]/74 px-4 pt-4 pb-5 shadow-[0_18px_48px_rgba(0,0,0,0.22)] md:px-5 md:pt-5 md:pb-6">
        <div className="grid gap-4 md:grid-cols-4">
          {featuredRows.map((card, index) => (
            <div key={card.title} className="min-w-0 overflow-hidden">
              <div className="overflow-hidden rounded-[22px] border border-white/8 bg-[#20212a] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <div className="relative aspect-[1.55/1] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/25 to-transparent p-4">
                    <div className="text-sm font-medium text-zinc-200">
                      {card.subtitle}
                    </div>
                    <div className="mt-1 text-[20px] font-semibold leading-none tracking-tight text-emerald-300">
                      {card.accent}
                    </div>
                  </div>
                  {index === 0 ? (
                    <button className="absolute top-1/2 left-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm">
                      <ArrowLeft className="size-5" />
                    </button>
                  ) : null}
                  {index === featuredRows.length - 1 ? (
                    <button className="absolute top-1/2 right-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm">
                      <ArrowRight className="size-5" />
                    </button>
                  ) : null}
                </div>
              </div>
              <p className="mt-3 text-[15px] font-medium leading-6 text-white">
                {card.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-white/8 bg-[#171821]/74 px-4 pt-4 pb-5 shadow-[0_18px_48px_rgba(0,0,0,0.22)] md:px-5 md:pt-5 md:pb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Image Tools
          </h2>
          <button className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
            View more <span>›</span>
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {toolCards.map((image, index) => (
            <div
              key={image + index}
              className="overflow-hidden rounded-[22px] border border-white/8 bg-[#20212a] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={image}
                  alt={`Image tool ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
