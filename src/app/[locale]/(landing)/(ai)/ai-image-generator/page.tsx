import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AiImageHubUi } from '@/shared/blocks/tools/ai-image-hub-ui';
import { ToolWorkspaceShell } from '@/shared/blocks/tools/tool-workspace-shell';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'ai.image.metadata',
  canonicalUrl: '/ai-image-generator',
});

export default async function AiImageGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('ai.image');

  return (
    <ToolWorkspaceShell
      activeKey="ai-image"
      activeTab="ai-image"
      workspaceMode="hub"
      title={t.raw('page.title')}
      description={t.raw('page.description')}
      actions={['Favorites', 'Assets']}
      contentCard={false}
      showIntroCard={false}
    >
      <AiImageHubUi />
    </ToolWorkspaceShell>
  );
}
