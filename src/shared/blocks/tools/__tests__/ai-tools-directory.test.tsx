import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AiToolsDirectory } from '@/shared/blocks/tools/ai-tools-directory';

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('AiToolsDirectory', () => {
  it('renders only the selected category and links directly to tool pages', () => {
    render(<AiToolsDirectory activeCategory="script-tools" />);

    expect(
      screen.getByRole('link', { name: /niche discovery sprint/i })
    ).toHaveAttribute('href', '/tools/niche-discovery-sprint');
    expect(
      screen.getByRole('link', { name: /script rewrite studio/i })
    ).toHaveAttribute('href', '/tools/script-rewrite-studio');
    expect(
      screen.queryByRole('link', { name: /shorts reframer/i })
    ).not.toBeInTheDocument();
  });

  it('keeps the cards visually minimal', () => {
    render(<AiToolsDirectory activeCategory="video-tools" />);

    expect(screen.getByText('Shorts Reframer')).toBeInTheDocument();
    expect(screen.queryByText(/what you input/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/open tool/i)).not.toBeInTheDocument();
  });
});
