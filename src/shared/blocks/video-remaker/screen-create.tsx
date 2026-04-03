'use client';

import { useState } from 'react';
import { Loader2, Video } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

import { createTask } from './api';

interface ScreenCreateProps {
  onTaskCreated: (taskId: string) => void;
}

export function ScreenCreate({ onTaskCreated }: ScreenCreateProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  function isYoutubeUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return ['www.youtube.com', 'youtube.com', 'youtu.be'].includes(url.hostname);
    } catch {
      return false;
    }
  }

  async function handleSubmit() {
    const url = youtubeUrl.trim();
    if (!url) return;
    if (!isYoutubeUrl(url)) {
      toast.error('请输入有效的 YouTube 链接');
      return;
    }
    setLoading(true);
    try {
      const { task_id } = await createTask(url);
      onTaskCreated(task_id);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : '创建任务失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-10 px-4">
      <div className="text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Video className="h-7 w-7 text-[var(--brand-signal)]" />
          <h1 className="text-2xl font-semibold text-[var(--studio-ink)]">VideoRemaker</h1>
        </div>
        <p className="text-[var(--studio-muted)]">将原视频复刻为 AI 生成视频</p>
      </div>

      <div className="w-full max-w-xl">
        <label className="mb-2 block text-sm text-[var(--studio-muted)]">YouTube 视频链接</label>
        <div className="flex gap-3">
          <Input
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/shorts/Ylkxe9MYRto"
            className="flex-1 border-[var(--studio-line)] placeholder:text-[var(--studio-muted)] focus-visible:ring-[var(--brand-signal)]"
            style={{ color: 'var(--studio-ink)', backgroundColor: 'var(--studio-panel)' }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button
            onClick={handleSubmit}
            disabled={!youtubeUrl.trim() || loading}
            className="bg-[var(--brand-signal)] text-white hover:bg-[var(--brand-signal-strong)]"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              '开始分析 →'
            )}
          </Button>
        </div>
        <p className="mt-2 text-xs text-[var(--studio-muted)]">
          当前仅支持公开可访问的 YouTube 视频或 Shorts 链接
        </p>
      </div>
    </div>
  );
}
