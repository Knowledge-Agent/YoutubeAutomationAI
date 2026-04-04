export interface SprintInput {
  seed?: string;
  format?: string;
  assetType?: string;
  audience?: string;
}

export type SprintFormat = 'story' | 'shorts';

export type SprintAspectRatio = '16:9' | '9:16';

export interface SprintSelections {
  nicheSlug: string;
  topicSlug: string;
  hookSlug: string;
}

export interface SprintScriptPack {
  prompt: string;
  aspectRatio: SprintAspectRatio;
  opening: string;
  voiceoverDraft: string[];
  visuals: string[];
}

export interface SprintHook {
  slug: string;
  title: 'Curiosity Hook' | 'Authority Hook' | 'Contrarian Hook';
  summary: string;
  scriptPack: SprintScriptPack;
}

export interface SprintTopic {
  slug: string;
  title: string;
  summary: string;
  hooks: SprintHook[];
}

export interface SprintNiche {
  slug: string;
  title: string;
  summary: string;
  whyItFits: string;
  risk: string;
  topics: SprintTopic[];
}

export interface NicheDiscoverySprintResult {
  seedLabel: string;
  format: SprintFormat;
  assetType: string;
  audience: string;
  niches: SprintNiche[];
  recommended: SprintSelections;
}

const DEFAULT_SEED = 'Faceless YouTube ideas';
const DEFAULT_FORMAT: SprintFormat = 'story';
const DEFAULT_ASSET_TYPE = 'stock footage';
const DEFAULT_AUDIENCE = 'curious general viewers';

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toFormat(format?: string): SprintFormat {
  return format === 'shorts' ? 'shorts' : DEFAULT_FORMAT;
}

function getAspectRatio(format: SprintFormat): SprintAspectRatio {
  return format === 'shorts' ? '9:16' : '16:9';
}

function buildHook(args: {
  nicheSlug: string;
  topicSlug: string;
  seedLabel: string;
  format: SprintFormat;
  assetType: string;
  audience: string;
  nicheTitle: string;
  topicTitle: string;
  hookTitle: SprintHook['title'];
}): SprintHook {
  const {
    nicheSlug,
    topicSlug,
    seedLabel,
    format,
    assetType,
    audience,
    nicheTitle,
    topicTitle,
    hookTitle,
  } = args;
  const hookSlug = `${topicSlug}-${slugify(hookTitle)}`;

  return {
    slug: hookSlug,
    title: hookTitle,
    summary: `${hookTitle} for ${topicTitle.toLowerCase()}.`,
    scriptPack: {
      prompt: `Create a ${format} YouTube script about ${seedLabel} for ${audience} using the ${nicheTitle} angle, focused on ${topicTitle}, and opened with a ${hookTitle}. Use ${assetType} as the visual language.`,
      aspectRatio: getAspectRatio(format),
      opening: `Open by reframing ${seedLabel} through ${nicheTitle.toLowerCase()} with a ${hookTitle.toLowerCase()}.`,
      voiceoverDraft: [
        `${seedLabel} feels crowded until you isolate the ${topicTitle.toLowerCase()} angle.`,
        `That is why ${nicheTitle.toLowerCase()} works for ${audience} without relying on on-camera personality.`,
        `The ${hookTitle.toLowerCase()} gives the episode an immediate viewer promise.`,
      ],
      visuals: [
        `Use ${assetType} to establish the promise in the first three seconds.`,
        `Cut to proof beats that make ${topicTitle.toLowerCase()} feel specific and credible.`,
        `End with one visual bridge into the next video idea.`,
      ],
    },
  };
}

