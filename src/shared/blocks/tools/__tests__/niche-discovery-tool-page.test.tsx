import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { getAiToolBySlug } from '@/shared/blocks/tools/ai-tools-catalog';
import { NicheDiscoveryToolPage } from '@/shared/blocks/tools/niche-discovery-tool-page';

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePathname: () => '/tools/niche-discovery-sprint',
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe('NicheDiscoveryToolPage', () => {
  it('renders the switcher link and an empty results state before the sprint runs', () => {
    const tool = getAiToolBySlug('niche-discovery-sprint');

    if (!tool) {
      throw new Error('Expected niche discovery tool metadata');
    }

    render(<NicheDiscoveryToolPage tool={tool} persistState={vi.fn()} />);

    expect(
      screen.getByRole('link', { name: /script rewrite studio/i })
    ).toHaveAttribute('href', '/tools/script-rewrite-studio');
    expect(screen.getByText(/run the sprint to see/i)).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /recommended niche/i })
    ).not.toBeInTheDocument();
  });

  it('renders the recommended niche and voiceover draft after one CTA', async () => {
    const user = userEvent.setup();
    const tool = getAiToolBySlug('niche-discovery-sprint');

    if (!tool) {
      throw new Error('Expected niche discovery tool metadata');
    }

    render(<NicheDiscoveryToolPage tool={tool} persistState={vi.fn()} />);

    await user.type(screen.getByLabelText(/seed topic/i), 'AI tools');
    await user.click(
      screen.getByRole('button', { name: /generate niche pack/i })
    );

    expect(
      await screen.findByRole('heading', { name: /recommended niche/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/voiceover draft/i)).toBeInTheDocument();
  });

  it('persists local topic and hook refinement without rerunning the sprint', async () => {
    const user = userEvent.setup();
    const tool = getAiToolBySlug('niche-discovery-sprint');
    const persistState = vi.fn();

    if (!tool) {
      throw new Error('Expected niche discovery tool metadata');
    }

    render(
      <NicheDiscoveryToolPage
        tool={tool}
        persistState={persistState}
        initialState={{ seed: 'AI tools', nicheSlug: 'ai-tools-breakdowns' }}
      />
    );

    expect(
      await screen.findByRole('heading', { name: /recommended niche/i })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /high-curiosity ai tools/i })
    );
    await user.click(screen.getByRole('button', { name: /authority hook/i }));

    expect(persistState).toHaveBeenLastCalledWith({
      seed: 'AI tools',
      format: 'story',
      assetType: 'stock footage',
      audience: 'curious general viewers',
      nicheSlug: 'ai-tools-breakdowns',
      topicSlug: 'ai-tools-breakdowns-high-curiosity',
      hookSlug: 'ai-tools-breakdowns-high-curiosity-authority-hook',
    });
    expect(screen.getByText(/voiceover draft/i)).toBeInTheDocument();
    expect(screen.getByText(/visual cues/i)).toBeInTheDocument();
  });
});
