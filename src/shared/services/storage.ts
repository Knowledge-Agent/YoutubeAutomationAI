import {
  OSSProvider,
  R2Provider,
  S3Provider,
  StorageManager,
} from '@/extensions/storage';
import { Configs, getAllConfigs } from '@/shared/models/config';

/**
 * get storage service with configs
 */
export function getStorageServiceWithConfigs(configs: Configs) {
  const storageManager = new StorageManager();
  let hasDefaultProvider = false;
  const preferredProvider =
    configs.default_storage_provider === 'auto'
      ? ''
      : configs.default_storage_provider || '';

  const shouldSetAsDefault = (providerName: string) => {
    if (preferredProvider) {
      return preferredProvider === providerName;
    }

    return !hasDefaultProvider;
  };

  // Add R2 provider if configured
  if (
    configs.r2_access_key &&
    configs.r2_secret_key &&
    configs.r2_bucket_name
  ) {
    // r2_region in settings stores the Cloudflare Account ID
    // For R2, region is typically "auto" but can be customized
    const accountId = configs.r2_account_id || '';

    storageManager.addProvider(
      new R2Provider({
        accountId: accountId,
        accessKeyId: configs.r2_access_key,
        secretAccessKey: configs.r2_secret_key,
        bucket: configs.r2_bucket_name,
        uploadPath: configs.r2_upload_path,
        region: 'auto', // R2 uses "auto" as region
        endpoint: configs.r2_endpoint, // Optional custom endpoint
        publicDomain: configs.r2_domain,
      }),
      shouldSetAsDefault('r2')
    );
    hasDefaultProvider = hasDefaultProvider || shouldSetAsDefault('r2');
  }

  if (
    configs.aliyun_oss_region &&
    configs.aliyun_oss_access_key_id &&
    configs.aliyun_oss_access_key_secret &&
    configs.aliyun_oss_bucket
  ) {
    storageManager.addProvider(
      new OSSProvider({
        region: configs.aliyun_oss_region,
        accessKeyId: configs.aliyun_oss_access_key_id,
        secretAccessKey: configs.aliyun_oss_access_key_secret,
        bucket: configs.aliyun_oss_bucket,
        uploadPath: configs.aliyun_oss_upload_path,
        endpoint: configs.aliyun_oss_endpoint,
        publicDomain: configs.aliyun_oss_public_domain,
      }),
      shouldSetAsDefault('aliyun-oss')
    );
    hasDefaultProvider = hasDefaultProvider || shouldSetAsDefault('aliyun-oss');
  }

  // Add S3 provider if configured
  if (configs.s3_access_key && configs.s3_secret_key && configs.s3_bucket) {
    storageManager.addProvider(
      new S3Provider({
        endpoint: configs.s3_endpoint,
        region: configs.s3_region || 'us-east-1',
        accessKeyId: configs.s3_access_key,
        secretAccessKey: configs.s3_secret_key,
        bucket: configs.s3_bucket,
        uploadPath: configs.s3_upload_path,
        publicDomain: configs.s3_domain,
      }),
      shouldSetAsDefault('s3')
    );
    hasDefaultProvider = hasDefaultProvider || shouldSetAsDefault('s3');
  }

  return storageManager;
}

/**
 * global storage service
 */
let storageService: StorageManager | null = null;

/**
 * get storage service instance
 */
export async function getStorageService(
  configs?: Configs
): Promise<StorageManager> {
  if (!configs) {
    configs = await getAllConfigs();
  }
  storageService = getStorageServiceWithConfigs(configs);

  return storageService;
}
