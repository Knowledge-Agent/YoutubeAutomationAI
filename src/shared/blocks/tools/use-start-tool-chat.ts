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
  const [isStarting, setIsStarting] = useState(false);

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

      const chatModel = chatModels[0]?.id;
      if (!chatModel) {
        toast.error('No chat model is available right now.');
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
        const existingChatId = user.toolChatIds?.[surface];
        let ensuredChatId = existingChatId;
        let targetPath = existingChatId ? `/chat/${existingChatId}` : '';

        if (!ensuredChatId) {
          const resp = await fetch('/api/chat/ensure-tool-chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              surface,
              mode,
              model: chatModel,
              toolModel: selectedToolModel.id,
              toolOptions: resolvedToolOptions,
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

          ensuredChatId = json.data.id;
          targetPath = json.data.path;
        }

        if (!ensuredChatId) {
          throw new Error('failed to resolve tool chat');
        }

        setPendingToolChatAutostart(ensuredChatId, {
          prompt: trimmedPrompt,
          mode,
          toolModel: selectedToolModel.id,
          toolOptions: resolvedToolOptions,
        });
        setUser(
          user.toolChatIds?.[surface] === ensuredChatId
            ? user
            : {
                ...user,
                toolChatIds: {
                  ...user.toolChatIds,
                  [surface]: ensuredChatId,
                },
              }
        );

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
      chatModels,
      router,
      setIsShowSignModal,
      setUser,
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
