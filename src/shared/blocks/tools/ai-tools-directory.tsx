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
    <div className="space-y-4">
      <nav
        aria-label="AI tools categories"
        className="flex flex-nowrap items-center gap-2 overflow-x-auto"
      >
        {aiToolCategories.map((category) => {
          const active = category.slug === activeCategory;

          return (
            <Link
              key={category.slug}
              href={`/tools?tab=${category.slug}`}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'shrink-0 rounded-full border border-[color:var(--studio-line)] px-3 py-1.5 text-sm font-medium transition',
                active
                  ? 'border-white bg-white text-[#13141b]'
                  : 'bg-[var(--studio-panel)] text-[var(--studio-muted)] hover:border-white/20 hover:text-white'
              )}
            >
              {category.title}
            </Link>
          );
        })}
      </nav>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.href}
            className="group overflow-hidden rounded-[20px] border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] transition hover:border-white/14"
          >
            <div className="relative aspect-[1.42/1] overflow-hidden bg-black">
              <img
                src={tool.coverImage}
                alt={tool.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="px-4 py-3">
              <div className="studio-title text-base font-semibold tracking-tight text-white">
                {tool.title}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
