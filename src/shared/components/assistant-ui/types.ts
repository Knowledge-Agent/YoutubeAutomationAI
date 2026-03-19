import type { AssistantToolUI } from '@assistant-ui/react';

export type AssistantSurface = 'chat' | 'image' | 'video';

export type AssistantToolMode =
  | 'chat'
  | 'text-to-image'
  | 'image-to-image'
  | 'text-to-video'
  | 'image-to-video'
  | 'video-to-video';

export type AssistantTaskStatus =
  | 'idle'
  | 'pending'
  | 'processing'
  | 'success'
  | 'failed'
  | 'canceled';

export interface AssistantModelOption {
  id: string;
  label: string;
  provider: string;
  providerLabel?: string;
  description?: string;
  meta?: string;
  surface: AssistantSurface;
  modes?: AssistantToolMode[];
  badge?: string;
  tags?: string[];
}

export interface AssistantSuggestion {
  id?: string;
  label: string;
  prompt: string;
}

export interface AssistantAttachmentItem {
  id: string;
  url?: string;
  name?: string;
  mimeType?: string;
}

export interface AssistantToolOptionMap {
  aspectRatio?: string;
  duration?: string;
  resolution?: string;
  style?: string;
  quality?: string;
  count?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface AssistantToolSessionState {
  surface: AssistantSurface;
  mode: AssistantToolMode;
  modelId?: string;
  prompt: string;
  options: AssistantToolOptionMap;
  attachments: AssistantAttachmentItem[];
  creditsLabel?: string;
}

export interface AssistantTaskAsset {
  id: string;
  kind: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  alt?: string;
}

export interface AssistantTaskCardData {
  id: string;
  title?: string;
  prompt: string;
  status: AssistantTaskStatus;
  progress?: number;
  modeLabel?: string;
  providerLabel?: string;
  modelLabel?: string;
  createdAtLabel?: string;
  errorMessage?: string;
  assets?: AssistantTaskAsset[];
}

export interface AssistantWorkspaceToolRegistry {
  tools?: AssistantToolUI[];
}
