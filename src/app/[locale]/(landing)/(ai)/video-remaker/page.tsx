import { setRequestLocale } from 'next-intl/server';

import { VideoRemakerUi } from '@/shared/blocks/video-remaker';

export const metadata = {
  title: 'VideoRemaker — AI 视频复刻',
  description: '将原视频深度解构为分镜，驱动 AI 生成高度一致的复刻视频',
};

export default async function VideoRemakerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--studio-bg)]">
      <header className="flex items-center justify-between border-b border-[var(--studio-line)] bg-[var(--studio-panel)] px-6 py-3">
        <span className="font-semibold text-[var(--studio-ink)]">VideoRemaker</span>
        <nav className="flex gap-4 text-sm text-[var(--studio-muted)]">
          <a href="/docs" className="hover:text-[var(--studio-ink)]">
            文档
          </a>
        </nav>
      </header>
      <main className="flex-1 overflow-hidden">
        <VideoRemakerUi />
      </main>
    </div>
  );
}
