import { Link } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';

import { aiTools } from './ai-tools-catalog';

export function ToolSwitcherCard({ activeSlug }: { activeSlug: string }) {
  return (
    <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#14151c] p-5">
      <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
        Switch Tool
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {aiTools.map((tool) => {
          const isActive = tool.slug === activeSlug;

          return (
            <Link
              key={tool.slug}
              href={tool.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex rounded-full border px-3 py-2 text-sm transition',
                isActive
                  ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)] text-white'
                  : 'border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] text-[var(--studio-muted)] hover:border-[var(--brand-signal)] hover:text-white'
              )}
            >
              {tool.title}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
