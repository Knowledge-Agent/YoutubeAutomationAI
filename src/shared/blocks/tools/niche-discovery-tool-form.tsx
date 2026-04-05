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
  const controlClassName =
    'rounded-2xl border px-4 py-3 text-left text-white transition';

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

        <div className="space-y-3">
          <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
            Format
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              aria-pressed={format === 'story'}
              onClick={() => onFormatChange('story')}
              className={cn(
                controlClassName,
                format === 'story'
                  ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                  : 'border-[color:var(--studio-line)]'
              )}
            >
              Story
            </button>
            <button
              type="button"
              aria-pressed={format === 'shorts'}
              onClick={() => onFormatChange('shorts')}
              className={cn(
                controlClassName,
                format === 'shorts'
                  ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                  : 'border-[color:var(--studio-line)]'
              )}
            >
              Shorts
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
            Visual Source
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              aria-pressed={assetType === 'stock footage'}
              onClick={() => onAssetTypeChange('stock footage')}
              className={cn(
                controlClassName,
                assetType === 'stock footage'
                  ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                  : 'border-[color:var(--studio-line)]'
              )}
            >
              Stock Footage
            </button>
            <button
              type="button"
              aria-pressed={assetType === 'screenshots'}
              onClick={() => onAssetTypeChange('screenshots')}
              className={cn(
                controlClassName,
                assetType === 'screenshots'
                  ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)]'
                  : 'border-[color:var(--studio-line)]'
              )}
            >
              Screenshots
            </button>
          </div>
        </div>

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
