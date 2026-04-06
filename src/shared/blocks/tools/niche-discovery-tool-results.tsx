'use client';

import { Link } from '@/core/i18n/navigation';
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
      <section className="overflow-hidden rounded-[28px] border border-[color:var(--studio-line)] bg-[#11131a]">
        <div className="border-b border-[color:var(--studio-line)] px-6 py-6">
          <div>
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              Result Workspace
            </div>
            <h2 className="studio-title mt-2 text-3xl font-semibold tracking-tight text-white">
              Recommended Path Preview
            </h2>
            <p className="mt-3 max-w-[48ch] text-sm leading-6 text-white/68">
              One run builds a recommended niche, topic ladder, hook
              options, and a script-ready pack on this same page.
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-hidden rounded-[24px] border border-[color:var(--studio-line)] bg-[#171922]">
            <div className="grid gap-0 border-b border-[color:var(--studio-line)] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <div className="px-5 py-5 xl:border-r xl:border-[color:var(--studio-line)]">
                <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                  Recommended Niche
                </div>
                <p className="mt-3 max-w-[42ch] text-sm leading-6 text-white/72">
                  One direction positioned for a faceless-friendly channel lane,
                  with the strongest next topic and opening path ready to refine.
                </p>
              </div>

              <div className="px-5 py-5">
                <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                  After This Run
                </div>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  Pick the strongest topic, choose a hook, then move into
                  scripting with a clear voiceover and visual direction.
                </p>
              </div>
            </div>

            <div className="grid gap-0 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <div className="px-5 py-5 xl:border-r xl:border-[color:var(--studio-line)]">
                <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                  Output Modules
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    {
                      title: 'Recommended Niche',
                      description:
                        'One recommended channel lane with a concrete faceless angle.',
                    },
                    {
                      title: 'Topic Ladder',
                      description:
                        'Episode angles ordered so the next decision is obvious.',
                    },
                    {
                      title: 'Hook Options',
                      description:
                        'Opening choices tuned to the selected topic direction.',
                    },
                    {
                      title: 'Script Pack',
                      description:
                        'A ready-to-use voiceover outline with matching visual cues.',
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[18px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.02)] px-4 py-3"
                    >
                      <div className="text-sm font-semibold text-white">
                        {item.title}
                      </div>
                      <p className="mt-1.5 text-sm leading-6 text-white/68">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-5 py-5">
                <div className="space-y-3">
                  {[
                    'Review the sprint recommendation and lock the lane.',
                    'Lock the topic and opening angle.',
                    'Use the script pack as your next creator step.',
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="rounded-[18px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.02)] px-4 py-3"
                    >
                      <div className="text-xs font-semibold tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                        Step {index + 1}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/72">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-[color:var(--studio-line)] bg-[#11131a]">
      <div className="border-b border-[color:var(--studio-line)] px-6 py-6">
        <div>
          <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
            Result Workspace
          </div>
          <p className="mt-3 max-w-[50ch] text-sm leading-6 text-white/68">
            Review the niche recommendation, refine the episode angle,
            and carry the selected script pack straight into scripting.
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-hidden rounded-[24px] border border-[color:var(--studio-line)] bg-[#171922]">
          <div className="border-b border-[color:var(--studio-line)] px-5 py-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                  Recommended Niche
                </div>
                <h2 className="studio-title mt-2 text-3xl font-semibold tracking-tight text-white">
                  <span className="sr-only">Recommended Niche: </span>
                  {selectedNiche.title}
                </h2>
                <p className="mt-3 max-w-[54ch] text-sm leading-6 text-white/72">
                  {selectedNiche.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-white/78">
                <span className="rounded-full border border-[color:var(--studio-line)] px-3 py-1.5">
                  Format: {selectedHook.scriptPack.aspectRatio}
                </span>
                <span className="rounded-full border border-[color:var(--studio-line)] px-3 py-1.5">
                  Asset: {selectedHook.scriptPack.visuals[0].includes('screenshots') ? 'Screenshots' : 'Stock Footage'}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[20px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.02)] p-4">
                <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                  Why It Fits
                </div>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  {selectedNiche.whyItFits}
                </p>
              </div>

              <div className="rounded-[20px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.02)] p-4">
                <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                  Risk To Watch
                </div>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  {selectedNiche.risk}
                </p>
              </div>
            </div>
          </div>

          <section className="border-b border-[color:var(--studio-line)] px-5 py-5">
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              Refine This Pack
            </div>
            <div className="mt-4 grid gap-5 xl:grid-cols-2">
              <section>
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
                            : 'border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.02)]'
                        )}
                      >
                        {topic.title}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              <section>
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
                            : 'border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.02)]'
                        )}
                      >
                        {hook.title}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            </div>
          </section>

          <section className="border-b border-[color:var(--studio-line)] px-5 py-5">
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

          <section className="px-5 py-5">
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              Next Creator Step
            </div>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="max-w-[52ch] text-sm leading-6 text-white/72">
                Continue in Script Rewrite Studio when you want to turn this
                selected direction into a tighter, production-ready draft.
              </p>
              <Link
                href="/tools/script-rewrite-studio"
                className="inline-flex min-h-11 items-center rounded-full border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-sm font-medium text-white transition hover:border-[var(--brand-signal)] hover:text-[var(--brand-signal)]"
              >
                Continue in Script Rewrite Studio
              </Link>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
