'use client';

import {
  AssistantRuntimeProvider,
  ThreadPrimitive,
  type AssistantRuntime,
  type AssistantToolUI,
} from '@assistant-ui/react';
import { ArrowDown } from 'lucide-react';
import { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { AssistantWorkspaceComposer } from './composer';
import { AssistantSuggestion } from './types';
import { AssistantThreadMessages } from './messages';

function AssistantThreadWelcome({
  title = 'Start with a prompt',
  description = 'Your conversation, generation progress, and results will appear here.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <ThreadPrimitive.Empty>
      <div className="mx-auto flex min-h-[320px] w-full max-w-[1120px] items-center justify-center px-4 py-12">
        <div className="max-w-[440px] text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/12 text-cyan-300">
            <ArrowDown className="size-7 rotate-180" />
          </div>
          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-zinc-500">{description}</p>
        </div>
      </div>
    </ThreadPrimitive.Empty>
  );
}

function AssistantScrollToBottom() {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <button
        type="button"
        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-[#171821] text-zinc-300 shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition hover:bg-[#1e2028] hover:text-white"
      >
        <ArrowDown className="size-4" />
      </button>
    </ThreadPrimitive.ScrollToBottom>
  );
}

function AssistantFollowUpSuggestions({
  suggestions,
}: {
  suggestions?: AssistantSuggestion[];
}) {
  if (!suggestions?.length) {
    return null;
  }

  return (
    <ThreadPrimitive.If empty={false} running={false}>
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap gap-2 px-4 pb-4">
        {suggestions.map((suggestion) => (
          <ThreadPrimitive.Suggestion
            key={suggestion.id ?? suggestion.prompt}
            autoSend
            className="rounded-full border border-white/8 bg-[#22232e] px-4 py-2 text-sm text-zinc-300 transition hover:bg-[#2a2b36] hover:text-white"
            method="replace"
            prompt={suggestion.prompt}
          >
            {suggestion.label}
          </ThreadPrimitive.Suggestion>
        ))}
      </div>
    </ThreadPrimitive.If>
  );
}

export function AssistantWorkspaceThread({
  runtime,
  toolUIs,
  suggestions,
  composerToolbar,
  composerFooter,
  composerPlaceholder,
  className,
  viewportClassName,
  emptyTitle,
  emptyDescription,
  footerSlot,
  initialComposerValue,
}: {
  runtime: AssistantRuntime;
  toolUIs?: AssistantToolUI[];
  suggestions?: AssistantSuggestion[];
  composerToolbar?: ReactNode;
  composerFooter?: ReactNode;
  composerPlaceholder?: string;
  className?: string;
  viewportClassName?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  footerSlot?: ReactNode;
  initialComposerValue?: string;
}) {
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ThreadPrimitive.Root
        className={cn('flex h-full min-h-0 flex-col bg-transparent', className)}
      >
        <ThreadPrimitive.Viewport
          className={cn('flex min-h-0 flex-1 flex-col', viewportClassName)}
        >
          <AssistantThreadWelcome
            title={emptyTitle}
            description={emptyDescription}
          />
          <AssistantThreadMessages toolUIs={toolUIs} />
          <AssistantFollowUpSuggestions suggestions={suggestions} />
          <div className="sticky bottom-0 mt-auto bg-gradient-to-t from-[#15161d] via-[#15161d] to-transparent px-4 pb-5 pt-6">
            <div className="mx-auto flex w-full max-w-[1120px] justify-end pb-3">
              <AssistantScrollToBottom />
            </div>
            <div className="mx-auto w-full max-w-[1120px]">
              <AssistantWorkspaceComposer
                footer={composerFooter}
                initialValue={initialComposerValue}
                placeholder={composerPlaceholder}
                toolbar={composerToolbar}
              />
              {footerSlot ? <div className="mt-3">{footerSlot}</div> : null}
            </div>
          </div>
        </ThreadPrimitive.Viewport>
      </ThreadPrimitive.Root>
    </AssistantRuntimeProvider>
  );
}
