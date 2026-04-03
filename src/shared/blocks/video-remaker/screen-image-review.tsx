'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';

import { refUrl, reimaging, triggerFilming } from './api';
import type { ImageReviewData, ImageReviewShot } from './types';

interface ScreenImageReviewProps {
  taskId: string;
  data: ImageReviewData;
  onFilmingStarted: () => void;
}

export function ScreenImageReview({ taskId, data, onFilmingStarted }: ScreenImageReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reimagingIds, setReimagingIds] = useState<Set<string>>(new Set());
  const [refreshKeys, setRefreshKeys] = useState<Record<string, number>>({});
  const [confirming, setConfirming] = useState(false);

  const shots = data.shots;
  const total = shots.length;
  const shot: ImageReviewShot = shots[currentIndex];

  async function handleReimage(shotId: string) {
    setReimagingIds((prev) => new Set([...prev, shotId]));
    try {
      await reimaging(taskId, shotId);
      // Poll until the new ref image is ready
      let attempts = 0;
      const maxAttempts = 30;
      await new Promise<void>((resolve, reject) => {
        const interval = setInterval(async () => {
          attempts++;
          try {
            const res = await fetch(`${refUrl(taskId, shotId)}?t=${Date.now()}`, { method: 'HEAD' });
            if (res.ok) {
              clearInterval(interval);
              resolve();
            }
          } catch {
            // continue polling
          }
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            reject(new Error('参考图生成超时'));
          }
        }, 3000);
      });
      // Bust cache so Image re-fetches
      setRefreshKeys((prev) => ({ ...prev, [shotId]: (prev[shotId] ?? 0) + 1 }));
      toast.success(`分镜 ${shotId} 参考图已更新`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : '重新生成失败');
    } finally {
      setReimagingIds((prev) => {
        const next = new Set(prev);
        next.delete(shotId);
        return next;
      });
    }
  }

  async function handleConfirm() {
    setConfirming(true);
    try {
      await triggerFilming(taskId);
      onFilmingStarted();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : '触发图生视频失败');
      setConfirming(false);
    }
  }

  const isReimaging = reimagingIds.has(shot.shot_id);
  const refreshKey = refreshKeys[shot.shot_id] ?? 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--studio-line)] px-6 py-3">
        <p className="text-sm text-[var(--studio-muted)]">{taskId}</p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--studio-muted)]"
            onClick={handleConfirm}
            disabled={confirming || reimagingIds.size > 0}
          >
            跳过审核
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={confirming || reimagingIds.size > 0}
            className="bg-[var(--brand-signal)] text-white hover:bg-[var(--brand-signal-strong)]"
          >
            {confirming ? '处理中...' : '确认，开始生成视频'}
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-[var(--studio-ink)]">
            参考图审核 — 分镜 {shot.shot_id} / {String(total).padStart(2, '0')}
            <span className="ml-2 text-xs text-[var(--studio-muted)]">
              {shot.start_sec.toFixed(1)}s – {shot.end_sec.toFixed(1)}s
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-[var(--studio-muted)]"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-[var(--studio-muted)]"
              onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
              disabled={currentIndex === total - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Comparison: original frame vs ref image */}
        <div className="mb-5 grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1 text-xs text-[var(--studio-muted)]">原始首帧</p>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-[var(--studio-panel-strong)]">
              <Image
                src={shot.frame_url}
                alt={`shot ${shot.shot_id} frame`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs text-[var(--studio-muted)]">参考主图</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-[var(--studio-muted)]"
                onClick={() => handleReimage(shot.shot_id)}
                disabled={isReimaging}
              >
                {isReimaging ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-1 h-3 w-3" />
                    重新生成
                  </>
                )}
              </Button>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-[var(--studio-panel-strong)]">
              {isReimaging ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[var(--brand-signal)]" />
                </div>
              ) : (
                <Image
                  key={refreshKey}
                  src={`${refUrl(taskId, shot.shot_id)}${refreshKey > 0 ? `?t=${refreshKey}` : ''}`}
                  alt={`shot ${shot.shot_id} ref`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
          </div>
        </div>

        {/* Image prompt */}
        <div className="mb-6 rounded-md bg-[var(--studio-panel-strong)] p-3 text-sm text-[var(--studio-ink)] leading-relaxed">
          <p className="mb-1 text-xs font-medium text-[var(--studio-muted)]">画面提示词（Image Prompt）</p>
          {shot.image_prompt}
        </div>

        {/* Dot navigation */}
        <div className="flex flex-wrap gap-1.5">
          {shots.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === currentIndex
                  ? 'bg-[var(--brand-signal)]'
                  : reimagingIds.has(s.shot_id)
                    ? 'bg-amber-400'
                    : 'bg-[var(--studio-panel-strong)] hover:bg-[var(--studio-muted)]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[var(--studio-line)] px-6 py-3 text-sm text-[var(--studio-muted)]">
        <span>{total} 个分镜</span>
        {reimagingIds.size > 0 && (
          <span className="text-amber-500">{reimagingIds.size} 张参考图重新生成中...</span>
        )}
      </div>
    </div>
  );
}
