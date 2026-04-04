import { type ReactNode } from 'react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';

import { aiTools, type AiToolDefinition } from './ai-tools-catalog';

export function AiToolPageFrame({
  tool,
  center,
  right,
}: {
  tool: AiToolDefinition;
  center: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-110px)] gap-4 lg:grid-cols-[220px_minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <aside className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#14151c] p-4">
        <div className="mb-3 text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
          AI Tools
        </div>
        <div className="space-y-2">
          {aiTools.map((entry) => (
            <Link
              key={entry.slug}
              href={entry.href}
              className={cn(
                'block rounded-2xl border px-3 py-3 text-sm transition',
                entry.slug === tool.slug
                  ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)] text-white'
                  : 'border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] text-[var(--studio-muted)] hover:text-white'
              )}
            >
              {entry.title}
            </Link>
          ))}
        </div>
      </aside>

      <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#171922] p-5">
        {center}
      </section>

      <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#11131a] p-5">
        {right}
      </section>
    </div>
  );
}
