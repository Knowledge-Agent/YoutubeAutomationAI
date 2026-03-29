'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

import { useRouter } from '@/core/i18n/navigation';
import { useAppContext } from '@/shared/contexts/app';
import { useToolCatalog } from '@/shared/hooks/use-tool-catalog';
import { getGenerationLimitCopy } from '@/shared/lib/generation-limit';
import type { ToolMode, ToolSurface } from '@/shared/types/ai-tools';

type SupportedToolSurface = Exclude<ToolSurface, 'chat'>;

function showGenerationQuotaModal(
  showModal: (payload: { title: string; description: string }) => void,
  mediaType: 'image' | 'video'
) {
  showModal(getGenerationLimitCopy(mediaType));
}

export function useStartToolChat(surface: SupportedToolSurface) {
  const router = useRouter();
  const { user, setIsShowSignModal, showGenerationLimitModal } =
    useAppContext();
  const { models: chatModels, loading: chatLoading } = useToolCatalog('chat');
  const { models: toolModels, loading: toolLoading } = useToolCatalog(surface);

  return useCallback(
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

      try {
        const resp = await fetch('/api/chat/tool-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: trimmedPrompt,
            surface,
            mode,
            model: chatModel,
            toolModel: selectedToolModel.id,
            toolOptions: toolOptions ?? selectedToolModel.defaultOptions ?? {},
            appendPrompt: true,
          }),
        });

        if (!resp.ok) {
          throw new Error(`request failed with status: ${resp.status}`);
        }

        const json = (await resp.json()) as {
          code: number;
          message?: string;
          data?: {
            path: string;
          };
        };

        if (
          json.code === -2 ||
          json.message === 'daily_generation_limit_reached'
        ) {
          showGenerationQuotaModal(showGenerationLimitModal, surface);
          return;
        }

        if (json.code !== 0 || !json.data?.path) {
          throw new Error(json.message || 'failed to start tool session');
        }

        router.push(json.data.path);
      } catch (error: any) {
        toast.error(error.message || 'failed to start tool session');
      }
    },
    [
      chatLoading,
      chatModels,
      router,
      setIsShowSignModal,
      showGenerationLimitModal,
      surface,
      toolLoading,
      toolModels,
      user,
    ]
  );
}
