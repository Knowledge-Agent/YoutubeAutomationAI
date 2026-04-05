import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ChatHeader } from '@/shared/blocks/chat/header';

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/shared/blocks/common/locale-selector', () => ({
  LocaleSelector: () => <div data-testid="locale-selector" />,
}));

vi.mock('@/shared/contexts/chat', () => ({
  useChatContext: () => ({
    chat: null,
  }),
}));

describe('ChatHeader', () => {
  it('sends the primary brand link back to /tools on tool detail pages', () => {
    render(<ChatHeader activeSection="tools" />);

    expect(
      screen.getByRole('link', { name: /youtube automation ai/i })
    ).toHaveAttribute('href', '/tools');
  });

  it('opens the workspace drawer as an accessible dialog', async () => {
    const user = userEvent.setup();

    render(<ChatHeader activeSection="tools" />);

    const trigger = screen.getByRole('button', {
      name: /open workspace menu/i,
    });

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const drawer = screen.getByRole('dialog', {
      name: /workspace navigation/i,
    });

    expect(trigger).toHaveAttribute('aria-controls', 'workspace-navigation');
    expect(drawer).toHaveAttribute('id', 'workspace-navigation');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    await waitFor(() => {
      expect(drawer).toHaveFocus();
    });

    await user.keyboard('{Shift>}{Tab}{/Shift}');

    expect(screen.getByRole('link', { name: 'Tools' })).toHaveFocus();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });
});
