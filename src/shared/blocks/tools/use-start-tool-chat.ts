'use client';

import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useRouter } from '@/core/i18n/navigation';
import { useAppContext } from '@/shared/contexts/app';
import { useToolCatalog } from '@/shared/hooks/use-tool-catalog';
import { setPendingToolChatAutostart } from '@/shared/lib/tool-chat-autostart';
import type { ToolMode, ToolSurface } from '@/shared/types/ai-tools';

type SupportedToolSurface = Exclude<ToolSurface, 'chat'>;

export function useStartToolChat(surface: SupportedToolSurface) {
  const router = useRouter();
  const { user, setIsShowSignModal, setUser } = useAppContext();
  const { models: chatModels, loading: chatLoading } = useToolCatalog('chat');
  const { models: toolModels, loading: toolLoading } = useToolCatalog(surface);
  const startLockRef = useRef(false);
  const ensurePromiseRef = useRef<Promise<{
    chatId: string;
    path: string;
  } | null> | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const ensureToolChat = useCallback(
    async ({
      mode,
      toolModelId,
      toolOptions,
    }: {
      mode: Extract<
        ToolMode,
        'text-to-image' | 'image-to-image' | 'text-to-video' | 'image-to-video'
      >;
      toolModelId: string;
      toolOptions: Record<string, unknown>;
    }) => {
      if (!user) {
        throw new Error('no auth, please sign in');
      }

      const existingChatId = user.toolChatIds?.[surface];
      if (existingChatId) {
        return {
          chatId: existingChatId,
          path: `/chat/${existingChatId}`,
        };
      }

      if (ensurePromiseRef.current) {
        return ensurePromiseRef.current;
      }

      const chatModel = chatModels[0]?.id;
      if (!chatModel) {
        throw new Error('No chat model is available right now.');
      }

      const promise = (async () => {
        const resp = await fetch('/api/chat/ensure-tool-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            surface,
            mode,
            model: chatModel,
            toolModel: toolModelId,
            toolOptions,
          }),
        });

        if (!resp.ok) {
          throw new Error(`request failed with status: ${resp.status}`);
        }

        const json = (await resp.json()) as {
          code: number;
          message?: string;
          data?: {
            id: string;
            path: string;
          };
        };

        if (json.code !== 0 || !json.data?.path || !json.data?.id) {
          throw new Error(json.message || 'failed to ensure tool chat');
        }

        const ensuredChatId = json.data.id;
        const targetPath = json.data.path;

        if (user.toolChatIds?.[surface] !== ensuredChatId) {
          setUser({
            ...user,
            toolChatIds: {
              ...user.toolChatIds,
              [surface]: ensuredChatId,
            },
          });
        }

        if (typeof (router as any).prefetch === 'function') {
          void (router as any).prefetch(targetPath);
        }

        return {
          chatId: ensuredChatId,
          path: targetPath,
        };
      })();

      ensurePromiseRef.current = promise;

      try {
        return await promise;
      } finally {
        if (ensurePromiseRef.current === promise) {
          ensurePromiseRef.current = null;
        }
      }
    },
    [chatModels, router, setUser, surface, user]
  );

  const startToolChat = useCallback(
    async ({
      prompt,
      mode,
      toolModel,
      toolOptions,
    }: {
      prompt: string;
      mode: Extract<
        ToolMode,
        'text-to-image' | 'image-to-image' | 'text-to-video' | 'image-to-video'
      >;
      toolModel?: string;
      toolOptions?: Record<string, unknown>;
    }) => {
      if (startLockRef.current) {
        return;
      }

      const trimmedPrompt = prompt.trim();
      if (!trimmedPrompt) {
        return;
      }

      if (!user) {
        setIsShowSignModal(true);
        return;
      }

      if (chatLoading || toolLoading) {
        toast.error('Models are still loading. Please try again.');
        return;
      }

      const selectedToolModel =
        toolModels.find((item) => item.id === toolModel) ??
        toolModels.find((item) => item.modeSupport.includes(mode));
      if (!selectedToolModel) {
        toast.error('No generation model is available for this workflow.');
        return;
      }

      let redirecting = false;

      try {
        startLockRef.current = true;
        setIsStarting(true);

        const resolvedToolOptions =
          toolOptions ?? selectedToolModel.defaultOptions ?? {};
        const ensured = await ensureToolChat({
          mode,
          toolModelId: selectedToolModel.id,
          toolOptions: resolvedToolOptions,
        });
        const ensuredChatId = ensured?.chatId ?? user.toolChatIds?.[surface];
        const targetPath = ensured?.path ?? `/chat/${ensuredChatId}`;

        if (!ensuredChatId) {
          throw new Error('failed to resolve tool chat');
        }

        setPendingToolChatAutostart(ensuredChatId, {
          prompt: trimmedPrompt,
          mode,
          toolModel: selectedToolModel.id,
          toolOptions: resolvedToolOptions,
        });

        redirecting = true;
        router.push(`${targetPath}?autostart=1`);
      } catch (error: any) {
        toast.error(error.message || 'failed to start tool session');
      } finally {
        if (!redirecting) {
          startLockRef.current = false;
          setIsStarting(false);
        }
      }
    },
    [
      chatLoading,
      ensureToolChat,
      router,
      setIsShowSignModal,
      surface,
      toolLoading,
      toolModels,
      user,
    ]
  );

  return {
    isStarting,
    startToolChat,
  };
}
