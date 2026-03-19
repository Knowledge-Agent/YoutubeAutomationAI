'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Clock3,
  MessageSquarePlus,
  Search,
  Sparkles,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link, useRouter } from '@/core/i18n/navigation';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useAppContext } from '@/shared/contexts/app';
import { useChatContext } from '@/shared/contexts/chat';
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
    <aside className="hidden w-[296px] shrink-0 border-r border-white/6 bg-[#0d0e14] lg:flex lg:flex-col">
      <div className="border-b border-white/6 px-5 py-4">
        <Link href="/tools" className="flex items-center gap-3">
          <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/12 bg-[#192130] shadow-[0_12px_24px_rgba(0,0,0,0.3)]">
            <span className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-rose-500 opacity-90" />
            <span className="absolute inset-[1px] rounded-[15px] bg-[#10131d]/80" />
            <Sparkles className="relative z-10 size-4 text-white" />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[1.05rem] font-semibold tracking-[-0.04em] text-white">
              YouTube Automation AI
            </div>
            <div className="text-xs text-zinc-500">Chat</div>
          </div>
        </Link>
      </div>

      <div className="px-5 pt-5">
        <Button
          className="h-12 w-full justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-sm font-semibold text-cyan-300 hover:bg-cyan-400/14"
          onClick={() => router.push('/chat')}
          type="button"
          variant="ghost"
        >
          <MessageSquarePlus className="size-4" />
          New Chat
        </Button>
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-zinc-500">
          <Search className="size-4" />
          <span className="text-sm">Search threads</span>
        </div>
      </div>

      <div className="px-5 pt-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
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
                    ? 'border-white/12 bg-[#20222d] text-white shadow-[0_12px_24px_rgba(0,0,0,0.16)]'
                    : 'border-transparent bg-transparent text-zinc-400 hover:border-white/8 hover:bg-white/5 hover:text-white'
                )}
                onClick={() => router.push(`/chat/${item.id}`)}
                type="button"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {item.title}
                  </div>
                  {item.subtitle ? (
                    <div className="mt-1 truncate text-xs text-zinc-500">
                      {item.subtitle}
                    </div>
                  ) : null}
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-white/8 bg-white/5 px-4 py-6 text-sm text-zinc-500">
              {user ? 'No chats yet.' : 'Sign in to see your chat history.'}
            </div>
          )}

          {hasMore ? (
            <Link
              className="block rounded-[22px] border border-white/8 bg-white/5 px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/8 hover:text-white"
              href="/chat/history"
            >
              View more
            </Link>
          ) : null}
        </div>
      </div>

      <div className="border-t border-white/6 p-5">
        {user ? (
          <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
            <div className="truncate text-sm font-medium text-white">
              {user.name || user.email}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
              <Badge className="border-none bg-fuchsia-400/12 text-[10px] text-fuchsia-300">
                {user.credits?.remainingCredits ?? 0} credits
              </Badge>
            </div>
          </div>
        ) : (
          <Button
            className="h-12 w-full rounded-2xl bg-rose-500 text-sm font-semibold text-white hover:bg-rose-500/90"
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
