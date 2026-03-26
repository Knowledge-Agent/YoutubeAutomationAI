import { setRequestLocale } from 'next-intl/server';

import { ChatGenerator } from '@/shared/blocks/chat/generator';

export default async function ChatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ChatGenerator />;
}
