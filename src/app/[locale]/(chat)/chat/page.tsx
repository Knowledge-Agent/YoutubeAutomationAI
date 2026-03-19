'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';

import { useRouter } from '@/core/i18n/navigation';

export default function ChatPage() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const target = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const id = crypto.randomUUID().toLowerCase();
    const query = params.toString();
    return `/chat/${id}${query ? `?${query}` : ''}`;
  }, [searchParams]);

  useEffect(() => {
    router.replace(target, { locale });
  }, [locale, router, target]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#15161d] px-8 text-sm text-zinc-500">
      Preparing chat workspace...
    </div>
  );
}
