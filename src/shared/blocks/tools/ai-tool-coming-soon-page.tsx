import { Link } from '@/core/i18n/navigation';

import { aiTools, type AiToolDefinition } from './ai-tools-catalog';
import { ToolSwitcherCard } from './tool-switcher-card';

export function AiToolComingSoonPage({ tool }: { tool: AiToolDefinition }) {
  const availableNowTool = aiTools.find((entry) => entry.status === 'ready');

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <div className="space-y-4">
        <ToolSwitcherCard activeSlug={tool.slug} />

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

            <div className="rounded-[24px] border border-[color:var(--studio-line)] bg-[#11131a] p-4">
              <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                What You&apos;ll Input
              </div>
              <p className="mt-3 text-sm leading-6 text-white/72">
                {tool.whatYouInput}
              </p>
            </div>

            <div className="rounded-[24px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] p-4">
              <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                Launch Status
              </div>
              <div className="mt-3 text-lg font-semibold tracking-tight text-white">
                Coming Soon
              </div>
              <p className="mt-2 text-sm leading-6 text-white/68">
                This workflow is being prepared with the same structured
                deliverable surface as the live tools.
              </p>
            </div>
          </div>
        </section>

        {availableNowTool ? (
          <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#14151c] p-5">
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              Available Now
            </div>
            <p className="mt-2 text-sm leading-6 text-white/72">
              While this workflow is still being prepared, the live tool below
              is available today.
            </p>
            <Link
              href={availableNowTool.href}
              className="mt-4 inline-flex rounded-full border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] px-4 py-2 text-sm font-medium text-white transition hover:border-[var(--brand-signal)] hover:text-[var(--brand-signal)]"
            >
              {availableNowTool.title}
            </Link>
          </section>
        ) : null}
      </div>

      <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#11131a] p-5">
        <div className="space-y-6">
          <div>
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              What You&apos;ll Get
            </div>
            <h2 className="studio-title mt-2 text-2xl font-semibold tracking-tight text-white">
              Preview the deliverable before this workflow goes live
            </h2>
            <p className="mt-3 max-w-[52ch] text-sm leading-6 text-white/68">
              {tool.whatYouGet}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {tool.outputModules.map((module) => (
              <div
                key={module}
                className="rounded-[22px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] p-4"
              >
                <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                  Output Module
                </div>
                <div className="mt-3 text-sm font-medium leading-6 text-white">
                  {module}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[24px] border border-dashed border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              Delivery Notes
            </div>
            <p className="mt-3 text-sm leading-6 text-white/68">
              The right-side workspace will ship with selectable modules and a
              review-ready output handoff.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
