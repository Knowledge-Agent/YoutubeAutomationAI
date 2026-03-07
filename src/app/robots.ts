import type { MetadataRoute } from 'next';

import { envConfigs } from '@/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin',
        '/*/admin',
        '/settings',
        '/*/settings',
        '/activity',
        '/*/activity',
        '/sign-in',
        '/*/sign-in',
        '/sign-up',
        '/*/sign-up',
        '/verify-email',
        '/*/verify-email',
        '/chat',
        '/*/chat',
        '/no-permission',
        '/*/no-permission',
      ],
    },
    sitemap: `${envConfigs.app_url}/sitemap.xml`,
    host: envConfigs.app_url,
  };
}
