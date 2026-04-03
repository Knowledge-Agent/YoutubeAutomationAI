'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';

import { frameUrl, getTaskStatus } from './api';
import type { TaskStatusData } from './types';

const STAGE_LABELS: Record<string, string> = {
  downloading: '正在下载 YouTube 视频...',
  splitter: '正在拆解分镜...',
  modeler: '正在识别角色特征...',
  architect: '正在生成提示词...',
};

interface ScreenAnalyzingProps {
  taskId: string;
  onReviewReady: () => void;
  onCancel: () => void;
}

export function ScreenAnalyzing({ taskId, onReviewReady, onCancel }: ScreenAnalyzingProps) {
  const [status, setStatus] = useState<TaskStatusData | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function poll() {
      try {
        const data = await getTaskStatus(taskId);
        setStatus(data);
        if (data.status === 'review_ready') {
          clearInterval(timerRef.current!);
          onReviewReady();
        } else if (data.status === 'failed') {
          clearInterval(timerRef.current!);
          toast.error(data.error ?? '分析失败，请重试');
        }
      } catch {
        // 网络临时失败，继续轮询
      }
    }

    poll();
    timerRef.current = setInterval(poll, 3000);
    return () => clearInterval(timerRef.current!);
  }, [taskId, onReviewReady]);

  const progress = status?.progress ?? 0;
  const shotsCount = status?.shots_count ?? 0;
  const stageLabel = status?.stage ? (STAGE_LABELS[status.stage] ?? '处理中...') : '正在分析视频...';

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--studio-muted)]">任务 {taskId}</p>
          <h2 className="mt-1 text-xl font-semibold text-[var(--studio-ink)]">正在分析视频，请稍候...</h2>
          <p className="mt-1 text-sm text-[var(--studio-muted)]">{stageLabel}</p>
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

      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm text-[var(--studio-muted)]">
          <span>{stageLabel}</span>
          <span>{progress}%</span>
        </div>
        <Progress
          value={progress}
          className="h-2 bg-[var(--studio-panel-strong)]"
        />
      </div>

      {shotsCount > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-[var(--studio-ink)]">分镜首帧预览</p>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: shotsCount }).map((_, i) => {
              const sid = String(i + 1).padStart(2, '0');
              const ready = status?.stage !== 'splitter';
              return (
                <div
                  key={sid}
                  className="relative aspect-video overflow-hidden rounded-md bg-[var(--studio-panel-strong)]"
                >
                  {ready ? (
                    <Image
                      src={frameUrl(taskId, sid)}
                      alt={`shot ${sid}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--studio-muted)] border-t-[var(--brand-signal)]" />
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">
                    {sid}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
