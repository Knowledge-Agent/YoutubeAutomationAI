import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AiToolsDirectory } from '@/shared/blocks/tools/ai-tools-directory';
import { parseAiToolCategory } from '@/shared/blocks/tools/ai-tools-catalog';
import { ToolWorkspaceShell } from '@/shared/blocks/tools/tool-workspace-shell';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'ai.tools.metadata',
  canonicalUrl: '/tools',
});

export default async function ToolsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('ai.tools');
  const activeCategory = parseAiToolCategory(
    Array.isArray(resolvedSearchParams.tab)
      ? resolvedSearchParams.tab[0]
      : resolvedSearchParams.tab
  );

  return (
    <ToolWorkspaceShell
      activeKey="tools"
      activeTab="tools"
      workspaceMode="hub"
      title={t.raw('page.title')}
      description={t.raw('page.description')}
      actions={['Directory']}
      contentCard={false}
      showIntroCard={false}
    >
      <AiToolsDirectory activeCategory={activeCategory} />
    </ToolWorkspaceShell>
  );
}
