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
  const radioInputClassName = 'peer sr-only';
  const radioCardClassName =
    'block w-full rounded-2xl border px-4 py-3 text-left text-white transition peer-focus-visible:border-[var(--brand-signal)] peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(229,106,17,0.35)] peer-checked:border-[var(--brand-signal)] peer-checked:bg-[rgba(229,106,17,0.12)]';

  if (!selectedNiche || !selectedTopic || !selectedHook) {
    return (
      <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#11131a] p-6">
        <div className="space-y-6">
          <div>
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              Results
            </div>
            <h2 className="studio-title mt-2 text-3xl font-semibold tracking-tight text-white">
              Run the sprint to see your recommended path
            </h2>
            <p className="mt-3 max-w-[48ch] text-sm leading-6 text-white/68">
              Generate one focused niche pack with a recommended
              direction, refinable episode angles, sharper opening
              choices, and a script-ready output.
            </p>
          </div>

          <div className="rounded-[24px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] p-4">
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              What you&apos;ll get
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                {
                  title: 'Recommended niche path',
                  description:
                    'One direction positioned for a faceless-friendly channel lane.',
                },
                {
                  title: 'Topic ladder',
                  description:
                    'A short list of episode angles ordered for fast refinement.',
                },
                {
                  title: 'Hook options',
                  description:
                    'Selectable openers tuned to the chosen topic direction.',
                },
                {
                  title: 'Script pack',
                  description:
                    'A voiceover draft with matching visual cues for production.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[20px] border border-[color:var(--studio-line)] bg-[#151821] p-4"
                >
                  <div className="text-sm font-semibold text-white">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#11131a] p-6">
      <div className="space-y-6">
        <div className="rounded-[24px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] p-5">
          <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
            Recommended Niche
          </div>
          <h2 className="studio-title mt-2 text-3xl font-semibold tracking-tight text-white">
            <span className="sr-only">Recommended Niche: </span>
            {selectedNiche.title}
          </h2>
          <div className="mt-4 text-sm font-semibold text-white">
            Recommended niche path
          </div>
          <p className="mt-2 max-w-[54ch] text-sm leading-6 text-white/72">
            {selectedNiche.summary}
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <section className="rounded-[24px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] p-5">
            <h3
              id="niche-topic-ladder-label"
              className="text-base font-semibold text-white"
            >
              Topic Ladder
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/68">
              Pick the episode direction you want to refine inside this
              niche path.
            </p>
            <div
              role="radiogroup"
              aria-labelledby="niche-topic-ladder-label"
              className="mt-4 space-y-2"
            >
              {selectedNiche.topics.map((topic) => (
                <label key={topic.slug} className="block cursor-pointer">
                  <input
                    type="radio"
                    name="niche-discovery-topic"
                    value={topic.slug}
                    checked={topic.slug === selectedTopic.slug}
                    onChange={() => onSelectTopic(topic)}
                    className={radioInputClassName}
                  />
                  <span
                    className={cn(
                      radioCardClassName,
                      topic.slug === selectedTopic.slug
                        ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                        : 'border-[color:var(--studio-line)]'
                    )}
                  >
                    {topic.title}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] p-5">
            <h3
              id="niche-hook-options-label"
              className="text-base font-semibold text-white"
            >
              Hook Options
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/68">
              Choose the opening angle that best frames the selected
              topic.
            </p>
            <div
              role="radiogroup"
              aria-labelledby="niche-hook-options-label"
              className="mt-4 space-y-2"
            >
              {selectedTopic.hooks.map((hook) => (
                <label key={hook.slug} className="block cursor-pointer">
                  <input
                    type="radio"
                    name="niche-discovery-hook"
                    value={hook.slug}
                    checked={hook.slug === selectedHook.slug}
                    onChange={() => onSelectHook(hook)}
                    className={radioInputClassName}
                  />
                  <span
                    className={cn(
                      radioCardClassName,
                      hook.slug === selectedHook.slug
                        ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                        : 'border-[color:var(--studio-line)]'
                    )}
                  >
                    {hook.title}
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[24px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.04)] p-5">
          <h3 className="text-base font-semibold text-white">Script Pack</h3>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-white">
                Voiceover Draft
              </div>
              {selectedHook.scriptPack.voiceoverDraft.map((line) => (
                <p key={line} className="text-sm leading-6 text-white/72">
                  {line}
                </p>
              ))}
            </div>

            <div className="space-y-3">
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
        </section>
      </div>
    </section>
  );
}
