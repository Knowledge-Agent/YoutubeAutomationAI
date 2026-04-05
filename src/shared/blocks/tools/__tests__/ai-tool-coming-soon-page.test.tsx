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
  it('renders output modules from structured tool data instead of parsing summary copy', () => {
    const baseTool = getAiToolBySlug('shorts-reframer');

    if (!baseTool) {
      throw new Error('Expected tool metadata');
    }

    const tool = {
      ...baseTool,
      whatYouGet: 'A focused production handoff for this workflow.',
      outputModules: [
        'Beat-by-beat short map',
        'Retention edit cues',
        'Publishing checklist',
      ],
    };

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
    expect(screen.getByText(tool.whatYouGet)).toBeInTheDocument();
    expect(screen.getByText(/beat-by-beat short map/i)).toBeInTheDocument();
    expect(screen.getByText(/retention edit cues/i)).toBeInTheDocument();
    expect(screen.getByText(/publishing checklist/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/hook-first short concepts/i)
    ).not.toBeInTheDocument();
  });
});
