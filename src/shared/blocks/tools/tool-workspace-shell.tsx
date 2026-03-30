'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Bell,
  Check,
  ChevronDown,
  Clapperboard,
  Coins,
  FolderOpen,
  ImageIcon,
  LoaderCircle,
  LogOut,
  Menu,
  PencilLine,
  Plus,
  Search,
  Star,
  Trash2,
  X,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

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
import { Input } from '@/shared/components/ui/input';
import { useAppContext } from '@/shared/contexts/app';
import { AI_CREDITS_ENABLED } from '@/shared/lib/ai-credits';
import {
  clearStoredProjectSelection,
  getStoredProjectSelection,
  setStoredProjectSelection,
} from '@/shared/lib/project-selection';
import { cn } from '@/shared/lib/utils';
import { signOut } from '@/core/auth/client';

const topTabs = [
  {
    key: 'ai-video',
    title: 'AI Video',
    href: '/ai-video-generator',
    icon: Clapperboard,
    accent: 'from-[var(--brand-signal)] via-[#ff8b4d] to-[var(--video-accent)]',
  },
  {
    key: 'ai-image',
    title: 'AI Image',
    href: '/ai-image-generator',
    icon: ImageIcon,
    accent: 'from-[#233836] via-[#1a6f63] to-[var(--image-accent)]',
  },
] as const;

const topTabStyles = {
  'ai-video': {
    surface:
      'from-[rgba(255,122,26,0.98)] via-[rgba(255,139,77,0.94)] to-[rgba(255,94,122,0.92)]',
    edge: 'from-orange-200/90 via-orange-100/80 to-rose-200/70',
    glow: 'shadow-[0_22px_48px_rgba(255,122,26,0.2)]',
    panelGlow:
      'radial-gradient(circle_at_12%_0%,rgba(255,122,26,0.16),transparent_26%),radial-gradient(circle_at_30%_12%,rgba(255,94,122,0.09),transparent_24%)',
  },
  'ai-image': {
    surface:
      'from-[rgba(35,56,53,0.98)] via-[rgba(26,112,97,0.94)] to-[rgba(30,184,166,0.92)]',
    edge: 'from-orange-200/55 via-emerald-100/80 to-cyan-100/80',
    glow: 'shadow-[0_22px_48px_rgba(20,184,166,0.18)]',
    panelGlow:
      'radial-gradient(circle_at_12%_0%,rgba(255,122,26,0.08),transparent_22%),radial-gradient(circle_at_30%_12%,rgba(30,184,166,0.12),transparent_24%)',
  },
} as const;

const workspaceDefaultHref = topTabs[0].href;

const workspaceNavItems = [
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
] as const;

interface WorkspaceProject {
  id: string;
  title: string;
}

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
  icon: LucideIcon;
}) {
  const content = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-medium tracking-tight transition',
        active
          ? 'bg-[var(--studio-panel-strong)] text-[var(--brand-signal)]'
          : disabled
            ? 'text-[var(--studio-muted)]/60'
            : 'text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] hover:text-[var(--studio-ink)]'
      )}
    >
      <Icon className="size-4" />
      <span>{title}</span>
      {badge ? (
        <span className="rounded-full bg-[var(--brand-signal)] px-2 py-0.5 text-[10px] font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </div>
  );

  if (disabled) return <div>{content}</div>;
  return <Link href={href}>{content}</Link>;
}

