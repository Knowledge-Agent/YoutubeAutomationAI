import { redirect } from '@/core/i18n/navigation';

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale } = await params;

  redirect({ href: '/tools', locale });
}
