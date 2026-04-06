'use client';

import { useState } from 'react';

import { type AiToolDefinition } from './ai-tools-catalog';
import {
  buildScriptRewriteResult,
  type ScriptRewriteDuration,
  type ScriptRewriteFormat,
  type ScriptRewriteResult,
  type ScriptRewriteTone,
} from './script-rewrite-tool-data';
import { ScriptRewriteToolForm } from './script-rewrite-tool-form';
import { ScriptRewriteToolResults } from './script-rewrite-tool-results';
import { ToolSwitcherCard } from './tool-switcher-card';

const DEFAULT_FORMAT: ScriptRewriteFormat = 'story';
const DEFAULT_DURATION: ScriptRewriteDuration = '90 seconds';
const DEFAULT_TONE: ScriptRewriteTone = 'clear';

export function ScriptRewriteToolPage({ tool }: { tool: AiToolDefinition }) {
  const [draftText, setDraftText] = useState('');
  const [format, setFormat] = useState<ScriptRewriteFormat>(DEFAULT_FORMAT);
  const [duration, setDuration] =
    useState<ScriptRewriteDuration>(DEFAULT_DURATION);
  const [tone, setTone] = useState<ScriptRewriteTone>(DEFAULT_TONE);
  const [result, setResult] = useState<ScriptRewriteResult | null>(null);

  const runRewrite = () => {
    if (!draftText.trim()) {
      return;
    }

    setResult(
      buildScriptRewriteResult({
        draftText: draftText.trim(),
        format,
        duration,
        tone,
      })
    );
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="space-y-4">
        <ToolSwitcherCard activeSlug={tool.slug} />
        <ScriptRewriteToolForm
          tool={tool}
          draftText={draftText}
          format={format}
          duration={duration}
          tone={tone}
          onDraftTextChange={setDraftText}
          onFormatChange={setFormat}
          onDurationChange={setDuration}
          onToneChange={setTone}
          onRewrite={runRewrite}
        />
      </div>

      <div className="min-w-0">
        <ScriptRewriteToolResults result={result} />
      </div>
    </div>
  );
}
