'use client';

import { ToolTaskWorkspace } from '@/shared/blocks/tools/tool-task-workspace';

export function AiImageWorkspaceUi({
  initialPrompt = '',
}: {
  initialPrompt?: string;
}) {
  return <ToolTaskWorkspace initialPrompt={initialPrompt} surface="image" />;
}
