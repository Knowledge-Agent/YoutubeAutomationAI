'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, PenLine, Plus, RefreshCw, Save, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';

import { frameUrl, patchShot, refUrl, triggerSynthesize, videoUrl } from './api';
import type { ResultData, ResultShot } from './types';

interface PromptEditDrawerProps {
  taskId: string;
  shot: ResultShot;
  onClose: () => void;
  onRegenerated: () => void;
}

function PromptEditDrawer({ taskId, shot, onClose, onRegenerated }: PromptEditDrawerProps) {
  const [draftImage, setDraftImage] = useState(shot.image_prompt);
  const [draftVideo, setDraftVideo] = useState(shot.video_prompt);
  const [saving, setSaving] = useState(false);

  async function handleConfirm() {
    setSaving(true);
    try {
      await patchShot(taskId, shot.shot_id, {
        image_prompt: draftImage,
        video_prompt: draftVideo,
      });
      await triggerSynthesize(taskId);
      toast.success('已提交重新生成');
      onRegenerated();
      onClose();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : '提交失败');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/50" onClick={onClose} />
      {/* Drawer */}
      <div className="flex w-96 flex-col bg-[var(--studio-panel)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--studio-line)] px-4 py-3">
          <h3 className="text-sm font-medium text-[var(--studio-ink)]">
            编辑分镜 {shot.shot_id} 提示词
          </h3>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--studio-muted)]" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--studio-muted)]">
              画面提示词（Image Prompt）
            </label>
            <Textarea
              value={draftImage}
              onChange={(e) => setDraftImage(e.target.value)}
              rows={6}
              className="border-[var(--studio-line)] bg-[var(--studio-panel-strong)] text-sm text-[var(--studio-ink)] focus-visible:ring-[var(--brand-signal)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--studio-muted)]">
              运镜提示词（Video Prompt）
            </label>
            <Textarea
              value={draftVideo}
              onChange={(e) => setDraftVideo(e.target.value)}
              rows={6}
              className="border-[var(--studio-line)] bg-[var(--studio-panel-strong)] text-sm text-[var(--studio-ink)] focus-visible:ring-[var(--brand-signal)]"
            />
          </div>
          <div className="rounded-md bg-[var(--studio-panel-strong)] p-3 text-xs text-[var(--studio-muted)]">
            ⚠ 修改提示词后，该分镜原有复刻结果将被覆盖
          </div>
        </div>

        <div className="flex gap-2 border-t border-[var(--studio-line)] p-4">
          <Button
            variant="ghost"
            className="flex-1 text-[var(--studio-muted)]"
            onClick={onClose}
          >
            取消
          </Button>
          <Button
            className="flex-1 bg-[var(--brand-signal)] text-white hover:bg-[var(--brand-signal-strong)]"
            disabled={saving}
            onClick={handleConfirm}
          >
            {saving ? '提交中...' : '确认，重新生成'}
          </Button>
        </div>
      </div>
    </div>
  );
}

type ViewMode = 'compare' | 'original' | 'remaker';

interface ScreenResultProps {
  taskId: string;
  result: ResultData;
  onNewTask: () => void;
  onRegenerated: () => void;
}

export function ScreenResult({ taskId, result, onNewTask, onRegenerated }: ScreenResultProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('compare');
  const [editingShot, setEditingShot] = useState<ResultShot | null>(null);
  const shots = result.shots;

  async function handleRegenerate(shot: ResultShot) {
    try {
      await triggerSynthesize(taskId);
      toast.success(`分镜 ${shot.shot_id} 已提交重新生成`);
      onRegenerated();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : '重新生成失败');
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--studio-line)] px-6 py-3">
        <div>
          <p className="text-sm text-[var(--studio-muted)]">{taskId}</p>
          <p className="text-sm text-emerald-500">✓ 复刻完成 | {shots.length} 个分镜</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[var(--studio-line)] text-[var(--studio-muted)]"
            asChild
          >
            <a href={`/api/video-remaker/download?taskId=${taskId}`} download>
              <Download className="mr-1 h-4 w-4" />
              下载全部
            </a>
          </Button>
          <Button
            size="sm"
            className="bg-[var(--brand-signal)] text-white hover:bg-[var(--brand-signal-strong)]"
            onClick={onNewTask}
          >
            <Plus className="mr-1 h-4 w-4" />
            新建任务
          </Button>
        </div>
      </div>

      {/* View mode tabs */}
      <div className="border-b border-[var(--studio-line)] px-6 py-2">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList className="bg-[var(--studio-panel-strong)]">
            <TabsTrigger value="compare" className="data-[state=active]:bg-[var(--studio-panel)]">
              逐镜对比
            </TabsTrigger>
            <TabsTrigger value="original" className="data-[state=active]:bg-[var(--studio-panel)]">
              原片连播
            </TabsTrigger>
            <TabsTrigger value="remaker" className="data-[state=active]:bg-[var(--studio-panel)]">
              复刻连播
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === 'compare' && (
          <div className="space-y-8">
            {shots.map((shot) => (
              <div key={shot.shot_id}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--studio-ink)]">
                    分镜 {shot.shot_id}
                    <span className="ml-2 text-xs text-[var(--studio-muted)]">
                      {shot.start_sec.toFixed(1)}s – {shot.end_sec.toFixed(1)}s
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-[var(--studio-muted)]"
                      onClick={() => handleRegenerate(shot)}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />重新生成
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-[var(--studio-muted)]"
                      onClick={() => setEditingShot(shot)}
                    >
                      <PenLine className="mr-1 h-3 w-3" />编辑提示词 & 重新生成
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-1 text-xs text-[var(--studio-muted)]">原片</p>
                    <video
                      src={`${frameUrl(taskId, shot.shot_id).replace('/frame', '/clip')}`}
                      controls
                      className="w-full rounded-lg bg-[var(--studio-panel-strong)]"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-[var(--studio-muted)]">复刻</p>
                    <video
                      src={videoUrl(taskId, shot.shot_id)}
                      controls
                      className="w-full rounded-lg bg-[var(--studio-panel-strong)]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'original' && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {shots.map((shot) => (
              <div key={shot.shot_id}>
                <p className="mb-1 text-xs text-[var(--studio-muted)]">分镜 {shot.shot_id}</p>
                <div className="relative aspect-video overflow-hidden rounded-lg bg-[var(--studio-panel-strong)]">
                  <Image src={frameUrl(taskId, shot.shot_id)} alt="" fill className="object-cover" unoptimized />
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'remaker' && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {shots.map((shot) => (
              <div key={shot.shot_id}>
                <p className="mb-1 text-xs text-[var(--studio-muted)]">分镜 {shot.shot_id}</p>
                <video
                  src={videoUrl(taskId, shot.shot_id)}
                  controls
                  className="w-full rounded-lg bg-[var(--studio-panel-strong)]"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prompt edit drawer */}
      {editingShot && (
        <PromptEditDrawer
          taskId={taskId}
          shot={editingShot}
          onClose={() => setEditingShot(null)}
          onRegenerated={onRegenerated}
        />
      )}
    </div>
  );
}
