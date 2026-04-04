import { describe, expect, it } from 'vitest';

import {
  buildNicheDiscoverySprint,
  getDefaultSprintSelections,
} from '@/shared/blocks/tools/niche-discovery-sprint-data';

describe('buildNicheDiscoverySprint', () => {
  it('builds a recommended path from one seed input', () => {
    const sprint = buildNicheDiscoverySprint({
      seed: 'AI tools',
      format: 'story',
      assetType: 'screenshots',
      audience: 'curious beginners',
    });

    expect(sprint.seedLabel).toBe('AI tools');
    expect(sprint.niches).toHaveLength(3);
    expect(sprint.recommended.nicheSlug).toBe(sprint.niches[0]?.slug);
    expect(sprint.niches[0]?.topics[0]?.hooks[0]?.scriptPack.prompt).toContain(
      'AI tools'
    );
  });

  it('returns a default recommended selection chain', () => {
    const sprint = buildNicheDiscoverySprint({
      seed: 'Hidden business stories',
    });

    expect(getDefaultSprintSelections(sprint)).toEqual({
      nicheSlug: sprint.niches[0]?.slug,
      topicSlug: sprint.niches[0]?.topics[0]?.slug,
      hookSlug: sprint.niches[0]?.topics[0]?.hooks[0]?.slug,
    });
  });
});
