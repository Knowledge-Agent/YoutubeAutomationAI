import type { MetadataRoute } from 'next';
import fs from 'node:fs';
import path from 'node:path';

import { envConfigs } from '@/config';
import { defaultLocale, locales } from '@/config/locale';
import { pagesSource, postsSource } from '@/core/docs/source';

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

function getSitemapLocales() {
  return Array.from(new Set([...locales, defaultLocale]));
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

function getPostCategories(data: unknown) {
  if (!data || typeof data !== 'object') {
    return [] as string[];
  }

  const frontmatter = data as { categories?: unknown };
  if (!Array.isArray(frontmatter.categories)) {
    return [] as string[];
  }

  return frontmatter.categories.filter(
    (value): value is string => typeof value === 'string' && Boolean(value)
  );
}

function stripQuotes(value: string) {
  return value.trim().replace(/^['"]|['"]$/g, '');
}

function parseCategoryLineValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return [] as string[];
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => stripQuotes(item))
      .filter(Boolean);
  }

  return [stripQuotes(trimmed)].filter(Boolean);
}

function getFrontmatterCategories(content: string) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return [] as string[];
  }

  const lines = match[1].split(/\r?\n/);
  const categories: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const categoriesMatch = line.match(/^categories\s*:\s*(.*)$/);
    if (!categoriesMatch) {
      continue;
    }

    const rest = categoriesMatch[1]?.trim() || '';
    if (rest) {
      categories.push(...parseCategoryLineValue(rest));
      break;
    }

    for (let j = i + 1; j < lines.length; j++) {
      const nextLine = lines[j];
      if (!nextLine.trim()) {
        continue;
      }

      const itemMatch = nextLine.match(/^\s*-\s*(.+?)\s*$/);
      if (itemMatch) {
        categories.push(stripQuotes(itemMatch[1]));
        continue;
      }

      if (/^[a-zA-Z0-9_-]+\s*:/.test(nextLine) || !/^\s+/.test(nextLine)) {
        break;
      }
    }
    break;
  }

  return categories.filter(Boolean);
}

function getLocalBlogRoutes() {
  const localeSet = new Set(getSitemapLocales());
  const defaultRoutes = {
    posts: new Map<string, Date>(),
    categories: new Set<string>(),
  };
  const localRoutes = new Map<
    string,
    { posts: Map<string, Date>; categories: Set<string> }
  >();

  const postsDir = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(postsDir)) {
    return localRoutes;
  }

  for (const entry of fs.readdirSync(postsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.mdx')) {
      continue;
    }

    const fileNameWithoutExt = entry.name.slice(0, -4);
    const localeMatch = fileNameWithoutExt.match(/^(.*)\.([a-z]{2})$/i);
    const slug = localeMatch ? localeMatch[1] : fileNameWithoutExt;
    const locale = localeMatch?.[2] || defaultLocale;
    if (!slug || !localeSet.has(locale)) {
      continue;
    }

    const routeData = localRoutes.get(locale) || {
      posts: new Map(defaultRoutes.posts),
      categories: new Set(defaultRoutes.categories),
    };

    const filePath = path.join(postsDir, entry.name);
    const stats = fs.statSync(filePath);
    routeData.posts.set(slug, stats.mtime);

    const content = fs.readFileSync(filePath, 'utf-8');
    getFrontmatterCategories(content).forEach((category) => {
      routeData.categories.add(category);
    });

    localRoutes.set(locale, routeData);
  }

  return localRoutes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routeMap = new Map<string, MetadataRoute.Sitemap[number]>();
  const localBlogRoutes = getLocalBlogRoutes();

  getSitemapLocales().forEach((locale) => {
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

    const staticPages = pagesSource.getPages(locale) || [];
    staticPages.forEach((staticPage) => {
      const url = toAbsoluteUrl(staticPage.url);
      routeMap.set(url, {
        url,
        lastModified: getLastModified(staticPage.data, now),
        changeFrequency: 'yearly',
        priority: 0.3,
      });
    });

    const postPages = postsSource.getPages(locale) || [];
    const categorySet = new Set<string>();

    postPages.forEach((postPage) => {
      const url = toAbsoluteUrl(postPage.url);
      routeMap.set(url, {
        url,
        lastModified: getLastModified(postPage.data, now),
        changeFrequency: 'monthly',
        priority: 0.85,
      });

      getPostCategories(postPage.data).forEach((category) => {
        categorySet.add(category);
      });
    });

    const localRoutes = localBlogRoutes.get(locale);
    localRoutes?.posts.forEach((lastModified, slug) => {
      const postPath = toLocalizedPath(locale, `/blog/${slug}`);
      const url = toAbsoluteUrl(postPath);
      routeMap.set(url, {
        url,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.85,
      });
    });

    localRoutes?.categories.forEach((category) => {
      categorySet.add(category);
    });

    categorySet.forEach((category) => {
      const categoryPath = toLocalizedPath(locale, `/blog/category/${category}`);
      const url = toAbsoluteUrl(categoryPath);
      routeMap.set(url, {
        url,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  return Array.from(routeMap.values()).sort((a, b) => a.url.localeCompare(b.url));
}
