'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, Clock, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';

import { frameUrl, getTaskStatus, refUrl } from './api';
import type { TaskStatusData } from './types';

interface ShotRow {
  shot_id: string;
}

interface ScreenImagingProps {
  taskId: string;
  shots: ShotRow[];
  onImageReviewReady: () => void;
  onCancel: () => void;
}

export function ScreenImaging({ taskId, shots, onImageReviewReady, onCancel }: ScreenImagingProps) {
  const [status, setStatus] = useState<TaskStatusData | null>(null);
  const [readyIds, setReadyIds] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function poll() {
      try {
        const data = await getTaskStatus(taskId);
        setStatus(data);

        for (const shot of shots) {
          if (!readyIds.has(shot.shot_id)) {
            try {
              const res = await fetch(refUrl(taskId, shot.shot_id), { method: 'HEAD' });
              if (res.ok) {
                setReadyIds((prev) => new Set([...prev, shot.shot_id]));
              }
            } catch {
              // 未就绪，跳过
            }
          }
        }

        if (data.status === 'image_review_ready') {
          clearInterval(timerRef.current!);
          onImageReviewReady();
        } else if (data.status === 'failed') {
          clearInterval(timerRef.current!);
          toast.error(data.error ?? '文生图失败');
        }
      } catch {
        // 忽略临时网络错误
      }
    }

    poll();
    timerRef.current = setInterval(poll, 3000);
    return () => clearInterval(timerRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, onImageReviewReady]);

  const progress = status?.progress ?? 0;
  const readyCount = readyIds.size;
  const total = shots.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--studio-ink)]">
            正在生成参考图...{' '}
            <span className="text-base font-normal text-[var(--studio-muted)]">
              {readyCount} / {total} 完成
            </span>
          </h2>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs text-[var(--studio-muted)]">
              <span>并发文生图中</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-[var(--studio-panel-strong)]" />
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-[var(--studio-muted)] hover:text-[var(--studio-ink)]"
        >
          <X className="h-4 w-4" />
          取消
        </Button>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-[3rem_1fr_1fr_6rem] gap-3 px-2 text-xs text-[var(--studio-muted)]">
          <span>分镜</span>
          <span>原始首帧</span>
          <span>参考主图</span>
          <span>状态</span>
        </div>

        {shots.map((shot) => {
          const done = readyIds.has(shot.shot_id);
          const isActive =
            !done && readyIds.size === shots.findIndex((s) => s.shot_id === shot.shot_id);

          return (
            <div
              key={shot.shot_id}
              className="grid grid-cols-[3rem_1fr_1fr_6rem] items-center gap-3 rounded-lg bg-[var(--studio-panel)] p-3"
            >
              <span className="text-sm font-medium text-[var(--studio-ink)]">{shot.shot_id}</span>

              <div className="relative aspect-video overflow-hidden rounded bg-[var(--studio-panel-strong)]">
                <Image
                  src={frameUrl(taskId, shot.shot_id)}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="relative aspect-video overflow-hidden rounded bg-[var(--studio-panel-strong)]">
                {done ? (
                  <Image
                    src={refUrl(taskId, shot.shot_id)}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--studio-muted)]">
                    等待中
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs">
                {done ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-500">完成</span>
                  </>
                ) : isActive ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--brand-signal)]" />
                    <span className="text-[var(--brand-signal)]">生成中</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 text-[var(--studio-muted)]" />
                    <span className="text-[var(--studio-muted)]">排队</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
