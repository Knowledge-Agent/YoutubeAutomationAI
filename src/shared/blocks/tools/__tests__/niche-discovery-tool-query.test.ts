import { describe, expect, it } from 'vitest';

import {
  buildNicheDiscoveryToolSearchParams,
  readNicheDiscoveryToolSearchState,
} from '@/shared/blocks/tools/niche-discovery-tool-query';

describe('niche-discovery-tool-query', () => {
  it('round-trips the tool state through URL params', () => {
    const params = buildNicheDiscoveryToolSearchParams(new URLSearchParams(), {
      seed: 'AI tools',
      format: 'shorts',
      assetType: 'screenshots',
      audience: 'curious beginners',
      nicheSlug: 'ai-tools-breakdowns',
      topicSlug: 'ai-tools-breakdowns-high-curiosity',
      hookSlug: 'ai-tools-breakdowns-high-curiosity-authority-hook',
    });

    expect(readNicheDiscoveryToolSearchState(params)).toEqual({
      seed: 'AI tools',
      format: 'shorts',
      assetType: 'screenshots',
      audience: 'curious beginners',
      nicheSlug: 'ai-tools-breakdowns',
      topicSlug: 'ai-tools-breakdowns-high-curiosity',
      hookSlug: 'ai-tools-breakdowns-high-curiosity-authority-hook',
    });
  });
});
