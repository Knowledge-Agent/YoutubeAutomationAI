import type { MetadataRoute } from 'next';

import { envConfigs } from '@/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${envConfigs.app_url}/sitemap.xml`,
    host: envConfigs.app_url,
  };
}
