import { redirect } from '@/core/i18n/navigation';

export default async function ChatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  redirect({ href: '/tools', locale });
}
