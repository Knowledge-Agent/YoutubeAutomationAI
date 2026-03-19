'use client';

import {
  ActionBarPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  type AssistantToolUI,
} from '@assistant-ui/react';
import { Bot, Copy, RefreshCcw } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';

import {
  AssistantEmptyPart,
  AssistantReasoningPart,
  AssistantSourcePart,
  AssistantTextPart,
  useAssistantToolComponentMap,
} from './message-parts';

function AssistantActionBar() {
  return (
    <ActionBarPrimitive.Root
      autohide="not-last"
      className="mt-3 flex items-center gap-2"
      hideWhenRunning
    >
      <ActionBarPrimitive.Reload asChild>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-white/8 bg-white/5 px-3 text-[11px] font-medium text-zinc-200 transition hover:bg-white/8 hover:text-white"
        >
          <RefreshCcw className="size-3.5" />
          Retry
        </button>
      </ActionBarPrimitive.Reload>
      <ActionBarPrimitive.Copy asChild>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-white/8 bg-white/5 px-3 text-[11px] font-medium text-zinc-200 transition hover:bg-white/8 hover:text-white"
        >
          <MessagePrimitive.If copied>
            <span>Copied</span>
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <>
              <Copy className="size-3.5" />
              Copy
            </>
          </MessagePrimitive.If>
        </button>
      </ActionBarPrimitive.Copy>
    </ActionBarPrimitive.Root>
  );
}

export function AssistantUserMessage() {
  return (
    <MessagePrimitive.Root className="mb-5 flex justify-end">
      <div className="max-w-[80%] rounded-[26px] border border-white/8 bg-[#23242e] px-4 py-3 text-[15px] leading-7 text-white shadow-[0_16px_36px_rgba(0,0,0,0.18)]">
        <MessagePrimitive.Content
          components={{
            Empty: AssistantEmptyPart,
            Text: AssistantTextPart,
          }}
        />
      </div>
    </MessagePrimitive.Root>
  );
}

export function AssistantMessage({
  toolUIs,
}: {
  toolUIs?: AssistantToolUI[];
}) {
  const tools = useAssistantToolComponentMap(toolUIs);

  return (
    <MessagePrimitive.Root className="mb-6">
      <div className="flex items-start gap-3">
        <Avatar className="mt-1 h-9 w-9 border border-white/10 bg-[#181a22]">
          <AvatarFallback className="bg-transparent text-xs font-semibold text-cyan-300">
            <Bot className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="rounded-[30px] border border-white/8 bg-[#1b1c23] px-4 py-4 shadow-[0_20px_44px_rgba(0,0,0,0.2)]">
            <MessagePrimitive.Content
              components={{
                Empty: AssistantEmptyPart,
                Text: AssistantTextPart,
                Reasoning: AssistantReasoningPart,
                Source: AssistantSourcePart,
                tools,
              }}
            />
          </div>
          <AssistantActionBar />
        </div>
      </div>
    </MessagePrimitive.Root>
  );
}

export function AssistantThreadMessages({
  toolUIs,
  className,
}: {
  toolUIs?: AssistantToolUI[];
  className?: string;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-[1120px] px-4 py-6', className)}>
      <ThreadPrimitive.Messages
        components={{
          UserMessage: AssistantUserMessage,
          AssistantMessage: () => <AssistantMessage toolUIs={toolUIs} />,
        }}
      />
    </div>
  );
}
