import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import { AiToolComingSoonPage } from '@/shared/blocks/tools/ai-tool-coming-soon-page';
import { getAiToolBySlug } from '@/shared/blocks/tools/ai-tools-catalog';
import { ToolWorkspaceShell } from '@/shared/blocks/tools/tool-workspace-shell';

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
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tool = getAiToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <ToolWorkspaceShell
      activeKey="tools"
      activeTab="tools"
      workspaceMode="detail"
      title={tool.pageTitle}
      description={tool.whenToUse}
      contentCard={false}
      showIntroCard={false}
    >
      <AiToolComingSoonPage tool={tool} />
    </ToolWorkspaceShell>
  );
}
