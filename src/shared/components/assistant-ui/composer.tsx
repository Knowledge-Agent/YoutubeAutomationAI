'use client';

import { ComposerPrimitive, ThreadPrimitive } from '@assistant-ui/react';
import { ArrowUp, Paperclip, Square } from 'lucide-react';
import { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

export function AssistantWorkspaceComposer({
  placeholder = 'Describe what you want to create',
  toolbar,
  footer,
  className,
  initialValue,
}: {
  placeholder?: string;
  toolbar?: ReactNode;
  footer?: ReactNode;
  className?: string;
  initialValue?: string;
}) {
  return (
    <ComposerPrimitive.Root
      className={cn(
        'w-full rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(33,34,44,0.98),rgba(28,29,37,0.98))] px-4 py-3.5 shadow-[0_22px_48px_rgba(0,0,0,0.24)] transition focus-within:border-cyan-300/18 focus-within:shadow-[0_24px_60px_rgba(34,211,238,0.16)]',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <ComposerPrimitive.AddAttachment asChild>
          <button
            type="button"
            className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-dashed border-white/12 bg-[#171821] text-zinc-500 transition hover:bg-[#1c1d26] hover:text-zinc-300"
          >
            <Paperclip className="size-5" />
          </button>
        </ComposerPrimitive.AddAttachment>
        <ComposerPrimitive.Input
          autoFocus
          className="min-h-[68px] w-full resize-none border-none bg-transparent px-0 py-1 text-[15px] leading-7 text-zinc-200 outline-none placeholder:text-zinc-500/80"
          defaultValue={initialValue}
          placeholder={placeholder}
          rows={3}
        />
      </div>

      {toolbar ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/6 pt-3">
          <div className="flex flex-1 flex-wrap gap-2">{toolbar}</div>
          <div className="flex items-center gap-3">
            {footer}
            <AssistantComposerAction />
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-end gap-3 border-t border-white/6 pt-3">
          {footer}
          <AssistantComposerAction />
        </div>
      )}
    </ComposerPrimitive.Root>
  );
}

function AssistantComposerAction() {
  return (
    <>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <button
            type="submit"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-zinc-950 shadow-lg shadow-black/20 transition hover:bg-zinc-100"
          >
            <ArrowUp className="size-4" />
          </button>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white transition hover:bg-white/8"
          >
            <Square className="size-3.5 fill-current" />
          </button>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  );
}
