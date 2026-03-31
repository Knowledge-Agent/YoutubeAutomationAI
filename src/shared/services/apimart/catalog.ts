import {
  ToolCatalogResponse,
  ToolModelDefinition,
  ToolOptionDefinition,
  ToolSurface,
} from '@/shared/types/ai-tools';

const aspectRatioChoices = [
  { label: '21:9', value: '21:9' },
  { label: '16:9', value: '16:9' },
  { label: '4:3', value: '4:3' },
  { label: '1:1', value: '1:1' },
  { label: '3:4', value: '3:4' },
  { label: '9:16', value: '9:16' },
];

const resolutionChoices = [
  { label: '512p', value: '512p' },
  { label: '720p', value: '720p' },
  { label: '768p', value: '768p' },
  { label: '1080p', value: '1080p' },
];

const durationChoices = [
  { label: '4s', value: '4' },
  { label: '5s', value: '5' },
  { label: '6s', value: '6' },
  { label: '8s', value: '8' },
  { label: '10s', value: '10' },
  { label: '12s', value: '12' },
  { label: '15s', value: '15' },
  { label: '25s', value: '25' },
];

const sharedOptions: Record<string, ToolOptionDefinition> = {
  size: {
    key: 'size',
    label: 'Size',
    type: 'select',
    defaultValue: '1:1',
    options: [
      { label: 'auto', value: 'auto' },
      { label: 'match_input_image', value: 'match_input_image' },
      { label: '1:1', value: '1:1' },
      { label: '4:5', value: '4:5' },
      { label: '5:4', value: '5:4' },
      { label: '16:9', value: '16:9' },
      { label: '9:16', value: '9:16' },
      { label: '4:3', value: '4:3' },
      { label: '3:4', value: '3:4' },
      { label: '2:3', value: '2:3' },
      { label: '3:2', value: '3:2' },
      { label: '21:9', value: '21:9' },
      { label: '9:21', value: '9:21' },
      { label: '1:4', value: '1:4' },
      { label: '4:1', value: '4:1' },
      { label: '1:8', value: '1:8' },
      { label: '8:1', value: '8:1' },
    ],
  },
  aspect_ratio: {
    key: 'aspect_ratio',
    label: 'Aspect Ratio',
    type: 'select',
    defaultValue: '16:9',
    options: aspectRatioChoices,
  },
  resolution: {
    key: 'resolution',
    label: 'Resolution',
    type: 'select',
    defaultValue: '1K',
    options: [
      { label: '1K', value: '1K' },
      { label: '2K', value: '2K' },
      { label: '4K', value: '4K' },
      ...resolutionChoices,
    ],
  },
  duration: {
    key: 'duration',
    label: 'Duration',
    type: 'select',
    defaultValue: '5',
    options: durationChoices,
  },
  mode: {
    key: 'mode',
    label: 'Mode',
    type: 'select',
    defaultValue: 'std',
    options: [
      { label: 'Standard', value: 'std' },
      { label: 'Professional', value: 'pro' },
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
  negative_prompt: {
    key: 'negative_prompt',
    label: 'Negative Prompt',
    type: 'text',
    placeholder: 'Exclude unwanted content',
  },
  audio: {
    key: 'audio',
    label: 'Audio',
    type: 'boolean',
    defaultValue: false,
  },
  seed: {
    key: 'seed',
    label: 'Seed',
    type: 'number',
    min: 0,
    step: 1,
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
  camerafixed: {
    key: 'camerafixed',
    label: 'Camera Fixed',
    type: 'boolean',
    defaultValue: false,
  },
  prompt_optimizer: {
    key: 'prompt_optimizer',
    label: 'Prompt Optimizer',
    type: 'boolean',
    defaultValue: true,
  },
  fast_pretreatment: {
    key: 'fast_pretreatment',
    label: 'Fast Pretreatment',
    type: 'boolean',
    defaultValue: false,
  },
  response_format: {
    key: 'response_format',
    label: 'Format',
    type: 'select',
    defaultValue: 'png',
    options: [
      { label: 'PNG', value: 'png' },
      { label: 'JPG', value: 'jpg' },
    ],
  },
  official_fallback: {
    key: 'official_fallback',
    label: 'Official Fallback',
    type: 'boolean',
    defaultValue: false,
  },
  prompt_upsampling: {
    key: 'prompt_upsampling',
    label: 'Prompt Upsampling',
    type: 'boolean',
    defaultValue: false,
  },
  safety_tolerance: {
    key: 'safety_tolerance',
    label: 'Safety',
    type: 'select',
    defaultValue: '2',
    options: [
      { label: '0', value: '0' },
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
    ],
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
    id: 'gemini-2.5-flash-image-preview',
    label: 'Gemini 2.5 Flash Image',
    provider: 'apimart',
    surface: 'image',
    mediaType: 'image',
    endpointFamily: 'image',
    description:
      'Nano banana fast image generation with optional official fallback',
    modeSupport: ['text-to-image', 'image-to-image'],
    supportedOptions: ['size', 'resolution', 'n', 'image_urls'],
    defaultOptions: {
      size: '1:1',
      resolution: '1K',
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
    optionOverrides: {
      resolution: {
        defaultValue: '1K',
        options: [{ label: '1K', value: '1K' }],
      },
      image_urls: {
        maxItems: 14,
      },
    },
    ui: {
      family: {
        key: 'gemini',
        label: 'Gemini Image',
        description: 'Google image generation family',
        badge: 'Fast',
      },
      mark: 'G',
      outputLabel: '1K fast',
      tags: [{ label: 'Fast', tone: 'success' }],
    },
  },
  {
    id: 'gemini-3.1-flash-image-preview',
    label: 'Gemini 3.1 Flash Image',
    provider: 'apimart',
    surface: 'image',
    mediaType: 'image',
    endpointFamily: 'image',
    description:
      'Nano banana2 with up to 4K output and broad aspect ratio support',
    modeSupport: ['text-to-image', 'image-to-image'],
    supportedOptions: ['size', 'resolution', 'n', 'image_urls'],
    defaultOptions: {
      size: '1:1',
      resolution: '2K',
      n: 1,
    },
    creditCostByMode: {
      'text-to-image': 3,
      'image-to-image': 5,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
    optionOverrides: {
      resolution: {
        defaultValue: '2K',
        options: [
          { label: '1K', value: '1K' },
          { label: '2K', value: '2K' },
          { label: '4K', value: '4K' },
        ],
      },
      image_urls: {
        maxItems: 14,
      },
    },
    ui: {
      family: {
        key: 'gemini',
        label: 'Gemini Image',
        description: 'Google image generation family',
        badge: 'Fast',
      },
      mark: 'G',
      outputLabel: 'Up to 4K',
      tags: [
        { label: '4K', tone: 'accent' },
        { label: 'Multi-ref', tone: 'muted' },
      ],
    },
  },
  {
    id: 'gemini-3-pro-image-preview',
    label: 'Gemini 3 Pro Image',
    provider: 'apimart',
    surface: 'image',
    mediaType: 'image',
    endpointFamily: 'image',
    description:
      'Nano banana Pro for higher quality professional image generation',
    modeSupport: ['text-to-image', 'image-to-image'],
    supportedOptions: ['size', 'resolution', 'n', 'image_urls'],
    defaultOptions: {
      size: '1:1',
      resolution: '1K',
      n: 1,
    },
    creditCostByMode: {
      'text-to-image': 4,
      'image-to-image': 6,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
    optionOverrides: {
      resolution: {
        defaultValue: '1K',
        options: [{ label: '1K', value: '1K' }],
      },
      image_urls: {
        maxItems: 14,
      },
    },
    ui: {
      family: {
        key: 'gemini',
        label: 'Gemini Image',
        description: 'Google image generation family',
        badge: 'Pro',
      },
      mark: 'G',
      outputLabel: 'Pro quality',
      tags: [{ label: 'Pro', tone: 'accent' }],
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
    ui: {
      family: {
        key: 'openai-image',
        label: 'OpenAI Image',
        description: 'OpenAI native image generation and editing',
      },
      mark: 'G',
      outputLabel: '1-4 images',
      tags: [{ label: 'OpenAI', tone: 'muted' }],
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
    optionOverrides: {
      size: {
        defaultValue: '16:9',
      },
      image_urls: {
        maxItems: 1,
      },
    },
    ui: {
      family: {
        key: 'flux-kontext',
        label: 'Flux Kontext',
        description: 'Context-aware image editing and generation',
      },
      mark: 'F',
      outputLabel: 'Edit + generate',
      tags: [{ label: 'Edit', tone: 'accent' }],
    },
  },
  {
    id: 'flux-kontext-max',
    label: 'Flux Kontext Max',
    provider: 'apimart',
    surface: 'image',
    mediaType: 'image',
    endpointFamily: 'image',
    description: 'Higher quality Flux Kontext image editing model',
    modeSupport: ['text-to-image', 'image-to-image'],
    supportedOptions: [
      'size',
      'image_urls',
      'response_format',
      'safety_tolerance',
      'prompt_upsampling',
    ],
    defaultOptions: {
      size: '16:9',
      response_format: 'png',
      safety_tolerance: '2',
      prompt_upsampling: false,
    },
    creditCostByMode: {
      'text-to-image': 3,
      'image-to-image': 5,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
    optionOverrides: {
      size: {
        defaultValue: '16:9',
      },
      image_urls: {
        maxItems: 1,
      },
    },
    ui: {
      family: {
        key: 'flux-kontext',
        label: 'Flux Kontext',
        description: 'Context-aware image editing and generation',
        badge: 'Max',
      },
      mark: 'F',
      outputLabel: 'Max quality',
      tags: [{ label: 'HQ', tone: 'accent' }],
    },
  },
  {
    id: 'flux-2-flex',
    label: 'Flux 2.0 Flex',
    provider: 'apimart',
    surface: 'image',
    mediaType: 'image',
    endpointFamily: 'image',
    description: 'Faster Flux 2.0 image generation for quick iterations',
    modeSupport: ['text-to-image', 'image-to-image'],
    supportedOptions: ['size', 'resolution', 'image_urls'],
    defaultOptions: {
      size: '1:1',
      resolution: '1K',
    },
    creditCostByMode: {
      'text-to-image': 2,
      'image-to-image': 4,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
    optionOverrides: {
      resolution: {
        defaultValue: '1K',
        options: [
          { label: '1K', value: '1K' },
          { label: '2K', value: '2K' },
        ],
      },
      image_urls: {
        maxItems: 8,
      },
    },
    ui: {
      family: {
        key: 'flux-2',
        label: 'Flux 2.0',
        description: 'Black Forest Labs image generation family',
        badge: 'Flex',
      },
      mark: 'F',
      outputLabel: '1K-2K',
      tags: [{ label: 'Fast', tone: 'success' }],
    },
  },
  {
    id: 'flux-2-pro',
    label: 'Flux 2.0 Pro',
    provider: 'apimart',
    surface: 'image',
    mediaType: 'image',
    endpointFamily: 'image',
    description: 'Higher quality Flux 2.0 image generation model',
    modeSupport: ['text-to-image', 'image-to-image'],
    supportedOptions: ['size', 'resolution', 'image_urls'],
    defaultOptions: {
      size: '1:1',
      resolution: '2K',
    },
    creditCostByMode: {
      'text-to-image': 3,
      'image-to-image': 5,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
    optionOverrides: {
      resolution: {
        defaultValue: '2K',
        options: [
          { label: '1K', value: '1K' },
          { label: '2K', value: '2K' },
        ],
      },
      image_urls: {
        maxItems: 8,
      },
    },
    ui: {
      family: {
        key: 'flux-2',
        label: 'Flux 2.0',
        description: 'Black Forest Labs image generation family',
        badge: 'Pro',
      },
      mark: 'F',
      outputLabel: 'High detail',
      tags: [{ label: 'Pro', tone: 'accent' }],
    },
  },
  {
    id: 'doubao-seedance-4-0',
    label: 'Seedream 4.0',
    provider: 'apimart',
    surface: 'image',
    mediaType: 'image',
    endpointFamily: 'image',
    description:
      'Seedream 4.0 supports text-to-image, image-to-image, and image editing',
    modeSupport: ['text-to-image', 'image-to-image'],
    supportedOptions: ['size', 'resolution', 'n', 'image_urls', 'watermark'],
    defaultOptions: {
      size: '1:1',
      resolution: '2K',
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
    optionOverrides: {
      resolution: {
        defaultValue: '2K',
        options: [
          { label: '1K', value: '1K' },
          { label: '2K', value: '2K' },
          { label: '4K', value: '4K' },
        ],
      },
      n: {
        options: [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '4', value: '4' },
          { label: '8', value: '8' },
        ],
      },
      image_urls: {
        maxItems: 10,
      },
    },
    ui: {
      family: {
        key: 'seedream',
        label: 'Seedream',
        description: 'Bytedance image generation family',
      },
      mark: 'S',
      outputLabel: '1K-4K',
      tags: [{ label: 'Edit', tone: 'accent' }],
    },
  },
  {
    id: 'doubao-seedance-4-5',
    label: 'Seedream 4.5',
    provider: 'apimart',
    surface: 'image',
    mediaType: 'image',
    endpointFamily: 'image',
    description: 'Bytedance image generation family',
    modeSupport: ['text-to-image', 'image-to-image'],
    supportedOptions: ['size', 'resolution', 'n', 'image_urls', 'watermark'],
    defaultOptions: {
      size: '1:1',
      resolution: '2K',
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
    optionOverrides: {
      resolution: {
        defaultValue: '2K',
        options: [
          { label: '2K', value: '2K' },
          { label: '4K', value: '4K' },
        ],
      },
      n: {
        options: [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '4', value: '4' },
          { label: '8', value: '8' },
        ],
      },
      image_urls: {
        maxItems: 10,
      },
    },
    ui: {
      family: {
        key: 'seedream',
        label: 'Seedream',
        description: 'Bytedance image generation family',
        badge: '4.5',
      },
      mark: 'S',
      outputLabel: '2K-4K',
      tags: [{ label: 'HQ', tone: 'accent' }],
    },
  },
  {
    id: 'doubao-seedream-5-0-lite',
    label: 'Seedream 5.0 Lite',
    provider: 'apimart',
    surface: 'image',
    mediaType: 'image',
    endpointFamily: 'image',
    description: 'Seedream 5.0 Lite image generation family',
    modeSupport: ['text-to-image', 'image-to-image'],
    supportedOptions: ['size', 'resolution', 'n', 'image_urls', 'watermark'],
    defaultOptions: {
      size: '1:1',
      resolution: '2K',
      n: 1,
    },
    creditCostByMode: {
      'text-to-image': 3,
      'image-to-image': 5,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
    optionOverrides: {
      resolution: {
        defaultValue: '2K',
        options: [
          { label: '2K', value: '2K' },
          { label: '3K', value: '3K' },
        ],
      },
      n: {
        options: [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '4', value: '4' },
          { label: '8', value: '8' },
        ],
      },
      image_urls: {
        maxItems: 10,
      },
    },
    ui: {
      family: {
        key: 'seedream',
        label: 'Seedream',
        description: 'Bytedance image generation family',
        badge: '5 Lite',
      },
      mark: 'S',
      outputLabel: 'Lite 2K-3K',
      tags: [
        { label: 'Lite', tone: 'success' },
        { label: 'HQ', tone: 'accent' },
      ],
    },
  },
  {
    id: 'veo3.1-fast',
    label: 'VEO3.1 Fast',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description: 'Fast VEO3 generation for quick previews and iterations',
    modeSupport: ['text-to-video', 'image-to-video'],
    supportedOptions: ['duration', 'aspect_ratio', 'resolution', 'image_urls'],
    defaultOptions: {
      duration: '8',
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
    optionOverrides: {
      duration: {
        defaultValue: '8',
        options: [{ label: '8s', value: '8' }],
      },
      aspect_ratio: {
        options: [
          { label: '16:9', value: '16:9' },
          { label: '9:16', value: '9:16' },
        ],
      },
      resolution: {
        defaultValue: '720p',
        options: [{ label: '720p', value: '720p' }],
      },
      image_urls: {
        maxItems: 3,
      },
    },
    ui: {
      family: {
        key: 'veo',
        label: 'Google',
        description: 'Preview-first clips with native audio support',
        badge: 'Audio',
      },
      mark: 'V',
      outputLabel: '8s clip',
      tags: [
        { label: 'New', tone: 'success' },
        { label: 'Audio', tone: 'muted' },
      ],
    },
  },
  {
    id: 'veo3.1-quality',
    label: 'VEO3.1 Quality',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description: 'Higher-quality VEO3 generation for final outputs',
    modeSupport: ['text-to-video'],
    supportedOptions: ['duration', 'aspect_ratio', 'resolution'],
    defaultOptions: {
      duration: '8',
      aspect_ratio: '16:9',
      resolution: '1080p',
    },
    creditCostByMode: {
      'text-to-video': 8,
    },
    capabilities: {
      progress: true,
    },
    optionOverrides: {
      duration: {
        defaultValue: '8',
        options: [{ label: '8s', value: '8' }],
      },
      aspect_ratio: {
        options: [
          { label: '16:9', value: '16:9' },
          { label: '9:16', value: '9:16' },
        ],
      },
      resolution: {
        defaultValue: '1080p',
        options: [{ label: '1080p', value: '1080p' }],
      },
    },
    ui: {
      family: {
        key: 'veo',
        label: 'Google',
        description: 'Preview-first clips with native audio support',
        badge: 'Audio',
      },
      mark: 'V',
      outputLabel: '8s final render',
      tags: [
        { label: 'HQ', tone: 'accent' },
        { label: 'Audio', tone: 'muted' },
      ],
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
    optionOverrides: {
      duration: {
        defaultValue: '5',
        options: [
          { label: '5s', value: '5' },
          { label: '10s', value: '10' },
        ],
      },
      resolution: {
        defaultValue: '720p',
        options: [
          { label: '720p', value: '720p' },
          { label: '1080p', value: '1080p' },
        ],
      },
      image_urls: {
        maxItems: 1,
      },
    },
    ui: {
      family: {
        key: 'kling',
        label: 'Kling AI',
        description:
          'Editing-oriented motion family with text, image, and video inputs',
        badge: 'New',
      },
      mark: 'K',
      outputLabel: '5-10s',
      tags: [{ label: 'Editing', tone: 'accent' }],
    },
  },
  {
    id: 'doubao-seedance-1-0-pro-fast',
    label: 'Seedance 1.0 Pro Fast',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description:
      'ByteDance Seedance 1.0 fast lane for text, image, and video generation',
    modeSupport: ['text-to-video', 'image-to-video', 'video-to-video'],
    supportedOptions: [
      'duration',
      'aspect_ratio',
      'resolution',
      'image_urls',
      'video_urls',
      'camerafixed',
    ],
    defaultOptions: {
      duration: '5',
      aspect_ratio: '16:9',
      resolution: '720p',
      camerafixed: false,
    },
    creditCostByMode: {
      'text-to-video': 5,
      'image-to-video': 7,
      'video-to-video': 9,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
    optionOverrides: {
      duration: {
        defaultValue: '5',
        options: [
          { label: '5s', value: '5' },
          { label: '10s', value: '10' },
        ],
      },
      aspect_ratio: {
        options: [
          { label: '21:9', value: '21:9' },
          { label: '16:9', value: '16:9' },
          { label: '4:3', value: '4:3' },
          { label: '1:1', value: '1:1' },
          { label: '3:4', value: '3:4' },
          { label: '9:16', value: '9:16' },
        ],
      },
      resolution: {
        defaultValue: '720p',
        options: [
          { label: '720p', value: '720p' },
          { label: '1080p', value: '1080p' },
        ],
      },
      image_urls: {
        maxItems: 2,
      },
    },
    ui: {
      family: {
        key: 'seedance',
        label: 'Seedance',
        description: 'ByteDance video generation family',
        badge: '1.0 Fast',
      },
      mark: 'D',
      outputLabel: '5-10s',
      tags: [{ label: 'Fast', tone: 'success' }],
    },
  },
  {
    id: 'doubao-seedance-1-0-pro-quality',
    label: 'Seedance 1.0 Pro Quality',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description:
      'ByteDance Seedance 1.0 quality lane for higher fidelity generation',
    modeSupport: ['text-to-video', 'image-to-video', 'video-to-video'],
    supportedOptions: [
      'duration',
      'aspect_ratio',
      'resolution',
      'image_urls',
      'video_urls',
      'camerafixed',
    ],
    defaultOptions: {
      duration: '5',
      aspect_ratio: '16:9',
      resolution: '1080p',
      camerafixed: false,
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
    optionOverrides: {
      duration: {
        defaultValue: '5',
        options: [
          { label: '5s', value: '5' },
          { label: '10s', value: '10' },
        ],
      },
      aspect_ratio: {
        options: [
          { label: '21:9', value: '21:9' },
          { label: '16:9', value: '16:9' },
          { label: '4:3', value: '4:3' },
          { label: '1:1', value: '1:1' },
          { label: '3:4', value: '3:4' },
          { label: '9:16', value: '9:16' },
        ],
      },
      resolution: {
        defaultValue: '1080p',
        options: [{ label: '1080p', value: '1080p' }],
      },
      image_urls: {
        maxItems: 2,
      },
    },
    ui: {
      family: {
        key: 'seedance',
        label: 'Seedance',
        description: 'ByteDance video generation family',
        badge: '1.0 HQ',
      },
      mark: 'D',
      outputLabel: '1080p',
      tags: [{ label: 'HQ', tone: 'accent' }],
    },
  },
  {
    id: 'doubao-seedance-1-5-pro',
    label: 'Seedance 1.5 Pro',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description:
      'ByteDance video family with mixed aspect ratios and optional synchronized audio',
    modeSupport: ['text-to-video', 'image-to-video', 'video-to-video'],
    supportedOptions: [
      'duration',
      'aspect_ratio',
      'resolution',
      'image_urls',
      'video_urls',
      'audio',
      'camerafixed',
    ],
    defaultOptions: {
      duration: '5',
      aspect_ratio: '16:9',
      resolution: '1080p',
      audio: false,
      camerafixed: false,
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
    optionOverrides: {
      duration: {
        defaultValue: '5',
        options: [
          { label: '4s', value: '4' },
          { label: '8s', value: '8' },
          { label: '12s', value: '12' },
        ],
      },
      aspect_ratio: {
        options: [
          { label: '21:9', value: '21:9' },
          { label: '16:9', value: '16:9' },
          { label: '4:3', value: '4:3' },
          { label: '1:1', value: '1:1' },
          { label: '3:4', value: '3:4' },
          { label: '9:16', value: '9:16' },
        ],
      },
      resolution: {
        defaultValue: '1080p',
        options: [{ label: '1080p', value: '1080p' }],
      },
      image_urls: {
        maxItems: 2,
      },
    },
    ui: {
      family: {
        key: 'seedance',
        label: 'Seedance',
        description: 'Mixed-ratio clips with optional audio and edit workflows',
        badge: 'Audio',
      },
      mark: 'D',
      outputLabel: '4-12s',
      tags: [
        { label: 'Audio', tone: 'muted' },
        { label: 'New', tone: 'success' },
      ],
    },
  },
  {
    id: 'kling-v2-6',
    label: 'Kling 2.6',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description:
      'Kling 2.6 supports standard and professional modes with optional audio',
    modeSupport: ['text-to-video', 'image-to-video'],
    supportedOptions: [
      'mode',
      'duration',
      'aspect_ratio',
      'negative_prompt',
      'image_urls',
      'audio',
      'watermark',
    ],
    defaultOptions: {
      mode: 'std',
      duration: '5',
      aspect_ratio: '16:9',
      audio: false,
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
    optionOverrides: {
      duration: {
        defaultValue: '5',
        options: [
          { label: '5s', value: '5' },
          { label: '10s', value: '10' },
        ],
      },
      aspect_ratio: {
        options: [
          { label: '16:9', value: '16:9' },
          { label: '9:16', value: '9:16' },
          { label: '1:1', value: '1:1' },
        ],
      },
      image_urls: {
        maxItems: 2,
      },
    },
    ui: {
      family: {
        key: 'kling',
        label: 'Kling AI',
        description: 'Kuaishou video generation family',
        badge: '2.6',
      },
      mark: 'K',
      outputLabel: '5-10s',
      tags: [{ label: 'Mode', tone: 'accent' }],
    },
  },
  {
    id: 'kling-v3',
    label: 'Kling v3',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description:
      'Kling v3 with std/pro modes and first-last frame image workflows',
    modeSupport: ['text-to-video', 'image-to-video'],
    supportedOptions: [
      'mode',
      'duration',
      'aspect_ratio',
      'negative_prompt',
      'image_urls',
      'audio',
      'watermark',
    ],
    defaultOptions: {
      mode: 'std',
      duration: '5',
      aspect_ratio: '16:9',
      audio: false,
      watermark: false,
    },
    creditCostByMode: {
      'text-to-video': 7,
      'image-to-video': 9,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
    optionOverrides: {
      duration: {
        defaultValue: '5',
        options: [
          { label: '5s', value: '5' },
          { label: '10s', value: '10' },
          { label: '15s', value: '15' },
        ],
      },
      aspect_ratio: {
        options: [
          { label: '16:9', value: '16:9' },
          { label: '9:16', value: '9:16' },
          { label: '1:1', value: '1:1' },
        ],
      },
      image_urls: {
        maxItems: 2,
      },
    },
    ui: {
      family: {
        key: 'kling',
        label: 'Kling AI',
        description: 'Kuaishou video generation family',
        badge: 'v3',
      },
      mark: 'K',
      outputLabel: '5-15s',
      tags: [{ label: 'HQ', tone: 'accent' }],
    },
  },
  {
    id: 'kling-v3-omni',
    label: 'Kling v3 Omni',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description:
      'Kling v3 Omni supports image referencing and base video editing via one interface',
    modeSupport: ['text-to-video', 'image-to-video', 'video-to-video'],
    supportedOptions: [
      'mode',
      'duration',
      'aspect_ratio',
      'image_urls',
      'video_urls',
    ],
    defaultOptions: {
      mode: 'std',
      duration: '5',
      aspect_ratio: '16:9',
    },
    creditCostByMode: {
      'text-to-video': 7,
      'image-to-video': 9,
      'video-to-video': 10,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
    optionOverrides: {
      duration: {
        defaultValue: '5',
        options: [
          { label: '5s', value: '5' },
          { label: '10s', value: '10' },
        ],
      },
      aspect_ratio: {
        options: [
          { label: '16:9', value: '16:9' },
          { label: '9:16', value: '9:16' },
          { label: '1:1', value: '1:1' },
        ],
      },
      image_urls: {
        maxItems: 10,
      },
      video_urls: {
        maxItems: 1,
      },
    },
    ui: {
      family: {
        key: 'kling',
        label: 'Kling AI',
        description: 'Kuaishou video generation family',
        badge: 'Omni',
      },
      mark: 'K',
      outputLabel: '5-10s',
      tags: [
        { label: 'Omni', tone: 'success' },
        { label: 'Edit', tone: 'accent' },
      ],
    },
  },
  {
    id: 'viduq3-pro',
    label: 'Vidu Q3 Pro',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description:
      'Vidu Q3 Pro supports text-to-video, image-to-video, and first-last frame workflows',
    modeSupport: ['text-to-video', 'image-to-video'],
    supportedOptions: [
      'duration',
      'resolution',
      'aspect_ratio',
      'image_urls',
      'audio',
      'seed',
    ],
    defaultOptions: {
      duration: '5',
      resolution: '720p',
      aspect_ratio: '16:9',
      audio: true,
    },
    creditCostByMode: {
      'text-to-video': 6,
      'image-to-video': 8,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
    optionOverrides: {
      duration: {
        defaultValue: '5',
        options: [
          { label: '1s', value: '1' },
          { label: '5s', value: '5' },
          { label: '8s', value: '8' },
          { label: '10s', value: '10' },
          { label: '16s', value: '16' },
        ],
      },
      resolution: {
        defaultValue: '720p',
        options: [
          { label: '540p', value: '540p' },
          { label: '720p', value: '720p' },
          { label: '1080p', value: '1080p' },
        ],
      },
      aspect_ratio: {
        options: [
          { label: '16:9', value: '16:9' },
          { label: '9:16', value: '9:16' },
          { label: '4:3', value: '4:3' },
          { label: '3:4', value: '3:4' },
          { label: '1:1', value: '1:1' },
        ],
      },
      image_urls: {
        maxItems: 2,
      },
    },
    ui: {
      family: {
        key: 'vidu',
        label: 'Vidu',
        description: 'Shengshu video generation family',
        badge: 'Q3',
      },
      mark: 'V',
      outputLabel: '1-16s',
      tags: [
        { label: 'Audio', tone: 'muted' },
        { label: 'Frames', tone: 'accent' },
      ],
    },
  },
  {
    id: 'wan2.6',
    label: 'Wan 2.6',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description:
      'Text and image video generation with optional synchronized audio and prompt extension',
    modeSupport: ['text-to-video', 'image-to-video'],
    supportedOptions: [
      'duration',
      'aspect_ratio',
      'resolution',
      'image_urls',
      'audio',
    ],
    defaultOptions: {
      duration: '5',
      aspect_ratio: '16:9',
      resolution: '720p',
      audio: false,
    },
    creditCostByMode: {
      'text-to-video': 6,
      'image-to-video': 8,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
    optionOverrides: {
      duration: {
        defaultValue: '5',
        options: [
          { label: '5s', value: '5' },
          { label: '10s', value: '10' },
        ],
      },
      aspect_ratio: {
        options: [
          { label: '16:9', value: '16:9' },
          { label: '9:16', value: '9:16' },
        ],
      },
      image_urls: {
        maxItems: 1,
      },
    },
    ui: {
      family: {
        key: 'wan',
        label: 'Wan AI',
        description:
          'Balanced general-purpose video generation with audio support',
        badge: 'Audio',
      },
      mark: 'W',
      outputLabel: '5-10s',
      tags: [{ label: 'Audio', tone: 'muted' }],
    },
  },
  {
    id: 'MiniMax-Hailuo-02',
    label: 'MiniMax-Hailuo-02',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description:
      'Story-driven clips with first-frame and last-frame image guidance',
    modeSupport: ['text-to-video', 'image-to-video'],
    supportedOptions: ['duration', 'resolution', 'image_urls', 'audio'],
    defaultOptions: {
      duration: '6',
      resolution: '768p',
      audio: false,
    },
    creditCostByMode: {
      'text-to-video': 6,
      'image-to-video': 8,
    },
    capabilities: {
      attachments: true,
      progress: true,
    },
    optionOverrides: {
      duration: {
        defaultValue: '6',
        options: [
          { label: '6s', value: '6' },
          { label: '10s', value: '10' },
        ],
      },
      resolution: {
        defaultValue: '768p',
        options: [
          { label: '512p', value: '512p' },
          { label: '768p', value: '768p' },
          { label: '1080p', value: '1080p' },
        ],
      },
      image_urls: {
        maxItems: 2,
      },
    },
    ui: {
      family: {
        key: 'hailuo',
        label: 'Hailuo AI',
        description: 'Frame-guided clips with optional synchronized audio',
        badge: undefined,
      },
      mark: 'H',
      outputLabel: '6-10s',
      tags: [
        { label: 'Frames', tone: 'accent' },
        { label: 'Audio', tone: 'muted' },
      ],
    },
  },
  {
    id: 'MiniMax-Hailuo-2.3',
    label: 'MiniMax-Hailuo-2.3',
    provider: 'apimart',
    surface: 'video',
    mediaType: 'video',
    endpointFamily: 'video',
    description:
      'MiniMax Hailuo 2.3 with prompt optimization and first-frame control',
    modeSupport: ['text-to-video', 'image-to-video'],
    supportedOptions: [
      'duration',
      'resolution',
      'image_urls',
      'prompt_optimizer',
      'fast_pretreatment',
      'watermark',
    ],
    defaultOptions: {
      duration: '6',
      resolution: '768p',
      prompt_optimizer: true,
      fast_pretreatment: false,
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
    optionOverrides: {
      duration: {
        defaultValue: '6',
        options: [
          { label: '6s', value: '6' },
          { label: '10s', value: '10' },
        ],
      },
      resolution: {
        defaultValue: '768p',
        options: [
          { label: '768p', value: '768p' },
          { label: '1080p', value: '1080p' },
        ],
      },
      image_urls: {
        maxItems: 1,
      },
    },
    ui: {
      family: {
        key: 'hailuo',
        label: 'Hailuo AI',
        description: 'Frame-guided clips with optional prompt optimization',
      },
      mark: 'H',
      outputLabel: '6-10s',
      tags: [{ label: 'Frames', tone: 'accent' }],
    },
  },
];

export function getToolOptionDefinition(
  key: string,
  model?: ToolModelDefinition
) {
  const option = sharedOptions[key];
  if (!option) {
    return undefined;
  }

  const override = model?.optionOverrides?.[key];
  if (!override) {
    return option;
  }

  return {
    ...option,
    ...override,
    options: override.options ?? option.options,
  };
}

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
