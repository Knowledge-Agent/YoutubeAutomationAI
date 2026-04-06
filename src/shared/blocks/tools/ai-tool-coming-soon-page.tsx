import { Link } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';

import { aiTools, type AiToolDefinition } from './ai-tools-catalog';
import { ToolSwitcherCard } from './tool-switcher-card';

export function AiToolComingSoonPage({ tool }: { tool: AiToolDefinition }) {
  const fallbackReadyTool = aiTools.find((entry) => entry.status === 'ready');
  const primaryActionHref = tool.primaryActionHref ?? fallbackReadyTool?.href;
  const primaryActionTool = aiTools.find(
    (entry) => entry.href === primaryActionHref
  );
  const primaryActionHeading =
    tool.primaryActionLabel ?? primaryActionTool?.title ?? 'Recommended Next';
  const primaryActionDescription =
    tool.primaryActionDescription ??
    `Use ${primaryActionTool?.title ?? 'a ready tool'} to keep moving while this workflow is still in development.`;
  const primaryActionButtonLabel = primaryActionTool
    ? `Use ${primaryActionTool.title} Now`
    : tool.primaryActionLabel;
  const previewTitle = tool.previewTitle ?? `Sample ${tool.pageTitle} Output`;
  const previewDescription = tool.previewDescription ?? tool.whatYouGet;
  const exampleSections =
    tool.exampleDeliverableSections ??
    tool.outputModules.map((module) => ({
      title: module,
      points: [module],
    }));

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="space-y-4">
        <ToolSwitcherCard activeSlug={tool.slug} />

        <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#171922] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                  Planned Tool
                </div>
                <h1 className="studio-title mt-2 text-3xl font-semibold tracking-tight text-white">
                  {tool.pageTitle}
                </h1>
                <p className="mt-3 max-w-[54ch] text-sm leading-6 text-white/72">
                  {tool.whenToUse}
                </p>
              </div>

              <div className="inline-flex rounded-full border border-[rgba(229,106,17,0.28)] bg-[rgba(229,106,17,0.12)] px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-[var(--brand-signal)] uppercase">
                Coming Soon
              </div>
            </div>

            <div className="rounded-[24px] border border-[rgba(229,106,17,0.24)] bg-[rgba(229,106,17,0.08)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div className="text-[11px] tracking-[0.18em] text-[var(--brand-signal)] uppercase">
                Recommended Right Now
              </div>
              <div className="mt-3 text-xl font-semibold tracking-tight text-white">
                {primaryActionHeading}
              </div>
              <p className="mt-2 text-sm leading-6 text-white/72">
                {primaryActionDescription}
              </p>

              {primaryActionHref && primaryActionButtonLabel ? (
                <Link
                  href={primaryActionHref}
                  className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[var(--brand-signal)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                >
                  {primaryActionButtonLabel}
                </Link>
              ) : null}
            </div>

            <div className="rounded-[24px] border border-[color:var(--studio-line)] bg-[#11131a] p-4">
              <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                Expected Input
              </div>
              <p className="mt-3 text-sm leading-6 text-white/72">
                {tool.whatYouInput}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#11131a] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              Sample Deliverable
            </div>
            <h2 className="studio-title mt-2 text-2xl font-semibold tracking-tight text-white">
              {previewTitle}
            </h2>
            <p className="mt-3 max-w-[56ch] text-sm leading-6 text-white/68">
              {previewDescription}
            </p>
          </div>

          <div className="inline-flex rounded-full border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[var(--studio-muted)] uppercase">
            Preview
          </div>
        </div>

        <div className="mt-6 rounded-[26px] border border-[color:var(--studio-line)] bg-[#171922] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div className="border-b border-[color:var(--studio-line)] px-5 py-4">
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              Example Handoff
            </div>
            <p className="mt-3 text-sm leading-6 text-white/72">
              {tool.whatYouGet}
            </p>
          </div>

          <div>
            {exampleSections.map((section, index) => (
              <div
                key={section.title}
                className={cn(
                  'px-5 py-5',
                  index > 0 && 'border-t border-[color:var(--studio-line)]'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(229,106,17,0.12)] text-sm font-semibold text-[var(--brand-signal)]">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold tracking-tight text-white">
                      {section.title}
                    </h3>
                    <ul className="mt-3 space-y-2.5">
                      {section.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-sm leading-6 text-white/70"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-signal)]" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
