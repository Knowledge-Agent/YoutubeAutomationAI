'use client';

import { ReactNode, useState } from 'react';
import {
  Clapperboard,
  ImageIcon,
  Menu,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { ToolWorkspaceChrome } from '@/shared/blocks/tools/tool-workspace-chrome';
import { cn } from '@/shared/lib/utils';

type ToolWorkspaceKey = 'tools' | 'ai-video' | 'ai-image';

type ToolWorkspaceShellProps = {
  activeKey: ToolWorkspaceKey;
  title: string;
  description: string;
  children: ReactNode;
};

const navigationSections = [
  {
    title: 'Base Capabilities',
    items: [
      {
        key: 'ai-video',
        title: 'AI Video',
        href: '/ai-video-generator',
        icon: Clapperboard,
      },
      {
        key: 'ai-image',
        title: 'AI Image',
        href: '/ai-image-generator',
        icon: ImageIcon,
      },
    ],
  },
  {
    title: 'Tools',
    items: [
      {
        key: 'tools',
        title: 'Tools',
        href: '/tools',
        icon: Sparkles,
      },
    ],
  },
] as const satisfies ReadonlyArray<{
  title: string;
  items: ReadonlyArray<{
    key: ToolWorkspaceKey;
    title: string;
    href: string;
    icon: LucideIcon;
  }>;
}>;

function SidebarItem({
  active,
  title,
  href,
  icon: Icon,
  onClick,
}: {
  active?: boolean;
  title: string;
  href: string;
  icon: LucideIcon;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-medium tracking-tight transition',
          active
            ? 'bg-[var(--studio-panel-strong)] text-[var(--brand-signal)]'
            : 'text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] hover:text-[var(--studio-ink)]'
        )}
      >
        <Icon className="size-4" />
        <span>{title}</span>
      </div>
    </Link>
  );
}

function NavigationSectionList({
  activeKey,
  onNavigate,
}: {
  activeKey: ToolWorkspaceKey;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-6">
      {navigationSections.map((section) => (
        <section key={section.title} className="space-y-2">
          <h2 className="px-3 text-sm font-medium text-[var(--studio-muted)]">
            {section.title}
          </h2>
          <div className="space-y-2">
            {section.items.map((item) => (
              <SidebarItem
                key={item.key}
                title={item.title}
                href={item.href}
                icon={item.icon}
                active={item.key === activeKey}
                onClick={onNavigate}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function ToolWorkspaceShell({
  activeKey,
  title,
  description,
  children,
}: ToolWorkspaceShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <ToolWorkspaceChrome
      headerLeading={
        <button
          type="button"
          aria-label="Open navigation"
          aria-expanded={isMobileNavOpen}
          aria-controls="workspace-mobile-navigation"
          className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[color:var(--studio-line)] bg-[var(--studio-panel)] text-[var(--studio-ink)] transition hover:border-white/14 hover:bg-[var(--studio-hover)] lg:hidden"
          onClick={() => setIsMobileNavOpen(true)}
        >
          <Menu className="size-4" />
        </button>
      }
    >
      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden">
          <div
            id="workspace-mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Workspace navigation"
            className="absolute inset-x-4 top-[78px] rounded-[28px] border border-[color:var(--studio-line)] bg-[rgb(23_25_32_/_0.98)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--studio-ink)]">
                Workspace navigation
              </h2>
              <button
                type="button"
                aria-label="Close navigation"
                className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[color:var(--studio-line)] bg-[var(--studio-panel)] text-[var(--studio-ink)] transition hover:border-white/14 hover:bg-[var(--studio-hover)]"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <X className="size-4" />
              </button>
            </div>
            <NavigationSectionList
              activeKey={activeKey}
              onNavigate={() => setIsMobileNavOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-screen pt-[62px]">
        <aside className="hidden w-[244px] shrink-0 border-r border-white/6 bg-[#0d0e14] lg:block">
          <div className="flex h-full flex-col px-4 py-6">
            <NavigationSectionList activeKey={activeKey} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-[#15161d] [background-image:radial-gradient(circle_at_top_left,rgba(255,122,26,0.08),transparent_20%),radial-gradient(circle_at_top_right,rgba(30,184,166,0.05),transparent_16%)] p-4 lg:p-6">
          <div className="mx-auto max-w-[1680px] space-y-6">
            <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[rgb(27_28_37_/_0.96)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:p-6">
              <div className="max-w-4xl">
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--studio-ink)] md:text-4xl">
                  {title}
                </h1>
                <p className="mt-3 text-base leading-7 text-[var(--studio-muted)] md:text-lg">
                  {description}
                </p>
              </div>
            </section>

            <div>{children}</div>
          </div>
        </main>
      </div>
    </ToolWorkspaceChrome>
  );
}
