import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { getAiToolBySlug } from '@/shared/blocks/tools/ai-tools-catalog';
import { ScriptRewriteToolPage } from '@/shared/blocks/tools/script-rewrite-tool-page';

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('ScriptRewriteToolPage', () => {
  it('renders an operator panel with one textarea, short control groups, and a structured empty workspace', () => {
    const tool = getAiToolBySlug('script-rewrite-studio');

    if (!tool) {
      throw new Error('Expected script rewrite tool metadata');
    }

    render(<ScriptRewriteToolPage tool={tool} />);

    expect(
      screen.getByRole('link', { name: /niche discovery sprint/i })
    ).toHaveAttribute('href', '/tools/niche-discovery-sprint');
    expect(screen.getByLabelText(/draft script/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /draft script/i })).toBe(
      screen.getByLabelText(/draft script/i)
    );
    expect(
      screen.getByRole('radiogroup', { name: /format/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radiogroup', { name: /duration target/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radiogroup', { name: /tone/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /rewrite script/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /run one rewrite to build your workspace/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/rewritten hook/i)).toBeInTheDocument();
    expect(screen.getByText(/structure plan/i)).toBeInTheDocument();
    expect(screen.getByText(/full rewrite/i)).toBeInTheDocument();
    expect(screen.getByText(/visual beat notes/i)).toBeInTheDocument();
  });

  it('generates rewritten hook, structure, full rewrite, and visual beat notes on the same page', async () => {
    const user = userEvent.setup();
    const tool = getAiToolBySlug('script-rewrite-studio');

    if (!tool) {
      throw new Error('Expected script rewrite tool metadata');
    }

    render(<ScriptRewriteToolPage tool={tool} />);

    await user.type(
      screen.getByLabelText(/draft script/i),
      'Today we are talking about AI tools. There are a lot of them. Some are useful. I will show you a few and explain why they matter.'
    );
    await user.click(screen.getByRole('radio', { name: /shorts/i }));
    await user.click(screen.getByRole('radio', { name: /45 seconds/i }));
    await user.click(screen.getByRole('radio', { name: /urgent/i }));
    await user.click(screen.getByRole('button', { name: /rewrite script/i }));

    expect(
      await screen.findByRole('heading', { name: /rewritten hook/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /structure plan/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /full rewrite/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /visual beat notes/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/format: shorts/i)).toBeInTheDocument();
    expect(
      screen.getByText(/duration target: 45 seconds/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/tone: urgent/i)).toBeInTheDocument();
    expect(screen.getByText(/you are losing watch time/i)).toBeInTheDocument();
    expect(screen.getByText(/pattern interrupt opener/i)).toBeInTheDocument();
    expect(
      screen.getByText(/show a fast collage of tools/i)
    ).toBeInTheDocument();
  });
});
