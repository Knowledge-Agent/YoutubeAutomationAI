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
  it('renders a lightweight switcher utility with the active tool marked as current', () => {
    render(<ToolSwitcherCard activeSlug="niche-discovery-sprint" />);

    const switcherLabel = screen.getByText(/switch tool/i);
    const switcher = switcherLabel.closest('section');
    const activeLink = screen.getByRole('link', {
      name: /niche discovery sprint/i,
    });
    const inactiveLink = screen.getByRole('link', {
      name: /script rewrite studio/i,
    });

    expect(switcherLabel).toBeInTheDocument();
    expect(switcher).toHaveClass(
      'rounded-[22px]',
      'px-4',
      'py-3',
      'bg-[rgba(255,255,255,0.02)]'
    );
    expect(
      activeLink
    ).toHaveAttribute('aria-current', 'page');
    expect(activeLink).toHaveClass('min-h-9', 'px-3.5', 'py-2');
    expect(inactiveLink).toHaveAttribute('href', '/tools/script-rewrite-studio');
    expect(screen.queryByText(/^Current Tool$/)).not.toBeInTheDocument();
  });
});
