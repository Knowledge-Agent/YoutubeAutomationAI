'use client';

import { Plus, Search } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

export interface AssistantThreadListItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  active?: boolean;
}

export function AssistantThreadList({
  items,
  onCreate,
  onSelect,
  className,
}: {
  items: AssistantThreadListItem[];
  onCreate?: () => void;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        'hidden w-[300px] shrink-0 border-r border-white/6 bg-[#0d0e14] p-4 lg:block',
        className
      )}
    >
      <button
        type="button"
        onClick={onCreate}
        className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/14"
      >
        <Plus className="size-4" />
        New Thread
      </button>

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-zinc-500">
        <Search className="size-4" />
        <span className="text-sm">Search threads</span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect?.(item.id)}
            className={cn(
              'w-full rounded-[22px] border px-4 py-3 text-left transition',
              item.active
                ? 'border-white/12 bg-[#20222d] text-white shadow-[0_12px_24px_rgba(0,0,0,0.16)]'
                : 'border-transparent bg-transparent text-zinc-400 hover:border-white/8 hover:bg-white/5 hover:text-white'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{item.title}</div>
                {item.subtitle ? (
                  <div className="mt-1 truncate text-xs text-zinc-500">
                    {item.subtitle}
                  </div>
                ) : null}
              </div>
              {item.badge ? (
                <Badge className="border-none bg-white/10 text-[10px] text-zinc-300">
                  {item.badge}
                </Badge>
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
