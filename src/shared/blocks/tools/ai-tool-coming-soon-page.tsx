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
          <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
            Current Tool
          </div>
          <h1 className="studio-title mt-2 text-3xl font-semibold tracking-tight text-white">
            {tool.pageTitle}
          </h1>
          <p className="mt-2 text-sm leading-6 text-white/72">
            {tool.whenToUse}
          </p>
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
        <div className="space-y-4">
          <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
            Status
          </div>
          <h2 className="studio-title text-2xl font-semibold tracking-tight text-white">
            Coming Soon
          </h2>
          <p className="text-sm leading-6 text-white/72">{tool.whatYouGet}</p>
        </div>
      </section>
    </div>
  );
}
