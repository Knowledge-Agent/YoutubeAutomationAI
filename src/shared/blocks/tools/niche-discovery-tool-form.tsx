'use client';

import { cn } from '@/shared/lib/utils';

import { type AiToolDefinition } from './ai-tools-catalog';
import { type SprintFormat } from './niche-discovery-sprint-data';

export function NicheDiscoveryToolForm({
  tool,
  seed,
  format,
  assetType,
  onSeedChange,
  onFormatChange,
  onAssetTypeChange,
  onRunSprint,
}: {
  tool: AiToolDefinition;
  seed: string;
  format: SprintFormat;
  assetType: string;
  onSeedChange: (value: string) => void;
  onFormatChange: (value: SprintFormat) => void;
  onAssetTypeChange: (value: string) => void;
  onRunSprint: () => void;
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
          <span className="text-sm font-medium text-white">Seed topic</span>
          <input
            aria-label="Seed topic"
            value={seed}
            onChange={(event) => onSeedChange(event.target.value)}
            className="w-full rounded-2xl border border-[color:var(--studio-line)] bg-[#0f1118] px-4 py-3 text-white outline-none focus-visible:border-[var(--brand-signal)] focus-visible:ring-2 focus-visible:ring-[rgba(229,106,17,0.35)]"
            placeholder="AI tools"
          />
        </label>

        <fieldset
          role="radiogroup"
          aria-labelledby="niche-format-label"
          className="space-y-3"
        >
          <legend
            id="niche-format-label"
            className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase"
          >
            Format
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block cursor-pointer">
              <input
                type="radio"
                name="niche-discovery-format"
                value="story"
                checked={format === 'story'}
                onChange={() => onFormatChange('story')}
                className={radioInputClassName}
              />
              <span
                className={cn(
                  radioCardClassName,
                  format === 'story'
                    ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                    : 'border-[color:var(--studio-line)]'
                )}
              >
                Story
              </span>
            </label>
            <label className="block cursor-pointer">
              <input
                type="radio"
                name="niche-discovery-format"
                value="shorts"
                checked={format === 'shorts'}
                onChange={() => onFormatChange('shorts')}
                className={radioInputClassName}
              />
              <span
                className={cn(
                  radioCardClassName,
                  format === 'shorts'
                    ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                    : 'border-[color:var(--studio-line)]'
                )}
              >
                Shorts
              </span>
            </label>
          </div>
        </fieldset>

        <fieldset
          role="radiogroup"
          aria-labelledby="niche-visual-source-label"
          className="space-y-3"
        >
          <legend
            id="niche-visual-source-label"
            className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase"
          >
            Visual Source
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block cursor-pointer">
              <input
                type="radio"
                name="niche-discovery-visual-source"
                value="stock footage"
                checked={assetType === 'stock footage'}
                onChange={() => onAssetTypeChange('stock footage')}
                className={radioInputClassName}
              />
              <span
                className={cn(
                  radioCardClassName,
                  assetType === 'stock footage'
                    ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                    : 'border-[color:var(--studio-line)]'
                )}
              >
                Stock Footage
              </span>
            </label>
            <label className="block cursor-pointer">
              <input
                type="radio"
                name="niche-discovery-visual-source"
                value="screenshots"
                checked={assetType === 'screenshots'}
                onChange={() => onAssetTypeChange('screenshots')}
                className={radioInputClassName}
              />
              <span
                className={cn(
                  radioCardClassName,
                  assetType === 'screenshots'
                    ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                    : 'border-[color:var(--studio-line)]'
                )}
              >
                Screenshots
              </span>
            </label>
          </div>
        </fieldset>

        <button
          type="button"
          onClick={onRunSprint}
          className="rounded-full bg-[var(--brand-signal)] px-5 py-3 text-sm font-semibold text-white"
        >
          Generate Niche Pack
        </button>
      </div>
    </section>
  );
}
