import type {
  StorageAccessUrlOptions,
  StorageConfigs,
  StorageDownloadUploadOptions,
  StorageProvider,
  StorageUploadOptions,
  StorageUploadResult,
} from '.';

/**
 * S3 storage provider configs
 * @docs https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html
 */
export interface S3Configs extends StorageConfigs {
  endpoint?: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  uploadPath?: string;
  publicDomain?: string;
}

/**
 * S3 storage provider implementation
 * @website https://aws.amazon.com/s3/
 */
export class S3Provider implements StorageProvider {
  readonly name = 's3';
  configs: S3Configs;

  constructor(configs: S3Configs) {
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

  private getEndpoint() {
    if (this.configs.endpoint?.trim()) {
      const endpoint = this.configs.endpoint.trim();
      const normalized = endpoint.startsWith('http://') ||
        endpoint.startsWith('https://')
        ? endpoint
        : `https://${endpoint}`;

      return normalized.replace(/\/+$/, '');
    }

    return `https://s3.${this.configs.region}.amazonaws.com`;
  }

  private getObjectPath(key: string) {
    return `${this.getUploadPath()}/${key}`;
  }

  private getObjectUrl(options: { key: string; bucket?: string }) {
    const uploadBucket = options.bucket || this.configs.bucket;
    const objectPath = this.getObjectPath(options.key);
    const endpoint = this.getEndpoint();

    if (!this.configs.endpoint?.trim()) {
      return `https://${uploadBucket}.s3.${this.configs.region}.amazonaws.com/${objectPath}`;
    }

    const parsed = new URL(endpoint);
    const normalizedPath = parsed.pathname.replace(/\/+$/, '');
    const bucketInHost = parsed.hostname === uploadBucket ||
      parsed.hostname.startsWith(`${uploadBucket}.`);
    const bucketInPath =
      normalizedPath === `/${uploadBucket}` ||
      normalizedPath.startsWith(`/${uploadBucket}/`);

    if (bucketInHost) {
      return `${parsed.origin}${normalizedPath}/${objectPath}`.replace(
        /([^:]\/)\/+/g,
        '$1'
      );
    }

    if (bucketInPath) {
      return `${parsed.origin}${normalizedPath}/${objectPath}`.replace(
        /([^:]\/)\/+/g,
        '$1'
      );
    }

    return `${parsed.origin}${normalizedPath}/${uploadBucket}/${objectPath}`.replace(
      /([^:]\/)\/+/g,
      '$1'
    );
  }

  getPublicUrl = (options: { key: string; bucket?: string }) => {
    const objectPath = this.getObjectPath(options.key);
    const url = this.getObjectUrl(options);
    return this.configs.publicDomain
      ? `${this.configs.publicDomain.replace(/\/+$/, '')}/${objectPath}`
      : url;
  };

  async getAccessUrl(options: StorageAccessUrlOptions): Promise<string> {
    const publicUrl = this.getPublicUrl(options);
    if (this.configs.publicDomain && publicUrl) {
      return publicUrl;
    }

    const url = new URL(this.getObjectUrl(options));
    url.searchParams.set(
      'X-Amz-Expires',
      String(Math.max(60, options.expiresIn || 3600))
    );

    const { AwsClient } = await import('aws4fetch');
    const client = new AwsClient({
      accessKeyId: this.configs.accessKeyId,
      secretAccessKey: this.configs.secretAccessKey,
      service: 's3',
      region: this.configs.region,
    });

    const signedRequest = await client.sign(url.toString(), {
      method: 'GET',
      aws: {
        signQuery: true,
      },
    });

    return signedRequest.url.toString();
  }

  exists = async (options: { key: string; bucket?: string }) => {
    try {
      const uploadBucket = options.bucket || this.configs.bucket;
      if (!uploadBucket) return false;

      const url = this.getObjectUrl(options);
      const { AwsClient } = await import('aws4fetch');
      const client = new AwsClient({
        accessKeyId: this.configs.accessKeyId,
        secretAccessKey: this.configs.secretAccessKey,
        service: 's3',
        region: this.configs.region,
      });

      const response = await client.fetch(
        new Request(url, {
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

      const url = this.getObjectUrl({
        key: options.key,
        bucket: uploadBucket,
      });

      const { AwsClient } = await import('aws4fetch');

      const client = new AwsClient({
        accessKeyId: this.configs.accessKeyId,
        secretAccessKey: this.configs.secretAccessKey,
        service: 's3',
        region: this.configs.region,
      });

      const headers: Record<string, string> = {
        'Content-Type': options.contentType || 'application/octet-stream',
        'Content-Disposition': options.disposition || 'inline',
        'Content-Length': bodyArray.length.toString(),
      };

      const request = new Request(url, {
        method: 'PUT',
        headers,
        body: bodyArray as any,
      });

      const response = await client.fetch(request);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        return {
          success: false,
          error: `Upload failed: ${response.status} ${response.statusText}${errorText ? ` - ${errorText.slice(0, 180)}` : ''}`,
          provider: this.name,
        };
      }

      const publicUrl =
        this.getPublicUrl({ key: options.key, bucket: uploadBucket }) || url;

      return {
        success: true,
        location: url,
        bucket: uploadBucket,
        uploadPath: this.getUploadPath(),
        key: options.key,
        filename: options.key.split('/').pop(),
        url: publicUrl,
        provider: this.name,
      };
    } catch (error) {
      const endpoint = this.getEndpoint();
      return {
        success: false,
        error:
          error instanceof Error
            ? `S3 request failed for bucket "${this.configs.bucket}" at "${endpoint}" (${this.configs.region}): ${error.message}`
            : 'Unknown error',
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

      if (!response.body) {
        return {
          success: false,
          error: 'No body in response',
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

/**
 * Create S3 provider with configs
 */
export function createS3Provider(configs: S3Configs): S3Provider {
  return new S3Provider(configs);
}
