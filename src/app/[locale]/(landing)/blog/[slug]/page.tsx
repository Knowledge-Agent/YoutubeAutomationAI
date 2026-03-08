import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import { Empty } from '@/shared/blocks/common';
import { buildBlogPostingStructuredData, buildBreadcrumbStructuredData, createStructuredDataGraph } from '@/shared/lib/structured-data';
import { getPost } from '@/shared/models/post';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('pages.blog.metadata');

  const localeSegment = locale !== defaultLocale ? `/${locale}` : '';
  const canonicalUrl = `${envConfigs.app_url}${localeSegment}/blog/${slug}`;

  const post = await getPost({ slug, locale });
  const image = post?.image || envConfigs.app_preview_image;
  const imageUrl = image.startsWith('http')
    ? image
    : `${envConfigs.app_url}${image}`;

  if (!post) {
    return {
      title: `${slug} | ${t('title')}`,
      description: t('description'),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: 'article',
        url: canonicalUrl,
        title: `${slug} | ${t('title')}`,
        description: t('description'),
        siteName: envConfigs.app_name,
        images: [imageUrl],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${slug} | ${t('title')}`,
        description: t('description'),
        images: [imageUrl],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  return {
    title: `${post.title} | ${t('title')}`,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: `${post.title} | ${t('title')}`,
      description: post.description,
      siteName: envConfigs.app_name,
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | ${t('title')}`,
      description: post.description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPost({ slug, locale });

  if (!post) {
    return <Empty message={`Post not found`} />;
  }

  // build page sections
  const page: DynamicPage = {
    sections: {
      blogDetail: {
        block: 'blog-detail',
        data: {
          post,
        },
      },
    },
  };

  const structuredData = createStructuredDataGraph([
    buildBlogPostingStructuredData({ locale, post }),
    buildBreadcrumbStructuredData({
      locale,
      items: [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: post.title || slug, url: post.url || `/blog/${slug}` },
      ],
    }),
  ]);

  const Page = await getThemePage('dynamic-page');

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Page locale={locale} page={page} />
    </>
  );
}
