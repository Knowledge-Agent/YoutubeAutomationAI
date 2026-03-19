'use client';

import { ToolTaskWorkspace } from '@/shared/blocks/tools/tool-task-workspace';

export function AiImageWorkspaceUi({
  initialPrompt = '',
  initialMode,
}: {
  initialPrompt?: string;
  initialMode?: 'text-to-image' | 'image-to-image';
}) {
  return (
    <ToolTaskWorkspace
      initialMode={initialMode}
      initialPrompt={initialPrompt}
      surface="image"
    />
  );
}
