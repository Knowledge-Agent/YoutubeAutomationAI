import type {
  StorageAccessUrlOptions,
  StorageConfigs,
  StorageDownloadUploadOptions,
  StorageProvider,
  StorageUploadOptions,
  StorageUploadResult,
} from '.';

export interface OSSConfigs extends StorageConfigs {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  uploadPath?: string;
  endpoint?: string;
  publicDomain?: string;
}

function normalizeRegion(region: string) {
  const trimmedRegion = region.trim();
  return trimmedRegion.startsWith('oss-')
    ? trimmedRegion.slice(4)
    : trimmedRegion;
}

function normalizeEndpointRegion(region: string) {
  const trimmedRegion = region.trim();
  return trimmedRegion.startsWith('oss-')
    ? trimmedRegion
    : `oss-${trimmedRegion}`;
}

function normalizePublicDomain(domain?: string) {
  if (!domain) {
    return '';
  }

  const trimmedDomain = domain.trim();
  if (!trimmedDomain) {
    return '';
  }

  if (
    trimmedDomain.startsWith('http://') ||
    trimmedDomain.startsWith('https://')
  ) {
    return trimmedDomain.replace(/\/+$/, '');
  }

  return `https://${trimmedDomain.replace(/\/+$/, '')}`;
}

export class OSSProvider implements StorageProvider {
  readonly name = 'aliyun-oss';
  configs: OSSConfigs;

  constructor(configs: OSSConfigs) {
    this.configs = configs;
  }

  private getUploadPath() {
    let uploadPath = this.configs.uploadPath || 'uploads';
    if (uploadPath.startsWith('/')) {
      uploadPath = uploadPath.slice(1);
    }
    if (uploadPath.endsWith('/')) {
      uploadPath = uploadPath.slice(0, -1);
    }

    return uploadPath;
  }

  private getBaseEndpoint() {
    if (this.configs.endpoint?.trim()) {
      return this.configs.endpoint.trim().replace(/\/+$/, '');
    }

    const endpointRegion = normalizeEndpointRegion(this.configs.region);
    return `https://s3.${endpointRegion}.aliyuncs.com`;
  }

  private getSignedUrl(options: { key: string; bucket?: string }) {
    const uploadBucket = options.bucket || this.configs.bucket;
    const uploadPath = this.getUploadPath();
    const baseEndpoint = this.getBaseEndpoint().replace(/^https?:\/\//, '');

    return `https://${uploadBucket}.${baseEndpoint}/${uploadPath}/${options.key}`;
  }

  getPublicUrl = (options: { key: string; bucket?: string }) => {
    const uploadPath = this.getUploadPath();
    const publicDomain = normalizePublicDomain(this.configs.publicDomain);

    if (publicDomain) {
      return `${publicDomain}/${uploadPath}/${options.key}`;
    }

    return this.getSignedUrl(options);
  };

  async getAccessUrl(options: StorageAccessUrlOptions): Promise<string> {
    return this.getPublicUrl(options);
  }

  exists = async (options: { key: string; bucket?: string }) => {
    try {
      const uploadBucket = options.bucket || this.configs.bucket;
      if (!uploadBucket) {
        return false;
      }

      const { AwsClient } = await import('aws4fetch');
      const client = new AwsClient({
        accessKeyId: this.configs.accessKeyId,
        secretAccessKey: this.configs.secretAccessKey,
        service: 's3',
        region: normalizeRegion(this.configs.region),
      });

      const response = await client.fetch(
        new Request(this.getSignedUrl(options), {
          method: 'HEAD',
        })
      );

      return response.ok;
    } catch {
      return false;
    }
  };

  async uploadFile(
    options: StorageUploadOptions
  ): Promise<StorageUploadResult> {
    try {
      const uploadBucket = options.bucket || this.configs.bucket;
      if (!uploadBucket) {
        return {
          success: false,
          error: 'Bucket is required',
          provider: this.name,
        };
      }

      const bodyArray =
        options.body instanceof Buffer
          ? new Uint8Array(options.body)
          : options.body;

      const { AwsClient } = await import('aws4fetch');
      const client = new AwsClient({
        accessKeyId: this.configs.accessKeyId,
        secretAccessKey: this.configs.secretAccessKey,
        service: 's3',
        region: normalizeRegion(this.configs.region),
      });

      const headers: Record<string, string> = {
        'Content-Type': options.contentType || 'application/octet-stream',
        'Content-Disposition': options.disposition || 'inline',
        'Content-Length': bodyArray.length.toString(),
      };

      const response = await client.fetch(
        new Request(this.getSignedUrl(options), {
          method: 'PUT',
          headers,
          body: bodyArray as BodyInit,
        })
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        return {
          success: false,
          error: `Upload failed: ${response.status} ${response.statusText}${errorText ? ` - ${errorText.slice(0, 180)}` : ''}`,
          provider: this.name,
        };
      }

      const publicUrl = this.getPublicUrl({
        key: options.key,
        bucket: uploadBucket,
      });

      return {
        success: true,
        location: this.getSignedUrl({
          key: options.key,
          bucket: uploadBucket,
        }),
        bucket: uploadBucket,
        uploadPath: this.getUploadPath(),
        key: options.key,
        filename: options.key.split('/').pop(),
        url: publicUrl,
        provider: this.name,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name,
      };
    }
  }

  async downloadAndUpload(
    options: StorageDownloadUploadOptions
  ): Promise<StorageUploadResult> {
    try {
      const response = await fetch(options.url);
      if (!response.ok) {
        return {
          success: false,
          error: `HTTP error! status: ${response.status}`,
          provider: this.name,
        };
      }

      const arrayBuffer = await response.arrayBuffer();
      const body = new Uint8Array(arrayBuffer);

      return this.uploadFile({
        body,
        key: options.key,
        bucket: options.bucket,
        contentType: options.contentType,
        disposition: options.disposition,
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name,
      };
    }
  }
}

export function createOSSProvider(configs: OSSConfigs): OSSProvider {
  return new OSSProvider(configs);
}
