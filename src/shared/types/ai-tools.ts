export type ToolSurface = 'chat' | 'image' | 'video';

export type ToolMode =
  | 'chat'
  | 'text-to-image'
  | 'image-to-image'
  | 'text-to-video'
  | 'image-to-video'
  | 'video-to-video';

export type ToolOptionKind =
  | 'select'
  | 'number'
  | 'boolean'
  | 'text'
  | 'textarea'
  | 'image_urls'
  | 'video_urls';

export interface ToolOptionChoice {
  label: string;
  value: string;
}

export interface ToolOptionDefinition {
  key: string;
  label: string;
  type: ToolOptionKind;
  description?: string;
  required?: boolean;
  defaultValue?: string | number | boolean | string[];
  min?: number;
  max?: number;
  step?: number;
  maxItems?: number;
  placeholder?: string;
  options?: ToolOptionChoice[];
}

export interface ToolModelCapabilities {
  streaming?: boolean;
  attachments?: boolean;
  progress?: boolean;
}

export interface ToolModelDefinition {
  id: string;
  label: string;
  provider: 'apimart';
  surface: ToolSurface;
  mediaType?: 'text' | 'image' | 'video';
  endpointFamily: 'chat' | 'image' | 'video';
  description?: string;
  modeSupport: ToolMode[];
  defaultOptions?: Record<string, string | number | boolean | string[]>;
  supportedOptions: string[];
  creditCostByMode?: Partial<Record<ToolMode, number>>;
  capabilities?: ToolModelCapabilities;
}

export interface ToolCatalogResponse {
  surface: ToolSurface | 'all';
  models: ToolModelDefinition[];
  options: Record<string, ToolOptionDefinition>;
}
