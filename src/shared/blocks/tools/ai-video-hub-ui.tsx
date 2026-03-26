'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

import { type ToolControlValue } from './tool-control-bar';
import { ToolPromptCard } from './tool-prompt-card';
import { useStartToolChat } from './use-start-tool-chat';

const featuredRows = [
  {
    title: 'Golden Hour Sneaker Trailers',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    accent: 'DROP TRAILER',
    subtitle: 'VEO3.1 Fast',
  },
  {
    title: 'High-Energy Food Reveal Sequences',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    accent: 'FOOD MOTION',
    subtitle: 'Sora 2',
  },
  {
    title: 'Cinematic Real Estate Flythrough Hooks',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    accent: 'PROPERTY REVEAL',
    subtitle: 'VEO3.1 Fast',
  },
  {
    title: 'Faceless Story Intros For YouTube',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    accent: 'CHANNEL OPENERS',
    subtitle: 'Narrative preset',
  },
];

const toolCards = [
  'https://images.unsplash.com/photo-1520034475321-cbe63696469a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
];

const promptIdeas = [
  'Vertical trailer for a sneaker drop at golden hour',
  'Drone reveal of a cliffside hotel with bold text moments',
  'Cinematic cooking close-ups with warm tungsten lighting',
];

export function AiVideoHubUi() {
  const [prompt, setPrompt] = useState('');
  const [controls, setControls] = useState<ToolControlValue>({
    mode: 'text-to-video',
    modelId: '',
    options: {},
  });
  const startToolChat = useStartToolChat('video');

  const startGeneration = () => {
    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt) return;

    startToolChat({
      prompt: normalizedPrompt,
      mode: controls.mode as 'text-to-video' | 'image-to-video',
      toolModel: controls.modelId,
      toolOptions: controls.options,
    });
  };

  return (
    <div className="space-y-5">
      <ToolPromptCard
        surface="video"
        prompt={prompt}
        onPromptChange={setPrompt}
        controls={controls}
        onControlsChange={setControls}
        onSubmit={startGeneration}
        allowedModes={['text-to-video', 'image-to-video']}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] text-[var(--studio-muted)] transition hover:bg-[var(--studio-hover-strong)] hover:text-[var(--studio-ink)]">
          <RefreshCw className="size-4" />
        </button>
        {promptIdeas.map((chip, index) => (
          <button
            key={chip}
            type="button"
            data-testid={`ai-video-hub-chip-${index}`}
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
                    <div className="mt-1 text-[20px] leading-none font-semibold tracking-tight text-[var(--video-accent)]">
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
            Video Tools
          </h2>
          <button className="inline-flex items-center gap-2 text-sm text-[var(--studio-muted)] hover:text-[var(--studio-ink)]">
            View more <span>›</span>
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {toolCards.map((image, index) => (
            <div
              key={image + index}
              className="overflow-hidden rounded-[22px] border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={image}
                  alt={`Video tool ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/10 to-transparent p-3">
                  <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                    Tool {index + 1}
                  </div>
                  <div className="studio-title mt-1 text-sm font-medium">
                    Motion preset
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
