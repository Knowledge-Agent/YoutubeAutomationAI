import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AiVideoHubUi } from '@/shared/blocks/tools/ai-video-hub-ui';
import { ToolWorkspaceShell } from '@/shared/blocks/tools/tool-workspace-shell';
import { getMetadata } from '@/shared/lib/seo';
import {
  buildFaqStructuredData,
  buildOrganizationStructuredData,
  buildWebsiteStructuredData,
  createStructuredDataGraph,
} from '@/shared/lib/structured-data';
import {
  DynamicPage,
  Header as LandingHeader,
} from '@/shared/types/blocks/landing';
import { LandingBottomNav } from '@/themes/default/blocks/landing-bottom-nav';

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
  const landingT = await getTranslations('landing');
  const toolT = await getTranslations('ai.video');

  const page: DynamicPage = t.raw('page');
  const header = landingT.raw('header') as LandingHeader;
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
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="relative min-h-screen bg-[var(--studio-bg)]">
        <section className="sr-only">
          <h1>{heroSection?.title || toolT.raw('page.title')}</h1>
          <p>{metadata.description || heroSection?.description}</p>
        </section>

        <ToolWorkspaceShell
          activeKey="ai-video"
          title={toolT.raw('page.title')}
          description={toolT.raw('page.description')}
        >
          <AiVideoHubUi />
        </ToolWorkspaceShell>

        <LandingBottomNav header={header} />
      </div>
    </>
  );
}
