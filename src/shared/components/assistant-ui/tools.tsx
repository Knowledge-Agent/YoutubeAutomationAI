'use client';

import { makeAssistantToolUI, type ToolCallMessagePartProps } from '@assistant-ui/react';

import { AssistantTaskCard } from './task-card';
import { AssistantTaskCardData } from './types';

function normalizeTaskPart<TArgs, TResult>(
  part: ToolCallMessagePartProps<TArgs, TResult>
) {
  const result =
    part.result && typeof part.result === 'object'
      ? (part.result as Record<string, unknown>)
      : undefined;
  const args =
    part.args && typeof part.args === 'object'
      ? (part.args as Record<string, unknown>)
      : undefined;

  const normalized: AssistantTaskCardData = {
    id: String(result?.id ?? args?.id ?? part.toolCallId),
    prompt: String(
      result?.prompt ?? args?.prompt ?? result?.title ?? part.toolName
    ),
    status:
      (result?.status as AssistantTaskCardData['status']) ??
      (part.status.type === 'complete'
        ? 'success'
        : part.status.type === 'incomplete'
          ? 'failed'
          : part.status.type === 'requires-action'
            ? 'pending'
            : 'processing'),
    title: typeof result?.title === 'string' ? result.title : undefined,
    progress:
      typeof result?.progress === 'number'
        ? result.progress
        : typeof args?.progress === 'number'
          ? args.progress
          : undefined,
    modeLabel:
      typeof result?.modeLabel === 'string'
        ? result.modeLabel
        : typeof args?.modeLabel === 'string'
          ? args.modeLabel
          : undefined,
    providerLabel:
      typeof result?.providerLabel === 'string'
        ? result.providerLabel
        : typeof args?.providerLabel === 'string'
          ? args.providerLabel
          : undefined,
    modelLabel:
      typeof result?.modelLabel === 'string'
        ? result.modelLabel
        : typeof args?.modelLabel === 'string'
          ? args.modelLabel
          : undefined,
    createdAtLabel:
      typeof result?.createdAtLabel === 'string'
        ? result.createdAtLabel
        : undefined,
    errorMessage:
      typeof result?.errorMessage === 'string'
        ? result.errorMessage
        : part.isError
          ? 'Tool call failed.'
          : undefined,
    assets: Array.isArray(result?.assets)
      ? (result.assets as AssistantTaskCardData['assets'])
      : undefined,
  };

  return normalized;
}

export function createAssistantTaskToolUI(toolName: string) {
  return makeAssistantToolUI({
    toolName,
    render: (part) => <AssistantTaskCard task={normalizeTaskPart(part)} />,
  });
}

export const imageTaskToolUI = createAssistantTaskToolUI('image_task');
export const videoTaskToolUI = createAssistantTaskToolUI('video_task');
