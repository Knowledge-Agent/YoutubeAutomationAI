'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

import { getReview, patchShot, triggerSynthesize } from './api';
import type { IdentityAnchor, ReviewData, ReviewShot } from './types';

interface ScreenReviewProps {
  taskId: string;
  onGenerating: () => void;
}

export function ScreenReview({ taskId, onGenerating }: ScreenReviewProps) {
  const [data, setData] = useState<ReviewData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingImage, setEditingImage] = useState(false);
  const [editingVideo, setEditingVideo] = useState(false);
  const [draftImage, setDraftImage] = useState('');
  const [draftVideo, setDraftVideo] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    getReview(taskId)
      .then(setData)
      .catch((e) => toast.error(e.message));
  }, [taskId]);

  if (!data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--studio-muted)] border-t-[var(--brand-signal)]" />
      </div>
    );
  }

  const shots = data.shots;
  const total = shots.length;
  const shot: ReviewShot = shots[currentIndex];

  function startEditImage() {
    setDraftImage(shot.image_prompt);
    setEditingImage(true);
  }
  function startEditVideo() {
    setDraftVideo(shot.video_prompt);
    setEditingVideo(true);
  }

  async function savePrompt(field: 'image' | 'video') {
    setSaving(true);
    try {
      const payload =
        field === 'image'
          ? { image_prompt: draftImage }
          : { video_prompt: draftVideo };
      const updated = await patchShot(taskId, shot.shot_id, payload);
      setData((prev) => {
        if (!prev) return prev;
        const newShots = prev.shots.map((s) =>
          s.shot_id === shot.shot_id
            ? { ...s, image_prompt: updated.image_prompt, video_prompt: updated.video_prompt }
            : s,
        );
        return { ...prev, shots: newShots };
      });
      field === 'image' ? setEditingImage(false) : setEditingVideo(false);
      toast.success('保存成功');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirm() {
    setConfirming(true);
    try {
      await triggerSynthesize(taskId);
      onGenerating();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : '触发生成失败');
      setConfirming(false);
    }
  }

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
            disabled={confirming}
          >
            跳过审核
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={confirming}
            className="bg-[var(--brand-signal)] text-white hover:bg-[var(--brand-signal-strong)]"
          >
            {confirming ? '处理中...' : '确认，开始生成'}
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: identity anchors */}
        <div className="w-56 shrink-0 overflow-y-auto border-r border-[var(--studio-line)] p-4">
          <p className="mb-3 text-sm font-medium text-[var(--studio-ink)]">角色识别结果</p>
          {data.identity_anchors.map((anchor: IdentityAnchor) => (
            <div key={anchor.id} className="mb-4">
              <div className="mb-1 text-xs font-medium text-[var(--brand-signal)]">{anchor.id}</div>
              <div className="rounded-md bg-[var(--studio-panel-strong)] p-2 text-xs text-[var(--studio-muted)] leading-relaxed">
                {anchor.bio_features}
              </div>
            </div>
          ))}
        </div>

        {/* Right: shot detail */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-[var(--studio-ink)]">
              分镜 {shot.shot_id} / {String(total).padStart(2, '0')}
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

          {/* Frame preview */}
          <div className="relative mb-5 aspect-video w-full max-w-sm overflow-hidden rounded-lg bg-[var(--studio-panel-strong)]">
            <Image
              src={shot.frame_url}
              alt={`shot ${shot.shot_id} frame`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Image prompt */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-medium text-[var(--studio-muted)]">画面提示词（Image Prompt）</p>
              {!editingImage && (
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-[var(--studio-muted)]" onClick={startEditImage}>
                  <Edit2 className="mr-1 h-3 w-3" />编辑
                </Button>
              )}
            </div>
            {editingImage ? (
              <div>
                <Textarea
                  value={draftImage}
                  onChange={(e) => setDraftImage(e.target.value)}
                  rows={4}
                  className="border-[var(--studio-line)] bg-[var(--studio-panel-strong)] text-sm text-[var(--studio-ink)] focus-visible:ring-[var(--brand-signal)]"
                />
                <div className="mt-2 flex gap-2">
                  <Button size="sm" disabled={saving} onClick={() => savePrompt('image')} className="h-7 bg-[var(--brand-signal)] text-white hover:bg-[var(--brand-signal-strong)]">
                    <Save className="mr-1 h-3 w-3" />{saving ? '保存中...' : '保存'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingImage(false)} className="h-7 text-[var(--studio-muted)]">
                    <X className="mr-1 h-3 w-3" />取消
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-[var(--studio-panel-strong)] p-3 text-sm text-[var(--studio-ink)] leading-relaxed">
                {shot.image_prompt}
              </div>
            )}
          </div>

          {/* Video prompt */}
          <div className="mb-6">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-medium text-[var(--studio-muted)]">运镜提示词（Video Prompt）</p>
              {!editingVideo && (
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-[var(--studio-muted)]" onClick={startEditVideo}>
                  <Edit2 className="mr-1 h-3 w-3" />编辑
                </Button>
              )}
            </div>
            {editingVideo ? (
              <div>
                <Textarea
                  value={draftVideo}
                  onChange={(e) => setDraftVideo(e.target.value)}
                  rows={4}
                  className="border-[var(--studio-line)] bg-[var(--studio-panel-strong)] text-sm text-[var(--studio-ink)] focus-visible:ring-[var(--brand-signal)]"
                />
                <div className="mt-2 flex gap-2">
                  <Button size="sm" disabled={saving} onClick={() => savePrompt('video')} className="h-7 bg-[var(--brand-signal)] text-white hover:bg-[var(--brand-signal-strong)]">
                    <Save className="mr-1 h-3 w-3" />{saving ? '保存中...' : '保存'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingVideo(false)} className="h-7 text-[var(--studio-muted)]">
                    <X className="mr-1 h-3 w-3" />取消
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-[var(--studio-panel-strong)] p-3 text-sm text-[var(--studio-ink)] leading-relaxed">
                {shot.video_prompt}
              </div>
            )}
          </div>

          {/* Dot navigation */}
          <div className="flex flex-wrap gap-1.5">
            {shots.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === currentIndex
                    ? 'bg-[var(--brand-signal)]'
                    : 'bg-[var(--studio-panel-strong)] hover:bg-[var(--studio-muted)]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[var(--studio-line)] px-6 py-3 text-sm text-[var(--studio-muted)]">
        <span>{total} 个分镜</span>
      </div>
    </div>
  );
}
