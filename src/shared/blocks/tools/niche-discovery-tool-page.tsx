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
import { NicheDiscoveryToolForm } from './niche-discovery-tool-form';
import {
  buildNicheDiscoveryToolSearchParams,
  type NicheDiscoveryToolSearchState,
} from './niche-discovery-tool-query';
import { NicheDiscoveryToolResults } from './niche-discovery-tool-results';
import { ToolSwitcherCard } from './tool-switcher-card';

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

  const buildSearchState = ({
    nextSeed = runSeed,
    nextFormat = format,
    nextAssetType = assetType,
    nextSelections = resolvedSelections,
  }: {
    nextSeed?: string;
    nextFormat?: SprintFormat;
    nextAssetType?: string;
    nextSelections?: SprintSelections | null;
  } = {}): NicheDiscoveryToolSearchState => ({
    seed: nextSeed,
    format: nextFormat,
    assetType: nextAssetType,
    audience,
    nicheSlug: nextSelections?.nicheSlug,
    topicSlug: nextSelections?.topicSlug,
    hookSlug: nextSelections?.hookSlug,
  });

  const updateSelections = (nextSelections: SprintSelections) => {
    setSelections(nextSelections);
    syncState(buildSearchState({ nextSelections }));
  };

  const updateFormat = (nextFormat: SprintFormat) => {
    setFormat(nextFormat);

    if (!runSeed.trim()) {
      return;
    }

    syncState(buildSearchState({ nextFormat }));
  };

  const updateAssetType = (nextAssetType: string) => {
    setAssetType(nextAssetType);

    if (!runSeed.trim()) {
      return;
    }

    syncState(buildSearchState({ nextAssetType }));
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
    syncState(
      buildSearchState({
        nextSeed: seed.trim(),
        nextSelections,
      })
    );
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <div className="space-y-4">
        <ToolSwitcherCard activeSlug={tool.slug} />
        <NicheDiscoveryToolForm
          tool={tool}
          seed={seed}
          format={format}
          assetType={assetType}
          onSeedChange={setSeed}
          onFormatChange={updateFormat}
          onAssetTypeChange={updateAssetType}
          onRunSprint={runSprint}
        />
      </div>

      <NicheDiscoveryToolResults
        selectedNiche={selectedNiche}
        selectedTopic={selectedTopic}
        selectedHook={selectedHook}
        onSelectTopic={(topic) => {
          const nextHook = topic.hooks[0];

          updateSelections({
            nicheSlug: selectedNiche?.slug ?? '',
            topicSlug: topic.slug,
            hookSlug: nextHook?.slug ?? '',
          });
        }}
        onSelectHook={(hook) =>
          updateSelections({
            nicheSlug: selectedNiche?.slug ?? '',
            topicSlug: selectedTopic?.slug ?? '',
            hookSlug: hook.slug,
          })
        }
      />
    </div>
  );
}
