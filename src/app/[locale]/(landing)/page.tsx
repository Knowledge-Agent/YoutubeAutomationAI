import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { getMetadata } from '@/shared/lib/seo';
import {
  buildFaqStructuredData,
  buildOrganizationStructuredData,
  buildWebsiteStructuredData,
  createStructuredDataGraph,
} from '@/shared/lib/structured-data';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'pages.index.metadata',
  canonicalUrl: '/',
});

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.index');

  const page: DynamicPage = t.raw('page');
  const metadata = t.raw('metadata') as { description?: string };
  const sectionKeys = page.show_sections || Object.keys(page.sections || {});
  const heroSection = sectionKeys
    .map((sectionKey) => page.sections?.[sectionKey])
    .find((section) => {
      if (!section) {
        return false;
      }

      const blockName = String(section.block || '').toLowerCase();
      const sectionId = String(section.id || '').toLowerCase();
      return blockName.startsWith('hero') || sectionId === 'hero';
    });
  const faqStructuredData = buildFaqStructuredData(
    (page.sections?.faq?.items || []) as any
  );
  const structuredData = createStructuredDataGraph([
    buildWebsiteStructuredData({
      locale,
      path: '/',
      description: metadata.description || heroSection?.description,
    }),
    buildOrganizationStructuredData(),
    faqStructuredData,
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
