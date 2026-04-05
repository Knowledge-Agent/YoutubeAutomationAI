import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import { AiToolComingSoonPage } from '@/shared/blocks/tools/ai-tool-coming-soon-page';
import { getAiToolBySlug } from '@/shared/blocks/tools/ai-tools-catalog';
import { NicheDiscoveryToolPage } from '@/shared/blocks/tools/niche-discovery-tool-page';
import {
  readNicheDiscoveryToolSearchState,
  type NicheDiscoveryToolSearchState,
} from '@/shared/blocks/tools/niche-discovery-tool-query';
import { ToolWorkspaceChrome } from '@/shared/blocks/tools/tool-workspace-chrome';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tool = getAiToolBySlug(slug);

  if (!tool) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const localeSegment = locale === defaultLocale ? '' : `/${locale}`;
  const canonicalUrl = `${envConfigs.app_url}${localeSegment}/tools/${tool.slug}`;

  return {
    title: `${tool.pageTitle} | AI Tools`,
    description: tool.whatYouGet,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ToolDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, slug } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);

  const tool = getAiToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const getSearchValue = (key: string) => {
    const value = resolvedSearchParams[key];

    return Array.isArray(value) ? value[0] : (value ?? null);
  };

  const initialState: NicheDiscoveryToolSearchState | undefined =
    tool.slug === 'niche-discovery-sprint'
      ? readNicheDiscoveryToolSearchState({ get: getSearchValue })
      : undefined;

  return (
    <ToolWorkspaceChrome>
      <div className="min-h-screen pt-[62px]">
        <main className="min-w-0 bg-[#15161d] [background-image:radial-gradient(circle_at_top_left,rgba(255,122,26,0.08),transparent_20%),radial-gradient(circle_at_top_right,rgba(30,184,166,0.05),transparent_16%)] p-4 lg:p-6">
          <div className="mx-auto max-w-[1680px]">
            {tool.slug === 'niche-discovery-sprint' ? (
              <NicheDiscoveryToolPage tool={tool} initialState={initialState} />
            ) : (
              <AiToolComingSoonPage tool={tool} />
            )}
          </div>
        </main>
      </div>
    </ToolWorkspaceChrome>
  );
}
