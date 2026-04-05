'use client';

import { type ReactNode } from 'react';

import { ChatHeader, type WorkspaceSection } from '@/shared/blocks/chat/header';

export function WorkspaceDetailShell({
  activeSection,
  children,
}: {
  activeSection: WorkspaceSection;
  children: ReactNode;
}) {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#111217]">
      <ChatHeader activeSection={activeSection} />
      <div className="min-h-0 flex-1 overflow-hidden px-3 py-2 lg:px-5 lg:py-3">
        <div className="mx-auto flex h-full min-h-0 max-w-[1180px] flex-col gap-2 lg:gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}
