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

  it('marks both niche discovery and script rewrite as ready tools', () => {
    expect(getAiToolBySlug('niche-discovery-sprint')).toEqual(
      expect.objectContaining({
        slug: 'niche-discovery-sprint',
        title: 'Niche Discovery Sprint',
        category: 'script-tools',
        status: 'ready',
        href: '/tools/niche-discovery-sprint',
        outputModules: [
          'Niche path',
          'Topic ladder',
          'Hook options',
          'Script-ready pack',
        ],
      })
    );

    expect(getAiToolBySlug('script-rewrite-studio')).toEqual(
      expect.objectContaining({
        slug: 'script-rewrite-studio',
        status: 'ready',
        href: '/tools/script-rewrite-studio',
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

  it('stores output modules as structured catalog data for every tool', () => {
    expect(getAiToolBySlug('shorts-reframer')).toEqual(
      expect.objectContaining({
        outputModules: [
          'Hook-first short concepts',
          'Clip boundaries',
          'Editing notes',
        ],
      })
    );

    expect(getAiToolBySlug('thumbnail-brief-builder')).toEqual(
      expect.objectContaining({
        outputModules: [
          'Thumbnail concepts',
          'Title angles',
          'Visual composition notes',
        ],
        status: 'planned',
        primaryActionLabel: 'Lock The Topic First',
        previewTitle: 'Sample Thumbnail Brief',
      })
    );

    expect(getAiToolBySlug('shorts-reframer')).toEqual(
      expect.objectContaining({
        status: 'planned',
        primaryActionLabel: 'Rewrite The Source First',
        previewTitle: 'Sample Shorts Reframe Pack',
      })
    );
  });
});
