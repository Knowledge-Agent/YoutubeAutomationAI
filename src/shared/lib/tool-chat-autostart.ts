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

function parsePendingToolChatAutostart(rawValue: string | null) {
  if (!rawValue) {
    return null;
  }

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

export function setPendingToolChatAutostart(
  chatId: string,
  payload: PendingToolChatAutostart
) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(getStorageKey(chatId), JSON.stringify(payload));
}

export function peekPendingToolChatAutostart(chatId: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  return parsePendingToolChatAutostart(
    window.sessionStorage.getItem(getStorageKey(chatId))
  );
}

export function takePendingToolChatAutostart(chatId: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  const storageKey = getStorageKey(chatId);
  const parsed = parsePendingToolChatAutostart(
    window.sessionStorage.getItem(storageKey)
  );
  window.sessionStorage.removeItem(storageKey);
  return parsed;
}
