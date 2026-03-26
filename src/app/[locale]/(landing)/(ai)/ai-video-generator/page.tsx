import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AiVideoHubUi } from '@/shared/blocks/tools/ai-video-hub-ui';
import { ToolWorkspaceShell } from '@/shared/blocks/tools/tool-workspace-shell';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'ai.video.metadata',
  canonicalUrl: '/ai-video-generator',
});

export default async function AiVideoGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('ai.video');

  return (
    <ToolWorkspaceShell
      activeKey="ai-video"
      activeTab="ai-video"
      workspaceMode="hub"
      title={t.raw('page.title')}
      description={t.raw('page.description')}
      actions={['Favorites', 'Assets']}
      contentCard={false}
      showIntroCard={false}
    >
      <AiVideoHubUi />
    </ToolWorkspaceShell>
  );
}
