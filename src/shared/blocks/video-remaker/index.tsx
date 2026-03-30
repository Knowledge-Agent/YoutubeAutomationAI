'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { getResult, getReview } from './api';
import { ScreenAnalyzing } from './screen-analyzing';
import { ScreenCreate } from './screen-create';
import { ScreenGenerating } from './screen-generating';
import { ScreenResult } from './screen-result';
import { ScreenReview } from './screen-review';
import type { ResultData, ReviewData, Screen } from './types';

export function VideoRemakerUi() {
  const [screen, setScreen] = useState<Screen>('create');
  const [taskId, setTaskId] = useState<string>('');
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [resultData, setResultData] = useState<ResultData | null>(null);

  function handleTaskCreated(id: string) {
    setTaskId(id);
    setScreen('analyzing');
  }

  const handleReviewReady = useCallback(async () => {
    try {
      const data = await getReview(taskId);
      setReviewData(data);
      setScreen('review');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : '获取审核数据失败');
    }
  }, [taskId]);

  function handleGenerating() {
    setScreen('generating');
  }

  const handleCompleted = useCallback(async () => {
    try {
      const data = await getResult(taskId);
      setResultData(data);
      setScreen('result');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : '获取结果失败');
    }
  }, [taskId]);

  function handleNewTask() {
    setTaskId('');
    setReviewData(null);
    setResultData(null);
    setScreen('create');
  }

  function handleRegenerated() {
    setScreen('generating');
  }

  return (
    <div className="flex h-full flex-col bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      {screen === 'create' && <ScreenCreate onTaskCreated={handleTaskCreated} />}

      {screen === 'analyzing' && (
        <ScreenAnalyzing
          taskId={taskId}
          onReviewReady={handleReviewReady}
          onCancel={handleNewTask}
        />
      )}

      {screen === 'review' && reviewData && (
        <ScreenReview taskId={taskId} onGenerating={handleGenerating} />
      )}

      {screen === 'generating' && reviewData && (
        <ScreenGenerating
          taskId={taskId}
          shots={reviewData.shots.map((s) => ({ shot_id: s.shot_id }))}
          onCompleted={handleCompleted}
        />
      )}

      {screen === 'result' && resultData && (
        <ScreenResult
          taskId={taskId}
          result={resultData}
          onNewTask={handleNewTask}
          onRegenerated={handleRegenerated}
        />
      )}
    </div>
  );
}
