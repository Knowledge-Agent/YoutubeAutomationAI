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
  const [videoPath, setVideoPath] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const path = videoPath.trim();
    if (!path) return;
    setLoading(true);
    try {
      const { task_id } = await createTask(path);
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
        <label className="mb-2 block text-sm text-[var(--studio-muted)]">本地视频路径</label>
        <div className="flex gap-3">
          <Input
            value={videoPath}
            onChange={(e) => setVideoPath(e.target.value)}
            placeholder="/data/input/my_video.mp4"
            className="flex-1 border-[var(--studio-line)] bg-[var(--studio-panel)] text-[var(--studio-ink)] placeholder:text-[var(--studio-muted)] focus-visible:ring-[var(--brand-signal)]"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button
            onClick={handleSubmit}
            disabled={!videoPath.trim() || loading}
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
          支持 MP4、MOV 等格式，处理约需 2-3 分钟
        </p>
      </div>
    </div>
  );
}
