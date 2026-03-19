'use client';

import { ReactNode, useState } from 'react';
import Image from 'next/image';
import {
  Bell,
  Bot,
  ChevronDown,
  Clapperboard,
  Coins,
  Compass,
  FolderOpen,
  Home,
  ImageIcon,
  Search,
  Sparkles,
  Star,
  WandSparkles,
} from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';

const topTabs = [
  {
    key: 'ai-video',
    title: 'AI Video',
    href: '/ai-video-generator',
    icon: Clapperboard,
    accent: 'from-violet-700 via-fuchsia-500 to-rose-500',
  },
  {
    key: 'ai-image',
    title: 'AI Image',
    href: '/ai-image-generator',
    icon: ImageIcon,
    accent: 'from-[#252532] to-[#22222d]',
  },
  {
    key: 'ai-agent',
    title: 'AI Agent',
    href: '#',
    icon: Bot,
    accent: 'from-[#252532] to-[#22222d]',
    badge: 'Beta',
    disabled: true,
  },
] as const;

const topTabStyles = {
  'ai-video': {
    surface:
      'from-[rgba(109,40,217,0.96)] via-[rgba(217,70,239,0.9)] to-[rgba(244,63,94,0.92)]',
    edge: 'from-violet-300/80 via-fuchsia-200/80 to-rose-200/80',
    glow: 'shadow-[0_22px_48px_rgba(217,70,239,0.22)]',
    panelGlow:
      'radial-gradient(circle_at_12%_0%,rgba(217,70,239,0.18),transparent_26%),radial-gradient(circle_at_30%_12%,rgba(244,63,94,0.09),transparent_24%)',
  },
  'ai-image': {
    surface:
      'from-[rgba(18,59,51,0.97)] via-[rgba(18,108,97,0.9)] to-[rgba(15,118,110,0.92)]',
    edge: 'from-emerald-200/80 via-teal-100/80 to-cyan-100/80',
    glow: 'shadow-[0_22px_48px_rgba(20,184,166,0.18)]',
    panelGlow:
      'radial-gradient(circle_at_12%_0%,rgba(16,185,129,0.16),transparent_26%),radial-gradient(circle_at_30%_12%,rgba(6,182,212,0.08),transparent_24%)',
  },
  'ai-agent': {
    surface:
      'from-[rgba(39,44,60,0.98)] via-[rgba(31,41,55,0.94)] to-[rgba(30,41,59,0.96)]',
    edge: 'from-slate-200/70 via-zinc-100/70 to-slate-200/70',
    glow: 'shadow-[0_22px_48px_rgba(30,41,59,0.28)]',
    panelGlow:
      'radial-gradient(circle_at_12%_0%,rgba(100,116,139,0.16),transparent_26%),radial-gradient(circle_at_30%_12%,rgba(71,85,105,0.08),transparent_24%)',
  },
} as const;

const primaryNav = [
  { key: 'hub', title: 'Home', href: '/tools', icon: Home },
  {
    key: 'explore',
    title: 'Explore',
    href: '#',
    icon: Compass,
    disabled: true,
  },
  {
    key: 'assets',
    title: 'Assets',
    href: '#',
    icon: FolderOpen,
    disabled: true,
  },
] as const;

const entertainmentNav = [
  {
    key: 'fun-effects',
    title: 'Fun Effects',
    href: '#',
    icon: Sparkles,
    disabled: true,
  },
  {
    key: 'photo-effects',
    title: 'Photo Effects',
    href: '#',
    icon: ImageIcon,
    disabled: true,
  },
] as const;

const creationNav = [
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
  {
    key: 'apps',
    title: 'Apps',
    href: '#',
    icon: WandSparkles,
    disabled: true,
  },
] as const;

function SidebarItem({
  active,
  title,
  href,
  disabled,
  badge,
  icon: Icon,
}: {
  active?: boolean;
  title: string;
  href: string;
  disabled?: boolean;
  badge?: string;
  icon: typeof Home;
}) {
  const content = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-medium tracking-tight transition',
        active
          ? 'bg-[#242532] text-pink-500'
          : disabled
            ? 'text-zinc-500'
            : 'text-zinc-300 hover:bg-[#1d1e28] hover:text-white'
      )}
    >
      <Icon className="size-4" />
      <span>{title}</span>
      {badge ? (
        <span className="rounded-full bg-[#ff5b6e] px-2 py-0.5 text-[10px] font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </div>
  );

  if (disabled) return <div>{content}</div>;
  return <Link href={href}>{content}</Link>;
}

