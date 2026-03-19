'use client';

import { ToolTaskWorkspace } from '@/shared/blocks/tools/tool-task-workspace';

export function AiVideoWorkspaceUi({
  initialPrompt = '',
}: {
  initialPrompt?: string;
}) {
  return <ToolTaskWorkspace initialPrompt={initialPrompt} surface="video" />;
}
