export interface ScriptRewriteInput {
  draftText?: string;
  format?: string;
  duration?: string;
  tone?: string;
}

export type ScriptRewriteFormat = 'story' | 'shorts';

export type ScriptRewriteDuration = '45 seconds' | '90 seconds' | '3 minutes';

export type ScriptRewriteTone = 'clear' | 'urgent' | 'authoritative';

export interface ScriptRewriteSection {
  title: string;
  summary: string;
}

export interface ScriptRewriteResult {
  topic: string;
  format: ScriptRewriteFormat;
  duration: ScriptRewriteDuration;
  tone: ScriptRewriteTone;
  rewrittenHook: string;
  structurePlan: ScriptRewriteSection[];
  fullRewrite: string[];
  visualBeatNotes: string[];
}

export const scriptRewriteFormats = ['story', 'shorts'] as const;

export const scriptRewriteDurations = [
  '45 seconds',
  '90 seconds',
  '3 minutes',
] as const;

export const scriptRewriteTones = ['clear', 'urgent', 'authoritative'] as const;

const DEFAULT_DRAFT =
  'This draft needs a clearer promise, a tighter middle, and a stronger finish.';
const DEFAULT_FORMAT: ScriptRewriteFormat = 'story';
const DEFAULT_DURATION: ScriptRewriteDuration = '90 seconds';
const DEFAULT_TONE: ScriptRewriteTone = 'clear';

function toFormat(value?: string): ScriptRewriteFormat {
  return value === 'shorts' ? 'shorts' : DEFAULT_FORMAT;
}

function toDuration(value?: string): ScriptRewriteDuration {
  return (
    scriptRewriteDurations.find((option) => option === value) ??
    DEFAULT_DURATION
  );
}

function toTone(value?: string): ScriptRewriteTone {
  return scriptRewriteTones.find((option) => option === value) ?? DEFAULT_TONE;
}

function splitIntoSentences(value: string) {
  return value
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function trimWords(value: string, maxWords: number) {
  return value.split(/\s+/).slice(0, maxWords).join(' ');
}

function extractTopic(draftText: string) {
  const fromAbout = draftText.match(/\babout\s+([^.!?]+)/i)?.[1]?.trim();

  if (fromAbout) {
    return trimWords(fromAbout, 4);
  }

  const firstSentence = splitIntoSentences(draftText)[0] ?? draftText;
  const cleaned = firstSentence
    .replace(/^today\s+we\s+are\s+talking\s+about\s+/i, '')
    .replace(/^we\s+are\s+talking\s+about\s+/i, '')
    .replace(/^this\s+video\s+is\s+about\s+/i, '')
    .replace(/^today\s+/i, '')
    .trim();

  return trimWords(cleaned || 'your topic', 4);
}

function buildHook(topic: string, tone: ScriptRewriteTone) {
  if (tone === 'urgent') {
    return `You are losing watch time before ${topic.toLowerCase()} gets specific, so open with the outcome and make the value obvious immediately.`;
  }

  if (tone === 'authoritative') {
    return `Most drafts around ${topic.toLowerCase()} bury the useful point, so lead with the proof and frame the takeaway like a decision.`;
  }

  return `${topic} becomes easier to watch when the first line states the payoff, names the tension, and shows the viewer what changes next.`;
}

function buildStructurePlan(
  topic: string,
  format: ScriptRewriteFormat,
  duration: ScriptRewriteDuration
): ScriptRewriteSection[] {
  const lowerTopic = topic.toLowerCase();
  const proofBeatCount = duration === '45 seconds' ? 'two' : 'three';

  if (format === 'shorts') {
    return [
      {
        title: 'Pattern Interrupt Opener',
        summary: `Lead with the strongest consequence tied to ${lowerTopic} before any setup lands.`,
      },
      {
        title: 'Fast Context',
        summary: `Explain why ${lowerTopic} matters in one clean sentence with no throat clearing.`,
      },
      {
        title: 'Proof Stack',
        summary: `Use ${proofBeatCount} fast proof beats so the claim feels earned instead of generic.`,
      },
      {
        title: 'Looped Finish',
        summary:
          'Close on one action or reveal that makes the viewer want the next part immediately.',
      },
    ];
  }

  return [
    {
      title: 'Hook Reset',
      summary: `Open with the viewer problem around ${lowerTopic} before you explain the background.`,
    },
    {
      title: 'Context Bridge',
      summary: `Set up the stakes in one short beat so the viewer understands what changes.`,
    },
    {
      title: 'Proof Sequence',
      summary: `Stack ${proofBeatCount} concrete beats that show why the rewrite is worth following.`,
    },
    {
      title: 'Payoff Close',
      summary:
        'End with a clear takeaway that naturally hands off to production or the next video.',
    },
  ];
}

function buildFullRewrite(args: {
  topic: string;
  tone: ScriptRewriteTone;
  structurePlan: ScriptRewriteSection[];
  sourceSentences: string[];
}) {
  const { topic, tone, structurePlan, sourceSentences } = args;
  const lowerTopic = topic.toLowerCase();
  const sourceReference =
    sourceSentences[0] ?? 'The original draft stays broad for too long.';
  const opening =
    tone === 'urgent'
      ? `Open by naming the watch-time leak around ${lowerTopic} before the viewer has a chance to scroll.`
      : tone === 'authoritative'
        ? `Open by stating the strongest proof about ${lowerTopic} before you explain the background.`
        : `Open by making the payoff around ${lowerTopic} obvious in the first line.`;

  return [
    opening,
    `Here is the sharper setup: frame ${lowerTopic} around one outcome the viewer can feel right away instead of a general overview.`,
    `Move through ${structurePlan[1]?.title.toLowerCase()} and ${structurePlan[2]?.title.toLowerCase()} with direct proof, replacing filler like "${sourceReference}" with one claim per beat.`,
    `Close by turning the takeaway into the next creator step so the rewrite can move straight into recording or editing.`,
  ];
}

function buildVisualBeatNotes(topic: string, format: ScriptRewriteFormat) {
  const lowerTopic = topic.toLowerCase();

  if (format === 'shorts') {
    return [
      'Show a fast collage of tools before the narration lands on the first claim.',
      `Cut to one proof screen that makes ${lowerTopic} feel specific instead of abstract.`,
      'Use punch-in captions on each beat change so the viewer feels the pacing shift.',
      'End on a clean visual callback to the opening promise.',
    ];
  }

  return [
    `Open on a strong proof visual that frames ${lowerTopic} in one glance.`,
    'Alternate between proof screenshots and simple motion graphics as the argument builds.',
    'Use lower-thirds only when the takeaway changes, not on every sentence.',
    'Finish on one clear action card that can flow into production notes.',
  ];
}

export function buildScriptRewriteResult(
  input: ScriptRewriteInput
): ScriptRewriteResult {
  const draftText = input.draftText?.trim() || DEFAULT_DRAFT;
  const format = toFormat(input.format);
  const duration = toDuration(input.duration);
  const tone = toTone(input.tone);
  const sourceSentences = splitIntoSentences(draftText);
  const topic = extractTopic(draftText);
  const structurePlan = buildStructurePlan(topic, format, duration);

  return {
    topic,
    format,
    duration,
    tone,
    rewrittenHook: buildHook(topic, tone),
    structurePlan,
    fullRewrite: buildFullRewrite({
      topic,
      tone,
      structurePlan,
      sourceSentences,
    }),
    visualBeatNotes: buildVisualBeatNotes(topic, format),
  };
}
