import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AiImageHubUi } from '@/shared/blocks/tools/ai-image-hub-ui';
import { AiImageWorkspaceUi } from '@/shared/blocks/tools/ai-image-workspace-ui';
import { ToolWorkspaceShell } from '@/shared/blocks/tools/tool-workspace-shell';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'ai.image.metadata',
  canonicalUrl: '/ai-image-generator',
});

export default async function AiImageGeneratorPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ view?: string; prompt?: string }>;
}) {
  const { locale } = await params;
  const { view, prompt } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('ai.image');
  const isDetailView = view === 'detail';

  return (
    <ToolWorkspaceShell
      activeKey="ai-image"
      activeTab="ai-image"
      workspaceMode={isDetailView ? 'detail' : 'hub'}
      title={t.raw('page.title')}
      description={t.raw('page.description')}
      actions={['Favorites', 'Assets']}
      contentCard={false}
      showIntroCard={false}
    >
      {isDetailView ? (
        <AiImageWorkspaceUi initialPrompt={prompt} />
      ) : (
        <AiImageHubUi />
      )}
    </ToolWorkspaceShell>
  );
}
