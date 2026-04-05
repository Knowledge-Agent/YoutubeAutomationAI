import { Link } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';

import { aiTools } from './ai-tools-catalog';

export function ToolSwitcherCard({ activeSlug }: { activeSlug: string }) {
  return (
    <section className="rounded-[22px] border border-[color:var(--studio-line)]/80 bg-[rgba(255,255,255,0.02)] px-4 py-3">
      <div className="text-[10px] tracking-[0.22em] text-[var(--studio-muted)] uppercase">
        Switch Tool
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {aiTools.map((tool) => {
          const isActive = tool.slug === activeSlug;

          return (
            <Link
              key={tool.slug}
              href={tool.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex min-h-9 items-center rounded-full border px-3.5 py-2 text-sm transition',
                isActive
                  ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)] text-white'
                  : 'border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] text-[var(--studio-muted)] hover:border-white/14 hover:text-white'
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
