import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import { WorkspaceDetailShell } from '@/shared/blocks/common';
import { AiToolComingSoonPage } from '@/shared/blocks/tools/ai-tool-coming-soon-page';
import { getAiToolBySlug } from '@/shared/blocks/tools/ai-tools-catalog';
import { NicheDiscoveryToolPage } from '@/shared/blocks/tools/niche-discovery-tool-page';
import { ScriptRewriteToolPage } from '@/shared/blocks/tools/script-rewrite-tool-page';
import {
  readNicheDiscoveryToolSearchState,
  type NicheDiscoveryToolSearchState,
} from '@/shared/blocks/tools/niche-discovery-tool-query';

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
    <WorkspaceDetailShell activeSection="tools">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {tool.slug === 'niche-discovery-sprint' ? (
          <NicheDiscoveryToolPage tool={tool} initialState={initialState} />
        ) : tool.slug === 'script-rewrite-studio' ? (
          <ScriptRewriteToolPage tool={tool} />
        ) : (
          <AiToolComingSoonPage tool={tool} />
        )}
      </div>
    </WorkspaceDetailShell>
  );
}
