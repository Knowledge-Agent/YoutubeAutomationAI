import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ToolSwitcherCard } from '@/shared/blocks/tools/tool-switcher-card';

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('ToolSwitcherCard', () => {
  it('renders compact tool links with the active tool marked as current', () => {
    render(<ToolSwitcherCard activeSlug="niche-discovery-sprint" />);

    expect(
      screen.getByRole('link', { name: /niche discovery sprint/i })
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('link', { name: /script rewrite studio/i })
    ).toHaveAttribute('href', '/tools/script-rewrite-studio');
    expect(screen.queryByText(/^AI Tools$/)).not.toBeInTheDocument();
  });
});
