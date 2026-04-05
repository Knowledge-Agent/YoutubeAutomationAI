import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ToolDetailPage from './page';

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('notFound');
  }),
}));

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePathname: () => '/tools/niche-discovery-sprint',
  useRouter: () => ({
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock('@/shared/blocks/sign/sign-modal', () => ({
  SignModal: () => null,
}));

vi.mock('@/shared/blocks/common', () => ({
  WorkspaceDetailShell: ({
    activeSection,
    children,
  }: {
    activeSection: string;
    children: any;
  }) => (
    <section
      data-testid="workspace-detail-shell"
      data-active-section={activeSection}
    >
      {children}
    </section>
  ),
}));

vi.mock('@/shared/contexts/app', () => ({
  useAppContext: () => ({
    user: null,
    setIsShowSignModal: vi.fn(),
  }),
}));

vi.mock('@/shared/blocks/tools/niche-discovery-tool-page', () => ({
  NicheDiscoveryToolPage: ({ tool }: any) => (
    <section>
      <h1>{tool.pageTitle}</h1>
      <p>detail tool body</p>
    </section>
  ),
}));

vi.mock('@/shared/blocks/tools/ai-tool-coming-soon-page', () => ({
  AiToolComingSoonPage: ({ tool }: any) => (
    <section>
      <h1>{tool.pageTitle}</h1>
      <p>coming soon tool body</p>
    </section>
  ),
}));

describe('ToolDetailPage', () => {
  it('reuses the shared detail shell without forcing the hub sidebar and intro shell', async () => {
    const page = await ToolDetailPage({
      params: Promise.resolve({ locale: 'en', slug: 'niche-discovery-sprint' }),
      searchParams: Promise.resolve({}),
    });

    render(page);

    expect(screen.getByText('detail tool body')).toBeInTheDocument();
    expect(screen.getByTestId('workspace-detail-shell')).toHaveAttribute(
      'data-active-section',
      'tools'
    );
    expect(
      screen.queryByRole('heading', { name: 'Base Capabilities' })
    ).not.toBeInTheDocument();
    expect(screen.getAllByText('Niche Discovery Sprint')).toHaveLength(1);
  });
});
