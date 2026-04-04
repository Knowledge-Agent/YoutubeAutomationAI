import { type AiToolDefinition } from './ai-tools-catalog';
import { AiToolPageFrame } from './ai-tool-page-frame';

export function AiToolComingSoonPage({
  tool,
}: {
  tool: AiToolDefinition;
}) {
  return (
    <AiToolPageFrame
      tool={tool}
      center={
        <div className="space-y-4">
          <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
            Current Tool
          </div>
          <h1 className="studio-title text-3xl font-semibold tracking-tight text-white">
            {tool.pageTitle}
          </h1>
          <p className="text-sm leading-6 text-white/72">{tool.whenToUse}</p>
        </div>
      }
      right={
        <div className="space-y-4">
          <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
            Status
          </div>
          <h2 className="studio-title text-2xl font-semibold tracking-tight text-white">
            Coming Soon
          </h2>
          <p className="text-sm leading-6 text-white/72">{tool.whatYouGet}</p>
        </div>
      }
    />
  );
}
