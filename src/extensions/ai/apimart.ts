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
    images?: Array<{ url?: string }>;
    videos?: Array<{ url?: string; thumbnail_url?: string; duration?: number }>;
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
    const response = await client.get<ApimartTaskResponse>(`/tasks/${taskId}`);

    const taskStatus = this.mapTaskStatus(response.status);
    const images =
      mediaType === AIMediaType.IMAGE
        ? await this.normalizeImages(response.result?.images || [])
        : undefined;
    const videos =
      mediaType === AIMediaType.VIDEO
        ? await this.normalizeVideos(response.result)
        : undefined;

    return {
      taskId,
      taskStatus,
      taskInfo: {
        images,
        videos,
        status: response.status,
        errorCode: response.error?.code?.toString(),
        errorMessage: response.error?.message,
        createTime: response.created
          ? new Date(response.created * 1000)
          : undefined,
      },
      taskResult: response,
    };
  }

  private buildImagePayload(params: AIGenerateParams) {
    const options = params.options || {};

    return {
      model: params.model,
      prompt: params.prompt,
      size: options.size,
      n:
        typeof options.n === 'string'
          ? parseInt(options.n, 10)
          : options.n || undefined,
      image_urls: Array.isArray(options.image_urls)
        ? options.image_urls
        : Array.isArray(options.image_input)
          ? options.image_input
          : undefined,
      resolution: options.resolution,
      quality: options.quality,
      mask_url: options.mask_url,
    };
  }

  private buildVideoPayload(params: AIGenerateParams) {
    const options = params.options || {};
    const modelDefinition = getToolModelById(params.model || '');
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

    return {
      model: params.model,
      prompt: params.prompt,
      duration:
        typeof options.duration === 'string'
          ? parseInt(options.duration, 10)
          : options.duration,
      aspect_ratio: options.aspect_ratio,
      resolution: options.resolution,
      generation_type: this.getGenerationType({
        mediaType: params.mediaType,
        imageUrls,
        videoUrls,
        explicitScene: options.scene,
      }),
      image_urls: imageUrls,
      video_urls: videoUrls,
      watermark: options.watermark,
      thumbnail: options.thumbnail,
      private: options.private,
      style: modelDefinition?.id === 'sora-2' ? options.style : undefined,
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

  private async normalizeImages(items: Array<{ url?: string }>) {
    const images: AIImage[] = items
      .filter((item) => item?.url)
      .map((item) => ({
        id: getUuid(),
        createTime: new Date(),
        imageUrl: item.url,
      }));

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
    const videos: AIVideo[] = items
      .filter((item) => item?.url)
      .map((item) => ({
        id: getUuid(),
        createTime: new Date(),
        videoUrl: item.url,
        thumbnailUrl: item.thumbnail_url || thumbnailUrl,
        duration: item.duration,
      }));

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
