'use client';

import {
  ComposerPrimitive,
  ThreadPrimitive,
  useAui,
} from '@assistant-ui/react';
import { ArrowUp, Paperclip, Square } from 'lucide-react';
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  ReactNode,
  FormEventHandler,
  useEffect,
  useRef,
} from 'react';

import { cn } from '@/shared/lib/utils';

export function AssistantWorkspaceComposer({
  placeholder = 'Describe what you want to create',
  toolbar,
  footer,
  actionSlot,
  className,
  initialValue,
  inputKey,
  onValueChange,
  onSubmitIntent,
  submitDisabled = false,
  leading,
  showAttachmentButton = true,
  rootTestId,
  inputTestId,
  submitTestId,
}: {
  placeholder?: string;
  toolbar?: ReactNode;
  footer?: ReactNode;
  actionSlot?: ReactNode;
  className?: string;
  initialValue?: string;
  inputKey?: string | number;
  onValueChange?: (value: string) => void;
  onSubmitIntent?: () => boolean;
  submitDisabled?: boolean;
  leading?: ReactNode;
  showAttachmentButton?: boolean;
  rootTestId?: string;
  inputTestId?: string;
  submitTestId?: string;
}) {
  const aui = useAui();
  const lastInitializedRef = useRef<string | null>(null);

  useEffect(() => {
    const nextValue = initialValue ?? '';

    if (lastInitializedRef.current === nextValue) {
      return;
    }

    aui.composer().setText(nextValue);
    lastInitializedRef.current = nextValue;
  }, [aui, initialValue, inputKey]);

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (
      submitDisabled &&
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      return;
    }

    if (!onSubmitIntent) {
      return;
    }

    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    if (!onSubmitIntent()) {
      return;
    }

    event.preventDefault();
  };

  const handleSubmitCapture: FormEventHandler<HTMLFormElement> = (event) => {
    if (submitDisabled) {
      event.preventDefault();
      return;
    }

    if (!onSubmitIntent) {
      return;
    }

    if (!onSubmitIntent()) {
      return;
    }

    event.preventDefault();
  };

  return (
    <ComposerPrimitive.Root
      className={cn(
        'w-full rounded-[20px] border border-white/8 bg-[linear-gradient(180deg,rgba(33,34,44,0.98),rgba(28,29,37,0.98))] px-2.5 py-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition focus-within:border-cyan-300/18 focus-within:shadow-[0_22px_52px_rgba(34,211,238,0.14)]',
        className
      )}
      data-testid={rootTestId}
      onSubmitCapture={handleSubmitCapture}
    >
      <div className="flex items-start gap-2.5">
        {leading ? (
          leading
        ) : showAttachmentButton ? (
          <ComposerPrimitive.AddAttachment asChild>
            <button
              type="button"
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] border border-dashed border-white/12 bg-[#171821] text-zinc-500 transition hover:bg-[#1c1d26] hover:text-zinc-300"
            >
              <Paperclip className="size-3.5" />
            </button>
          </ComposerPrimitive.AddAttachment>
        ) : null}
        <ComposerPrimitive.Input
          autoFocus
          className="min-h-[42px] w-full resize-none border-none !bg-transparent px-0 py-1 text-[14px] leading-6 text-zinc-200 shadow-none outline-none placeholder:text-zinc-500/80 focus:bg-transparent focus-visible:bg-transparent"
          data-testid={inputTestId}
          key={inputKey}
          onChange={
            onValueChange
              ? ((event) =>
                  onValueChange(event.currentTarget.value)) as ChangeEventHandler<HTMLTextAreaElement>
              : undefined
          }
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
          style={{ backgroundColor: 'transparent' }}
        />
      </div>

      {toolbar ? (
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-1 flex-wrap gap-1.5">{toolbar}</div>
          <div className="flex items-center gap-2">
            {footer}
            {actionSlot ?? (
              <AssistantComposerAction
                disabled={submitDisabled}
                testId={submitTestId}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="mt-1.5 flex items-center justify-end gap-2 pt-1">
          {footer}
          {actionSlot ?? (
            <AssistantComposerAction
              disabled={submitDisabled}
              testId={submitTestId}
            />
          )}
        </div>
      )}
    </ComposerPrimitive.Root>
  );
}

function AssistantComposerAction({
  disabled = false,
  testId,
}: {
  disabled?: boolean;
  testId?: string;
}) {
  return (
    <>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <button
            type="submit"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-950 shadow-lg shadow-black/20 transition hover:bg-zinc-100 disabled:bg-white/5 disabled:text-zinc-500"
            data-testid={testId}
            disabled={disabled}
          >
            <ArrowUp className="size-3" />
          </button>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white transition hover:bg-white/8"
          >
            <Square className="size-2.5 fill-current" />
          </button>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  );
}
