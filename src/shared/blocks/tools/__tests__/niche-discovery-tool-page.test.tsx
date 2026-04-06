import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { getAiToolBySlug } from '@/shared/blocks/tools/ai-tools-catalog';
import {
  buildNicheDiscoverySprint,
  getDefaultSprintSelections,
} from '@/shared/blocks/tools/niche-discovery-sprint-data';
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
  it('renders one operator panel CTA and a structured result workspace before the sprint runs', () => {
    const tool = getAiToolBySlug('niche-discovery-sprint');

    if (!tool) {
      throw new Error('Expected niche discovery tool metadata');
    }

    render(<NicheDiscoveryToolPage tool={tool} persistState={vi.fn()} />);

    expect(
      screen.getByRole('link', { name: /script rewrite studio/i })
    ).toHaveAttribute('href', '/tools/script-rewrite-studio');
    expect(screen.getByText(/operator panel/i)).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: /format/i })).toBeInTheDocument();
    expect(
      screen.getByRole('radiogroup', { name: /visual source/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /story/i })).toBeChecked();
    expect(
      screen.getByRole('radio', { name: /stock footage/i })
    ).toBeChecked();
    expect(
      screen.getByRole('button', { name: /generate niche pack/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByText(/result workspace/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /recommended path preview/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/output modules/i)).toBeInTheDocument();
    expect(screen.getAllByText(/recommended niche/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/topic ladder/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/hook options/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/script pack/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/after this run/i)).toBeInTheDocument();
    expect(
      screen.getByText(/pick the strongest topic, choose a hook, then move into scripting/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/what you'll get/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/what happens after this run/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /recommended niche/i })
    ).not.toBeInTheDocument();
  });

  it('renders one cohesive result workspace with a usable next step after one CTA', async () => {
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
    expect(screen.getByText(/result workspace/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(
      screen.getByRole('radiogroup', { name: /topic ladder/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radiogroup', { name: /hook options/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /topic ladder/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /hook options/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /script pack/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/why it fits/i)).toBeInTheDocument();
    expect(screen.getByText(/risk to watch/i)).toBeInTheDocument();
    expect(screen.getByText(/refine this pack/i)).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: /easy-entry ai tools/i })
    ).toBeChecked();
    expect(
      screen.getByRole('radio', { name: /curiosity hook/i })
    ).toBeChecked();
    expect(screen.getByText(/voiceover draft/i)).toBeInTheDocument();
    expect(screen.getByText(/next creator step/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /continue in script rewrite studio/i })
    ).toHaveAttribute('href', '/tools/script-rewrite-studio');

    const scriptPack = screen.getByRole('heading', { name: /script pack/i })
      .closest('section');

    expect(scriptPack).not.toBeNull();
    expect(
      within(scriptPack as HTMLElement).getByText(/voiceover draft/i)
    ).toBeInTheDocument();
    expect(
      within(scriptPack as HTMLElement).getByText(/visual cues/i)
    ).toBeInTheDocument();
  });

  it('syncs persisted sprint state when format and asset type change after a run', async () => {
    const user = userEvent.setup();
    const tool = getAiToolBySlug('niche-discovery-sprint');
    const persistState = vi.fn();

    if (!tool) {
      throw new Error('Expected niche discovery tool metadata');
    }

    const defaultSelections = getDefaultSprintSelections(
      buildNicheDiscoverySprint({
        seed: 'AI tools',
        format: 'story',
        assetType: 'stock footage',
        audience: 'curious general viewers',
      })
    );

    render(<NicheDiscoveryToolPage tool={tool} persistState={persistState} />);

    await user.type(screen.getByLabelText(/seed topic/i), 'AI tools');
    await user.click(
      screen.getByRole('button', { name: /generate niche pack/i })
    );

    await user.click(screen.getByRole('radio', { name: /shorts/i }));

    expect(persistState).toHaveBeenLastCalledWith({
      seed: 'AI tools',
      format: 'shorts',
      assetType: 'stock footage',
      audience: 'curious general viewers',
      nicheSlug: defaultSelections.nicheSlug,
      topicSlug: defaultSelections.topicSlug,
      hookSlug: defaultSelections.hookSlug,
    });

    await user.click(screen.getByRole('radio', { name: /screenshots/i }));

    expect(persistState).toHaveBeenLastCalledWith({
      seed: 'AI tools',
      format: 'shorts',
      assetType: 'screenshots',
      audience: 'curious general viewers',
      nicheSlug: defaultSelections.nicheSlug,
      topicSlug: defaultSelections.topicSlug,
      hookSlug: defaultSelections.hookSlug,
    });
    expect(
      screen.getByText(/use screenshots to establish/i)
    ).toBeInTheDocument();
  });

  it('lets the user switch asset type back to stock footage', async () => {
    const user = userEvent.setup();
    const tool = getAiToolBySlug('niche-discovery-sprint');

    if (!tool) {
      throw new Error('Expected niche discovery tool metadata');
    }

    render(<NicheDiscoveryToolPage tool={tool} persistState={vi.fn()} />);

    const stockFootageRadio = screen.getByRole('radio', {
      name: /stock footage/i,
    });
    const screenshotsRadio = screen.getByRole('radio', {
      name: /screenshots/i,
    });

    expect(stockFootageRadio).toBeChecked();
    expect(screenshotsRadio).not.toBeChecked();

    await user.click(screenshotsRadio);
    expect(stockFootageRadio).not.toBeChecked();
    expect(screenshotsRadio).toBeChecked();

    await user.click(stockFootageRadio);
    expect(stockFootageRadio).toBeChecked();
    expect(screenshotsRadio).not.toBeChecked();
  });

  it('renders a visible focus indicator for the seed input', () => {
    const tool = getAiToolBySlug('niche-discovery-sprint');

    if (!tool) {
      throw new Error('Expected niche discovery tool metadata');
    }

    render(<NicheDiscoveryToolPage tool={tool} persistState={vi.fn()} />);

    expect(screen.getByLabelText(/seed topic/i)).toHaveClass(
      'focus-visible:border-[var(--brand-signal)]',
      'focus-visible:ring-2',
      'focus-visible:ring-[rgba(229,106,17,0.35)]'
    );
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
      screen.getByRole('radio', { name: /high-curiosity ai tools/i })
    );
    await user.click(screen.getByRole('radio', { name: /authority hook/i }));

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
