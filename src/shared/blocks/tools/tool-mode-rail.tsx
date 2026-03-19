import { LucideIcon } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';

export function ToolModeRail({
  items,
}: {
  items: Array<{
    key: string;
    title: string;
    icon: LucideIcon;
    href?: string;
    active?: boolean;
    disabled?: boolean;
  }>;
}) {
  return (
    <div className="flex h-full min-h-[760px] flex-col overflow-hidden rounded-[24px] border border-white/7 bg-[#15161d] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="flex flex-1 flex-col space-y-1.5 p-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const content = (
            <div
              className={cn(
                'relative flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-[18px] px-1.5 py-2 text-center text-[10px] font-medium tracking-tight transition',
                item.active
                  ? 'bg-[#23242e] text-pink-400 shadow-[0_12px_24px_rgba(0,0,0,0.18)]'
                  : item.disabled
                    ? 'text-zinc-500'
                    : 'text-zinc-300 hover:bg-[#1d1e28] hover:text-white'
              )}
            >
              {item.active ? (
                <span className="absolute top-3 bottom-3 left-0 w-[2px] rounded-r-full bg-pink-500" />
              ) : null}
              <span
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-transparent',
                  item.active ? 'border-white/10 bg-white/8' : 'bg-black/15'
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="max-w-[44px] leading-3.5">{item.title}</span>
            </div>
          );

          if (item.disabled || !item.href) {
            return <div key={item.key}>{content}</div>;
          }

          return (
            <Link key={item.key} href={item.href}>
              {content}
            </Link>
          );
        })}
        <div className="flex-1" />
      </div>
    </div>
  );
}
