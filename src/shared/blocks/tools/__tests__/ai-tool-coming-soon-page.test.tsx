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
  it('renders tool detail content without the old tools-only sidebar frame', () => {
    const tool = getAiToolBySlug('shorts-reframer');

    if (!tool) {
      throw new Error('Expected tool metadata');
    }

    render(<AiToolComingSoonPage tool={tool} />);

    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /niche discovery sprint/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/^AI Tools$/)).not.toBeInTheDocument();
  });
});
