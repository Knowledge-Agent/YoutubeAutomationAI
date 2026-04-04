import { describe, expect, it } from 'vitest';

import {
  aiToolCategories,
  getAiToolBySlug,
  getAiToolsForCategory,
  parseAiToolCategory,
} from '@/shared/blocks/tools/ai-tools-catalog';

describe('ai-tools-catalog', () => {
  it('parses only the supported directory categories', () => {
    expect(parseAiToolCategory('video-tools')).toBe('video-tools');
    expect(parseAiToolCategory('script-tools')).toBe('script-tools');
    expect(parseAiToolCategory('not-a-real-tab')).toBe('video-tools');
  });

  it('returns the niche discovery tool as the ready tool route', () => {
    expect(getAiToolBySlug('niche-discovery-sprint')).toEqual(
      expect.objectContaining({
        slug: 'niche-discovery-sprint',
        title: 'Niche Discovery Sprint',
        category: 'script-tools',
        status: 'ready',
        href: '/tools/niche-discovery-sprint',
      })
    );
  });

  it('keeps the directory categories stable and ordered', () => {
    expect(aiToolCategories.map((item) => item.slug)).toEqual([
      'video-tools',
      'image-tools',
      'script-tools',
    ]);
  });

  it('filters tools by category without mixing unrelated cards', () => {
    const videoTools = getAiToolsForCategory('video-tools').map(
      (item) => item.slug
    );
    const scriptTools = getAiToolsForCategory('script-tools').map(
      (item) => item.slug
    );

    expect(videoTools).toContain('shorts-reframer');
    expect(videoTools).not.toContain('script-rewrite-studio');
    expect(scriptTools).toContain('script-rewrite-studio');
  });
});
