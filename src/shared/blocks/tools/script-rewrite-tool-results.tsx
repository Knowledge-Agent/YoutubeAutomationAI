'use client';

import { type ScriptRewriteResult } from './script-rewrite-tool-data';

export function ScriptRewriteToolResults({
  result,
}: {
  result: ScriptRewriteResult | null;
}) {
  if (!result) {
    return (
      <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#11131a] p-6">
        <div className="space-y-6">
          <div>
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              Results
            </div>
            <h2 className="studio-title mt-2 text-3xl font-semibold tracking-tight text-white">
              Run one rewrite to build your workspace
            </h2>
            <p className="mt-3 max-w-[48ch] text-sm leading-6 text-white/68">
              Generate a tighter faceless-ready script with a stronger opener,
              cleaner flow, and production notes that can move straight into
              editing.
            </p>
          </div>

          <div className="rounded-[24px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] p-4">
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              Workspace preview
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                'Rewritten Hook',
                'Structure Plan',
                'Full Rewrite',
                'Visual Beat Notes',
              ].map((title) => (
                <div
                  key={title}
                  className="rounded-[20px] border border-[color:var(--studio-line)] bg-[#151821] p-4"
                >
                  <div className="text-sm font-semibold text-white">
                    {title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    This module appears after one run with production-ready
                    guidance, not placeholder filler.
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
            Rewrite summary
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/80">
            <span className="rounded-full border border-[color:var(--studio-line)] px-3 py-1.5">
              Format: {result.format}
            </span>
            <span className="rounded-full border border-[color:var(--studio-line)] px-3 py-1.5">
              Duration target: {result.duration}
            </span>
            <span className="rounded-full border border-[color:var(--studio-line)] px-3 py-1.5">
              Tone: {result.tone}
            </span>
          </div>
        </div>

        <section className="rounded-[24px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] p-5">
          <h2 className="text-base font-semibold text-white">Rewritten Hook</h2>
          <p className="mt-3 text-sm leading-6 text-white/72">
            {result.rewrittenHook}
          </p>
        </section>

        <section className="rounded-[24px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] p-5">
          <h2 className="text-base font-semibold text-white">Structure Plan</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {result.structurePlan.map((section) => (
              <div
                key={section.title}
                className="rounded-[20px] border border-[color:var(--studio-line)] bg-[#151821] p-4"
              >
                <div className="text-sm font-semibold text-white">
                  {section.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-white/68">
                  {section.summary}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] p-5">
          <h2 className="text-base font-semibold text-white">Full Rewrite</h2>
          <div className="mt-4 space-y-3">
            {result.fullRewrite.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-6 text-white/72">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] p-5">
          <h2 className="text-base font-semibold text-white">
            Visual Beat Notes
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/72">
            {result.visualBeatNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
