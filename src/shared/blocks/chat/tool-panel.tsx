'use client';

import { ImagePlus, Video } from 'lucide-react';

import { type ToolControlValue } from '@/shared/blocks/tools/tool-control-bar';
import { ToolPromptCard } from '@/shared/blocks/tools/tool-prompt-card';
import { cn } from '@/shared/lib/utils';
import type { ToolMode, ToolSurface } from '@/shared/types/ai-tools';

type ToolPanelSurface = Exclude<ToolSurface, 'chat'>;

export function ChatToolPanel({
  surface,
  prompt,
  mode,
  modelId,
  options,
  onPromptChange,
  onControlsChange,
  onGenerate,
  onReset,
  generating = false,
}: {
  surface: ToolPanelSurface;
  prompt: string;
  mode: ToolMode | string;
  modelId: string;
  options: Record<string, unknown>;
  onPromptChange: (prompt: string) => void;
  onControlsChange: (nextValue: ToolControlValue) => void;
  onGenerate: () => void;
  onReset: () => void;
  generating?: boolean;
}) {
  return (
    <aside className="flex h-full min-h-0 flex-col rounded-[28px] border border-[color:var(--studio-line)] bg-[var(--studio-panel)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="flex items-center gap-3 border-b border-[color:var(--studio-line)] pb-4">
        <span
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--studio-line)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
            surface === 'image'
              ? 'bg-[rgba(30,184,166,0.14)] text-[var(--image-accent)]'
              : 'bg-[rgba(255,94,122,0.14)] text-[var(--video-accent)]'
          )}
        >
          {surface === 'image' ? (
            <ImagePlus className="size-5" />
          ) : (
            <Video className="size-5" />
          )}
        </span>
        <div className="min-w-0">
          <div className="text-[10px] font-medium tracking-[0.18em] text-[var(--studio-muted)] uppercase">
            Generation Controls
          </div>
          <div className="mt-1 text-lg font-semibold tracking-tight text-[var(--studio-ink)]">
            {surface === 'image' ? 'AI Image' : 'AI Video'}
          </div>
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
        <ToolPromptCard
          surface={surface}
          prompt={prompt}
          onPromptChange={onPromptChange}
          controls={{ mode, modelId, options }}
          onControlsChange={onControlsChange}
          onSubmit={onGenerate}
          submitting={generating}
          allowedModes={
            surface === 'image'
              ? ['text-to-image', 'image-to-image']
              : ['text-to-video', 'image-to-video']
          }
          variant="panel"
        />
      </div>
    </aside>
  );
}
