import {
  ToolCatalogResponse,
  ToolModelDefinition,
  ToolOptionDefinition,
  ToolSurface,
} from '@/shared/types/ai-tools';

const sharedOptions: Record<string, ToolOptionDefinition> = {
  size: {
    key: 'size',
    label: 'Size',
    type: 'select',
    defaultValue: '1:1',
    options: [
      { label: '1:1', value: '1:1' },
      { label: '16:9', value: '16:9' },
      { label: '9:16', value: '9:16' },
      { label: '2:3', value: '2:3' },
      { label: '3:2', value: '3:2' },
    ],
  },
  aspect_ratio: {
    key: 'aspect_ratio',
    label: 'Aspect Ratio',
    type: 'select',
    defaultValue: '16:9',
    options: [
      { label: '16:9', value: '16:9' },
      { label: '9:16', value: '9:16' },
      { label: '1:1', value: '1:1' },
    ],
  },
  resolution: {
    key: 'resolution',
    label: 'Resolution',
    type: 'select',
    defaultValue: '720p',
    options: [
      { label: '360p', value: '360p' },
      { label: '540p', value: '540p' },
      { label: '720p', value: '720p' },
      { label: '1080p', value: '1080p' },
    ],
  },
  duration: {
    key: 'duration',
    label: 'Duration',
    type: 'select',
    defaultValue: '5',
    options: [
      { label: '5s', value: '5' },
      { label: '10s', value: '10' },
      { label: '15s', value: '15' },
      { label: '20s', value: '20' },
    ],
  },
  n: {
    key: 'n',
    label: 'Outputs',
    type: 'select',
    defaultValue: 1,
    options: [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '4', value: '4' },
    ],
  },
  image_urls: {
    key: 'image_urls',
    label: 'Reference Images',
    type: 'image_urls',
    maxItems: 5,
  },
  video_urls: {
    key: 'video_urls',
    label: 'Reference Videos',
    type: 'video_urls',
    maxItems: 1,
  },
  quality: {
    key: 'quality',
    label: 'Quality',
    type: 'select',
    options: [
      { label: 'Auto', value: 'auto' },
      { label: 'High', value: 'high' },
      { label: 'Medium', value: 'medium' },
    ],
  },
  style: {
    key: 'style',
    label: 'Style',
    type: 'select',
    options: [
      { label: 'Anime', value: 'anime' },
      { label: 'Comic', value: 'comic' },
      { label: 'News', value: 'news' },
      { label: 'Nostalgic', value: 'nostalgic' },
      { label: 'Selfie', value: 'selfie' },
    ],
  },
  watermark: {
    key: 'watermark',
    label: 'Watermark',
    type: 'boolean',
    defaultValue: false,
  },
  thumbnail: {
    key: 'thumbnail',
    label: 'Thumbnail',
    type: 'boolean',
    defaultValue: true,
  },
};

const models: ToolModelDefinition[] = [
  {
    id: 'gpt-4o',
    label: 'GPT-4o',
    provider: 'apimart',
    surface: 'chat',
    mediaType: 'text',
    endpointFamily: 'chat',
    description: 'General chat completion model via APIMart chat API',
    modeSupport: ['chat'],
    supportedOptions: [],
    capabilities: {
      streaming: true,
    },
  },
  {
    id: 'gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    provider: 'apimart',
    surface: 'chat',
    mediaType: 'text',
    endpointFamily: 'chat',
    description: 'Fast Gemini chat model via APIMart chat API',
    modeSupport: ['chat'],
    supportedOptions: [],
    capabilities: {
      streaming: true,
    },
  },
  {
    id: 'gpt-4o-image',
    label: 'GPT-4o Image',
    provider: 'apimart',
    surface: 'image',
    mediaType: 'image',
    endpointFamily: 'image',
    description: 'APIMart async image generation endpoint',
    modeSupport: ['text-to-image', 'image-to-image'],
    supportedOptions: ['size', 'n', 'image_urls'],
    defaultOptions: {
      size: '1:1',
      n: 1,
    },
    creditCostByMode: {
      'text-to-image': 2,
      'image-to-image': 4,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
  },
  {
    id: 'flux-kontext-pro',
    label: 'Flux Kontext Pro',
    provider: 'apimart',
    surface: 'image',
    mediaType: 'image',
    endpointFamily: 'image',
    description: 'Supports text-to-image and image editing with one reference',
    modeSupport: ['text-to-image', 'image-to-image'],
    supportedOptions: ['size', 'image_urls'],
    defaultOptions: {
      size: '16:9',
    },
    creditCostByMode: {
      'text-to-image': 2,
      'image-to-image': 4,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
  },
  {
    id: 'seedream-4.5',
    label: 'Seedream 4.5',
    provider: 'apimart',
    surface: 'image',
    mediaType: 'image',
    endpointFamily: 'image',
    description: 'Bytedance image generation family',
    modeSupport: ['text-to-image', 'image-to-image'],
    supportedOptions: ['size', 'n', 'image_urls'],
    defaultOptions: {
      size: '1:1',
      n: 1,
    },
    creditCostByMode: {
      'text-to-image': 2,
      'image-to-image': 4,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
  },
  {
    id: 'veo3',
    label: 'VEO3',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description: 'APIMart async video generation with text/image input',
    modeSupport: ['text-to-video', 'image-to-video'],
    supportedOptions: ['duration', 'aspect_ratio', 'resolution', 'image_urls'],
    defaultOptions: {
      duration: '5',
      aspect_ratio: '16:9',
      resolution: '720p',
    },
    creditCostByMode: {
      'text-to-video': 6,
      'image-to-video': 8,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
  },
  {
    id: 'sora-2',
    label: 'Sora 2',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description: 'APIMart async video generation with style and thumbnails',
    modeSupport: ['text-to-video', 'image-to-video'],
    supportedOptions: [
      'duration',
      'aspect_ratio',
      'image_urls',
      'watermark',
      'thumbnail',
      'style',
    ],
    defaultOptions: {
      duration: '5',
      aspect_ratio: '16:9',
      thumbnail: true,
      watermark: false,
    },
    creditCostByMode: {
      'text-to-video': 6,
      'image-to-video': 8,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
  },
  {
    id: 'kling-video-o1',
    label: 'Kling Video O1',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description: 'Video editing-oriented APIMart video family',
    modeSupport: ['text-to-video', 'image-to-video', 'video-to-video'],
    supportedOptions: [
      'duration',
      'aspect_ratio',
      'resolution',
      'image_urls',
      'video_urls',
    ],
    defaultOptions: {
      duration: '5',
      aspect_ratio: '16:9',
      resolution: '720p',
    },
    creditCostByMode: {
      'text-to-video': 6,
      'image-to-video': 8,
      'video-to-video': 10,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
  },
];

export function getToolOptions() {
  return sharedOptions;
}

export function getToolModels(surface?: ToolSurface) {
  if (!surface) {
    return models;
  }

  return models.filter((model) => model.surface === surface);
}

export function getToolModelById(id: string) {
  return models.find((model) => model.id === id);
}

export function getToolCatalog(surface?: ToolSurface): ToolCatalogResponse {
  return {
    surface: surface ?? 'all',
    models: getToolModels(surface),
    options: sharedOptions,
  };
}
