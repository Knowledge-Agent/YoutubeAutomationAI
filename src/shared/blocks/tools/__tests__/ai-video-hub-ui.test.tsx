import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AiVideoHubUi } from '@/shared/blocks/tools/ai-video-hub-ui';

vi.mock('@/shared/hooks/use-media-query', () => ({
  useMediaQuery: () => false,
}));

vi.mock('@/shared/hooks/use-tool-catalog', () => ({
  useToolCatalog: () => ({
    models: [],
    options: {},
    loading: false,
    error: null,
  }),
}));

vi.mock('@/shared/blocks/tools/use-start-tool-chat', () => ({
  useStartToolChat: () => ({
    isStarting: false,
    startToolChat: vi.fn(),
  }),
}));

describe('AiVideoHubUi', () => {
  it('keeps AI Video generator-first and does not render business tool cards', () => {
    render(<AiVideoHubUi />);

    expect(
      screen.getByPlaceholderText(/enter your idea to generate/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/featured video generations/i)).toBeInTheDocument();
    expect(screen.queryByText(/video tools/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/viral hook finder/i)).not.toBeInTheDocument();
  });
});
