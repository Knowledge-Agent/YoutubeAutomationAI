import { setRequestLocale } from 'next-intl/server';

import { AiVideoHubUi } from '@/shared/blocks/tools/ai-video-hub-ui';
import { ToolWorkspaceShell } from '@/shared/blocks/tools/tool-workspace-shell';

export const revalidate = 3600;

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ToolWorkspaceShell
      activeKey="ai-video"
      activeTab="ai-video"
      title="Tools"
      description=""
      actions={[]}
      contentCard={false}
      showIntroCard={false}
    >
      <AiVideoHubUi />
    </ToolWorkspaceShell>
  );
}
