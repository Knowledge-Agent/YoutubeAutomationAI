import type { MetadataRoute } from 'next';

import { envConfigs } from '@/config';

const blogSlugs = [
  'what-is-youtube-automation',
  'best-youtube-automation-niches-2026',
  'ai-tools-youtube-automation-guide',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${envConfigs.app_url}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${envConfigs.app_url}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  blogSlugs.forEach((slug) => {
    routes.push({
      url: `${envConfigs.app_url}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  return routes;
}
