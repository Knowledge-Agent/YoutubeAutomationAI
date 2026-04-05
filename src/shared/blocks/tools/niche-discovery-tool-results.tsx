'use client';

import { cn } from '@/shared/lib/utils';

import {
  type SprintHook,
  type SprintNiche,
  type SprintTopic,
} from './niche-discovery-sprint-data';

export function NicheDiscoveryToolResults({
  selectedNiche,
  selectedTopic,
  selectedHook,
  onSelectTopic,
  onSelectHook,
}: {
  selectedNiche: SprintNiche | null;
  selectedTopic: SprintTopic | null;
  selectedHook: SprintHook | null;
  onSelectTopic: (topic: SprintTopic) => void;
  onSelectHook: (hook: SprintHook) => void;
}) {
  if (!selectedNiche || !selectedTopic || !selectedHook) {
    return (
      <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#11131a] p-5">
        <div className="space-y-3">
          <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
            Results
          </div>
          <h2 className="studio-title text-2xl font-semibold tracking-tight text-white">
            Run the sprint to see your recommended path
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#11131a] p-5">
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
              aria-pressed={topic.slug === selectedTopic.slug}
              onClick={() => onSelectTopic(topic)}
              className={cn(
                'block w-full rounded-2xl border px-4 py-3 text-left text-white transition',
                topic.slug === selectedTopic.slug
                  ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                  : 'border-[color:var(--studio-line)]'
              )}
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
              aria-pressed={hook.slug === selectedHook.slug}
              onClick={() => onSelectHook(hook)}
              className={cn(
                'block w-full rounded-2xl border px-4 py-3 text-left text-white transition',
                hook.slug === selectedHook.slug
                  ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                  : 'border-[color:var(--studio-line)]'
              )}
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

          <div className="text-sm font-semibold text-white">Visual Cues</div>
          {selectedHook.scriptPack.visuals.map((line) => (
            <p key={line} className="text-sm leading-6 text-white/72">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
