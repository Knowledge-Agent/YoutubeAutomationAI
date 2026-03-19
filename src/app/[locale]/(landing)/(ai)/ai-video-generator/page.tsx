import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AiVideoHubUi } from '@/shared/blocks/tools/ai-video-hub-ui';
import { AiVideoWorkspaceUi } from '@/shared/blocks/tools/ai-video-workspace-ui';
import { ToolWorkspaceShell } from '@/shared/blocks/tools/tool-workspace-shell';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'ai.video.metadata',
  canonicalUrl: '/ai-video-generator',
});

export default async function AiVideoGeneratorPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ view?: string; prompt?: string }>;
}) {
  const { locale } = await params;
  const { view, prompt } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('ai.video');
  const isDetailView = view === 'detail';

  return (
    <ToolWorkspaceShell
      activeKey="ai-video"
      activeTab="ai-video"
      workspaceMode={isDetailView ? 'detail' : 'hub'}
      title={t.raw('page.title')}
      description={t.raw('page.description')}
      actions={['Favorites', 'Assets']}
      contentCard={false}
      showIntroCard={false}
    >
      {isDetailView ? (
        <AiVideoWorkspaceUi initialPrompt={prompt} />
      ) : (
        <AiVideoHubUi />
      )}
    </ToolWorkspaceShell>
  );
}
