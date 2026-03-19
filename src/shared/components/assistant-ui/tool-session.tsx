'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  AssistantAttachmentItem,
  AssistantSurface,
  AssistantToolMode,
  AssistantToolOptionMap,
  AssistantToolSessionState,
} from './types';

interface AssistantToolSessionContextValue {
  state: AssistantToolSessionState;
  setPrompt: (prompt: string) => void;
  setModelId: (modelId?: string) => void;
  setMode: (mode: AssistantToolMode) => void;
  setSurface: (surface: AssistantSurface) => void;
  setCreditsLabel: (creditsLabel?: string) => void;
  setOption: (key: string, value: string | number | boolean | undefined) => void;
  setOptions: (options: AssistantToolOptionMap) => void;
  setAttachments: (attachments: AssistantAttachmentItem[]) => void;
  reset: (nextState?: Partial<AssistantToolSessionState>) => void;
}

const AssistantToolSessionContext =
  createContext<AssistantToolSessionContextValue | null>(null);

export function useAssistantToolSession() {
  const context = useContext(AssistantToolSessionContext);

  if (!context) {
    throw new Error(
      'useAssistantToolSession must be used within AssistantToolSessionProvider'
    );
  }

  return context;
}

export function AssistantToolSessionProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: AssistantToolSessionState;
}) {
  const [state, setState] = useState<AssistantToolSessionState>(initialState);

  const value = useMemo<AssistantToolSessionContextValue>(
    () => ({
      state,
      setPrompt: (prompt) => setState((current) => ({ ...current, prompt })),
      setModelId: (modelId) =>
        setState((current) => ({ ...current, modelId })),
      setMode: (mode) => setState((current) => ({ ...current, mode })),
      setSurface: (surface) =>
        setState((current) => ({ ...current, surface })),
      setCreditsLabel: (creditsLabel) =>
        setState((current) => ({ ...current, creditsLabel })),
      setOption: (key, value) =>
        setState((current) => ({
          ...current,
          options: {
            ...current.options,
            [key]: value,
          },
        })),
      setOptions: (options) =>
        setState((current) => ({
          ...current,
          options: {
            ...current.options,
            ...options,
          },
        })),
      setAttachments: (attachments) =>
        setState((current) => ({ ...current, attachments })),
      reset: (nextState) =>
        setState(() => ({
          ...initialState,
          ...nextState,
        })),
    }),
    [initialState, state]
  );

  return (
    <AssistantToolSessionContext.Provider value={value}>
      {children}
    </AssistantToolSessionContext.Provider>
  );
}
