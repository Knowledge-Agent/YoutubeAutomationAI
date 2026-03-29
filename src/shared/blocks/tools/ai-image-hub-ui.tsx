'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

import { type ToolControlValue } from './tool-control-bar';
import { ToolPromptCard } from './tool-prompt-card';
import { useStartToolChat } from './use-start-tool-chat';

const featuredRows = [
  {
    title: 'Creator Headshots for Thumbnail Packs',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
    accent: 'THUMBNAIL FACES',
    subtitle: 'Channel branding',
  },
  {
    title: 'Stylized Channel Mascots in One Pass',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    accent: 'CHARACTER POSTERS',
    subtitle: 'Popular preset',
  },
  {
    title: 'Cinematic Environment Plates for B-Roll',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    accent: 'SCENE BACKDROPS',
    subtitle: 'Landscape prompt',
  },
  {
    title: 'Storyboard Reference Sheets for Scene Planning',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    accent: 'SHOT BOARDS',
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
  const [controls, setControls] = useState<ToolControlValue>({
    mode: 'text-to-image',
    modelId: '',
    options: {},
  });
  const startToolChat = useStartToolChat('image');

  const startGeneration = () => {
    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt) return;
    startToolChat({
      prompt: normalizedPrompt,
      mode: controls.mode as 'text-to-image' | 'image-to-image',
      toolModel: controls.modelId,
      toolOptions: controls.options,
    });
  };

  return (
    <div className="space-y-5">
      <ToolPromptCard
        surface="image"
        prompt={prompt}
        onPromptChange={setPrompt}
        controls={controls}
        onControlsChange={setControls}
        onSubmit={startGeneration}
        allowedModes={['text-to-image', 'image-to-image']}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] text-[var(--studio-muted)] transition hover:bg-[var(--studio-hover-strong)] hover:text-[var(--studio-ink)]">
          <RefreshCw className="size-4" />
        </button>
        {promptIdeas.map((chip) => (
          <button
            key={chip}
            type="button"
            className="rounded-full border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] px-4.5 py-2.5 text-sm text-[var(--studio-muted)] transition hover:bg-[var(--studio-hover-strong)] hover:text-[var(--studio-ink)]"
            onClick={() => setPrompt(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      <section className="rounded-[30px] border border-[color:var(--studio-line)] bg-[rgb(23_25_32_/_0.74)] px-4 pt-4 pb-5 shadow-[0_18px_48px_rgba(0,0,0,0.22)] md:px-5 md:pt-5 md:pb-6">
        <div className="grid gap-4 md:grid-cols-4">
          {featuredRows.map((card, index) => (
            <div key={card.title} className="min-w-0 overflow-hidden">
              <div className="overflow-hidden rounded-[22px] border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <div className="relative aspect-[1.55/1] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/25 to-transparent p-4">
                    <div className="text-sm font-medium text-[var(--studio-ink)]">
                      {card.subtitle}
                    </div>
                    <div className="mt-1 text-[20px] leading-none font-semibold tracking-tight text-[var(--image-accent)]">
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
              <p className="studio-title mt-3 text-[15px] leading-6 font-medium">
                {card.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-[color:var(--studio-line)] bg-[rgb(23_25_32_/_0.74)] px-4 pt-4 pb-5 shadow-[0_18px_48px_rgba(0,0,0,0.22)] md:px-5 md:pt-5 md:pb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="studio-title text-2xl font-semibold tracking-tight">
            Image Tools
          </h2>
          <button className="inline-flex items-center gap-2 text-sm text-[var(--studio-muted)] hover:text-[var(--studio-ink)]">
            View more <span>›</span>
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {toolCards.map((image, index) => (
            <div
              key={image + index}
              className="group overflow-hidden rounded-[22px] border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <img
                  src={image}
                  alt={`Image tool ${index + 1}`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-[rgba(7,8,12,0.66)] opacity-0 backdrop-blur-md transition duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-medium tracking-[0.12em] text-white/92 uppercase shadow-[0_12px_32px_rgba(0,0,0,0.32)]">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