function CompactRailItem({
  active,
  title,
  href,
  disabled,
  icon: Icon,
}: {
  active?: boolean;
  title: string;
  href: string;
  disabled?: boolean;
  icon: LucideIcon;
}) {
  const content = (
    <div
      className={cn(
        'group relative flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-[20px] px-2 py-3 text-center text-[11px] font-medium tracking-tight transition',
        active
          ? 'bg-[var(--studio-panel-strong)] text-[var(--brand-signal)] shadow-[0_16px_30px_rgba(0,0,0,0.28)]'
          : disabled
            ? 'text-[var(--studio-muted)]/50'
            : 'text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] hover:text-[var(--studio-ink)]'
      )}
    >
      {active ? (
        <span className="absolute top-3 bottom-3 left-0 w-[2px] rounded-r-full bg-[var(--brand-signal)]" />
      ) : null}
      <span
        className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--studio-line)] bg-black/18 transition',
          active && 'border-white/10 bg-white/8'
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="max-w-[56px] leading-3.5">{title}</span>
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
  chromeStyle = 'default',
}: {
  activeKey: 'ai-video' | 'ai-image';
  activeTab: 'ai-video' | 'ai-image';
  workspaceMode?: 'hub' | 'detail';
  eyebrow?: string;
  title: string;
  description: string;
  chips?: string[];
  actions?: string[];
  children: ReactNode;
  contentCard?: boolean;
  showIntroCard?: boolean;
  chromeStyle?: 'default' | 'studio';
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setIsShowSignModal } = useAppContext();
  const [projectOpen, setProjectOpen] = useState(false);
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState('');
  const [activeProjectTitle, setActiveProjectTitle] = useState('Project');
  const [renameProjectId, setRenameProjectId] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  const [savingProjectId, setSavingProjectId] = useState('');
  const [deletingProjectId, setDeletingProjectId] = useState('');
  const projectMenuRef = useRef<HTMLDivElement | null>(null);
  const isDetailMode = workspaceMode === 'detail';
  const isStudioChrome = chromeStyle === 'studio';
  const useConnectedWorkspacePanel = !showIntroCard && !contentCard;
  const activeTabStyle = topTabStyles[activeTab];
  const headerControlClass = isStudioChrome
    ? 'flex h-[58px] items-center gap-3 rounded-[18px] border border-[color:var(--studio-line)] bg-[var(--studio-panel)] px-5 text-[18px] font-medium text-[var(--studio-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-white/14 hover:bg-[var(--studio-hover)]'
    : 'flex h-9 items-center gap-2 rounded-2xl border border-[color:var(--studio-line)] bg-[var(--studio-panel)] px-3.5 text-[13px] font-medium text-[var(--studio-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-white/14 hover:bg-[var(--studio-hover)]';
  const headerIconButtonClass = isStudioChrome
    ? 'flex h-10 w-10 items-center justify-center rounded-[18px] border border-[color:var(--studio-line)] bg-[var(--studio-panel)] text-[var(--studio-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:border-white/14 hover:bg-[var(--studio-hover)]'
    : 'flex h-9 w-9 items-center justify-center rounded-2xl border border-[color:var(--studio-line)] bg-[var(--studio-panel)] text-[var(--studio-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-white/14 hover:bg-[var(--studio-hover)]';
  const compactRailItems = workspaceNavItems;

  const syncProjectSelection = useCallback(
    (project: WorkspaceProject | null) => {
      if (!project) {
        setActiveProjectId('');
        setActiveProjectTitle('Project');
        clearStoredProjectSelection();
        return;
      }

      setActiveProjectId(project.id);
      setActiveProjectTitle(project.title);
      setStoredProjectSelection(project);
    },
    []
  );

  const loadProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      syncProjectSelection(null);
      return;
    }

    try {
      setLoadingProjects(true);
      const resp = await fetch('/api/project/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await resp.json();

      if (!resp.ok || json.code !== 0) {
        throw new Error(json.message || 'failed to load projects');
      }

      const nextProjects: WorkspaceProject[] = Array.isArray(json.data)
        ? json.data.map((item: any) => ({
            id: item.id,
            title: item.title || 'Untitled Project',
          }))
        : [];

      setProjects(nextProjects);

      const storedProject = getStoredProjectSelection();
      const currentProject =
        nextProjects.find((item) => item.id === activeProjectId) ||
        nextProjects.find((item) => item.id === storedProject?.id) ||
        nextProjects[0] ||
        null;

      syncProjectSelection(currentProject);
    } catch (error: any) {
      console.error('load workspace projects failed:', error);
      toast.error(error.message || 'failed to load projects');
    } finally {
      setLoadingProjects(false);
    }
  }, [activeProjectId, syncProjectSelection, user]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (!projectOpen) {
      setRenameProjectId('');
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!projectMenuRef.current) {
        return;
      }

      if (projectMenuRef.current.contains(event.target as Node)) {
        return;
      }

      setProjectOpen(false);
      setRenameProjectId('');
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [projectOpen]);

  const requireProjectAccess = useCallback(() => {
    if (user) {
      return true;
    }

    setIsShowSignModal(true);
    return false;
  }, [setIsShowSignModal, user]);

  const handleCreateProject = async () => {
    if (!requireProjectAccess()) {
      return;
    }

    try {
      setCreatingProject(true);
      const resp = await fetch('/api/project/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '',
        }),
      });
      const json = await resp.json();

      if (!resp.ok || json.code !== 0) {
        throw new Error(json.message || 'failed to create project');
      }

      const nextProject = {
        id: json.data.id,
        title: json.data.title || 'Untitled Project',
      };

      setProjects((current) => [nextProject, ...current]);
      syncProjectSelection(nextProject);
      setProjectOpen(true);
      setRenameProjectId('');
    } catch (error: any) {
      toast.error(error.message || 'failed to create project');
    } finally {
      setCreatingProject(false);
    }
  };

  const handleSelectProject = (project: WorkspaceProject) => {
    syncProjectSelection(project);
    setRenameProjectId('');
    setProjectOpen(false);
  };

  const handleStartRename = (project: WorkspaceProject) => {
    setRenameProjectId(project.id);
    setDraftTitle(project.title);
  };

  const handleRenameProject = async (projectId: string) => {
    const nextTitle = draftTitle.trim();
    if (!nextTitle) {
      toast.error('Project title is required.');
      return;
    }

    try {
      setSavingProjectId(projectId);
      const resp = await fetch('/api/project/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          title: nextTitle,
        }),
      });
      const json = await resp.json();

      if (!resp.ok || json.code !== 0) {
        throw new Error(json.message || 'failed to update project');
      }

      const nextProjects = projects.map((item) =>
        item.id === projectId ? { ...item, title: nextTitle } : item
      );
      setProjects(nextProjects);

      if (activeProjectId === projectId) {
        syncProjectSelection({
          id: projectId,
          title: nextTitle,
        });
      }

      setRenameProjectId('');
    } catch (error: any) {
      toast.error(error.message || 'failed to update project');
    } finally {
      setSavingProjectId('');
    }
  };

  const handleDeleteProject = async (project: WorkspaceProject) => {
    if (!window.confirm(`Delete "${project.title}"?`)) {
      return;
    }

    try {
      setDeletingProjectId(project.id);
      const resp = await fetch('/api/project/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
          createFallback: activeProjectId === project.id,
        }),
      });
      const json = await resp.json();

      if (!resp.ok || json.code !== 0) {
        throw new Error(json.message || 'failed to delete project');
      }

      const nextProjects = projects.filter((item) => item.id !== project.id);
      const fallbackProject = json.data?.nextProject
        ? {
            id: json.data.nextProject.id,
            title: json.data.nextProject.title || 'Untitled Project',
          }
        : null;

      const mergedProjects =
        fallbackProject &&
        !nextProjects.some((item) => item.id === fallbackProject.id)
          ? [fallbackProject, ...nextProjects]
          : nextProjects;

      setProjects(mergedProjects);

      if (activeProjectId === project.id) {
        syncProjectSelection(
          fallbackProject ||
            mergedProjects.find((item) => item.id !== project.id) ||
            null
        );
      }

      if (renameProjectId === project.id) {
        setRenameProjectId('');
      }
    } catch (error: any) {
      toast.error(error.message || 'failed to delete project');
    } finally {
      setDeletingProjectId('');
    }
  };

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
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r opacity-80',
            activeTabStyle.edge
          )}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-white/0 via-white/8 to-white/0" />
        <div className="flex h-[62px] items-center justify-between px-4 lg:px-5">
          <div className="flex items-center gap-3">
            {isStudioChrome ? (
              <button
                aria-label="Open navigation"
                className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[color:var(--studio-line)] bg-[var(--studio-panel)] text-[var(--studio-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-white/14 hover:bg-[var(--studio-hover)]"
              >
                <Menu className="size-4.5" />
              </button>
            ) : null}
            <Link
              href={workspaceDefaultHref}
              className="flex items-center gap-3"
            >
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

      {isDetailMode ? (
        <div className="min-h-screen pt-[62px]">
          <main
            className={cn(
              'min-w-0 bg-[#15161d] [background-image:radial-gradient(circle_at_top_left,rgba(255,122,26,0.08),transparent_20%),radial-gradient(circle_at_top_right,rgba(30,184,166,0.05),transparent_16%)]',
              isStudioChrome
                ? 'px-4 pt-4 pb-4 lg:px-5 lg:pt-5'
                : 'pt-3 pr-3 pb-0 pl-0 lg:pt-4 lg:pr-6 lg:pb-2'
            )}
          >
            <div
              className={cn(
                'w-full',
                isStudioChrome && 'mx-auto max-w-[1560px]'
              )}
            >
              {children}
            </div>
          </main>
        </div>
      ) : (
        <div className="flex min-h-screen pt-[62px]">
          <aside
            className={cn(
              'hidden shrink-0 border-r border-white/6 lg:block',
              isStudioChrome
                ? 'w-[94px] bg-[#0c0d12]'
                : 'w-[176px] bg-[#0d0e14]'
            )}
          >
            {isStudioChrome ? (
              <div className="flex h-full flex-col items-center px-2.5 py-4">
                <div className="flex w-full flex-col gap-1.5">
                  {compactRailItems.map((item) => (
                    <CompactRailItem
                      key={item.key}
                      title={item.title}
                      href={item.href}
                      icon={item.icon}
                      active={item.key === activeKey}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col px-4 py-6">
                <div className="text-sm font-medium text-[var(--studio-muted)]">
                  AI Generators
                </div>
                <div className="mt-2 space-y-2">
                  {workspaceNavItems.map((item) => (
                    <SidebarItem
                      key={item.key}
                      title={item.title}
                      href={item.href}
                      icon={item.icon}
                      active={item.key === activeKey}
                    />
                  ))}
                </div>
              </div>
            )}
          </aside>

          <main
            className={cn(
              'min-w-0 flex-1 bg-[#15161d] [background-image:radial-gradient(circle_at_top_left,rgba(255,122,26,0.08),transparent_20%),radial-gradient(circle_at_top_right,rgba(30,184,166,0.05),transparent_16%)]',
              isStudioChrome ? 'p-4 lg:p-5' : 'p-4 lg:p-6'
            )}
          >
            <div
              className={cn(
                'mx-auto space-y-0',
                isStudioChrome ? 'max-w-[1560px]' : 'max-w-[1680px]'
              )}
            >
              {isStudioChrome ? (
                <div>{children}</div>
              ) : (
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
                                'border-white/14 bg-[var(--studio-panel-strong)] text-white',
                                tabTheme.glow
                              )
                            : 'border-[color:var(--studio-line)] bg-[var(--studio-panel)] text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] hover:text-[var(--studio-ink)]'
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
                                  : 'text-[var(--studio-muted)] group-hover:text-[var(--studio-ink)]'
                              )}
                            >
                              <Icon className="size-5" />
                            </span>
                            <span className="relative z-10 block text-[17px] font-semibold tracking-tight">
                              {tab.title}
                            </span>
                            {isActive && !useConnectedWorkspacePanel ? (
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
                </div>
              )}

              {!isStudioChrome ? (
                <>
                  {showIntroCard ? (
                    <div className="rounded-[28px] border border-[color:var(--studio-line)] bg-[rgb(27_28_37_/_0.96)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:p-6">
                      <div className="max-w-4xl">
                        {eyebrow ? (
                          <div className="text-primary font-mono text-[13px] font-medium tracking-tight">
                            {eyebrow}
                          </div>
                        ) : null}
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--studio-ink)] md:text-4xl">
                          {title}
                        </h1>
                        <p className="mt-3 text-base leading-7 text-[var(--studio-muted)] md:text-lg">
                          {description}
                        </p>
                        {chips && chips.length > 0 ? (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {chips.map((chip) => (
                              <span
                                key={chip}
                                className="rounded-full border border-[color:var(--studio-line)] bg-white/5 px-3 py-1.5 text-xs font-medium text-[var(--studio-muted)]"
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
                    <div className="rounded-[28px] border border-[color:var(--studio-line)] bg-[var(--studio-panel)] p-3 md:p-4">
                      {children}
                    </div>
                  ) : useConnectedWorkspacePanel ? (
                    isDetailMode ? (
                      <div className="relative overflow-hidden rounded-[30px] border border-[color:var(--studio-line)] bg-[var(--studio-panel)] px-4 pt-3 pb-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] md:px-5 md:pt-3 md:pb-5">
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
                </>
              ) : null}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
