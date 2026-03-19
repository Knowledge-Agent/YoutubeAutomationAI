'use client';

import { useEffect, useMemo, useState } from 'react';
import { UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

import {
  AssistantModelPicker,
  AssistantModelOption,
  AssistantWorkspaceThread,
  useAssistantWorkspaceRuntime,
} from '@/shared/components/assistant-ui';
import { useToolCatalog } from '@/shared/hooks/use-tool-catalog';
import { useChatContext } from '@/shared/contexts/chat';
import { Chat } from '@/shared/types/chat';

import { ChatHeader } from './header';

export function ChatBox({
  initialChat,
  initialMessages,
}: {
  initialChat?: Chat;
  initialMessages?: UIMessage[];
}) {
  const { setChat } = useChatContext();
  const { models } = useToolCatalog('chat');
  const [selectedModelId, setSelectedModelId] = useState(
    initialChat?.model ?? ''
  );

  const runtime = useAssistantWorkspaceRuntime({
    id: initialChat?.id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest({ messages, id, body }) {
        const extraBody = body ?? {};

        return {
          body: {
            ...extraBody,
            chatId: id,
            model: selectedModelId || initialChat?.model || models[0]?.id,
            message: messages[messages.length - 1],
          },
        };
      },
    }),
  });

  const modelOptions = useMemo<AssistantModelOption[]>(
    () =>
      models.map((model) => ({
        id: model.id,
        label: model.label,
        provider: model.provider,
        providerLabel: 'APIMart',
        description: model.description,
        surface: 'chat',
        modes: model.modeSupport,
      })),
    [models]
  );

  useEffect(() => {
    if (initialChat) {
      setChat(initialChat);
    }
  }, [initialChat, setChat]);

  useEffect(() => {
    if (!selectedModelId && initialChat?.model) {
      setSelectedModelId(initialChat.model);
      return;
    }

    if (!selectedModelId && models[0]?.id) {
      setSelectedModelId(models[0].id);
    }
  }, [initialChat?.model, models, selectedModelId]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <ChatHeader />
      <div className="min-h-0 flex-1 bg-[#15161d]">
        <AssistantWorkspaceThread
          runtime={runtime}
          composerPlaceholder="Ask about scripts, workflows, prompts, or growth ideas"
          composerToolbar={
            <AssistantModelPicker
              compact
              models={modelOptions}
              onSelect={setSelectedModelId}
              selectedModelId={selectedModelId}
            />
          }
          emptyDescription="Ask for ideas, rewrite prompts, or use APIMart-backed chat to plan your next asset."
          emptyTitle={initialChat?.title || 'Start the conversation'}
          suggestions={[
            {
              label: 'Rewrite my thumbnail prompt',
              prompt: 'Rewrite my thumbnail prompt to improve click-through rate.',
            },
            {
              label: 'Plan a faceless channel',
              prompt: 'Plan a faceless YouTube channel workflow using image and video generation.',
            },
            {
              label: 'Generate better hooks',
              prompt: 'Give me 10 stronger hooks for a YouTube automation video.',
            },
          ]}
        />
      </div>
    </div>
  );
}
