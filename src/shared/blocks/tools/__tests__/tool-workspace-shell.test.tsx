import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ToolWorkspaceShell } from '@/shared/blocks/tools/tool-workspace-shell';

let mockPathname = '/tools';

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePathname: () => mockPathname,
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

vi.mock('@/shared/blocks/sign/sign-modal', () => ({
  SignModal: () => null,
}));

vi.mock('@/shared/contexts/app', () => ({
  useAppContext: () => ({
    user: null,
    setIsShowSignModal: vi.fn(),
  }),
}));

describe('ToolWorkspaceShell', () => {
  beforeEach(() => {
    mockPathname = '/tools';
  });

  it('renders a single primary navigation hierarchy for tools', () => {
    render(
      <ToolWorkspaceShell
        activeKey="tools"
        title="Workspace Overview"
        description="Workspace description"
      >
        <div>shell content</div>
      </ToolWorkspaceShell>
    );

    expect(
      screen.getByRole('heading', { name: 'Base Capabilities' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tools' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Tools' })).toHaveLength(1);
    expect(screen.queryByText('AI Generators')).not.toBeInTheDocument();
  });

  it('opens a mobile navigation drawer with the same hub hierarchy', async () => {
    const user = userEvent.setup();

    render(
      <ToolWorkspaceShell
        activeKey="tools"
        title="Workspace Overview"
        description="Workspace description"
      >
        <div>shell content</div>
      </ToolWorkspaceShell>
    );

    await user.click(screen.getByRole('button', { name: /open navigation/i }));

    const mobileNav = screen.getByRole('dialog', {
      name: /workspace navigation/i,
    });

    expect(
      within(mobileNav).getByRole('heading', { name: 'Base Capabilities' })
    ).toBeInTheDocument();
    expect(
      within(mobileNav).getByRole('heading', { name: 'Tools' })
    ).toBeInTheDocument();
    expect(
      within(mobileNav).getAllByRole('link', { name: 'Tools' })
    ).toHaveLength(1);
  });

  it('stays hub-only even when the pathname points at a tool detail route', () => {
    mockPathname = '/tools/niche-discovery-sprint';

    render(
      <ToolWorkspaceShell
        activeKey="tools"
        title="Workspace Overview"
        description="Workspace description"
      >
        <div>shell content</div>
      </ToolWorkspaceShell>
    );

    expect(
      screen.getByRole('button', { name: /open navigation/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Base Capabilities' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Workspace Overview' })
    ).toBeInTheDocument();
  });
});
