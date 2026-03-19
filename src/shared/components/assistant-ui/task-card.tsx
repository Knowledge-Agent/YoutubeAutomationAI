'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Play,
  XCircle,
} from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/lib/utils';

import { AssistantTaskCardData, AssistantTaskStatus } from './types';

function getStatusMeta(status: AssistantTaskStatus) {
  switch (status) {
    case 'success':
      return {
        label: 'Completed',
        icon: CheckCircle2,
        className: 'bg-emerald-400/12 text-emerald-300',
      };
    case 'failed':
      return {
        label: 'Failed',
        icon: AlertCircle,
        className: 'bg-rose-500/12 text-rose-300',
      };
    case 'canceled':
      return {
        label: 'Canceled',
        icon: XCircle,
        className: 'bg-zinc-500/12 text-zinc-300',
      };
    case 'processing':
      return {
        label: 'Processing',
        icon: LoaderCircle,
        className: 'bg-sky-500/12 text-sky-300',
      };
    case 'pending':
      return {
        label: 'Queued',
        icon: Clock3,
        className: 'bg-amber-500/12 text-amber-300',
      };
    default:
      return {
        label: 'Draft',
        icon: Clock3,
        className: 'bg-zinc-500/12 text-zinc-300',
      };
  }
}

export function AssistantTaskCard({
  task,
  className,
}: {
  task: AssistantTaskCardData;
  className?: string;
}) {
  const statusMeta = getStatusMeta(task.status);
  const StatusIcon = statusMeta.icon;
  const primaryAsset = task.assets?.[0];

  return (
    <Card
      className={cn(
        'overflow-hidden rounded-[28px] border-white/8 bg-[#171821] py-0 text-white shadow-[0_24px_60px_rgba(0,0,0,0.24)]',
        className
      )}
    >
      <CardContent className="grid gap-4 px-4 py-4 md:grid-cols-[minmax(0,1fr)_188px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn('gap-1.5 border-none px-2.5 py-1', statusMeta.className)}>
              <StatusIcon
                className={cn('size-3.5', task.status === 'processing' && 'animate-spin')}
              />
              {statusMeta.label}
            </Badge>
            {task.modeLabel ? (
              <Badge
                variant="secondary"
                className="border border-white/8 bg-white/5 px-2.5 py-1 text-zinc-300"
              >
                {task.modeLabel}
              </Badge>
            ) : null}
            {task.modelLabel ? (
              <Badge
                variant="secondary"
                className="border border-white/8 bg-white/5 px-2.5 py-1 text-zinc-300"
              >
                {task.modelLabel}
              </Badge>
            ) : null}
            {task.createdAtLabel ? (
              <span className="text-xs text-zinc-500">{task.createdAtLabel}</span>
            ) : null}
          </div>

          {task.title ? (
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">
              {task.title}
            </h3>
          ) : null}

          <p className="mt-2 text-sm leading-7 text-zinc-300">{task.prompt}</p>

          {typeof task.progress === 'number' && task.status !== 'success' ? (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <Progress
                value={task.progress}
                className="h-2 rounded-full bg-white/5"
              />
            </div>
          ) : null}

          {task.errorMessage ? (
            <div className="mt-4 rounded-2xl border border-rose-500/18 bg-rose-500/8 px-4 py-3 text-sm text-rose-200">
              {task.errorMessage}
            </div>
          ) : null}

          {(task.providerLabel || task.modelLabel) && (
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-500">
              {task.providerLabel ? <span>{task.providerLabel}</span> : null}
              {task.modelLabel ? <span>{task.modelLabel}</span> : null}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#11131a]">
          {primaryAsset ? (
            primaryAsset.kind === 'video' ? (
              <div className="group relative aspect-[4/4.6] overflow-hidden">
                <img
                  src={primaryAsset.thumbnailUrl ?? primaryAsset.url}
                  alt={primaryAsset.alt ?? 'Generated video preview'}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-950 shadow-xl shadow-black/30">
                    <Play className="ml-0.5 size-4.5 fill-current" />
                  </span>
                </div>
              </div>
            ) : (
              <img
                src={primaryAsset.url}
                alt={primaryAsset.alt ?? 'Generated image preview'}
                className="aspect-square h-full w-full object-cover"
              />
            )
          ) : (
            <div className="flex aspect-[4/4.6] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_28%)] text-zinc-500">
              {task.status === 'failed' ? (
                <AlertCircle className="size-8" />
              ) : (
                <LoaderCircle
                  className={cn(
                    'size-8',
                    task.status === 'processing' && 'animate-spin'
                  )}
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
