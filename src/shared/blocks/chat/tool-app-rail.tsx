'use client';

import {
  AppWindow,
  Clapperboard,
  ImagePlay,
  Images,
  Menu,
  ScanFace,
  Sparkles,
  Wand2,
} from 'lucide-react';

import { Link, usePathname } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';

const railItems = [
  {
    key: 'img2vid',
    label: 'Img2Vid',
    icon: ImagePlay,
    href: '/ai-video-generator',
  },
  {
    key: 'txt2vid',
    label: 'Txt2Vid',
    icon: Clapperboard,
    href: '/ai-video-generator',
  },
  {
    key: 'ref2vid',
    label: 'Ref2Vid',
    icon: Images,
    href: '/ai-video-generator',
  },
  {
    key: 'avatar',
    label: 'AI Avatar',
    icon: ScanFace,
    href: '/ai-video-generator',
  },
  { key: 'apps', label: 'Apps', icon: AppWindow, href: '/tools' },
  {
    key: 'effects',
    label: 'Effects',
    icon: Sparkles,
    href: '/ai-image-generator',
  },
  { key: 'tools', label: 'AI Tools', icon: Wand2, href: '/tools' },
] as const;

export function ToolAppRail() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[118px] shrink-0 border-r border-[color:var(--studio-line)] bg-[#17181f] lg:flex lg:flex-col">
      <div className="flex h-[72px] items-center justify-center border-b border-[color:var(--studio-line)]">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--studio-line)] bg-[#1e2028] text-[var(--studio-ink)]"
        >
          <Menu className="size-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 border-b border-[color:var(--studio-line)]">
        <button
          type="button"
          className="flex h-16 items-center justify-center border-r border-[color:var(--studio-line)] bg-[#111219] text-[var(--image-accent)]"
        >
          <Images className="size-5" />
        </button>
        <button
          type="button"
          className="flex h-16 items-center justify-center bg-[#1d1f27] text-[var(--video-accent)]"
        >
          <Clapperboard className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {railItems.map((item, index) => {
          const Icon = item.icon;
          const active =
            index === 0 ||
            pathname.includes('/ai-video-generator') ||
            pathname.includes('/chat/');

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'relative flex h-[84px] flex-col items-center justify-center gap-2 px-2 text-center transition',
                active && index === 0
                  ? 'bg-[var(--studio-panel-strong)] text-[var(--brand-signal)]'
                  : 'text-[var(--studio-muted)] hover:bg-white/[0.03] hover:text-[var(--studio-ink)]'
              )}
            >
              {active && index === 0 ? (
                <span className="absolute inset-y-0 left-0 w-[3px] rounded-r-full bg-[var(--brand-signal)]" />
              ) : null}
              <Icon className="size-5" />
              <span className="text-[12px] font-medium tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
