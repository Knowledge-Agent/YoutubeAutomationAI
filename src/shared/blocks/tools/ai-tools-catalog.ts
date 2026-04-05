export type AiToolCategory = 'video-tools' | 'image-tools' | 'script-tools';

export type AiToolStatus = 'ready' | 'coming-soon';

export interface AiToolCategoryDefinition {
  slug: AiToolCategory;
  title: string;
}

export interface AiToolDefinition {
  slug: string;
  title: string;
  category: AiToolCategory;
  coverImage: string;
  status: AiToolStatus;
  href: `/tools/${string}`;
  pageTitle: string;
  whenToUse: string;
  whatYouInput: string;
  whatYouGet: string;
  outputModules: string[];
}

export const aiToolCategories = [
  { slug: 'video-tools', title: 'Video Tools' },
  { slug: 'image-tools', title: 'Image Tools' },
  { slug: 'script-tools', title: 'Script Tools' },
] satisfies AiToolCategoryDefinition[];

export const aiTools = [
  {
    slug: 'shorts-reframer',
    title: 'Shorts Reframer',
    category: 'video-tools',
    coverImage:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    status: 'coming-soon',
    href: '/tools/shorts-reframer',
    pageTitle: 'Shorts Reframer',
    whenToUse: 'Use this when one long-form video needs multiple vertical cuts.',
    whatYouInput: 'One source video, desired cut style, and publishing goal.',
    whatYouGet: 'Hook-first short concepts, clip boundaries, and editing notes.',
    outputModules: [
      'Hook-first short concepts',
      'Clip boundaries',
      'Editing notes',
    ],
  },
  {
    slug: 'thumbnail-brief-builder',
    title: 'Thumbnail Brief Builder',
    category: 'image-tools',
    coverImage:
      'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80',
    status: 'coming-soon',
    href: '/tools/thumbnail-brief-builder',
    pageTitle: 'Thumbnail Brief Builder',
    whenToUse: 'Use this when the packaging angle is still weaker than the topic.',
    whatYouInput: 'Topic angle, audience promise, and thumbnail direction.',
    whatYouGet: 'Thumbnail concepts, title angles, and visual composition notes.',
    outputModules: [
      'Thumbnail concepts',
      'Title angles',
      'Visual composition notes',
    ],
  },
  {
    slug: 'niche-discovery-sprint',
    title: 'Niche Discovery Sprint',
    category: 'script-tools',
    coverImage:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    status: 'ready',
    href: '/tools/niche-discovery-sprint',
    pageTitle: 'Niche Discovery Sprint',
    whenToUse:
      'Use this when you have a seed direction but no clear faceless niche path yet.',
    whatYouInput:
      'One seed topic, content format, and optional audience constraints.',
    whatYouGet: 'A niche path, topic ladder, hook options, and a script-ready pack.',
    outputModules: [
      'Niche path',
      'Topic ladder',
      'Hook options',
      'Script-ready pack',
    ],
  },
  {
    slug: 'script-rewrite-studio',
    title: 'Script Rewrite Studio',
    category: 'script-tools',
    coverImage:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    status: 'coming-soon',
    href: '/tools/script-rewrite-studio',
    pageTitle: 'Script Rewrite Studio',
    whenToUse:
      'Use this when a rough draft already exists but the retention flow is weak.',
    whatYouInput: 'A draft script, tone direction, and desired pacing.',
    whatYouGet: 'A cleaner narrative structure, tighter hook, and sharper beats.',
    outputModules: [
      'Cleaner narrative structure',
      'Tighter hook',
      'Sharper beats',
    ],
  },
] satisfies AiToolDefinition[];

export function parseAiToolCategory(value?: string | null): AiToolCategory {
  if (value === 'image-tools' || value === 'script-tools') {
    return value;
  }

  return 'video-tools';
}

export function getAiToolsForCategory(category: AiToolCategory) {
  return aiTools.filter((tool) => tool.category === category);
}

export function getAiToolBySlug(slug: string) {
  return aiTools.find((tool) => tool.slug === slug);
}
