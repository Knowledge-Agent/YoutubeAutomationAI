'use client';

import { useEffect, useMemo } from 'react';
import { ArrowUp, ImageIcon, Loader2, Video } from 'lucide-react';

import { ChatReferenceImageSlots } from '@/shared/blocks/chat/reference-image-slots';
import { useToolCatalog } from '@/shared/hooks/use-tool-catalog';
import { AI_CREDITS_ENABLED } from '@/shared/lib/ai-credits';
import { cn } from '@/shared/lib/utils';
import type { ToolMode, ToolSurface } from '@/shared/types/ai-tools';

import {
  normalizeToolControlValue,
  ToolControlBar,
  type ToolControlValue,
} from './tool-control-bar';

type ToolPromptSurface = Exclude<ToolSurface, 'chat'>;

export function ToolPromptCard({
  surface,
  prompt,
  onPromptChange,
  controls,
  onControlsChange,
  onSubmit,
  submitting = false,
  allowedModes,
  variant = 'hero',
  className,
}: {
  surface: ToolPromptSurface;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  controls: ToolControlValue;
  onControlsChange: (nextValue: ToolControlValue) => void;
  onSubmit: () => void;
  submitting?: boolean;
  allowedModes: ToolMode[];
  variant?: 'hero' | 'panel';
  className?: string;
}) {
  const { models, options: optionDefinitions } = useToolCatalog(surface);
  const normalizedControls = useMemo(
    () =>
      normalizeToolControlValue({
        mode: controls.mode,
        modelId: controls.modelId,
        options: controls.options,
        models,
        allowedModes,
        optionDefinitions,
      }),
    [
      allowedModes,
      controls.mode,
      controls.modelId,
      controls.options,
      models,
      optionDefinitions,
    ]
  );

  useEffect(() => {
    if (
      normalizedControls.mode !== controls.mode ||
      normalizedControls.modelId !== controls.modelId ||
      JSON.stringify(normalizedControls.options) !==
        JSON.stringify(controls.options)
    ) {
      onControlsChange(normalizedControls);
    }
  }, [
    controls.mode,
    controls.modelId,
    controls.options,
    normalizedControls,
    onControlsChange,
  ]);

  const selectedModel = useMemo(
    () => models.find((model) => model.id === normalizedControls.modelId),
    [models, normalizedControls.modelId]
  );

  const imageReferenceRequired =
    normalizedControls.mode === 'image-to-image' ||
    normalizedControls.mode === 'image-to-video';
  const imageUrls = Array.isArray(normalizedControls.options.image_urls)
    ? (normalizedControls.options.image_urls as string[])
    : [];
  const hasPrompt = prompt.trim().length > 0;
  const canSubmit =
    hasPrompt && (!imageReferenceRequired || imageUrls.length > 0);
  const creditCost =
    selectedModel?.creditCostByMode?.[normalizedControls.mode as ToolMode] ?? 0;
  const isHero = variant === 'hero';

  return (
    <div
      className={cn(
        'relative overflow-hidden border border-[color:var(--studio-line)] bg-[rgb(27_29_36_/_0.94)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
        isHero
          ? '-mt-px rounded-[38px] rounded-tl-[6px] px-6 pt-6 pb-5 md:rounded-tl-[8px] md:px-7 md:pt-7 md:pb-6'
          : 'rounded-[28px] px-4 py-4',
        className
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          surface === 'image'
            ? 'bg-[radial-gradient(circle_at_10%_18%,rgba(30,184,166,0.18),transparent_26%),radial-gradient(circle_at_24%_82%,rgba(255,122,26,0.06),transparent_32%)]'
            : 'bg-[radial-gradient(circle_at_10%_18%,rgba(255,94,122,0.18),transparent_26%),radial-gradient(circle_at_24%_82%,rgba(255,122,26,0.08),transparent_32%)]'
        )}
      />

      <div
        className={cn(
          'relative flex flex-col',
          imageReferenceRequired
            ? 'justify-start gap-1.5'
            : 'justify-between gap-6',
          isHero && 'min-h-[278px]'
        )}
      >
        <div className="flex items-start gap-5">
          <button
            type="button"
            className={cn(
              'shrink-0 -rotate-[4deg] items-center justify-center rounded-[18px] border border-dashed border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.03)] text-[var(--studio-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:border-white/18 hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--studio-ink)]',
              isHero
                ? 'mt-2 flex h-[96px] w-[82px]'
                : 'mt-1 flex h-[76px] w-[62px]'
            )}
          >
            {surface === 'image' ? (
              <ImageIcon className={cn(isHero ? 'size-7' : 'size-5')} />
            ) : (
              <Video className={cn(isHero ? 'size-7' : 'size-5')} />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <textarea
              value={prompt}
              onChange={(event) => onPromptChange(event.target.value)}
              placeholder="Enter your idea to generate"
              style={{ backgroundColor: 'transparent' }}
              className={cn(
                'w-full resize-none border-none !bg-transparent p-0 font-medium tracking-tight text-[var(--studio-ink)] outline-none placeholder:text-[color:var(--studio-muted)] focus:ring-0 focus:outline-none',
                isHero
                  ? imageReferenceRequired
                    ? 'min-h-[92px] pt-4 text-[20px] leading-9'
                    : 'min-h-[168px] pt-4 text-[20px] leading-9'
                  : 'min-h-[128px] pt-2 text-[17px] leading-8'
              )}
            />
          </div>
        </div>

        {imageReferenceRequired ? (
          <div
            className={cn(
              'flex items-start',
              isHero ? 'pt-0' : 'pt-0'
            )}
          >
            <ChatReferenceImageSlots
              value={imageUrls}
              maxSizeMB={8}
              className="gap-2.5"
              onChange={(nextUrls) =>
                onControlsChange({
                  ...normalizedControls,
                  options: {
                    ...normalizedControls.options,
                    image_urls: nextUrls,
                  },
                })
              }
            />
          </div>
        ) : null}

        <div className="flex flex-wrap items-end gap-2">
          <ToolControlBar
            surface={surface}
            value={normalizedControls}
            onChange={onControlsChange}
            allowedModes={allowedModes}
          />
          <div className="ml-auto flex items-center gap-5 pl-4 text-[15px] text-[var(--studio-muted)]">
            {AI_CREDITS_ENABLED ? (
              <span className="text-[var(--studio-muted)]">
                {creditCost} Credits
              </span>
            ) : null}
            <button
              type="button"
              onClick={onSubmit}
              className={cn(
                'flex items-center justify-center rounded-full border transition',
                isHero ? 'h-16 w-16' : 'h-14 w-14',
                canSubmit
                  ? 'border-[color:var(--brand-signal)] bg-[var(--brand-signal)] text-white shadow-lg shadow-[rgba(229,106,17,0.22)] hover:bg-[var(--brand-signal-strong)]'
                  : 'border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.04)] text-[var(--studio-muted)] hover:bg-[rgba(255,255,255,0.07)] hover:text-[var(--studio-ink)]'
              )}
              disabled={!canSubmit || submitting}
            >
              {submitting ? (
                <Loader2
                  className={cn(
                    'animate-spin',
                    isHero ? 'size-5' : 'size-4.5'
                  )}
                />
              ) : (
                <ArrowUp className={cn(isHero ? 'size-5' : 'size-4.5')} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
