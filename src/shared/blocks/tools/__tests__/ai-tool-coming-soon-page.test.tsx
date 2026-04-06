import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AiToolComingSoonPage } from '@/shared/blocks/tools/ai-tool-coming-soon-page';
import { getAiToolBySlug } from '@/shared/blocks/tools/ai-tools-catalog';

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('AiToolComingSoonPage', () => {
  it('renders a planned-tool page with explicit hierarchy, one clear CTA, and one strong sample deliverable', () => {
    const tool = getAiToolBySlug('shorts-reframer');

    if (!tool) {
      throw new Error('Expected tool metadata');
    }

    render(<AiToolComingSoonPage tool={tool} />);

    expect(
      screen.getByRole('heading', { name: /shorts reframer/i, level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /shorts reframer/i })
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getAllByRole('link', { name: /script rewrite studio/i })
    ).toHaveLength(2);
    expect(
      screen.getAllByRole('link', { name: /niche discovery sprint/i })
    ).toHaveLength(1);
    expect(screen.queryByText(/^AI Tools$/)).not.toBeInTheDocument();
    expect(
      screen.getByText(/recommended right now/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/rewrite the source first/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /use script rewrite studio now/i })
    ).toHaveAttribute('href', '/tools/script-rewrite-studio');
    expect(
      screen.getByRole('heading', { name: /sample shorts reframe pack/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /a realistic example of the short-form output this tool will generate/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/short angles/i)).toBeInTheDocument();
    expect(screen.getByText(/hook options/i)).toBeInTheDocument();
    expect(screen.getByText(/edit notes/i)).toBeInTheDocument();
    expect(
      screen.getByText(/unexpected turning point cut/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/start at the payoff and rewind/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/trim setup to under 2 seconds/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/why this page exists/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/output module/i)
    ).not.toBeInTheDocument();
  });
});
