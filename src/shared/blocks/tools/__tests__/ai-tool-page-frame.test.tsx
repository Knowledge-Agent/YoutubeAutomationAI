import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { getAiToolBySlug } from '@/shared/blocks/tools/ai-tools-catalog';
import { AiToolPageFrame } from '@/shared/blocks/tools/ai-tool-page-frame';

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('AiToolPageFrame', () => {
  it('renders the left tool switcher plus center and right slots', () => {
    const tool = getAiToolBySlug('niche-discovery-sprint');

    if (!tool) {
      throw new Error('Expected niche discovery tool metadata');
    }

    render(
      <AiToolPageFrame
        tool={tool}
        center={<div>center panel</div>}
        right={<div>right panel</div>}
      />
    );

    expect(
      screen.getByRole('link', { name: /script rewrite studio/i })
    ).toHaveAttribute('href', '/tools/script-rewrite-studio');
    expect(screen.getByText('center panel')).toBeInTheDocument();
    expect(screen.getByText('right panel')).toBeInTheDocument();
  });
});
