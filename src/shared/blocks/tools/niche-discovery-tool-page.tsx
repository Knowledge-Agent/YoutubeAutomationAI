'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { usePathname, useRouter } from '@/core/i18n/navigation';

import { type AiToolDefinition } from './ai-tools-catalog';
import {
  buildNicheDiscoverySprint,
  getDefaultSprintSelections,
  type SprintFormat,
  type SprintHook,
  type SprintNiche,
  type SprintSelections,
  type SprintTopic,
} from './niche-discovery-sprint-data';
import {
  buildNicheDiscoveryToolSearchParams,
  type NicheDiscoveryToolSearchState,
} from './niche-discovery-tool-query';

const DEFAULT_FORMAT: SprintFormat = 'story';
const DEFAULT_ASSET_TYPE = 'stock footage';
const DEFAULT_AUDIENCE = 'curious general viewers';

function resolveTopic(niche: SprintNiche, topicSlug?: string): SprintTopic {
  return (
    niche.topics.find((topic) => topic.slug === topicSlug) ?? niche.topics[0]
  );
}

function resolveHook(topic: SprintTopic, hookSlug?: string): SprintHook {
  return topic.hooks.find((hook) => hook.slug === hookSlug) ?? topic.hooks[0];
}

export function NicheDiscoveryToolPage({
  tool,
  initialState,
  persistState,
}: {
  tool: AiToolDefinition;
  initialState?: NicheDiscoveryToolSearchState;
  persistState?: (state: NicheDiscoveryToolSearchState) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [seed, setSeed] = useState(initialState?.seed ?? '');
  const [format, setFormat] = useState<SprintFormat>(
    initialState?.format ?? DEFAULT_FORMAT
  );
  const [assetType, setAssetType] = useState(
    initialState?.assetType ?? DEFAULT_ASSET_TYPE
  );
  const [audience] = useState(initialState?.audience ?? DEFAULT_AUDIENCE);
  const [runSeed, setRunSeed] = useState(initialState?.seed ?? '');

  const sprint = useMemo(() => {
    if (!runSeed.trim()) {
      return null;
    }

    return buildNicheDiscoverySprint({
      seed: runSeed,
      format,
      assetType,
      audience,
    });
  }, [assetType, audience, format, runSeed]);

  const [selections, setSelections] = useState<SprintSelections | null>(() => {
    if (!initialState?.seed) {
      return null;
    }

    const initialSprint = buildNicheDiscoverySprint({
      seed: initialState.seed,
      format: initialState.format,
      assetType: initialState.assetType,
      audience: initialState.audience,
    });
    const fallback = getDefaultSprintSelections(initialSprint);

    return {
      nicheSlug: initialState.nicheSlug ?? fallback.nicheSlug,
      topicSlug: initialState.topicSlug ?? fallback.topicSlug,
      hookSlug: initialState.hookSlug ?? fallback.hookSlug,
    };
  });

  const resolvedSelections = useMemo(() => {
    if (!sprint) {
      return null;
    }

    return selections ?? getDefaultSprintSelections(sprint);
  }, [selections, sprint]);

  const selectedNiche = useMemo(() => {
    if (!sprint || !resolvedSelections) {
      return null;
    }

    return (
      sprint.niches.find(
        (niche) => niche.slug === resolvedSelections.nicheSlug
      ) ?? sprint.niches[0]
    );
  }, [resolvedSelections, sprint]);

  const selectedTopic = useMemo(() => {
    if (!selectedNiche || !resolvedSelections) {
      return null;
    }

    return resolveTopic(selectedNiche, resolvedSelections.topicSlug);
  }, [resolvedSelections, selectedNiche]);

  const selectedHook = useMemo(() => {
    if (!selectedTopic || !resolvedSelections) {
      return null;
    }

    return resolveHook(selectedTopic, resolvedSelections.hookSlug);
  }, [resolvedSelections, selectedTopic]);

  const syncState = (next: NicheDiscoveryToolSearchState) => {
    if (persistState) {
      persistState(next);
      return;
    }

    const params = buildNicheDiscoveryToolSearchParams(
      new URLSearchParams(searchParams.toString()),
      next
    );
    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const updateSelections = (nextSelections: SprintSelections) => {
    setSelections(nextSelections);
    syncState({
      seed: runSeed,
      format,
      assetType,
      audience,
      nicheSlug: nextSelections.nicheSlug,
      topicSlug: nextSelections.topicSlug,
      hookSlug: nextSelections.hookSlug,
    });
  };

  const runSprint = () => {
    if (!seed.trim()) {
      return;
    }

    const nextSprint = buildNicheDiscoverySprint({
      seed: seed.trim(),
      format,
      assetType,
      audience,
    });
    const nextSelections = getDefaultSprintSelections(nextSprint);

    setRunSeed(seed.trim());
    setSelections(nextSelections);
    syncState({
      seed: seed.trim(),
      format,
      assetType,
      audience,
      nicheSlug: nextSelections.nicheSlug,
      topicSlug: nextSelections.topicSlug,
      hookSlug: nextSelections.hookSlug,
    });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#171922] p-5">
        <div className="space-y-5">
          <div>
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              Current Tool
            </div>
            <h1 className="studio-title mt-2 text-3xl font-semibold tracking-tight text-white">
              {tool.pageTitle}
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/72">
              {tool.whenToUse}
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-white">Seed topic</span>
            <input
              aria-label="Seed topic"
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
              className="w-full rounded-2xl border border-[color:var(--studio-line)] bg-[#0f1118] px-4 py-3 text-white outline-none"
              placeholder="AI tools"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-3">
            <button
              type="button"
              onClick={() => setFormat('story')}
              className="rounded-2xl border border-[color:var(--studio-line)] px-4 py-3 text-left text-white"
            >
              Story
            </button>
            <button
              type="button"
              onClick={() => setFormat('shorts')}
              className="rounded-2xl border border-[color:var(--studio-line)] px-4 py-3 text-left text-white"
            >
              Shorts
            </button>
            <button
              type="button"
              onClick={() => setAssetType('screenshots')}
              className="rounded-2xl border border-[color:var(--studio-line)] px-4 py-3 text-left text-white"
            >
              Screenshots
            </button>
          </div>

          <button
            type="button"
            onClick={runSprint}
            className="rounded-full bg-[var(--brand-signal)] px-5 py-3 text-sm font-semibold text-white"
          >
            Generate Niche Pack
          </button>
        </div>
      </section>

      <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#11131a] p-5">
        {!sprint || !selectedNiche || !selectedTopic || !selectedHook ? (
          <div className="space-y-3">
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              Results
            </div>
            <h2 className="studio-title text-2xl font-semibold tracking-tight text-white">
              Run the sprint to see your recommended path
            </h2>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                Recommended Niche
              </div>
              <h2 className="studio-title mt-2 text-3xl font-semibold tracking-tight text-white">
                <span className="sr-only">Recommended Niche: </span>
                {selectedNiche.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/72">
                {selectedNiche.summary}
              </p>
            </div>

            <div className="space-y-2">
              {selectedNiche.topics.map((topic) => (
                <button
                  key={topic.slug}
                  type="button"
                  onClick={() => {
                    const nextHook = topic.hooks[0];

                    updateSelections({
                      nicheSlug: selectedNiche.slug,
                      topicSlug: topic.slug,
                      hookSlug: nextHook?.slug ?? '',
                    });
                  }}
                  className="block w-full rounded-2xl border border-[color:var(--studio-line)] px-4 py-3 text-left text-white"
                >
                  {topic.title}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {selectedTopic.hooks.map((hook) => (
                <button
                  key={hook.slug}
                  type="button"
                  onClick={() =>
                    updateSelections({
                      nicheSlug: selectedNiche.slug,
                      topicSlug: selectedTopic.slug,
                      hookSlug: hook.slug,
                    })
                  }
                  className="block w-full rounded-2xl border border-[color:var(--studio-line)] px-4 py-3 text-left text-white"
                >
                  {hook.title}
                </button>
              ))}
            </div>

            <div className="space-y-3 rounded-[24px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.04)] p-4">
              <div className="text-sm font-semibold text-white">
                Voiceover Draft
              </div>
              {selectedHook.scriptPack.voiceoverDraft.map((line) => (
                <p key={line} className="text-sm leading-6 text-white/72">
                  {line}
                </p>
              ))}

              <div className="text-sm font-semibold text-white">
                Visual Cues
              </div>
              {selectedHook.scriptPack.visuals.map((line) => (
                <p key={line} className="text-sm leading-6 text-white/72">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
