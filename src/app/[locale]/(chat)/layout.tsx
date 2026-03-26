'use client';

import { ReactNode } from 'react';

import { usePathname } from '@/core/i18n/navigation';
import { ChatLibrary } from '@/shared/blocks/chat/library';
import { LocaleDetector } from '@/shared/blocks/common';
import { ChatContextProvider } from '@/shared/contexts/chat';

export default function ChatLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isChatDetailRoute =
    pathname.startsWith('/chat/') && pathname !== '/chat/history';

  return (
    <ChatContextProvider>
      <div className="dark flex min-h-screen bg-[#101117] text-white">
        {!isChatDetailRoute ? <ChatLibrary /> : null}
        <main className="min-w-0 flex-1 bg-[#15161d] [background-image:radial-gradient(circle_at_top_left,rgba(34,211,238,0.06),transparent_18%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.05),transparent_18%)]">
          {children}
        </main>
        <LocaleDetector />
      </div>
    </ChatContextProvider>
  );
}
