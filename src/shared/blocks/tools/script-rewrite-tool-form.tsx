'use client';

import { cn } from '@/shared/lib/utils';

import { type AiToolDefinition } from './ai-tools-catalog';
import {
  scriptRewriteDurations,
  scriptRewriteFormats,
  scriptRewriteTones,
  type ScriptRewriteDuration,
  type ScriptRewriteFormat,
  type ScriptRewriteTone,
} from './script-rewrite-tool-data';

export function ScriptRewriteToolForm({
  tool,
  draftText,
  format,
  duration,
  tone,
  onDraftTextChange,
  onFormatChange,
  onDurationChange,
  onToneChange,
  onRewrite,
}: {
  tool: AiToolDefinition;
  draftText: string;
  format: ScriptRewriteFormat;
  duration: ScriptRewriteDuration;
  tone: ScriptRewriteTone;
  onDraftTextChange: (value: string) => void;
  onFormatChange: (value: ScriptRewriteFormat) => void;
  onDurationChange: (value: ScriptRewriteDuration) => void;
  onToneChange: (value: ScriptRewriteTone) => void;
  onRewrite: () => void;
}) {
  const radioInputClassName = 'peer sr-only';
  const radioCardClassName =
    'block rounded-2xl border px-4 py-3 text-left text-white transition peer-focus-visible:border-[var(--brand-signal)] peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(229,106,17,0.35)] peer-checked:border-[var(--brand-signal)] peer-checked:bg-[rgba(229,106,17,0.12)]';

  return (
    <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#171922] p-6">
      <div className="space-y-5">
        <div>
          <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
            Current Tool
          </div>
          <h1 className="studio-title mt-2 text-[2rem] font-semibold tracking-tight text-white">
            {tool.pageTitle}
          </h1>
          <p className="mt-2 max-w-[44ch] text-sm leading-6 text-white/72">
            {tool.whenToUse}
          </p>
        </div>

        <label className="block space-y-2.5">
          <span className="text-sm font-medium text-white">Draft script</span>
          <textarea
            aria-label="Draft script"
            value={draftText}
            onChange={(event) => onDraftTextChange(event.target.value)}
            className="min-h-44 w-full rounded-2xl border border-[color:var(--studio-line)] bg-[#0f1118] px-4 py-3 text-sm leading-6 text-white outline-none focus-visible:border-[var(--brand-signal)] focus-visible:ring-2 focus-visible:ring-[rgba(229,106,17,0.35)]"
            placeholder="Paste the rough draft or transcript you want to tighten."
          />
        </label>

        <fieldset
          role="radiogroup"
          aria-labelledby="script-rewrite-format-label"
          className="space-y-3"
        >
          <legend
            id="script-rewrite-format-label"
            className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase"
          >
            Format
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {scriptRewriteFormats.map((option) => (
              <label key={option} className="block cursor-pointer">
                <input
                  type="radio"
                  name="script-rewrite-format"
                  value={option}
                  checked={format === option}
                  onChange={() => onFormatChange(option)}
                  className={radioInputClassName}
                />
                <span
                  className={cn(
                    radioCardClassName,
                    format === option
                      ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                      : 'border-[color:var(--studio-line)]'
                  )}
                >
                  {option === 'story' ? 'Story' : 'Shorts'}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset
          role="radiogroup"
          aria-labelledby="script-rewrite-duration-label"
          className="space-y-3"
        >
          <legend
            id="script-rewrite-duration-label"
            className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase"
          >
            Duration target
          </legend>
          <div className="grid gap-3">
            {scriptRewriteDurations.map((option) => (
              <label key={option} className="block cursor-pointer">
                <input
                  type="radio"
                  name="script-rewrite-duration"
                  value={option}
                  checked={duration === option}
                  onChange={() => onDurationChange(option)}
                  className={radioInputClassName}
                />
                <span
                  className={cn(
                    radioCardClassName,
                    duration === option
                      ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                      : 'border-[color:var(--studio-line)]'
                  )}
                >
                  {option}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset
          role="radiogroup"
          aria-labelledby="script-rewrite-tone-label"
          className="space-y-3"
        >
          <legend
            id="script-rewrite-tone-label"
            className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase"
          >
            Tone
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {scriptRewriteTones.map((option) => (
              <label key={option} className="block cursor-pointer">
                <input
                  type="radio"
                  name="script-rewrite-tone"
                  value={option}
                  checked={tone === option}
                  onChange={() => onToneChange(option)}
                  className={radioInputClassName}
                />
                <span
                  className={cn(
                    radioCardClassName,
                    tone === option
                      ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                      : 'border-[color:var(--studio-line)]'
                  )}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={onRewrite}
          className="rounded-full bg-[var(--brand-signal)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!draftText.trim()}
        >
          Rewrite Script
        </button>
      </div>
    </section>
  );
}
