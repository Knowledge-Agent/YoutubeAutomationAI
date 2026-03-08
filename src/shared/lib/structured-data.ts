import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import { type Post as BlogPost } from '@/shared/types/blocks/blog';
import { type FAQItem } from '@/shared/types/blocks/landing';

type JsonLdObject = Record<string, unknown>;

function stripHtml(value?: string) {
  return (value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function toAbsoluteUrl(pathOrUrl?: string, locale?: string) {
  const value = (pathOrUrl || '/').trim();

  if (!value) {
    return envConfigs.app_url;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalized = value.startsWith('/') ? value : `/${value}`;

  if (!locale || locale === defaultLocale) {
    return `${envConfigs.app_url}${normalized}`;
  }

  if (normalized === `/${locale}` || normalized.startsWith(`/${locale}/`)) {
    return `${envConfigs.app_url}${normalized}`;
  }

  return normalized === '/'
    ? `${envConfigs.app_url}/${locale}`
    : `${envConfigs.app_url}/${locale}${normalized}`;
}

function toIsoDate(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

export function buildOrganizationStructuredData(): JsonLdObject {
  return {
    '@type': 'Organization',
    name: envConfigs.app_name,
    url: envConfigs.app_url,
    logo: toAbsoluteUrl('/logo-mark.svg'),
  };
}

export function buildWebsiteStructuredData({
  locale,
  path = '/',
  description,
}: {
  locale?: string;
  path?: string;
  description?: string;
}): JsonLdObject {
  return {
    '@type': 'WebSite',
    name: envConfigs.app_name,
    url: toAbsoluteUrl(path, locale),
    description: stripHtml(description),
  };
}

export function buildFaqStructuredData(items?: FAQItem[]): JsonLdObject | null {
  const validItems = (items || [])
    .map((item) => ({
      question: stripHtml(item.question || item.title),
      answer: stripHtml(item.answer || item.description),
    }))
    .filter((item) => item.question && item.answer);

  if (validItems.length === 0) {
    return null;
  }

  return {
    '@type': 'FAQPage',
    mainEntity: validItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbStructuredData({
  locale,
  items,
}: {
  locale?: string;
  items: Array<{ name?: string; url?: string }>;
}): JsonLdObject | null {
  const listItems = items
    .map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: stripHtml(item.name),
      item: toAbsoluteUrl(item.url || '/', locale),
    }))
    .filter((item) => item.name);

  if (listItems.length === 0) {
    return null;
  }

  return {
    '@type': 'BreadcrumbList',
    itemListElement: listItems,
  };
}

export function buildCollectionPageStructuredData({
  locale,
  path,
  title,
  description,
  posts,
}: {
  locale?: string;
  path: string;
  title?: string;
  description?: string;
  posts: BlogPost[];
}): JsonLdObject {
  return {
    '@type': 'CollectionPage',
    name: stripHtml(title),
    description: stripHtml(description),
    url: toAbsoluteUrl(path, locale),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => {
        const item: Record<string, unknown> = {
          '@type': 'ListItem',
          position: index + 1,
          name: stripHtml(post.title),
          url: toAbsoluteUrl(post.url || `/blog/${post.slug || ''}`, locale),
        };

        if (post.description) {
          item.description = stripHtml(post.description);
        }

        if (post.image) {
          item.image = toAbsoluteUrl(post.image, locale);
        }

        return item;
      }),
    },
  };
}

export function buildBlogPostingStructuredData({
  locale,
  post,
}: {
  locale?: string;
  post: BlogPost;
}): JsonLdObject {
  const datePublished = toIsoDate(post.date || post.created_at);
  const data: Record<string, unknown> = {
    '@type': 'BlogPosting',
    headline: stripHtml(post.title),
    description: stripHtml(post.description),
    url: toAbsoluteUrl(post.url || `/blog/${post.slug || ''}`, locale),
    author: {
      '@type': 'Organization',
      name: stripHtml(post.author_name) || envConfigs.app_name,
    },
    publisher: {
      '@type': 'Organization',
      name: envConfigs.app_name,
      logo: {
        '@type': 'ImageObject',
        url: toAbsoluteUrl('/logo-mark.svg'),
      },
    },
  };

  if (post.image) {
    data.image = [toAbsoluteUrl(post.image, locale)];
  }

  if (datePublished) {
    data.datePublished = datePublished;
    data.dateModified = datePublished;
  }

  return data;
}

export function createStructuredDataGraph(
  nodes: Array<JsonLdObject | null | undefined>
) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  };
}
