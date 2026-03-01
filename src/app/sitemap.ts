import type { MetadataRoute } from 'next';

import { envConfigs } from '@/config';
import { defaultLocale, locales } from '@/config/locale';
import { postsSource } from '@/core/docs/source';

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/blog', changeFrequency: 'daily', priority: 0.95 },
];

function toLocalizedPath(locale: string, path: string) {
  if (locale === defaultLocale) {
    return path;
  }
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

function toAbsoluteUrl(path: string) {
  return new URL(path, envConfigs.app_url).toString();
}

function getLastModified(data: unknown, fallback: Date) {
  if (!data || typeof data !== 'object') {
    return fallback;
  }

  const frontmatter = data as { date?: unknown; created_at?: unknown };
  const dateValue = frontmatter.date || frontmatter.created_at;
  if (typeof dateValue !== 'string' || !dateValue) {
    return fallback;
  }

  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routeMap = new Map<string, MetadataRoute.Sitemap[number]>();

  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      const localizedPath = toLocalizedPath(locale, route.path);
      const url = toAbsoluteUrl(localizedPath);
      routeMap.set(url, {
        url,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    });

    const postPages = postsSource.getPages(locale) || [];
    postPages.forEach((postPage) => {
      const url = toAbsoluteUrl(postPage.url);
      routeMap.set(url, {
        url,
        lastModified: getLastModified(postPage.data, now),
        changeFrequency: 'monthly',
        priority: 0.85,
      });
    });
  });

  return Array.from(routeMap.values()).sort((a, b) =>
    a.url.localeCompare(b.url)
  );
}
