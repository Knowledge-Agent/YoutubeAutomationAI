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
  it('starts with an empty result panel, then renders the recommended path after one CTA', async () => {
    const user = userEvent.setup();
    const tool = getAiToolBySlug('niche-discovery-sprint');

    if (!tool) {
      throw new Error('Expected niche discovery tool metadata');
    }

    render(<NicheDiscoveryToolPage tool={tool} persistState={vi.fn()} />);

    expect(screen.queryByText(/^AI Tools$/)).not.toBeInTheDocument();
    expect(screen.getByText(/run the sprint to see/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/seed topic/i), 'AI tools');
    await user.click(
      screen.getByRole('button', { name: /generate niche pack/i })
    );

    expect(
      await screen.findByRole('heading', { name: /recommended niche/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /authority hook/i })
    ).toBeInTheDocument();
  });

  it('lets the user swap hooks locally without rerunning the full flow', async () => {
    const user = userEvent.setup();
    const tool = getAiToolBySlug('niche-discovery-sprint');

    if (!tool) {
      throw new Error('Expected niche discovery tool metadata');
    }

    render(
      <NicheDiscoveryToolPage
        tool={tool}
        persistState={vi.fn()}
        initialState={{ seed: 'AI tools', nicheSlug: 'ai-tools-breakdowns' }}
      />
    );

    expect(
      await screen.findByRole('heading', { name: /recommended niche/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /authority hook/i }));

    expect(screen.getByText(/voiceover draft/i)).toBeInTheDocument();
    expect(screen.getByText(/visual cues/i)).toBeInTheDocument();
  });
});
