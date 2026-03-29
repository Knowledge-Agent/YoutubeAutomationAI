'use client';

import { ReactNode } from 'react';

import { usePathname } from '@/core/i18n/navigation';
import {
  Footer as FooterType,
  Header as HeaderType,
} from '@/shared/types/blocks/landing';
import { Footer, Header } from '@/themes/default/blocks';

export default function LandingLayout({
  children,
  header,
  footer,
}: {
  children: ReactNode;
  header: HeaderType;
  footer: FooterType;
}) {
  const pathname = usePathname();
  const isHomeRoute = pathname === '/';
  const isWorkspaceRoute =
    pathname.startsWith('/ai-video-generator') ||
    pathname.startsWith('/ai-image-generator');

  if (isWorkspaceRoute || isHomeRoute) {
    return <div className="min-h-screen bg-[var(--studio-bg)]">{children}</div>;
  }

  return (
    <div className="h-screen w-screen">
      <Header header={header} />
      {children}
      <Footer footer={footer} />
    </div>
  );
}
