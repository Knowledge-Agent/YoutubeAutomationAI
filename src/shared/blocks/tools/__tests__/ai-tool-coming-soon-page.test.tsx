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
  it('renders an operational detail layout with an output preview for coming-soon tools', () => {
    const tool = getAiToolBySlug('shorts-reframer');

    if (!tool) {
      throw new Error('Expected tool metadata');
    }

    render(<AiToolComingSoonPage tool={tool} />);

    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /shorts reframer/i })
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getAllByRole('link', { name: /niche discovery sprint/i })
    ).toHaveLength(2);
    expect(screen.queryByText(/^AI Tools$/)).not.toBeInTheDocument();
    expect(screen.getByText(/what you'll input/i)).toBeInTheDocument();
    expect(screen.getByText(tool.whatYouInput)).toBeInTheDocument();
    expect(screen.getByText(/what you'll get/i)).toBeInTheDocument();
    expect(screen.getByText(/hook-first short concepts/i)).toBeInTheDocument();
    expect(screen.getByText(/clip boundaries/i)).toBeInTheDocument();
    expect(screen.getByText(/editing notes/i)).toBeInTheDocument();
  });
});
