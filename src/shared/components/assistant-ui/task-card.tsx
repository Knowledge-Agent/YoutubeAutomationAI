'use client';
import { useState } from 'react';
import {
  AlertCircle,
  LoaderCircle,
  PencilLine,
  Play,
  RefreshCw,
  XCircle,
} from 'lucide-react';

import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/lib/utils';

import { AssistantTaskCardData, AssistantTaskStatus } from './types';

function getStatusMeta(status: AssistantTaskStatus) {
  switch (status) {
    case 'failed':
      return {
        label: 'Failed',
        icon: AlertCircle,
        className: 'text-rose-300',
      };
    case 'canceled':
      return {
        label: 'Canceled',
        icon: XCircle,
        className: 'text-zinc-400',
      };
    case 'processing':
      return {
        label: 'Generating',
        icon: LoaderCircle,
        className: 'text-sky-300',
      };
    case 'pending':
      return {
        label: 'Queued',
        icon: LoaderCircle,
        className: 'text-amber-300',
      };
    default:
      return null;
  }
}

export function AssistantTaskCard({
  task,
  className,
  onReprompt,
  onRegenerate,
}: {
  task: AssistantTaskCardData;
  className?: string;
  onReprompt?: (task: AssistantTaskCardData) => void;
  onRegenerate?: (task: AssistantTaskCardData) => void;
}) {
  const statusMeta = getStatusMeta(task.status);
  const StatusIcon = statusMeta?.icon;
  const primaryAsset = task.assets?.[0];
  const isVideoAsset = primaryAsset?.kind === 'video';
  const showStatusPlaceholder = !primaryAsset && statusMeta && StatusIcon;
  const [videoOpen, setVideoOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  return (
    <Card
      className={cn(
        'overflow-hidden rounded-[24px] border border-white/6 bg-[#181922] py-0 text-white shadow-[0_18px_50px_rgba(0,0,0,0.16)]',
        className
      )}
    >
      <CardContent className="px-4 py-3 sm:py-3.5">
        <div className="max-w-[660px]">
          <div className="flex flex-wrap items-center gap-1.5">
            {task.modeLabel ? (
              <span className="rounded-[10px] border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[12px] text-zinc-300">
                {task.modeLabel}
              </span>
            ) : null}
            {task.modelLabel ? (
              <span className="rounded-[10px] border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[12px] text-zinc-400">
                {task.modelLabel}
              </span>
            ) : null}
            {task.createdAtLabel ? (
              <span className="text-[12px] text-zinc-500">
                {task.createdAtLabel}
              </span>
            ) : null}
          </div>

          <p className="mt-2.5 max-w-[560px] text-[14px] font-medium leading-6 text-white sm:text-[15px]">
            {task.prompt}
          </p>

          {primaryAsset ? (
            <div className="mt-2.5 w-full max-w-[148px] sm:max-w-[160px] md:max-w-[172px]">
              {isVideoAsset ? (
                <>
                  <button
                    type="button"
                    onClick={() => setVideoOpen(true)}
                    aria-label="Play generated video"
                  className="group relative block overflow-hidden rounded-[18px] border border-white/8 bg-[#101118] shadow-[0_20px_40px_rgba(0,0,0,0.22)]"
                  >
                    <video
                      src={primaryAsset.url}
                      poster={primaryAsset.thumbnailUrl}
                      muted
                      playsInline
                      preload="metadata"
                      className="aspect-[3/4] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/8 to-transparent transition group-hover:from-black/36" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-zinc-950 shadow-[0_18px_36px_rgba(0,0,0,0.32)] transition group-hover:scale-[1.03]">
                        <Play className="ml-0.5 size-5 fill-current" />
                      </span>
                    </div>
                  </button>
                  <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
                    <DialogContent
                      className="max-w-[min(92vw,960px)] border-white/8 bg-[#111218] p-3 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                      showCloseButton
                    >
                      <DialogTitle className="sr-only">
                        Generated video preview
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Play the generated video inside the chat.
                      </DialogDescription>
                      <video
                        src={primaryAsset.url}
                        poster={primaryAsset.thumbnailUrl}
                        controls
                        autoPlay
                        playsInline
                        preload="metadata"
                        className="max-h-[80vh] w-full rounded-[16px] bg-black object-contain"
                      />
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setImageOpen(true)}
                    aria-label="Preview generated image"
                    className="group block overflow-hidden rounded-[18px] border border-white/8 bg-[#101118] shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
                  >
                    <img
                      src={primaryAsset.url}
                      alt={primaryAsset.alt ?? 'Generated image preview'}
                      className="aspect-[3/4] w-full object-cover transition group-hover:scale-[1.02]"
                    />
                  </button>
                  <Dialog open={imageOpen} onOpenChange={setImageOpen}>
                    <DialogContent
                      className="max-w-[min(92vw,1080px)] border-white/8 bg-[#111218] p-3 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                      showCloseButton
                    >
                      <DialogTitle className="sr-only">
                        Generated image preview
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Preview the generated image inside the chat.
                      </DialogDescription>
                      <div className="flex max-h-[80vh] items-center justify-center overflow-hidden rounded-[16px] bg-black">
                        <img
                          src={primaryAsset.url}
                          alt={primaryAsset.alt ?? 'Generated image preview'}
                          className="max-h-[80vh] w-auto max-w-full object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          ) : null}

          {showStatusPlaceholder ? (
            <div className="mt-2.5 flex min-h-[124px] w-full max-w-[148px] sm:max-w-[160px] md:max-w-[172px] items-center justify-center rounded-[18px] border border-white/8 bg-[#12131a]">
              <div
                className={cn('flex flex-col items-center gap-3', statusMeta.className)}
              >
                <StatusIcon
                  className={cn(
                    'size-8',
                    task.status !== 'failed' &&
                      task.status !== 'canceled' &&
                      'animate-spin'
                  )}
                />
                <span className="text-sm font-medium text-zinc-200">
                  {statusMeta.label}
                </span>
              </div>
            </div>
          ) : null}

          {typeof task.progress === 'number' && task.status !== 'success' ? (
            <div className="mt-2.5 max-w-[148px] sm:max-w-[160px] md:max-w-[172px] space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{statusMeta?.label ?? 'Progress'}</span>
                <span>{task.progress}%</span>
              </div>
              <Progress
                value={task.progress}
                className="h-1.5 rounded-full bg-white/5"
              />
            </div>
          ) : null}

          {task.errorMessage ? (
            <div className="mt-3 max-w-[520px] rounded-[18px] border border-rose-500/18 bg-rose-500/8 px-4 py-3 text-sm text-rose-200">
              {task.errorMessage}
            </div>
          ) : null}

          {task.status === 'success' ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onReprompt?.(task)}
                className="inline-flex h-8 items-center gap-2 rounded-[11px] border border-white/8 bg-[#1c1d25] px-3 text-[12px] font-medium text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                <PencilLine className="size-4" />
                Re-prompt
              </button>
              <button
                type="button"
                onClick={() => onRegenerate?.(task)}
                className="inline-flex h-8 items-center gap-2 rounded-[11px] border border-white/8 bg-[#1c1d25] px-3 text-[12px] font-medium text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                <RefreshCw className="size-4" />
                Regenerate
              </button>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
