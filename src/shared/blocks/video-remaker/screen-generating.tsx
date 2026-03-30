'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Progress } from '@/shared/components/ui/progress';

import { frameUrl, getTaskStatus, refUrl, videoUrl } from './api';
import type { TaskStatusData } from './types';

interface ShotRow {
  shot_id: string;
}

interface ScreenGeneratingProps {
  taskId: string;
  shots: ShotRow[];
  onCompleted: () => void;
}

export function ScreenGenerating({ taskId, shots, onCompleted }: ScreenGeneratingProps) {
  const [status, setStatus] = useState<TaskStatusData | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function poll() {
      try {
        const data = await getTaskStatus(taskId);
        setStatus(data);

        // 检查每个分镜的 video 文件是否就绪（通过 HEAD 请求）
        for (const shot of shots) {
          if (!completedIds.has(shot.shot_id)) {
            try {
              const res = await fetch(videoUrl(taskId, shot.shot_id), { method: 'HEAD' });
              if (res.ok) {
                setCompletedIds((prev) => new Set([...prev, shot.shot_id]));
              }
            } catch {
              // 未就绪，跳过
            }
          }
        }

        if (data.status === 'completed') {
          clearInterval(timerRef.current!);
          onCompleted();
        } else if (data.status === 'failed') {
          clearInterval(timerRef.current!);
          toast.error(data.error ?? '生成失败');
        }
      } catch {
        // 忽略临时网络错误
      }
    }

    poll();
    timerRef.current = setInterval(poll, 5000);
    return () => clearInterval(timerRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, onCompleted]);

  const progress = status?.progress ?? 0;
  const completedCount = completedIds.size;
  const total = shots.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[var(--studio-ink)]">
          正在生成复刻视频...{' '}
          <span className="text-base font-normal text-[var(--studio-muted)]">
            {completedCount} / {total} 完成
          </span>
        </h2>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-[var(--studio-muted)]">
            <span>Volcengine 逐镜生成中</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-[var(--studio-panel-strong)]" />
        </div>
      </div>

      <div className="space-y-3">
        {/* Table header */}
        <div className="grid grid-cols-[3rem_1fr_1fr_1fr_6rem] gap-3 px-2 text-xs text-[var(--studio-muted)]">
          <span>分镜</span>
          <span>原始首帧</span>
          <span>参考主图</span>
          <span>复刻视频</span>
          <span>状态</span>
        </div>

        {shots.map((shot) => {
          const done = completedIds.has(shot.shot_id);
          const isNext = !done && completedIds.size === shots.findIndex((s) => s.shot_id === shot.shot_id);

          return (
            <div
              key={shot.shot_id}
              className="grid grid-cols-[3rem_1fr_1fr_1fr_6rem] items-center gap-3 rounded-lg bg-[var(--studio-panel)] p-3"
            >
              <span className="text-sm font-medium text-[var(--studio-ink)]">{shot.shot_id}</span>

              {/* 原始首帧 */}
              <div className="relative aspect-video overflow-hidden rounded bg-[var(--studio-panel-strong)]">
                <Image
                  src={frameUrl(taskId, shot.shot_id)}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* 参考主图 */}
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

              {/* 复刻视频 */}
              <div className="relative aspect-video overflow-hidden rounded bg-[var(--studio-panel-strong)]">
                {done ? (
                  <video
                    src={videoUrl(taskId, shot.shot_id)}
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--studio-muted)]">
                    等待中
                  </div>
                )}
              </div>

              {/* 状态 */}
              <div className="flex items-center gap-1 text-xs">
                {done ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-500">完成</span>
                  </>
                ) : isNext ? (
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
