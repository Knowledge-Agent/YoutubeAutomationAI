import { getUuid } from '@/shared/lib/hash';
import { getToolModelById } from '@/shared/services/apimart/catalog';
import { ApimartClient } from '@/shared/services/apimart/client';

import { saveFiles } from '.';
import {
  AIConfigs,
  AIFile,
  AIGenerateParams,
  AIImage,
  AIMediaType,
  AIProvider,
  AITaskResult,
  AITaskStatus,
  AIVideo,
} from './types';

export interface ApimartConfigs extends AIConfigs {
  apiKey: string;
  baseUrl?: string;
  customStorage?: boolean;
}

interface ApimartTaskCreationResponse {
  code?: number;
  data?: Array<{
    status?: string;
    task_id?: string;
  }>;
}

interface ApimartTaskResponse {
  id?: string;
  status?: string;
  progress?: number;
  result?: {
    images?: Array<{ url?: string | string[] }>;
    videos?: Array<{
      url?: string | string[];
      thumbnail_url?: string;
      duration?: number;
    }>;
    thumbnail_url?: string;
  };
  error?: {
    code?: number | string;
    message?: string;
    type?: string;
  };
  created?: number;
  completed?: number;
  estimated_time?: number;
  actual_time?: number;
}

interface ApimartTaskQueryResponse {
  code?: number;
  message?: string;
  data?: ApimartTaskResponse;
}

export class ApimartProvider implements AIProvider {
  readonly name = 'apimart';
  configs: ApimartConfigs;

  constructor(configs: ApimartConfigs) {
    this.configs = configs;
  }

  async generate({
    params,
  }: {
    params: AIGenerateParams;
  }): Promise<AITaskResult> {
    if (!params.model) {
      throw new Error('model is required');
    }

    const client = new ApimartClient(this.configs.apiKey, this.configs.baseUrl);

    if (params.mediaType === AIMediaType.IMAGE) {
      const response = await client.post<ApimartTaskCreationResponse>(
        '/images/generations',
        this.buildImagePayload(params)
      );
      const taskId = response.data?.[0]?.task_id;
      if (!taskId) {
        throw new Error('apimart image generation failed: no task_id');
      }

      return {
        taskStatus: AITaskStatus.PENDING,
        taskId,
        taskInfo: {
          status: response.data?.[0]?.status || 'submitted',
        },
        taskResult: response,
      };
    }

    if (params.mediaType === AIMediaType.VIDEO) {
      const response = await client.post<ApimartTaskCreationResponse>(
        '/videos/generations',
        this.buildVideoPayload(params)
      );
      const taskId = response.data?.[0]?.task_id;
      if (!taskId) {
        throw new Error('apimart video generation failed: no task_id');
      }

      return {
        taskStatus: AITaskStatus.PENDING,
        taskId,
        taskInfo: {
          status: response.data?.[0]?.status || 'submitted',
        },
        taskResult: response,
      };
    }

    throw new Error(`apimart does not support mediaType: ${params.mediaType}`);
  }

  async query({
    taskId,
    mediaType,
  }: {
    taskId: string;
    mediaType?: string;
    model?: string;
  }): Promise<AITaskResult> {
    const client = new ApimartClient(this.configs.apiKey, this.configs.baseUrl);
    const response = await client.get<
      ApimartTaskResponse | ApimartTaskQueryResponse
    >(`/tasks/${taskId}`);
    const taskResponse = this.unwrapTaskResponse(response);

    const taskStatus = this.mapTaskStatus(taskResponse.status);
    const images =
      mediaType === AIMediaType.IMAGE
        ? await this.normalizeImages(taskResponse.result?.images || [])
        : undefined;
    const videos =
      mediaType === AIMediaType.VIDEO
        ? await this.normalizeVideos(taskResponse.result)
        : undefined;

    return {
      taskId,
      taskStatus,
      taskInfo: {
        images,
        videos,
        status: taskResponse.status,
        progress: taskResponse.progress,
        errorCode: taskResponse.error?.code?.toString(),
        errorMessage: taskResponse.error?.message,
        createTime: taskResponse.created
          ? new Date(taskResponse.created * 1000)
          : undefined,
      },
      taskResult: response,
    };
  }

