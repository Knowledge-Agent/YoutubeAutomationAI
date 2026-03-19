'use client';

import type {
  AssistantToolUI,
  EmptyMessagePartProps,
  ReasoningMessagePartProps,
  SourceMessagePartProps,
  TextMessagePartProps,
  ToolCallMessagePartProps,
} from '@assistant-ui/react';
import { Link2, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Response } from '@/shared/components/ai-elements/response';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

export function AssistantEmptyPart({ status }: EmptyMessagePartProps) {
  if (status.type === 'running') {
    return <span className="text-sm text-zinc-500">Thinking...</span>;
  }

  return null;
}

export function AssistantTextPart({ text, status }: TextMessagePartProps) {
  return (
    <Response
      className={cn(
        'text-[15px] leading-7 text-zinc-100',
        status.type === 'running' && 'opacity-90'
      )}
    >
      {text}
    </Response>
  );
}

export function AssistantReasoningPart({
  text,
  status,
}: ReasoningMessagePartProps) {
  const [open, setOpen] = useState(status.type === 'running');

  return (
    <div className="mt-3 rounded-[20px] border border-white/8 bg-white/[0.03] p-3">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left text-sm font-medium text-zinc-300"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="inline-flex items-center gap-2">
          <Sparkles className="size-4 text-cyan-300" />
          Reasoning
        </span>
        <Badge
          variant="secondary"
          className="border border-white/8 bg-black/20 text-[10px] text-zinc-400"
        >
          {status.type === 'running' ? 'Streaming' : 'Complete'}
        </Badge>
      </button>
      {open ? (
        <div className="mt-3 border-t border-white/8 pt-3 text-sm leading-6 text-zinc-400">
          <Response className="text-sm leading-6 text-zinc-400">
            {text}
          </Response>
        </div>
      ) : null}
    </div>
  );
}

export function AssistantSourcePart({
  url,
  title,
}: SourceMessagePartProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-white/14 hover:bg-white/8 hover:text-white"
    >
      <Link2 className="size-3.5" />
      <span className="max-w-[240px] truncate">{title ?? url}</span>
    </a>
  );
}

export function AssistantToolFallback({
  toolName,
  argsText,
  result,
  status,
}: ToolCallMessagePartProps) {
  return (
    <div className="mt-3 rounded-[22px] border border-white/8 bg-[#14151b] p-4 text-sm text-zinc-300">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="border-none bg-cyan-400/12 text-cyan-300">
          Tool
        </Badge>
        <span className="font-medium text-white">{toolName}</span>
        <span className="text-zinc-500">{status.type}</span>
      </div>
      <pre className="mt-3 overflow-x-auto rounded-2xl bg-black/20 p-3 text-xs text-zinc-400">
        {argsText}
      </pre>
      {result !== undefined ? (
        <pre className="mt-3 overflow-x-auto rounded-2xl bg-black/20 p-3 text-xs text-zinc-400">
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}

export function useAssistantToolComponentMap(toolUIs?: AssistantToolUI[]) {
  return useMemo(
    () => ({
      by_name: !toolUIs
        ? undefined
        : Object.fromEntries(
            toolUIs.map((tool) => [
              tool.unstable_tool.toolName,
              tool.unstable_tool.render,
            ])
          ),
      Fallback: AssistantToolFallback,
    }),
    [toolUIs]
  );
}

export function AssistantFollowUpSuggestion({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="rounded-full border border-white/8 bg-[#22232e] px-4 py-2 text-sm text-zinc-300 hover:bg-[#2a2b36] hover:text-white"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
