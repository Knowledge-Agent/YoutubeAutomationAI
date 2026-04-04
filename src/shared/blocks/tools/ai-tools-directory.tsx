import { Link } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';

import {
  aiToolCategories,
  getAiToolsForCategory,
  type AiToolCategory,
} from './ai-tools-catalog';

export function AiToolsDirectory({
  activeCategory,
}: {
  activeCategory: AiToolCategory;
}) {
  const tools = getAiToolsForCategory(activeCategory);

  return (
    <div className="space-y-5">
      <nav
        aria-label="AI tools categories"
        className="flex flex-wrap gap-2 rounded-[28px] border border-[color:var(--studio-line)] bg-[rgb(23_25_32_/_0.74)] p-2"
      >
        {aiToolCategories.map((category) => {
          const active = category.slug === activeCategory;

          return (
            <Link
              key={category.slug}
              href={`/tools?tab=${category.slug}`}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition',
                active
                  ? 'bg-white text-[#13141b]'
                  : 'text-[var(--studio-muted)] hover:bg-white/[0.04] hover:text-white'
              )}
            >
              {category.title}
            </Link>
          );
        })}
      </nav>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.href}
            className="group overflow-hidden rounded-[22px] border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:border-white/14"
          >
            <div className="relative aspect-[1.42/1] overflow-hidden bg-black">
              <img
                src={tool.coverImage}
                alt={tool.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="border-t border-[color:var(--studio-line)] px-4 py-3">
              <div className="studio-title text-lg font-semibold tracking-tight text-white">
                {tool.title}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
