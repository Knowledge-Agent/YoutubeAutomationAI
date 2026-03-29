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

export interface ToolModelTagDefinition {
  label: string;
  tone?: 'accent' | 'muted' | 'success';
}

export interface ToolModelFamilyDefinition {
  key: string;
  label: string;
  description?: string;
  badge?: string;
}

export interface ToolModelUiDefinition {
  family?: ToolModelFamilyDefinition;
  mark?: string;
  outputLabel?: string;
  tags?: ToolModelTagDefinition[];
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
  optionOverrides?: Record<string, Partial<ToolOptionDefinition>>;
  creditCostByMode?: Partial<Record<ToolMode, number>>;
  capabilities?: ToolModelCapabilities;
  ui?: ToolModelUiDefinition;
}

export interface ToolCatalogResponse {
  surface: ToolSurface | 'all';
  models: ToolModelDefinition[];
  options: Record<string, ToolOptionDefinition>;
}
