'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Captions,
  Clapperboard,
  FileText,
  MonitorPlay,
  PanelsTopLeft,
  RefreshCw,
  Scissors,
  type LucideIcon,
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

interface VideoToolCard {
  title: string;
  eyebrow: string;
  summary: string;
  image: string;
  icon: LucideIcon;
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

const toolCards = [
  {
    title: 'Viral Hook Finder',
    eyebrow: 'Research',
    summary: 'Scan winning openings and retention beats.',
    image:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80',
    icon: Clapperboard,
  },
  {
    title: 'Script Rewrite Studio',
    eyebrow: 'Script',
    summary: 'Turn references into cleaner channel-ready drafts.',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    icon: FileText,
  },
  {
    title: 'Storyboard Planner',
    eyebrow: 'Scenes',
    summary: 'Map each beat into visual panels before edit.',
    image:
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
    icon: PanelsTopLeft,
  },
  {
    title: 'Auto Subtitle Polish',
    eyebrow: 'Captions',
    summary: 'Clean timing, emphasis, and keyword highlights.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    icon: Captions,
  },
  {
    title: 'Shorts Reframer',
    eyebrow: 'Editing',
    summary: 'Convert long-form shots into vertical story cuts.',
    image:
      'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=80',
    icon: Scissors,
  },
  {
    title: 'Thumbnail Brief Builder',
    eyebrow: 'Packaging',
    summary: 'Generate title-angle and thumbnail shot direction.',
    image:
      'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80',
    icon: MonitorPlay,
  },
] satisfies VideoToolCard[];

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
          {toolCards.map((card) => (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-[22px] border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,12,0.12)_0%,rgba(7,8,12,0.08)_36%,rgba(7,8,12,0.94)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,122,0.14),transparent_42%)] opacity-0 transition duration-500 group-hover:opacity-100" />
                <div className="absolute top-3 left-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/32 text-white shadow-[0_8px_20px_rgba(0,0,0,0.28)] backdrop-blur-md">
                  <card.icon className="size-4.5" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                    {card.eyebrow}
                  </div>
                  <div className="studio-title mt-1 text-[18px] leading-snug font-semibold">
                    {card.title}
                  </div>
                  <div className="mt-1 max-w-[15ch] text-sm leading-5 text-white/72">
                    {card.summary}
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(7,8,12,0.66)] opacity-0 backdrop-blur-md transition duration-300 group-hover:opacity-100">
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
