'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Check,
  ChevronDown,
  Coins,
  FolderPlus,
  Home,
  ImageIcon,
  LoaderCircle,
  Menu,
  WandSparkles,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Link, useRouter } from '@/core/i18n/navigation';
import { LocaleSelector } from '@/shared/blocks/common';
import { Input } from '@/shared/components/ui/input';
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
  const router = useRouter();
  const { chat, setChat } = useChatContext();
  const headerMetadata = safeParseHeaderMetadata(chat?.metadata);
  const activeDrawerKey = getToolDrawerActiveKey(headerMetadata);
  const projectTitle = chat?.projectTitle?.trim() || 'Untitled Project';
  const [draftTitle, setDraftTitle] = useState(projectTitle);
  const [projects, setProjects] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renameProjectId, setRenameProjectId] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);
  const [savingProjectId, setSavingProjectId] = useState('');
  const [deletingProjectId, setDeletingProjectId] = useState('');
  const projectMenuRef = useRef<HTMLDivElement | null>(null);
  const activeProjectId = chat?.projectId || '';

  useEffect(() => {
    setDraftTitle(projectTitle);
  }, [projectTitle]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!projectMenuRef.current) {
        return;
      }

      if (projectMenuRef.current.contains(event.target as Node)) {
        return;
      }

      setMenuOpen(false);
      setRenameProjectId('');
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [menuOpen]);

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

  useEffect(() => {
    if (!chat?.id) {
      return;
    }

    let active = true;

    void (async () => {
      try {
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

        if (!active) {
          return;
        }

        setProjects(
          Array.isArray(json.data)
            ? json.data.map((item: any) => ({
                id: item.id,
                title: item.title || 'Untitled Project',
              }))
            : []
        );
      } catch (error) {
        console.error('load projects failed:', error);
      }
    })();

    return () => {
      active = false;
    };
  }, [chat?.id]);

  const handleRenameProject = async (projectId: string) => {
    if (!projectId) {
      toast.error('Project is not ready yet.');
      return;
    }

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

      setChat(
        chat && projectId === chat.projectId
          ? {
              ...chat,
              projectTitle: nextTitle,
            }
          : chat
      );
      setProjects((current) =>
        current.map((item) =>
          item.id === projectId ? { ...item, title: nextTitle } : item
        )
      );
      setRenameProjectId('');
    } catch (error: any) {
      toast.error(error.message || 'failed to update project');
    } finally {
      setSavingProjectId('');
    }
  };

  const handleCreateProject = () => {
    void (async () => {
      try {
        setCreatingProject(true);
        const resp = await fetch('/api/project/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: chat?.id,
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
        if (chat) {
          setChat({
            ...chat,
            projectId: nextProject.id,
            projectTitle: nextProject.title,
          });
        }
        setDraftTitle(nextProject.title);
        setRenameProjectId('');
      } catch (error: any) {
        toast.error(error.message || 'failed to create project');
      } finally {
        setCreatingProject(false);
      }
    })();
  };

  const handleSelectProject = async (projectId: string, title: string) => {
    if (!chat?.id) {
      return;
    }

    try {
      const resp = await fetch('/api/project/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: chat.id,
          projectId,
        }),
      });
      const json = await resp.json();

      if (!resp.ok || json.code !== 0) {
        throw new Error(json.message || 'failed to switch project');
      }

      const nextChatId =
        typeof json.data?.chat?.id === 'string' ? json.data.chat.id : chat.id;
      const nextProjectTitle =
        typeof json.data?.project?.title === 'string'
          ? json.data.project.title
          : title;
      const hasTargetChat =
        typeof json.data?.chat?.id === 'string' && json.data.chat.id.length > 0;

      setDraftTitle(nextProjectTitle);
      setRenameProjectId('');
      setMenuOpen(false);

      if (hasTargetChat && nextChatId !== chat.id) {
        router.push(`/chat/${nextChatId}`);
        return;
      }

      if (hasTargetChat) {
        setChat({
          ...chat,
          projectId,
          projectTitle: nextProjectTitle,
        });
        router.refresh();
        return;
      }

      toast.error('This project has no chat data yet.');
    } catch (error: any) {
      toast.error(error.message || 'failed to switch project');
    }
  };

  const handleDeleteProject = (projectId: string, title: string) => {
    void (async () => {
      if (!window.confirm(`Delete "${title}"?`)) {
        return;
      }

      try {
        setDeletingProjectId(projectId);
        const resp = await fetch('/api/project/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId,
            createFallback: projectId === activeProjectId,
          }),
        });
        const json = await resp.json();

        if (!resp.ok || json.code !== 0) {
          throw new Error(json.message || 'failed to delete project');
        }

        const fallbackProject = json.data?.nextProject
          ? {
              id: json.data.nextProject.id,
              title: json.data.nextProject.title || 'Untitled Project',
            }
          : null;

        setProjects((current) => {
          const nextProjects = current.filter((item) => item.id !== projectId);
          if (
            fallbackProject &&
            !nextProjects.some((item) => item.id === fallbackProject.id)
          ) {
            return [fallbackProject, ...nextProjects];
          }

          return nextProjects;
        });

        if (projectId === activeProjectId && fallbackProject) {
          await handleSelectProject(fallbackProject.id, fallbackProject.title);
          return;
        }

        if (renameProjectId === projectId) {
          setRenameProjectId('');
        }
      } catch (error: any) {
        toast.error(error.message || 'failed to delete project');
      } finally {
        setDeletingProjectId('');
      }
    })();
  };

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
              <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/12 bg-[#192130] shadow-[0_12px_24px_rgba(0,0,0,0.3)]">
                <span className="absolute inset-0 bg-gradient-to-br from-[var(--brand-signal)] via-[#ff8b4d] to-[var(--video-accent)] opacity-90" />
                <span className="absolute inset-[1px] rounded-[15px] bg-[#10131d]/80" />
                <Image
                  src="/logo-mark.svg"
                  alt="YouTube Automation AI"
                  width={18}
                  height={18}
                  className="relative z-10 h-[18px] w-[18px]"
                />
              </span>
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
              <button className="mb-6 flex h-12 items-center justify-center gap-3 rounded-2xl border border-[color:var(--brand-signal-soft)] bg-[color:var(--brand-signal-soft)] text-[15px] font-semibold text-[var(--brand-signal)] shadow-[0_14px_28px_rgba(229,106,17,0.12)]">
                <span className="text-[24px] leading-none font-light">+</span>
                <span>Create New</span>
              </button>

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

              <div className="mt-auto pt-6">
                <button className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--brand-signal)] text-base font-semibold text-white shadow-lg shadow-[rgba(229,106,17,0.2)]">
                  Upgrade Now
                </button>
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
