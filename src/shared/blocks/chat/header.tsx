'use client';

import { LocaleSelector } from '@/shared/blocks/common';
import { Badge } from '@/shared/components/ui/badge';
import { useChatContext } from '@/shared/contexts/chat';

export function ChatHeader() {
  const { chat } = useChatContext();

  return (
    <header className="sticky top-0 z-10 border-b border-white/6 bg-[#12131a]/96 px-5 py-3 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-white">
            {chat?.title || 'New Chat'}
          </h1>
          {chat?.model ? (
            <div className="mt-1 flex items-center gap-2">
              <Badge className="border-none bg-cyan-400/12 text-[10px] text-cyan-300">
                APIMart
              </Badge>
              <span className="text-xs text-zinc-500">{chat.model}</span>
            </div>
          ) : null}
        </div>
        <LocaleSelector />
      </div>
    </header>
  );
}
