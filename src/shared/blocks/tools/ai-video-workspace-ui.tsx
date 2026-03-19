'use client';

import { ToolTaskWorkspace } from '@/shared/blocks/tools/tool-task-workspace';

export function AiVideoWorkspaceUi({
  initialPrompt = '',
  initialMode,
}: {
  initialPrompt?: string;
  initialMode?: 'text-to-video' | 'image-to-video' | 'video-to-video';
}) {
  return (
    <ToolTaskWorkspace
      initialMode={initialMode}
      initialPrompt={initialPrompt}
      surface="video"
    />
  );
}
