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

  it('normalizes malformed format and asset values to supported defaults', () => {
    const params = new URLSearchParams({
      seed: 'AI tools',
      format: 'unsupported',
      asset: 'b-roll',
      audience: 'curious beginners',
      niche: 'ai-tools-breakdowns',
      topic: 'ai-tools-breakdowns-high-curiosity',
      hook: 'ai-tools-breakdowns-high-curiosity-authority-hook',
    });

    expect(readNicheDiscoveryToolSearchState(params)).toEqual({
      seed: 'AI tools',
      format: 'story',
      assetType: 'stock footage',
      audience: 'curious beginners',
      nicheSlug: 'ai-tools-breakdowns',
      topicSlug: 'ai-tools-breakdowns-high-curiosity',
      hookSlug: 'ai-tools-breakdowns-high-curiosity-authority-hook',
    });
  });
});