  private unwrapTaskResponse(
    response: ApimartTaskResponse | ApimartTaskQueryResponse
  ): ApimartTaskResponse {
    if (
      response &&
      typeof response === 'object' &&
      'data' in response &&
      response.data &&
      typeof response.data === 'object'
    ) {
      return response.data;
    }

    return response as ApimartTaskResponse;
  }

  private buildImagePayload(params: AIGenerateParams) {
    const options = params.options || {};
    const modelDefinition = getToolModelById(params.model || '');
    const imageUrls = Array.isArray(options.image_urls)
      ? options.image_urls
      : Array.isArray(options.image_input)
        ? options.image_input
        : undefined;
    const imageCount =
      typeof options.n === 'string'
        ? parseInt(options.n, 10)
        : options.n || undefined;
    const safetyTolerance =
      typeof options.safety_tolerance === 'string'
        ? parseInt(options.safety_tolerance, 10)
        : options.safety_tolerance;
    const isDoubaoSeedream =
      modelDefinition?.id === 'doubao-seedance-4-0' ||
      modelDefinition?.id === 'doubao-seedance-4-5' ||
      modelDefinition?.id === 'doubao-seedream-5-0-lite';

    return {
      model: params.model,
      prompt: params.prompt,
      size: options.size,
      n: imageCount,
      image_urls: imageUrls,
      resolution: options.resolution,
      quality: options.quality,
      mask_url: options.mask_url,
      response_format: options.response_format,
      prompt_upsampling: options.prompt_upsampling,
      safety_tolerance: safetyTolerance,
      watermark: options.watermark,
      sequential_image_generation:
        isDoubaoSeedream && imageUrls?.length && (imageCount || 1) > 1
          ? 'auto'
          : options.sequential_image_generation,
      sequential_image_generation_options:
        isDoubaoSeedream && imageUrls?.length && (imageCount || 1) > 1
          ? {
              max_images: imageCount,
            }
          : options.sequential_image_generation_options,
    };
  }

  private buildVideoPayload(params: AIGenerateParams) {
    const options = params.options || {};
    const modelDefinition = getToolModelById(params.model || '');
    const isHailuo = modelDefinition?.id?.startsWith('MiniMax-Hailuo');
    const supportsSoraStyle = modelDefinition?.id?.startsWith('sora-2');
    const usesMode =
      modelDefinition?.id === 'kling-v2-6' ||
      modelDefinition?.id === 'kling-v3' ||
      modelDefinition?.id === 'kling-v3-omni';
    const usesVideoList = modelDefinition?.id === 'kling-v3-omni';
    const imageUrls = Array.isArray(options.image_urls)
      ? options.image_urls
      : Array.isArray(options.image_input)
        ? options.image_input
        : undefined;
    const videoUrls = Array.isArray(options.video_urls)
      ? options.video_urls
      : Array.isArray(options.video_input)
        ? options.video_input
        : undefined;
    const [firstFrameImage, lastFrameImage] = imageUrls ?? [];

    return {
      model: params.model,
      prompt: params.prompt,
      duration:
        typeof options.duration === 'string'
          ? parseInt(options.duration, 10)
          : options.duration,
      mode: usesMode ? options.mode : undefined,
      aspect_ratio: options.aspect_ratio,
      resolution: options.resolution,
      negative_prompt: options.negative_prompt,
      seed:
        typeof options.seed === 'string'
          ? parseInt(options.seed, 10)
          : options.seed,
      generation_type: this.getGenerationType({
        mediaType: params.mediaType,
        imageUrls,
        videoUrls,
        explicitScene: options.scene,
      }),
      image_urls: isHailuo ? undefined : imageUrls,
      first_frame_image: isHailuo ? firstFrameImage : undefined,
      last_frame_image: isHailuo ? lastFrameImage : undefined,
      video_urls: usesVideoList ? undefined : videoUrls,
      video_list:
        usesVideoList && videoUrls?.length
          ? videoUrls.slice(0, 1).map((url: string) => ({
              video_url: url,
              refer_type: 'base',
              keep_original_sound: 'no',
            }))
          : undefined,
      audio: modelDefinition?.supportedOptions.includes('audio')
        ? options.audio
        : undefined,
      camerafixed: modelDefinition?.supportedOptions.includes('camerafixed')
        ? options.camerafixed
        : undefined,
      prompt_optimizer: modelDefinition?.supportedOptions.includes(
        'prompt_optimizer'
      )
        ? options.prompt_optimizer
        : undefined,
      fast_pretreatment: modelDefinition?.supportedOptions.includes(
        'fast_pretreatment'
      )
        ? options.fast_pretreatment
        : undefined,
      watermark: options.watermark,
      thumbnail: options.thumbnail,
      private: options.private,
      style: supportsSoraStyle ? options.style : undefined,
      storyboard: options.storyboard,
      character_url: options.character_url,
      character_timestamps: options.character_timestamps,
    };
  }

