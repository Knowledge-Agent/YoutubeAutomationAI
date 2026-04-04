'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { cn } from '@/shared/lib/utils';

import { type ToolControlValue } from './tool-control-bar';
import { ToolPromptCard } from './tool-prompt-card';
import { useStartToolChat } from './use-start-tool-chat';

interface FeaturedDemoCard {
  title: string;
  accent: string;
  subtitle: string;
  poster: string;
  video: string;
}

// Temporary local demo reels sourced from Pollo AI until
// the in-house model showcase clips are ready.
const featuredRows = [
  {
    title: 'Golden Hour Sneaker Trailers',
    accent: 'DROP TRAILER',
    subtitle: 'VEO3.1 Fast',
    poster: '/demos/video-hub/drop-trailer.jpg',
    video: '/demos/video-hub/drop-trailer.mp4',
  },
  {
    title: 'High-Energy Food Reveal Sequences',
    accent: 'FOOD MOTION',
    subtitle: 'VEO3.1 Fast',
    poster: '/demos/video-hub/food-motion.jpg',
    video: '/demos/video-hub/food-motion.mp4',
  },
  {
    title: 'Cinematic Real Estate Flythrough Hooks',
    accent: 'PROPERTY REVEAL',
    subtitle: 'VEO3.1 Fast',
    poster: '/demos/video-hub/property-reveal.jpg',
    video: '/demos/video-hub/property-reveal.mp4',
  },
  {
    title: 'Faceless Story Intros For YouTube',
    accent: 'CHANNEL OPENERS',
    subtitle: 'Narrative preset',
    poster: '/demos/video-hub/channel-openers.jpg',
    video: '/demos/video-hub/channel-openers.mp4',
  },
] satisfies FeaturedDemoCard[];

const promptIdeas = [
  'Vertical trailer for a sneaker drop at golden hour',
  'Drone reveal of a cliffside hotel with bold text moments',
  'Cinematic cooking close-ups with warm tungsten lighting',
];

function FeaturedVideoTile({ card }: { card: FeaturedDemoCard }) {
  const shouldReduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || !containerRef.current) {
      setIsVisible(!shouldReduceMotion);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.2);
      },
      {
        threshold: [0, 0.2, 0.45],
        rootMargin: '120px 0px',
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [shouldReduceMotion]);

  return (
    <div ref={containerRef} className="group min-w-0 overflow-hidden">
      <div className="overflow-hidden rounded-[22px] border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div className="relative aspect-[1.55/1] overflow-hidden bg-black">
          <img
            src={card.poster}
            alt={card.title}
            className="absolute inset-0 h-full w-full object-cover object-[center_24%] transition duration-700 group-hover:scale-[1.03]"
          />
          {isVisible && !shouldReduceMotion && !hasError ? (
            <video
              src={card.video}
              poster={card.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className={cn(
                'absolute inset-0 h-full w-full object-cover object-[center_24%] transition duration-500',
                isReady ? 'opacity-100' : 'opacity-0'
              )}
              onLoadedData={() => setIsReady(true)}
              onCanPlay={() => setIsReady(true)}
              onError={() => {
                setHasError(true);
                setIsReady(false);
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0)_24%,rgba(0,0,0,0.88)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[44%] bg-linear-to-t from-black/95 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,122,0.16),transparent_40%)] opacity-0 transition duration-500 group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="text-sm font-medium text-[var(--studio-ink)]">
              {card.subtitle}
            </div>
            <div className="mt-1 text-[20px] leading-none font-semibold tracking-tight text-[var(--video-accent)]">
              {card.accent}
            </div>
          </div>
        </div>
      </div>
      <p className="studio-title mt-3 text-[15px] leading-6 font-medium">
        {card.title}
      </p>
    </div>
  );
}

export function AiVideoHubUi() {
  const [prompt, setPrompt] = useState('');
  const [controls, setControls] = useState<ToolControlValue>({
    mode: 'text-to-video',
    modelId: '',
    options: {},
  });
  const featuredRailRef = useRef<HTMLDivElement | null>(null);
  const [hasFeaturedOverflow, setHasFeaturedOverflow] = useState(false);
  const { isStarting, startToolChat } = useStartToolChat('video');

  const startGeneration = () => {
    if (isStarting) {
      return;
    }

    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt) return;

    void startToolChat({
      prompt: normalizedPrompt,
      mode: controls.mode as 'text-to-video' | 'image-to-video',
      toolModel: controls.modelId,
      toolOptions: controls.options,
    });
  };

  const scrollFeaturedRail = (direction: 'prev' | 'next') => {
    const rail = featuredRailRef.current;

    if (!rail) {
      return;
    }

    const offset = Math.max(rail.clientWidth * 0.82, 320);
    rail.scrollBy({
      left: direction === 'next' ? offset : -offset,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const rail = featuredRailRef.current;

    if (!rail) {
      return;
    }

    const syncOverflowState = () => {
      setHasFeaturedOverflow(rail.scrollWidth > rail.clientWidth + 8);
    };

    syncOverflowState();
    window.addEventListener('resize', syncOverflowState);

    return () => {
      window.removeEventListener('resize', syncOverflowState);
    };
  }, []);

  return (
    <div className="space-y-5">
      <ToolPromptCard
        surface="video"
        prompt={prompt}
        onPromptChange={setPrompt}
        controls={controls}
        onControlsChange={setControls}
        onSubmit={startGeneration}
        submitting={isStarting}
        allowedModes={['text-to-video', 'image-to-video']}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-label="Reset prompt"
          onClick={() => setPrompt('')}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] text-[var(--studio-muted)] transition hover:bg-[var(--studio-hover-strong)] hover:text-[var(--studio-ink)]"
        >
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
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="studio-title text-2xl font-semibold tracking-tight">
              Featured Video Generations
            </h2>
            <p className="mt-1 text-sm text-[var(--studio-muted)]">
              Reference outputs to calibrate pacing, style, and visual language.
            </p>
          </div>
        </div>

        <div className="relative">
          <div
            ref={featuredRailRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1"
          >
            {featuredRows.map((card) => (
              <div
                key={card.title}
                className="w-[min(84vw,460px)] shrink-0 snap-start md:w-[calc((100%-1rem)/2)] xl:w-[calc((100%-3rem)/4)]"
              >
                <FeaturedVideoTile card={card} />
              </div>
            ))}
          </div>

          {hasFeaturedOverflow ? (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-linear-to-r from-[rgb(23_25_32_/_0.94)] via-[rgb(23_25_32_/_0.4)] to-transparent lg:block"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-linear-to-l from-[rgb(23_25_32_/_0.94)] via-[rgb(23_25_32_/_0.4)] to-transparent lg:block"
              />
              <button
                type="button"
                aria-label="Show previous video demos"
                className="absolute top-[29%] left-3 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white shadow-[0_10px_24px_rgba(0,0,0,0.24)] backdrop-blur-sm transition hover:bg-black/55 lg:flex"
                onClick={() => scrollFeaturedRail('prev')}
              >
                <ArrowLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Show next video demos"
                className="absolute top-[29%] right-3 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white shadow-[0_10px_24px_rgba(0,0,0,0.24)] backdrop-blur-sm transition hover:bg-black/55 lg:flex"
                onClick={() => scrollFeaturedRail('next')}
              >
                <ArrowRight className="size-5" />
              </button>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
