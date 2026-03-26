'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Clock3, MessageSquarePlus, Search, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link, useRouter } from '@/core/i18n/navigation';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useAppContext } from '@/shared/contexts/app';
import { useChatContext } from '@/shared/contexts/chat';
import { AI_CREDITS_ENABLED } from '@/shared/lib/ai-credits';
import { cn } from '@/shared/lib/utils';

export function ChatLibrary() {
  const t = useTranslations('ai.chat.library');
  const params = useParams();
  const router = useRouter();
  const { user, setIsShowSignModal } = useAppContext();
  const { chats, setChats } = useChatContext();
  const [hasMore, setHasMore] = useState(false);

  const page = 1;
  const limit = 10;
  const activeChatId = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (!user) {
      setChats([]);
      setHasMore(false);
      return;
    }

    const fetchChats = async () => {
      try {
        const resp = await fetch('/api/chat/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ page, limit }),
        });
        if (!resp.ok) {
          throw new Error(`fetch chats failed with status: ${resp.status}`);
        }

        const { code, message, data } = await resp.json();
        if (code !== 0) {
          throw new Error(message);
        }

        setChats(data.list || []);
        setHasMore(Boolean(data.hasMore));
      } catch (e) {
        console.log('fetch chats failed:', e);
      }
    };

    fetchChats();
  }, [setChats, user]);

  const items = useMemo(
    () =>
      chats.slice(0, limit).map((chat) => ({
        id: chat.id,
        title: chat.title || 'Untitled chat',
        subtitle: chat.model || 'APIMart',
      })),
    [chats]
  );

  return (
    <aside className="hidden w-[296px] shrink-0 border-r border-[color:var(--studio-line)] bg-[#0d0e14] lg:flex lg:flex-col">
      <div className="border-b border-[color:var(--studio-line)] px-5 py-4">
        <Link href="/ai-video-generator" className="flex items-center gap-3">
          <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/12 bg-[#192130] shadow-[0_12px_24px_rgba(0,0,0,0.3)]">
            <span className="absolute inset-0 bg-gradient-to-br from-[var(--brand-signal)] via-[#ff8b4d] to-[var(--video-accent)] opacity-90" />
            <span className="absolute inset-[1px] rounded-[15px] bg-[#10131d]/80" />
            <Sparkles className="relative z-10 size-4 text-white" />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[1.05rem] font-semibold tracking-[-0.04em] text-[var(--studio-ink)]">
              YouTube Automation AI
            </div>
            <div className="text-xs text-[var(--studio-muted)]">Chat</div>
          </div>
        </Link>
      </div>

      <div className="px-5 pt-5">
        <Button
          className="h-12 w-full justify-center gap-2 rounded-2xl border border-[color:var(--brand-signal-soft)] bg-[color:var(--brand-signal-soft)] text-sm font-semibold text-[var(--brand-signal)] hover:bg-[#ff7a1a26]"
          onClick={() => router.push('/chat')}
          type="button"
          variant="ghost"
        >
          <MessageSquarePlus className="size-4" />
          New Chat
        </Button>
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--studio-line)] bg-white/5 px-4 py-3 text-[var(--studio-muted)]">
          <Search className="size-4" />
          <span className="text-sm">Search threads</span>
        </div>
      </div>

      <div className="px-5 pt-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--studio-muted)] transition hover:text-[var(--studio-ink)]"
          href="/chat/history"
        >
          <Clock3 className="size-4" />
          {t('title')}
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-2">
          {items.length > 0 ? (
            items.map((item) => (
              <button
                key={item.id}
                className={cn(
                  'w-full rounded-[22px] border px-4 py-3 text-left transition',
                  activeChatId === item.id
                    ? 'border-white/12 bg-[var(--studio-panel-strong)] text-[var(--studio-ink)] shadow-[0_12px_24px_rgba(0,0,0,0.16)]'
                    : 'border-transparent bg-transparent text-[var(--studio-muted)] hover:border-white/8 hover:bg-white/5 hover:text-[var(--studio-ink)]'
                )}
                onClick={() => router.push(`/chat/${item.id}`)}
                type="button"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {item.title}
                  </div>
                  {item.subtitle ? (
                    <div className="mt-1 truncate text-xs text-[var(--studio-muted)]">
                      {item.subtitle}
                    </div>
                  ) : null}
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-[color:var(--studio-line)] bg-white/5 px-4 py-6 text-sm text-[var(--studio-muted)]">
              {user ? 'No chats yet.' : 'Sign in to see your chat history.'}
            </div>
          )}

          {hasMore ? (
            <Link
              className="block rounded-[22px] border border-[color:var(--studio-line)] bg-white/5 px-4 py-3 text-sm text-[var(--studio-muted)] transition hover:bg-white/8 hover:text-[var(--studio-ink)]"
              href="/chat/history"
            >
              View more
            </Link>
          ) : null}
        </div>
      </div>

      <div className="border-t border-[color:var(--studio-line)] p-5">
        {user ? (
          <div className="rounded-2xl border border-[color:var(--studio-line)] bg-white/5 px-4 py-3">
            <div className="truncate text-sm font-medium text-[var(--studio-ink)]">
              {user.name || user.email}
            </div>
            {AI_CREDITS_ENABLED ? (
              <div className="mt-1 flex items-center gap-2 text-xs text-[var(--studio-muted)]">
                <Badge className="border-none bg-[color:var(--brand-signal-soft)] text-[10px] text-[var(--brand-signal)]">
                  {user.credits?.remainingCredits ?? 0} credits
                </Badge>
              </div>
            ) : null}
          </div>
        ) : (
          <Button
            className="h-12 w-full rounded-2xl bg-[var(--brand-signal)] text-sm font-semibold text-white hover:bg-[var(--brand-signal-strong)]"
            onClick={() => setIsShowSignModal(true)}
            type="button"
          >
            Sign In
          </Button>
        )}
      </div>
    </aside>
  );
}
