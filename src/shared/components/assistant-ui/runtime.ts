'use client';

import type { UIMessage } from '@ai-sdk/react';
import { useChatRuntime, type UseChatRuntimeOptions } from '@assistant-ui/react-ai-sdk';

export function useAssistantWorkspaceRuntime<
  UI_MESSAGE extends UIMessage = UIMessage,
>(options?: UseChatRuntimeOptions<UI_MESSAGE>) {
  return useChatRuntime(options);
}
