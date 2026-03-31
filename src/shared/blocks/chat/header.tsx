'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Coins, Home, ImageIcon, Menu, WandSparkles, X } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { LocaleSelector } from '@/shared/blocks/common';
import { useChatContext } from '@/shared/contexts/chat';
import { AI_CREDITS_ENABLED } from '@/shared/lib/ai-credits';
import { cn } from '@/shared/lib/utils';

type ChatDrawerNavItem = {
  key: string;
  title: string;
  href: string;
  icon: typeof Home;
  disabled?: boolean;
  badge?: string;
};

const drawerPrimaryNav: ChatDrawerNavItem[] = [
  { key: 'home', title: 'Home', href: '/tools', icon: Home },
];

const drawerCreationNav: ChatDrawerNavItem[] = [
  {
    key: 'ai-video',
    title: 'AI Video',
    href: '/ai-video-generator',
    icon: WandSparkles,
  },
  {
    key: 'ai-image',
    title: 'AI Image',
    href: '/ai-image-generator',
    icon: ImageIcon,
  },
];

function safeParseHeaderMetadata(value: unknown) {
  if (!value) {
    return {};
  }

  if (typeof value === 'object') {
    return value as Record<string, unknown>;
  }

  if (typeof value !== 'string') {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function getToolDrawerActiveKey(metadata: Record<string, unknown>) {
  const toolSurface =
    typeof metadata.toolSurface === 'string' ? metadata.toolSurface : '';

  if (toolSurface === 'image') {
    return 'ai-image';
  }

  if (toolSurface === 'video') {
    return 'ai-video';
  }

  return 'home';
}

function DrawerNavItem({
  item,
  active,
  onNavigate,
}: {
  item: ChatDrawerNavItem;
  active?: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  const content = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-medium tracking-tight transition',
        active
          ? 'bg-[var(--studio-panel-strong)] text-[var(--brand-signal)]'
          : item.disabled
            ? 'text-[var(--studio-muted)]/60'
            : 'text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] hover:text-[var(--studio-ink)]'
      )}
    >
      <Icon className="size-4" />
      <span>{item.title}</span>
      {item.badge ? (
        <span className="rounded-full bg-[var(--brand-signal)] px-2 py-0.5 text-[10px] font-semibold text-white">
          {item.badge}
        </span>
      ) : null}
    </div>
  );

  if (item.disabled) {
    return <div>{content}</div>;
  }

  return (
    <Link href={item.href} onClick={onNavigate}>
      {content}
    </Link>
  );
}

export function ChatHeader() {
  const { chat } = useChatContext();
  const headerMetadata = safeParseHeaderMetadata(chat?.metadata);
  const activeDrawerKey = getToolDrawerActiveKey(headerMetadata);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="sticky top-0 z-20 h-[68px] border-b border-[color:var(--studio-line)] bg-[rgb(18_19_26_/_0.96)] px-4 backdrop-blur-xl md:px-5">
        <div className="flex h-full items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen((current) => !current)}
              aria-label={
                drawerOpen ? 'Close workspace menu' : 'Open workspace menu'
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-[color:var(--studio-line)] bg-[var(--studio-panel)] text-[var(--studio-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-white/14 hover:bg-[var(--studio-hover)]"
            >
              {drawerOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
            <Link
              href="/ai-video-generator"
              className="flex items-center gap-3"
            >
              <Image
                src="/logo-mark.svg"
                alt="YouTube Automation AI"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <div className="min-w-0">
                <div className="truncate text-[1.15rem] font-semibold tracking-[-0.04em] text-[var(--studio-ink)]">
                  YouTube Automation AI
                </div>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {AI_CREDITS_ENABLED ? (
              <button className="inline-flex h-10 items-center gap-1.5 rounded-[16px] border border-[color:var(--brand-signal-soft)] bg-[var(--studio-panel)] px-3.5 text-[13px] font-medium text-[var(--brand-signal)] transition hover:border-[var(--brand-signal)]/40 hover:bg-[var(--studio-hover)]">
                <Coins className="size-3.5" />0 credit
              </button>
            ) : null}
            <LocaleSelector />
          </div>
        </div>
      </header>

      {drawerOpen ? (
        <>
          <div
            className="fixed inset-x-0 top-[68px] bottom-0 z-30 bg-black/46"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed top-[68px] bottom-0 left-0 z-40 w-[286px] border-r border-[color:var(--studio-line)] bg-[rgb(15_16_22_/_0.98)] px-4 py-5 shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl">
            <div className="flex h-full flex-col">
              <div className="space-y-2">
                {drawerPrimaryNav.map((item) => (
                  <DrawerNavItem
                    key={item.key}
                    item={item}
                    active={item.key === 'home'}
                    onNavigate={() => setDrawerOpen(false)}
                  />
                ))}
              </div>

              <div className="mt-5 text-sm font-medium text-[var(--studio-muted)]">
                Creation
              </div>
              <div className="mt-2 space-y-2">
                {drawerCreationNav.map((item) => (
                  <DrawerNavItem
                    key={item.key}
                    item={item}
                    active={item.key === activeDrawerKey}
                    onNavigate={() => setDrawerOpen(false)}
                  />
                ))}
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
