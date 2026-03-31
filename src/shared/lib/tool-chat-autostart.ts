'use client';

import type { ToolMode } from '@/shared/types/ai-tools';

const TOOL_CHAT_AUTOSTART_PREFIX = 'tool-chat-autostart:';

export type PendingToolChatAutostart = {
  prompt: string;
  mode: Extract<
    ToolMode,
    'text-to-image' | 'image-to-image' | 'text-to-video' | 'image-to-video'
  >;
  toolModel: string;
  toolOptions?: Record<string, unknown>;
};

function getStorageKey(chatId: string) {
  return `${TOOL_CHAT_AUTOSTART_PREFIX}${chatId}`;
}

export function setPendingToolChatAutostart(
  chatId: string,
  payload: PendingToolChatAutostart
) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(getStorageKey(chatId), JSON.stringify(payload));
}

export function takePendingToolChatAutostart(chatId: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  const storageKey = getStorageKey(chatId);
  const rawValue = window.sessionStorage.getItem(storageKey);
  if (!rawValue) {
    return null;
  }

  window.sessionStorage.removeItem(storageKey);

  try {
    const parsed = JSON.parse(rawValue);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.prompt === 'string' &&
      typeof parsed.mode === 'string' &&
      typeof parsed.toolModel === 'string'
    ) {
      return parsed as PendingToolChatAutostart;
    }
  } catch {
    return null;
  }

  return null;
}
