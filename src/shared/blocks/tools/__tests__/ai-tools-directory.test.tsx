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
  it('renders compact category filters and direct card links', () => {
    const { container } = render(
      <AiToolsDirectory activeCategory="script-tools" />
    );

    expect(
      screen.getByRole('link', { name: /video tools/i })
    ).toHaveAttribute('href', '/tools?tab=video-tools');
    expect(
      screen.getByRole('link', { name: /niche discovery sprint/i })
    ).toHaveAttribute('href', '/tools/niche-discovery-sprint');
    expect(
      screen.getByRole('link', { name: /script rewrite studio/i })
    ).toHaveAttribute('href', '/tools/script-rewrite-studio');
    expect(
      screen.queryByRole('link', { name: /shorts reframer/i })
    ).not.toBeInTheDocument();

    const nav = container.querySelector('nav');
    const navClasses = nav?.className.split(/\s+/) ?? [];

    expect(navClasses).toContain('gap-2');
    expect(navClasses).not.toContain('p-2');
  });

  it('keeps cards limited to the cover image and tool name', () => {
    render(<AiToolsDirectory activeCategory="script-tools" />);

    const nicheCard = screen.getByRole('link', {
      name: /niche discovery sprint/i,
    });
    const nicheImage = screen.getByRole('img', {
      name: /niche discovery sprint/i,
    });

    expect(nicheCard).toContainElement(nicheImage);
    expect(screen.getByText('Niche Discovery Sprint')).toBeInTheDocument();
    expect(screen.getByText('Script Rewrite Studio')).toBeInTheDocument();
    expect(screen.queryByText(/what you input/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/open tool/i)).not.toBeInTheDocument();
  });
});