function buildTopic(args: {
  nicheSlug: string;
  seedLabel: string;
  format: SprintFormat;
  assetType: string;
  audience: string;
  nicheTitle: string;
  track: 'easy-entry' | 'high-curiosity' | 'series-potential';
  label: string;
}): SprintTopic {
  const {
    nicheSlug,
    seedLabel,
    format,
    assetType,
    audience,
    nicheTitle,
    track,
    label,
  } = args;
  const topicTitle = `${label} ${seedLabel}`;
  const topicSlug = `${nicheSlug}-${track}`;

  return {
    slug: topicSlug,
    title: topicTitle,
    summary: `${label} angle for ${seedLabel.toLowerCase()}.`,
    hooks: [
      buildHook({
        nicheSlug,
        topicSlug,
        seedLabel,
        format,
        assetType,
        audience,
        nicheTitle,
        topicTitle,
        hookTitle: 'Curiosity Hook',
      }),
      buildHook({
        nicheSlug,
        topicSlug,
        seedLabel,
        format,
        assetType,
        audience,
        nicheTitle,
        topicTitle,
        hookTitle: 'Authority Hook',
      }),
      buildHook({
        nicheSlug,
        topicSlug,
        seedLabel,
        format,
        assetType,
        audience,
        nicheTitle,
        topicTitle,
        hookTitle: 'Contrarian Hook',
      }),
    ],
  };
}

function buildNiche(args: {
  seedLabel: string;
  format: SprintFormat;
  assetType: string;
  audience: string;
  suffix: string;
  titleSuffix: string;
}): SprintNiche {
  const { seedLabel, format, assetType, audience, suffix, titleSuffix } = args;
  const baseSlug = slugify(seedLabel);
  const nicheSlug = `${baseSlug}-${suffix}`;
  const nicheTitle = `${seedLabel} ${titleSuffix}`;

  return {
    slug: nicheSlug,
    title: nicheTitle,
    summary: `A faceless-friendly ${titleSuffix.toLowerCase()} angle for ${seedLabel.toLowerCase()}.`,
    whyItFits: `This angle works because the story lives in the structure, not on-camera personality.`,
    risk: `The channel can feel generic if each episode does not sharpen the mechanism.`,
    topics: [
      buildTopic({
        nicheSlug,
        seedLabel,
        format,
        assetType,
        audience,
        nicheTitle,
        track: 'easy-entry',
        label: 'Easy-entry',
      }),
      buildTopic({
        nicheSlug,
        seedLabel,
        format,
        assetType,
        audience,
        nicheTitle,
        track: 'high-curiosity',
        label: 'High-curiosity',
      }),
      buildTopic({
        nicheSlug,
        seedLabel,
        format,
        assetType,
        audience,
        nicheTitle,
        track: 'series-potential',
        label: 'Series-potential',
      }),
    ],
  };
}

export function getDefaultSprintSelections(
  sprint: NicheDiscoverySprintResult
): SprintSelections {
  return {
    nicheSlug: sprint.niches[0]?.slug ?? '',
    topicSlug: sprint.niches[0]?.topics[0]?.slug ?? '',
    hookSlug: sprint.niches[0]?.topics[0]?.hooks[0]?.slug ?? '',
  };
}

export function buildNicheDiscoverySprint(
  input: SprintInput
): NicheDiscoverySprintResult {
  const seedLabel = input.seed?.trim() || DEFAULT_SEED;
  const format = toFormat(input.format);
  const assetType = input.assetType?.trim() || DEFAULT_ASSET_TYPE;
  const audience = input.audience?.trim() || DEFAULT_AUDIENCE;

  const niches = [
    buildNiche({
      seedLabel,
      format,
      assetType,
      audience,
      suffix: 'breakdowns',
      titleSuffix: 'Breakdowns',
    }),
    buildNiche({
      seedLabel,
      format,
      assetType,
      audience,
      suffix: 'case-files',
      titleSuffix: 'Case Files',
    }),
    buildNiche({
      seedLabel,
      format,
      assetType,
      audience,
      suffix: 'playbooks',
      titleSuffix: 'Playbooks',
    }),
  ];

  const recommended = getDefaultSprintSelections({
    seedLabel,
    format,
    assetType,
    audience,
    niches,
    recommended: {
      nicheSlug: '',
      topicSlug: '',
      hookSlug: '',
    },
  });

  return {
    seedLabel,
    format,
    assetType,
    audience,
    niches,
    recommended,
  };
}