export function ToolWorkspaceShell({
  activeKey,
  activeTab,
  workspaceMode = 'hub',
  eyebrow,
  title,
  description,
  chips,
  actions,
  children,
  contentCard = true,
  showIntroCard = true,
}: {
  activeKey: 'hub' | 'ai-video' | 'ai-image';
  activeTab: 'ai-video' | 'ai-image' | 'ai-agent';
  workspaceMode?: 'hub' | 'detail';
  eyebrow?: string;
  title: string;
  description: string;
  chips?: string[];
  actions?: string[];
  children: ReactNode;
  contentCard?: boolean;
  showIntroCard?: boolean;
}) {
  const [projectOpen, setProjectOpen] = useState(false);
  const isDetailMode = workspaceMode === 'detail';
  const useConnectedWorkspacePanel = !showIntroCard && !contentCard;
  const activeTabStyle = topTabStyles[activeTab];
  const headerControlClass =
    'flex h-9 items-center gap-2 rounded-2xl border border-white/10 bg-[#1b1d25] px-3.5 text-[13px] font-medium text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-white/14 hover:bg-[#22242d]';
  const headerIconButtonClass =
    'flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-[#1b1d25] text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-white/14 hover:bg-[#22242d] hover:text-white';

  return (
    <div
      className="dark min-h-screen bg-[#101117] text-white"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/6 bg-[#12131a]/96 backdrop-blur-xl">
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r opacity-80',
            activeTabStyle.edge
          )}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-white/0 via-white/8 to-white/0" />
        <div className="flex h-[62px] items-center justify-between px-4 lg:px-5">
          <Link href="/tools" className="flex items-center gap-3">
            <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-white/12 bg-[#192130] shadow-[0_12px_24px_rgba(0,0,0,0.3)]">
              <span
                className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-90',
                  activeTabStyle.surface
                )}
              />
              <span className="absolute inset-[1px] rounded-[15px] bg-[#10131d]/80" />
              <Image
                src="/logo-mark.svg"
                alt="YouTube Automation AI"
                width={16}
                height={16}
                className="relative z-10 h-4 w-4"
              />
            </span>
            <span className="text-[1.15rem] font-semibold tracking-[-0.04em] text-white lg:text-[1.3rem]">
              YouTube Automation AI
            </span>
          </Link>

          <div className="relative flex items-center gap-3">
            <button
              className={cn(headerControlClass, 'pr-4')}
              onClick={() => setProjectOpen((value) => !value)}
            >
              <span>Project 1</span>
              <ChevronDown className="size-4 text-zinc-400" />
            </button>
            {projectOpen ? (
              <div className="absolute top-12 left-0 z-50 w-[268px] rounded-[24px] border border-white/10 bg-[#181a22]/98 p-4 shadow-[0_24px_56px_rgba(0,0,0,0.46)] backdrop-blur-xl">
                <div className="text-xs font-medium tracking-[0.02em] text-zinc-500">
                  Project
                </div>
                <button className="mt-4 flex h-14 w-full items-center justify-center gap-2.5 rounded-[18px] border border-pink-500/25 bg-pink-500/12 text-base font-semibold text-pink-500 transition hover:bg-pink-500/15">
                  <span className="text-[28px] leading-none font-light">+</span>
                  <span>Project</span>
                </button>
                <div className="mt-6 space-y-3">
                  <div className="rounded-[18px] bg-[#242532] px-4 py-3.5 text-[18px] font-medium tracking-tight text-pink-500">
                    Project 1
                  </div>
                  <div className="px-2 text-[16px] leading-none tracking-tight text-zinc-500">
                    Default Project
                  </div>
                </div>
              </div>
            ) : null}

            <button
              className={cn(headerControlClass, 'hidden px-4 md:inline-flex')}
            >
              History
            </button>
            <button className="flex h-9 items-center gap-1.5 rounded-2xl border border-fuchsia-400/14 bg-[#1b1d25] px-3 text-[13px] font-medium text-fuchsia-300 shadow-[0_10px_24px_rgba(217,70,239,0.08)] transition hover:border-fuchsia-300/20 hover:bg-[#22242d]">
              <Coins className="size-3.5" />1 credit
            </button>
            <button aria-label="Search" className={headerIconButtonClass}>
              <Search className="size-4" />
            </button>
            <button
              aria-label="Notifications"
              className={headerIconButtonClass}
            >
              <Bell className="size-4" />
            </button>
            <button
              aria-label="AI assistant"
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8ed916] text-[12px] font-semibold text-[#132200] shadow-[0_14px_28px_rgba(142,217,22,0.28)] transition hover:brightness-105"
            >
              <span>AI</span>
            </button>
          </div>
        </div>
      </header>

      {isDetailMode ? (
        <div className="min-h-screen pt-[62px]">
          <main className="min-w-0 bg-[#15161d] [background-image:radial-gradient(circle_at_top_left,rgba(244,63,94,0.08),transparent_20%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.05),transparent_16%)] pt-3 pr-3 pb-0 pl-0 lg:pt-4 lg:pr-6 lg:pb-2">
            <div className="w-full">{children}</div>
          </main>
        </div>
      ) : (
        <div className="flex min-h-screen pt-[62px]">
          <aside className="hidden w-[176px] shrink-0 border-r border-white/6 bg-[#0d0e14] lg:block">
            <div className="flex h-full flex-col px-4 py-6">
              <button className="mb-7 flex h-14 items-center justify-center gap-3 rounded-2xl border border-pink-500/25 bg-pink-500/12 text-base font-semibold text-pink-500">
                <span className="text-3xl font-light">+</span>
                <span>Create New</span>
              </button>

              <div className="space-y-2">
                {primaryNav.map((item) => (
                  <SidebarItem
                    key={item.key}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                    disabled={'disabled' in item ? item.disabled : undefined}
                    active={item.key === activeKey}
                  />
                ))}
              </div>

              <div className="mt-5 text-sm font-medium text-zinc-500">
                Creation
              </div>
              <div className="mt-2 space-y-2">
                {creationNav.map((item) => (
                  <SidebarItem
                    key={item.key}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                    disabled={'disabled' in item ? item.disabled : undefined}
                    badge={
                      'badge' in item && typeof item.badge === 'string'
                        ? item.badge
                        : undefined
                    }
                    active={item.key === activeKey}
                  />
                ))}
              </div>

              <div className="mt-5 text-sm font-medium text-zinc-500">
                Entertainment
              </div>
              <div className="mt-2 space-y-2">
                {entertainmentNav.map((item) => (
                  <SidebarItem
                    key={item.key}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                    disabled={'disabled' in item ? item.disabled : undefined}
                  />
                ))}
              </div>

              <div className="mt-5 border-t border-white/6 pt-5 text-sm font-medium text-zinc-500">
                AI Tools
              </div>
              <div className="mt-3 space-y-2 text-sm text-zinc-500">
                <div className="rounded-2xl px-4 py-3">App</div>
                <div className="rounded-2xl px-4 py-3">API</div>
              </div>

              <div className="mt-auto pt-6">
                <button className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 text-base font-semibold text-white shadow-lg shadow-pink-500/20">
                  Upgrade Now
                </button>
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1 bg-[#15161d] [background-image:radial-gradient(circle_at_top_left,rgba(244,63,94,0.08),transparent_20%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.05),transparent_16%)] p-4 lg:p-6">
            <div className="mx-auto max-w-[1680px] space-y-0">
              <div
                className={cn(
                  'flex flex-wrap items-end justify-between gap-3',
                  useConnectedWorkspacePanel && 'relative z-10 -mb-px'
                )}
              >
                <div
                  className={cn(
                    'flex items-center',
                    useConnectedWorkspacePanel
                      ? 'max-w-full min-w-0 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                      : 'flex-wrap'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center',
                      useConnectedWorkspacePanel
                        ? 'min-w-max -space-x-7'
                        : 'flex-wrap gap-2'
                    )}
                  >
                    {topTabs.map((tab, index) => {
                      const Icon = tab.icon;
                      const isActive = tab.key === activeTab;
                      const tabTheme = topTabStyles[tab.key];
                      const baseClasses = cn(
                        'group relative flex h-[76px] min-w-[220px] items-center gap-4 overflow-hidden border px-7 pr-8 text-left transition sm:min-w-[250px]',
                        useConnectedWorkspacePanel &&
                          'h-[86px] min-w-[250px] rounded-t-[30px] border-b-0 px-8 pr-10 shadow-none sm:min-w-[290px]',
                        isActive
                          ? cn(
                              'border-white/14 bg-[#242532] text-white',
                              tabTheme.glow
                            )
                          : 'border-white/8 bg-[#20202a] text-zinc-400 hover:bg-[#272732] hover:text-white'
                      );
                      const clipPath = useConnectedWorkspacePanel
                        ? index === 0
                          ? 'polygon(0 0, 84% 0, 100% 100%, 0 100%)'
                          : 'polygon(10% 0, 84% 0, 100% 100%, 0 100%)'
                        : index === 0
                          ? 'polygon(0 0, 84% 0, 100% 100%, 0 100%)'
                          : 'polygon(12% 0, 84% 0, 100% 100%, 0 100%)';
                      const tabStyle = {
                        clipPath,
                        zIndex: isActive
                          ? topTabs.length + 2
                          : topTabs.length - index,
                      };

                      const tabContent = (
                        <>
                          {isActive ? (
                            <>
                              <div
                                className={cn(
                                  'absolute inset-[1px] rounded-t-[30px] bg-gradient-to-r opacity-100',
                                  tabTheme.surface
                                )}
                              />
                              <div
                                className={cn(
                                  'absolute inset-x-6 top-0 h-px bg-gradient-to-r',
                                  tabTheme.edge
                                )}
                              />
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_26%)] opacity-70" />
                            </>
                          ) : null}
                          <span
                            className={cn(
                              'relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition',
                              useConnectedWorkspacePanel &&
                                'h-12 w-12 rounded-[16px]',
                              isActive
                                ? 'border-white/18 bg-white/10 text-white'
                                : 'text-zinc-300 group-hover:text-white'
                            )}
                          >
                            <Icon className="size-5" />
                          </span>
                          <span className="relative z-10 block text-[17px] font-semibold tracking-tight">
                            {tab.title}
                          </span>
                          {'badge' in tab && tab.badge ? (
                            <span className="relative z-10 rounded-[12px] bg-[#ff525c] px-3 py-1 text-[11px] font-semibold text-white">
                              {tab.badge}
                            </span>
                          ) : null}
                          {isActive ? (
                            <div className="absolute inset-x-7 bottom-0 h-[3px] rounded-full bg-white/20" />
                          ) : null}
                        </>
                      );

                      if ('disabled' in tab && tab.disabled) {
                        return (
                          <div
                            key={tab.key}
                            className={cn(baseClasses, 'opacity-95')}
                            style={tabStyle}
                          >
                            {tabContent}
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={tab.key}
                          href={tab.href}
                          className={baseClasses}
                          style={tabStyle}
                        >
                          {tabContent}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {actions && actions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {actions.map((action) => {
                      const Icon = action === 'Favorites' ? Star : FolderOpen;
                      return (
                        <button
                          key={action}
                          className="flex h-11 items-center gap-2.5 rounded-2xl border border-white/8 bg-[#161821] px-4 text-sm font-medium text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-white/12 hover:bg-white/[0.06] hover:text-white"
                        >
                          <Icon className="size-4" />
                          {action}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              {showIntroCard ? (
                <div className="rounded-[28px] border border-white/8 bg-[#1b1c25] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:p-6">
                  <div className="max-w-4xl">
                    {eyebrow ? (
                      <div className="text-primary font-mono text-[13px] font-medium tracking-tight">
                        {eyebrow}
                      </div>
                    ) : null}
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                      {title}
                    </h1>
                    <p className="mt-3 text-base leading-7 text-zinc-400 md:text-lg">
                      {description}
                    </p>
                    {chips && chips.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {chips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {contentCard ? (
                <div className="rounded-[28px] border border-white/8 bg-[#171821] p-3 md:p-4">
                  {children}
                </div>
              ) : useConnectedWorkspacePanel ? (
                isDetailMode ? (
                  <div className="relative overflow-hidden rounded-[30px] border border-white/8 bg-[#171821] px-4 pt-3 pb-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] md:px-5 md:pt-3 md:pb-5">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-100"
                      style={{ backgroundImage: activeTabStyle.panelGlow }}
                    />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/0 via-white/16 to-white/0" />
                    <div className="relative z-10">{children}</div>
                  </div>
                ) : (
                  <div className="relative z-10">{children}</div>
                )
              ) : (
                <div>{children}</div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
