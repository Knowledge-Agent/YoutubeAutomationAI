'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import {
  ChevronDown,
  Clapperboard,
  Coins,
  ImageIcon,
  LogOut,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

import { signOut } from '@/core/auth/client';
import { Link, usePathname, useRouter } from '@/core/i18n/navigation';
import { SignModal } from '@/shared/blocks/sign/sign-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useAppContext } from '@/shared/contexts/app';
import { AI_CREDITS_ENABLED } from '@/shared/lib/ai-credits';
import { cn } from '@/shared/lib/utils';

type ToolWorkspaceKey = 'tools' | 'ai-video' | 'ai-image';

type ToolWorkspaceShellProps = {
  activeKey: ToolWorkspaceKey;
  title: string;
  description: string;
  children: ReactNode;
  activeTab?: ToolWorkspaceKey;
  workspaceMode?: 'hub' | 'detail';
  eyebrow?: string;
  chips?: string[];
  actions?: string[];
  contentCard?: boolean;
  showIntroCard?: boolean;
  chromeStyle?: 'default' | 'studio';
};

const workspaceHomeHref = '/tools';

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
}: {
  active?: boolean;
  title: string;
  href: string;
  icon: LucideIcon;
}) {
  return (
    <Link href={href}>
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

export function ToolWorkspaceShell({
  activeKey,
  title,
  description,
  children,
}: ToolWorkspaceShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setIsShowSignModal } = useAppContext();
  const headerControlClass =
    'flex h-9 items-center gap-2 rounded-2xl border border-[color:var(--studio-line)] bg-[var(--studio-panel)] px-3.5 text-[13px] font-medium text-[var(--studio-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-white/14 hover:bg-[var(--studio-hover)]';

  return (
    <div
      className="dark min-h-screen bg-[var(--studio-bg)] text-white"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <SignModal callbackUrl={pathname || '/'} />
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[color:var(--studio-line)] bg-[rgb(18_19_26_/_0.96)] backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[var(--brand-signal)] via-[#ff8b4d] to-[var(--image-accent)] opacity-80" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-white/0 via-white/8 to-white/0" />
        <div className="flex h-[62px] items-center justify-between px-4 lg:px-5">
          <div className="flex items-center gap-3">
            <Link href={workspaceHomeHref} className="flex items-center gap-3">
              <Image
                src="/logo-mark.svg"
                alt="YouTube Automation AI"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="text-[1.15rem] font-semibold tracking-[-0.04em] text-[var(--studio-ink)] lg:text-[1.3rem]">
                YouTube Automation AI
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      headerControlClass,
                      'hidden max-w-[240px] px-4 md:inline-flex'
                    )}
                  >
                    <span className="truncate">{user.name || user.email}</span>
                    <ChevronDown className="size-4 text-[var(--studio-muted)]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-60 border-[color:var(--studio-line)] bg-[rgb(23_25_32_/_0.98)] text-[var(--studio-ink)] shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl"
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="truncate text-sm font-semibold text-[var(--studio-ink)]">
                      {user.name || 'User'}
                    </div>
                    <div className="truncate text-xs font-normal text-[var(--studio-muted)]">
                      {user.email}
                    </div>
                  </DropdownMenuLabel>
                  {AI_CREDITS_ENABLED ? (
                    <>
                      <DropdownMenuSeparator className="bg-[color:var(--studio-line)]" />
                      <DropdownMenuItem className="px-3 py-2 text-[var(--studio-ink)] focus:bg-[var(--studio-hover)] focus:text-[var(--studio-ink)]">
                        <Coins className="size-4 text-[var(--brand-signal)]" />
                        <span>
                          Credits: {user.credits?.remainingCredits ?? 0}
                        </span>
                      </DropdownMenuItem>
                    </>
                  ) : null}
                  <DropdownMenuSeparator className="bg-[color:var(--studio-line)]" />
                  <DropdownMenuItem
                    className="px-3 py-2 text-[var(--studio-ink)] focus:bg-[var(--studio-hover)] focus:text-[var(--studio-ink)]"
                    onClick={() =>
                      signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            router.refresh();
                          },
                        },
                      })
                    }
                  >
                    <LogOut className="size-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                type="button"
                className={cn(
                  headerControlClass,
                  'px-4 text-sm font-semibold text-white'
                )}
                onClick={() => setIsShowSignModal(true)}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex min-h-screen pt-[62px]">
        <aside className="hidden w-[244px] shrink-0 border-r border-white/6 bg-[#0d0e14] lg:block">
          <div className="flex h-full flex-col px-4 py-6">
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
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
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
    </div>
  );
}