  private getGenerationType({
    imageUrls,
    videoUrls,
    explicitScene,
  }: {
    mediaType: AIMediaType;
    imageUrls?: string[];
    videoUrls?: string[];
    explicitScene?: string;
  }) {
    if (explicitScene) {
      return explicitScene;
    }

    if (videoUrls?.length) {
      return 'video-to-video';
    }

    if (imageUrls?.length) {
      return 'image-to-video';
    }

    return 'text-to-video';
  }

  private mapTaskStatus(status?: string): AITaskStatus {
    switch (status) {
      case 'completed':
        return AITaskStatus.SUCCESS;
      case 'failed':
        return AITaskStatus.FAILED;
      case 'cancelled':
        return AITaskStatus.CANCELED;
      case 'processing':
        return AITaskStatus.PROCESSING;
      case 'pending':
      case 'submitted':
      default:
        return AITaskStatus.PENDING;
    }
  }

  private async normalizeImages(items: Array<{ url?: string | string[] }>) {
    const images: AIImage[] = items.flatMap((item) => {
      const urls = Array.isArray(item?.url)
        ? item.url
        : item?.url
          ? [item.url]
          : [];

      return urls.map((url) => ({
        id: getUuid(),
        createTime: new Date(),
        imageUrl: url,
      }));
    });

    if (!this.configs.customStorage || images.length === 0) {
      return images;
    }

    const files: AIFile[] = images
      .map((image, index) =>
        image.imageUrl
          ? {
              url: image.imageUrl,
              contentType: 'image/png',
              key: `apimart/image/${getUuid()}.png`,
              index,
              type: 'image',
            }
          : null
      )
      .filter(Boolean) as AIFile[];

    const uploadedFiles = await saveFiles(files);
    uploadedFiles?.forEach((file) => {
      if (file.index !== undefined && images[file.index]) {
        images[file.index]!.imageUrl = file.url;
      }
    });

    return images;
  }

  private async normalizeVideos(
    result?: ApimartTaskResponse['result']
  ): Promise<AIVideo[] | undefined> {
    const items = result?.videos || [];
    const thumbnailUrl = result?.thumbnail_url;
    const videos: AIVideo[] = items.flatMap((item) => {
      const urls = Array.isArray(item?.url)
        ? item.url
        : item?.url
          ? [item.url]
          : [];

      return urls.map((url) => ({
        id: getUuid(),
        createTime: new Date(),
        videoUrl: url,
        thumbnailUrl: item.thumbnail_url || thumbnailUrl,
        duration: item.duration,
      }));
    });

    if (!this.configs.customStorage || videos.length === 0) {
      return videos;
    }

    const files: AIFile[] = videos
      .map((video, index) =>
        video.videoUrl
          ? {
              url: video.videoUrl,
              contentType: 'video/mp4',
              key: `apimart/video/${getUuid()}.mp4`,
              index,
              type: 'video',
            }
          : null
      )
      .filter(Boolean) as AIFile[];

    const uploadedFiles = await saveFiles(files);
    uploadedFiles?.forEach((file) => {
      if (file.index !== undefined && videos[file.index]) {
        videos[file.index]!.videoUrl = file.url;
      }
    });

    return videos;
  }
}
