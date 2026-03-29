import { setRequestLocale } from 'next-intl/server';

import { ChatHistory } from '@/shared/blocks/chat/history';

export default async function ChatHistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ChatHistory />;
}
