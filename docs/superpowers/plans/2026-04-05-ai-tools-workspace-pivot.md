# AI Tools Workspace Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `AI Tools` into a first-class tool workspace with a minimal `/tools` directory, dedicated `/tools/[slug]` pages, a standalone `Niche Discovery Sprint` workspace, and a cleaned-up `AI Video` generator page that no longer acts as the default workflow destination.

**Architecture:** Introduce a dedicated AI tools catalog as the source of truth for directory cards and tool routes. Keep the existing shared workspace shell and deterministic sprint data engine, but move business workflows into dedicated tool pages that own their center-column input and right-column output. Simplify `/tools` into tabs plus cards, then route one fully working tool (`niche-discovery-sprint`) into its own page while other tools use a consistent coming-soon detail surface.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, next-intl, Tailwind CSS, lucide-react, Vitest, Testing Library, pnpm

---

## File Structure

**Create:**

- `src/app/[locale]/(landing)/tools/[slug]/page.tsx`
- `src/shared/blocks/tools/ai-tools-catalog.ts`
- `src/shared/blocks/tools/ai-tools-directory.tsx`
- `src/shared/blocks/tools/ai-tool-page-frame.tsx`
- `src/shared/blocks/tools/ai-tool-coming-soon-page.tsx`
- `src/shared/blocks/tools/niche-discovery-tool-page.tsx`
- `src/shared/blocks/tools/niche-discovery-tool-query.ts`
- `src/shared/blocks/tools/__tests__/ai-tools-catalog.test.ts`
- `src/shared/blocks/tools/__tests__/ai-tools-directory.test.tsx`
- `src/shared/blocks/tools/__tests__/ai-tool-page-frame.test.tsx`
- `src/shared/blocks/tools/__tests__/niche-discovery-tool-query.test.ts`
- `src/shared/blocks/tools/__tests__/niche-discovery-tool-page.test.tsx`
- `src/shared/blocks/tools/__tests__/ai-video-hub-ui.test.tsx`

**Modify:**

- `src/app/[locale]/(landing)/tools/page.tsx`
- `src/shared/blocks/tools/ai-video-hub-ui.tsx`
- `src/shared/blocks/tools/youtube-ops-tool-data.ts`
- `src/config/locale/messages/en/ai/tools.json`
- `src/config/locale/messages/zh/ai/tools.json`
- `openspec/changes/add-youtube-ops-tools-hub/design.md`
- `openspec/changes/add-youtube-ops-tools-hub/specs/youtube-ops-tools/spec.md`
- `openspec/changes/add-youtube-ops-tools-hub/tasks.md`

**Delete:**

- `src/shared/blocks/tools/youtube-ops-tools-directory.tsx`
- `src/shared/blocks/tools/niche-discovery-sprint.tsx`
- `src/shared/blocks/tools/ai-video-sprint-query.ts`
- `src/shared/blocks/tools/__tests__/niche-discovery-sprint.test.tsx`
- `src/shared/blocks/tools/__tests__/ai-video-sprint-query.test.ts`

## Responsibilities

- `ai-tools-catalog.ts`: single source of truth for tool slugs, card imagery, categories, route metadata, and detail-page semantics.
- `ai-tools-directory.tsx`: minimal tab-plus-card directory UI with no workflow copy clutter and no prompt/chat entry.
- `page.tsx` under `/tools`: route-level parsing of the active directory tab and shell composition.
- `page.tsx` under `/tools/[slug]`: dynamic route that resolves tool metadata and renders either the real workspace or a consistent coming-soon detail page.
- `ai-tool-page-frame.tsx`: consistent left / center / right page frame for business tools.
- `niche-discovery-tool-query.ts`: URL state helpers scoped to the dedicated niche discovery tool route.
- `niche-discovery-tool-page.tsx`: the first real tool workspace using the approved operator-panel and result-panel layout.
- `ai-video-hub-ui.tsx`: prompt-first generator surface only, without tool directory logic or workflow starter state.
- `youtube-ops-tool-data.ts`: generator-specific demo data only after the business-tool catalog moves elsewhere.

## Scope Notes

This plan intentionally does **not** include:

- backend persistence for tool runs
- user accounts or saved projects for tool history
- real competitor scraping or live YouTube data
- a full implementation for every tool in the directory
- SEO structure changes beyond the intended `/tools/[slug]` pages

The first pass should make the IA pivot unambiguous, even if only one tool is fully interactive.

### Task 1: Introduce the AI Tools Catalog

**Files:**

- Create: `src/shared/blocks/tools/ai-tools-catalog.ts`
- Create: `src/shared/blocks/tools/__tests__/ai-tools-catalog.test.ts`

- [ ] **Step 1: Write the failing catalog test**

Create `src/shared/blocks/tools/__tests__/ai-tools-catalog.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify the catalog module does not exist yet**

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/ai-tools-catalog.test.ts
```

Expected: FAIL with a module resolution error for `ai-tools-catalog`.

- [ ] **Step 3: Implement the catalog source of truth**

Create `src/shared/blocks/tools/ai-tools-catalog.ts`:

```ts
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
    whenToUse: 'Use this when you have a seed direction but no clear faceless niche path yet.',
    whatYouInput: 'One seed topic, content format, and optional audience constraints.',
    whatYouGet: 'A niche path, topic ladder, hook options, and a script-ready pack.',
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
    whenToUse: 'Use this when a rough draft already exists but the retention flow is weak.',
    whatYouInput: 'A draft script, tone direction, and desired pacing.',
    whatYouGet: 'A cleaner narrative structure, tighter hook, and sharper beats.',
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
```

- [ ] **Step 4: Run the catalog test to verify the module is green**

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/ai-tools-catalog.test.ts
```

Expected: PASS with 4 tests passing.

- [ ] **Step 5: Commit the catalog layer**

Run:

```bash
git add src/shared/blocks/tools/ai-tools-catalog.ts src/shared/blocks/tools/__tests__/ai-tools-catalog.test.ts
git commit -m "feat: add AI tools catalog for workspace routes"
```

### Task 2: Replace the Tools Directory with a Minimal Tab-and-Card Page

**Files:**

- Create: `src/shared/blocks/tools/ai-tools-directory.tsx`
- Create: `src/shared/blocks/tools/__tests__/ai-tools-directory.test.tsx`
- Modify: `src/app/[locale]/(landing)/tools/page.tsx`
- Modify: `src/config/locale/messages/en/ai/tools.json`
- Modify: `src/config/locale/messages/zh/ai/tools.json`
- Delete: `src/shared/blocks/tools/youtube-ops-tools-directory.tsx`

- [ ] **Step 1: Write the failing directory test**

Create `src/shared/blocks/tools/__tests__/ai-tools-directory.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AiToolsDirectory } from '@/shared/blocks/tools/ai-tools-directory';

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('AiToolsDirectory', () => {
  it('renders only the selected category and links directly to tool pages', () => {
    render(<AiToolsDirectory activeCategory="script-tools" />);

    expect(
      screen.getByRole('link', { name: /niche discovery sprint/i })
    ).toHaveAttribute('href', '/tools/niche-discovery-sprint');
    expect(
      screen.getByRole('link', { name: /script rewrite studio/i })
    ).toHaveAttribute('href', '/tools/script-rewrite-studio');
    expect(
      screen.queryByRole('link', { name: /shorts reframer/i })
    ).not.toBeInTheDocument();
  });

  it('keeps the cards visually minimal', () => {
    render(<AiToolsDirectory activeCategory="video-tools" />);

    expect(screen.getByText('Shorts Reframer')).toBeInTheDocument();
    expect(screen.queryByText(/what you input/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/open tool/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify the new component does not exist yet**

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/ai-tools-directory.test.tsx
```

Expected: FAIL with a module resolution error for `ai-tools-directory`.

- [ ] **Step 3: Implement the new directory component and route wiring**

Create `src/shared/blocks/tools/ai-tools-directory.tsx`:

```tsx
import { Link } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';

import {
  aiToolCategories,
  getAiToolsForCategory,
  type AiToolCategory,
} from './ai-tools-catalog';

export function AiToolsDirectory({
  activeCategory,
}: {
  activeCategory: AiToolCategory;
}) {
  const tools = getAiToolsForCategory(activeCategory);

  return (
    <div className="space-y-5">
      <nav
        aria-label="AI tools categories"
        className="flex flex-wrap gap-2 rounded-[28px] border border-[color:var(--studio-line)] bg-[rgb(23_25_32_/_0.74)] p-2"
      >
        {aiToolCategories.map((category) => {
          const active = category.slug === activeCategory;

          return (
            <Link
              key={category.slug}
              href={`/tools?tab=${category.slug}`}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition',
                active
                  ? 'bg-white text-[#13141b]'
                  : 'text-[var(--studio-muted)] hover:bg-white/[0.04] hover:text-white'
              )}
            >
              {category.title}
            </Link>
          );
        })}
      </nav>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.href}
            className="group overflow-hidden rounded-[22px] border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:border-white/14"
          >
            <div className="relative aspect-[1.42/1] overflow-hidden bg-black">
              <img
                src={tool.coverImage}
                alt={tool.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="border-t border-[color:var(--studio-line)] px-4 py-3">
              <div className="studio-title text-lg font-semibold tracking-tight text-white">
                {tool.title}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
```

Modify `src/app/[locale]/(landing)/tools/page.tsx`:

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AiToolsDirectory } from '@/shared/blocks/tools/ai-tools-directory';
import { parseAiToolCategory } from '@/shared/blocks/tools/ai-tools-catalog';
import { ToolWorkspaceShell } from '@/shared/blocks/tools/tool-workspace-shell';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'ai.tools.metadata',
  canonicalUrl: '/tools',
});

export default async function ToolsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('ai.tools');
  const activeCategory = parseAiToolCategory(
    Array.isArray(resolvedSearchParams.tab)
      ? resolvedSearchParams.tab[0]
      : resolvedSearchParams.tab
  );

  return (
    <ToolWorkspaceShell
      activeKey="tools"
      activeTab="tools"
      workspaceMode="hub"
      title={t.raw('page.title')}
      description={t.raw('page.description')}
      actions={['Directory']}
      contentCard={false}
      showIntroCard={false}
    >
      <AiToolsDirectory activeCategory={activeCategory} />
    </ToolWorkspaceShell>
  );
}
```

Replace `src/config/locale/messages/en/ai/tools.json` with:

```json
{
  "metadata": {
    "title": "AI Tools",
    "description": "Browse dedicated AI tools for faceless YouTube workflows."
  },
  "page": {
    "title": "AI Tools",
    "description": "Choose a tool, then enter its own workspace."
  }
}
```

Replace `src/config/locale/messages/zh/ai/tools.json` with:

```json
{
  "metadata": {
    "title": "AI Tools",
    "description": "浏览面向 faceless YouTube 工作流的独立 AI 工具。"
  },
  "page": {
    "title": "AI Tools",
    "description": "先选择工具，再进入对应的独立工作台。"
  }
}
```

Then remove the obsolete directory implementation:

```bash
rm src/shared/blocks/tools/youtube-ops-tools-directory.tsx
```

- [ ] **Step 4: Run the new directory test**

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/ai-tools-directory.test.tsx
```

Expected: PASS with 2 tests passing.

- [ ] **Step 5: Commit the directory pivot**

Run:

```bash
git add src/app/[locale]/(landing)/tools/page.tsx src/shared/blocks/tools/ai-tools-directory.tsx src/shared/blocks/tools/__tests__/ai-tools-directory.test.tsx src/shared/blocks/tools/ai-tools-catalog.ts src/config/locale/messages/en/ai/tools.json src/config/locale/messages/zh/ai/tools.json
git rm src/shared/blocks/tools/youtube-ops-tools-directory.tsx
git commit -m "refactor: simplify AI tools directory into minimal card grid"
```

### Task 3: Add the Dedicated Tool Detail Route and Shared Page Frame

**Files:**

- Create: `src/app/[locale]/(landing)/tools/[slug]/page.tsx`
- Create: `src/shared/blocks/tools/ai-tool-page-frame.tsx`
- Create: `src/shared/blocks/tools/ai-tool-coming-soon-page.tsx`
- Create: `src/shared/blocks/tools/__tests__/ai-tool-page-frame.test.tsx`

- [ ] **Step 1: Write the failing page-frame test**

Create `src/shared/blocks/tools/__tests__/ai-tool-page-frame.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AiToolPageFrame } from '@/shared/blocks/tools/ai-tool-page-frame';
import { getAiToolBySlug } from '@/shared/blocks/tools/ai-tools-catalog';

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('AiToolPageFrame', () => {
  it('renders the left tool switcher plus center and right slots', () => {
    const tool = getAiToolBySlug('niche-discovery-sprint');

    if (!tool) {
      throw new Error('Expected niche discovery tool metadata');
    }

    render(
      <AiToolPageFrame
        tool={tool}
        center={<div>center panel</div>}
        right={<div>right panel</div>}
      />
    );

    expect(
      screen.getByRole('link', { name: /script rewrite studio/i })
    ).toHaveAttribute('href', '/tools/script-rewrite-studio');
    expect(screen.getByText('center panel')).toBeInTheDocument();
    expect(screen.getByText('right panel')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify the frame does not exist yet**

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/ai-tool-page-frame.test.tsx
```

Expected: FAIL with module resolution errors for the new frame component.

- [ ] **Step 3: Implement the shared detail frame and the dynamic route**

Create `src/shared/blocks/tools/ai-tool-page-frame.tsx`:

```tsx
import { type ReactNode } from 'react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';

import { aiTools, type AiToolDefinition } from './ai-tools-catalog';

export function AiToolPageFrame({
  tool,
  center,
  right,
}: {
  tool: AiToolDefinition;
  center: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-110px)] gap-4 lg:grid-cols-[220px_minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <aside className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#14151c] p-4">
        <div className="mb-3 text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
          AI Tools
        </div>
        <div className="space-y-2">
          {aiTools.map((entry) => (
            <Link
              key={entry.slug}
              href={entry.href}
              className={cn(
                'block rounded-2xl border px-3 py-3 text-sm transition',
                entry.slug === tool.slug
                  ? 'border-[var(--brand-signal)] bg-[rgba(229,106,17,0.12)] text-white'
                  : 'border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] text-[var(--studio-muted)] hover:text-white'
              )}
            >
              {entry.title}
            </Link>
          ))}
        </div>
      </aside>

      <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#171922] p-5">
        {center}
      </section>

      <section className="rounded-[28px] border border-[color:var(--studio-line)] bg-[#11131a] p-5">
        {right}
      </section>
    </div>
  );
}
```

Create `src/shared/blocks/tools/ai-tool-coming-soon-page.tsx`:

```tsx
import { AiToolPageFrame } from './ai-tool-page-frame';
import { type AiToolDefinition } from './ai-tools-catalog';

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
```

Create `src/app/[locale]/(landing)/tools/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import { AiToolComingSoonPage } from '@/shared/blocks/tools/ai-tool-coming-soon-page';
import { getAiToolBySlug } from '@/shared/blocks/tools/ai-tools-catalog';
import { ToolWorkspaceShell } from '@/shared/blocks/tools/tool-workspace-shell';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tool = getAiToolBySlug(slug);

  if (!tool) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const localeSegment = locale === defaultLocale ? '' : `/${locale}`;
  const canonicalUrl = `${envConfigs.app_url}${localeSegment}/tools/${tool.slug}`;

  return {
    title: `${tool.pageTitle} | AI Tools`,
    description: tool.whatYouGet,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tool = getAiToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <ToolWorkspaceShell
      activeKey="tools"
      activeTab="tools"
      workspaceMode="detail"
      title={tool.pageTitle}
      description={tool.whenToUse}
      contentCard={false}
      showIntroCard={false}
    >
      <AiToolComingSoonPage tool={tool} />
    </ToolWorkspaceShell>
  );
}
```

- [ ] **Step 4: Run the frame test**

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/ai-tool-page-frame.test.tsx
```

Expected: PASS with 1 test passing.

- [ ] **Step 5: Commit the dedicated route skeleton**

Run:

```bash
git add src/app/[locale]/(landing)/tools/[slug]/page.tsx src/shared/blocks/tools/ai-tool-page-frame.tsx src/shared/blocks/tools/ai-tool-coming-soon-page.tsx src/shared/blocks/tools/__tests__/ai-tool-page-frame.test.tsx
git commit -m "feat: add dedicated AI tool detail routes"
```

### Task 4: Move Niche Discovery Sprint into Its Own Tool Workspace

**Files:**

- Create: `src/shared/blocks/tools/niche-discovery-tool-query.ts`
- Create: `src/shared/blocks/tools/niche-discovery-tool-page.tsx`
- Create: `src/shared/blocks/tools/__tests__/niche-discovery-tool-query.test.ts`
- Create: `src/shared/blocks/tools/__tests__/niche-discovery-tool-page.test.tsx`
- Modify: `src/app/[locale]/(landing)/tools/[slug]/page.tsx`
- Delete: `src/shared/blocks/tools/niche-discovery-sprint.tsx`
- Delete: `src/shared/blocks/tools/__tests__/niche-discovery-sprint.test.tsx`
- Delete: `src/shared/blocks/tools/__tests__/ai-video-sprint-query.test.ts`

- [ ] **Step 1: Write the failing query-helper and workspace tests**

Create `src/shared/blocks/tools/__tests__/niche-discovery-tool-query.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import {
  buildNicheDiscoveryToolSearchParams,
  readNicheDiscoveryToolSearchState,
} from '@/shared/blocks/tools/niche-discovery-tool-query';

describe('niche-discovery-tool-query', () => {
  it('round-trips the tool state through URL params', () => {
    const params = buildNicheDiscoveryToolSearchParams(new URLSearchParams(), {
      seed: 'AI tools',
      format: 'shorts',
      assetType: 'screenshots',
      audience: 'curious beginners',
      nicheSlug: 'ai-tools-breakdowns',
      topicSlug: 'ai-tools-breakdowns-high-curiosity',
      hookSlug: 'ai-tools-breakdowns-high-curiosity-authority-hook',
    });

    expect(readNicheDiscoveryToolSearchState(params)).toEqual({
      seed: 'AI tools',
      format: 'shorts',
      assetType: 'screenshots',
      audience: 'curious beginners',
      nicheSlug: 'ai-tools-breakdowns',
      topicSlug: 'ai-tools-breakdowns-high-curiosity',
      hookSlug: 'ai-tools-breakdowns-high-curiosity-authority-hook',
    });
  });
});
```

Create `src/shared/blocks/tools/__tests__/niche-discovery-tool-page.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { getAiToolBySlug } from '@/shared/blocks/tools/ai-tools-catalog';
import { NicheDiscoveryToolPage } from '@/shared/blocks/tools/niche-discovery-tool-page';

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePathname: () => '/tools/niche-discovery-sprint',
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe('NicheDiscoveryToolPage', () => {
  it('starts with an empty result panel, then renders the recommended path after one CTA', async () => {
    const user = userEvent.setup();
    const tool = getAiToolBySlug('niche-discovery-sprint');

    if (!tool) {
      throw new Error('Expected niche discovery tool metadata');
    }

    render(
      <NicheDiscoveryToolPage
        tool={tool}
        persistState={vi.fn()}
      />
    );

    expect(screen.getByText(/run the sprint to see/i)).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/seed topic/i),
      'AI tools'
    );
    await user.click(
      screen.getByRole('button', { name: /generate niche pack/i })
    );

    expect(
      await screen.findByRole('heading', { name: /recommended niche/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /authority hook/i })).toBeInTheDocument();
  });

  it('lets the user swap hooks locally without rerunning the full flow', async () => {
    const user = userEvent.setup();
    const tool = getAiToolBySlug('niche-discovery-sprint');

    if (!tool) {
      throw new Error('Expected niche discovery tool metadata');
    }

    render(
      <NicheDiscoveryToolPage
        tool={tool}
        persistState={vi.fn()}
        initialState={{ seed: 'AI tools', nicheSlug: 'ai-tools-breakdowns' }}
      />
    );

    expect(
      await screen.findByRole('heading', { name: /recommended niche/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /authority hook/i }));

    expect(screen.getByText(/voiceover draft/i)).toBeInTheDocument();
    expect(screen.getByText(/visual cues/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify the dedicated tool workspace does not exist yet**

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/niche-discovery-tool-query.test.ts src/shared/blocks/tools/__tests__/niche-discovery-tool-page.test.tsx
```

Expected: FAIL with module resolution errors for the new helper and page component.

- [ ] **Step 3: Implement the query helper and the dedicated tool page**

Create `src/shared/blocks/tools/niche-discovery-tool-query.ts`:

```ts
export interface NicheDiscoveryToolSearchState {
  seed?: string;
  format?: 'story' | 'shorts';
  assetType?: string;
  audience?: string;
  nicheSlug?: string;
  topicSlug?: string;
  hookSlug?: string;
}

export function readNicheDiscoveryToolSearchState(searchParams: {
  get: (key: string) => string | null;
}): NicheDiscoveryToolSearchState {
  return {
    seed: searchParams.get('seed') || undefined,
    format:
      (searchParams.get('format') as NicheDiscoveryToolSearchState['format']) ||
      undefined,
    assetType: searchParams.get('asset') || undefined,
    audience: searchParams.get('audience') || undefined,
    nicheSlug: searchParams.get('niche') || undefined,
    topicSlug: searchParams.get('topic') || undefined,
    hookSlug: searchParams.get('hook') || undefined,
  };
}

export function buildNicheDiscoveryToolSearchParams(
  currentParams: URLSearchParams,
  state: NicheDiscoveryToolSearchState
) {
  const nextParams = new URLSearchParams(currentParams.toString());

  const entries: Array<[keyof NicheDiscoveryToolSearchState, string]> = [
    ['seed', 'seed'],
    ['format', 'format'],
    ['assetType', 'asset'],
    ['audience', 'audience'],
    ['nicheSlug', 'niche'],
    ['topicSlug', 'topic'],
    ['hookSlug', 'hook'],
  ];

  for (const [stateKey, queryKey] of entries) {
    const value = state[stateKey]?.trim();

    if (value) {
      nextParams.set(queryKey, value);
    } else {
      nextParams.delete(queryKey);
    }
  }

  return nextParams;
}
```

Create `src/shared/blocks/tools/niche-discovery-tool-page.tsx`:

```tsx
'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { usePathname, useRouter } from '@/core/i18n/navigation';
import {
  buildNicheDiscoverySprint,
  getDefaultSprintSelections,
  type SprintFormat,
  type SprintSelections,
} from './niche-discovery-sprint-data';
import { AiToolPageFrame } from './ai-tool-page-frame';
import { type AiToolDefinition } from './ai-tools-catalog';
import {
  buildNicheDiscoveryToolSearchParams,
  type NicheDiscoveryToolSearchState,
} from './niche-discovery-tool-query';

const DEFAULT_FORMAT: SprintFormat = 'story';
const DEFAULT_ASSET_TYPE = 'stock footage';
const DEFAULT_AUDIENCE = 'curious general viewers';

function getFirstSelections(seed: string) {
  const sprint = buildNicheDiscoverySprint({ seed });
  return {
    sprint,
    selections: getDefaultSprintSelections(sprint),
  };
}

export function NicheDiscoveryToolPage({
  tool,
  initialState,
  persistState,
}: {
  tool: AiToolDefinition;
  initialState?: NicheDiscoveryToolSearchState;
  persistState?: (state: NicheDiscoveryToolSearchState) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [seed, setSeed] = useState(initialState?.seed ?? '');
  const [format, setFormat] = useState<SprintFormat>(
    initialState?.format ?? DEFAULT_FORMAT
  );
  const [assetType, setAssetType] = useState(
    initialState?.assetType ?? DEFAULT_ASSET_TYPE
  );
  const [audience, setAudience] = useState(
    initialState?.audience ?? DEFAULT_AUDIENCE
  );
  const [runSeed, setRunSeed] = useState(initialState?.seed ?? '');
  const [selections, setSelections] = useState<SprintSelections | null>(
    initialState?.nicheSlug && initialState?.topicSlug && initialState?.hookSlug
      ? {
          nicheSlug: initialState.nicheSlug,
          topicSlug: initialState.topicSlug,
          hookSlug: initialState.hookSlug,
        }
      : null
  );

  const sprint = useMemo(() => {
    if (!runSeed.trim()) {
      return null;
    }

    return buildNicheDiscoverySprint({
      seed: runSeed,
      format,
      assetType,
      audience,
    });
  }, [assetType, audience, format, runSeed]);

  const resolvedSelections = useMemo(() => {
    if (!sprint) {
      return null;
    }

    return selections ?? getDefaultSprintSelections(sprint);
  }, [selections, sprint]);

  const selectedNiche = sprint?.niches.find(
    (item) => item.slug === resolvedSelections?.nicheSlug
  );
  const selectedTopic = selectedNiche?.topics.find(
    (item) => item.slug === resolvedSelections?.topicSlug
  );
  const selectedHook = selectedTopic?.hooks.find(
    (item) => item.slug === resolvedSelections?.hookSlug
  );

  const syncState = (next: NicheDiscoveryToolSearchState) => {
    if (persistState) {
      persistState(next);
      return;
    }

    const params = buildNicheDiscoveryToolSearchParams(
      new URLSearchParams(searchParams.toString()),
      next
    );
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const runSprint = () => {
    if (!seed.trim()) {
      return;
    }

    const next = getFirstSelections(seed.trim());
    setRunSeed(seed.trim());
    setSelections(next.selections);

    syncState({
      seed: seed.trim(),
      format,
      assetType,
      audience,
      nicheSlug: next.selections.nicheSlug,
      topicSlug: next.selections.topicSlug,
      hookSlug: next.selections.hookSlug,
    });
  };

  return (
    <AiToolPageFrame
      tool={tool}
      center={
        <div className="space-y-5">
          <div>
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              Current Tool
            </div>
            <h1 className="studio-title mt-2 text-3xl font-semibold tracking-tight text-white">
              {tool.pageTitle}
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/72">
              {tool.whenToUse}
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-white">Seed topic</span>
            <input
              aria-label="Seed topic"
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
              className="w-full rounded-2xl border border-[color:var(--studio-line)] bg-[#0f1118] px-4 py-3 text-white outline-none"
              placeholder="AI tools"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-3">
            <button
              type="button"
              onClick={() => setFormat('story')}
              className="rounded-2xl border border-[color:var(--studio-line)] px-4 py-3 text-left text-white"
            >
              Story
            </button>
            <button
              type="button"
              onClick={() => setFormat('shorts')}
              className="rounded-2xl border border-[color:var(--studio-line)] px-4 py-3 text-left text-white"
            >
              Shorts
            </button>
            <button
              type="button"
              onClick={() => setAssetType('screenshots')}
              className="rounded-2xl border border-[color:var(--studio-line)] px-4 py-3 text-left text-white"
            >
              Screenshots
            </button>
          </div>

          <button
            type="button"
            onClick={runSprint}
            className="rounded-full bg-[var(--brand-signal)] px-5 py-3 text-sm font-semibold text-white"
          >
            Generate Niche Pack
          </button>
        </div>
      }
      right={
        !sprint || !selectedNiche || !selectedTopic || !selectedHook ? (
          <div className="space-y-3">
            <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
              Results
            </div>
            <h2 className="studio-title text-2xl font-semibold tracking-tight text-white">
              Run the sprint to see your recommended path
            </h2>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
                Recommended Niche
              </div>
              <h2 className="studio-title mt-2 text-3xl font-semibold tracking-tight text-white">
                {selectedNiche.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/72">
                {selectedNiche.summary}
              </p>
            </div>

            <div className="space-y-2">
              {selectedNiche.topics.map((topic) => (
                <button
                  key={topic.slug}
                  type="button"
                  onClick={() => {
                    const nextHook = topic.hooks[0];
                    const nextSelections = {
                      nicheSlug: selectedNiche.slug,
                      topicSlug: topic.slug,
                      hookSlug: nextHook?.slug ?? '',
                    };
                    setSelections(nextSelections);
                    syncState({
                      seed: runSeed,
                      format,
                      assetType,
                      audience,
                      ...nextSelections,
                    });
                  }}
                  className="block w-full rounded-2xl border border-[color:var(--studio-line)] px-4 py-3 text-left text-white"
                >
                  {topic.title}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {selectedTopic.hooks.map((hook) => (
                <button
                  key={hook.slug}
                  type="button"
                  onClick={() => {
                    const nextSelections = {
                      nicheSlug: selectedNiche.slug,
                      topicSlug: selectedTopic.slug,
                      hookSlug: hook.slug,
                    };
                    setSelections(nextSelections);
                    syncState({
                      seed: runSeed,
                      format,
                      assetType,
                      audience,
                      ...nextSelections,
                    });
                  }}
                  className="block w-full rounded-2xl border border-[color:var(--studio-line)] px-4 py-3 text-left text-white"
                >
                  {hook.title}
                </button>
              ))}
            </div>

            <div className="space-y-3 rounded-[24px] border border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.04)] p-4">
              <div className="text-sm font-semibold text-white">Voiceover Draft</div>
              {selectedHook.scriptPack.voiceoverDraft.map((line) => (
                <p key={line} className="text-sm leading-6 text-white/72">
                  {line}
                </p>
              ))}
              <div className="text-sm font-semibold text-white">Visual Cues</div>
              {selectedHook.scriptPack.visuals.map((line) => (
                <p key={line} className="text-sm leading-6 text-white/72">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )
      }
    />
  );
}
```

Modify `src/app/[locale]/(landing)/tools/[slug]/page.tsx` so the dynamic route resolves the tool state and renders the dedicated niche workspace when the slug is ready:

```tsx
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import { AiToolComingSoonPage } from '@/shared/blocks/tools/ai-tool-coming-soon-page';
import { getAiToolBySlug } from '@/shared/blocks/tools/ai-tools-catalog';
import { NicheDiscoveryToolPage } from '@/shared/blocks/tools/niche-discovery-tool-page';
import {
  readNicheDiscoveryToolSearchState,
  type NicheDiscoveryToolSearchState,
} from '@/shared/blocks/tools/niche-discovery-tool-query';
import { ToolWorkspaceShell } from '@/shared/blocks/tools/tool-workspace-shell';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tool = getAiToolBySlug(slug);

  if (!tool) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const localeSegment = locale === defaultLocale ? '' : `/${locale}`;
  const canonicalUrl = `${envConfigs.app_url}${localeSegment}/tools/${tool.slug}`;

  return {
    title: `${tool.pageTitle} | AI Tools`,
    description: tool.whatYouGet,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ToolDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, slug } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);

  const tool = getAiToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const getSearchValue = (key: string) => {
    const value = resolvedSearchParams[key];

    return Array.isArray(value) ? value[0] : value ?? null;
  };

  const initialState: NicheDiscoveryToolSearchState | undefined =
    tool.slug === 'niche-discovery-sprint'
      ? readNicheDiscoveryToolSearchState({ get: getSearchValue })
      : undefined;

  return (
    <ToolWorkspaceShell
      activeKey="tools"
      activeTab="tools"
      workspaceMode="detail"
      title={tool.pageTitle}
      description={tool.whenToUse}
      contentCard={false}
      showIntroCard={false}
    >
      {tool.slug === 'niche-discovery-sprint' ? (
        <NicheDiscoveryToolPage tool={tool} initialState={initialState} />
      ) : (
        <AiToolComingSoonPage tool={tool} />
      )}
    </ToolWorkspaceShell>
  );
}
```

Then remove the obsolete single-column sprint component and old query test file:

```bash
rm src/shared/blocks/tools/niche-discovery-sprint.tsx
rm src/shared/blocks/tools/ai-video-sprint-query.ts
rm src/shared/blocks/tools/__tests__/niche-discovery-sprint.test.tsx
rm src/shared/blocks/tools/__tests__/ai-video-sprint-query.test.ts
```

- [ ] **Step 4: Run the dedicated-tool tests**

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/niche-discovery-tool-query.test.ts src/shared/blocks/tools/__tests__/niche-discovery-tool-page.test.tsx src/shared/blocks/tools/__tests__/niche-discovery-sprint-data.test.ts
```

Expected: PASS with the new tool-route tests green and the existing deterministic data tests still green.

- [ ] **Step 5: Commit the niche discovery migration**

Run:

```bash
git add src/app/[locale]/(landing)/tools/[slug]/page.tsx src/shared/blocks/tools/niche-discovery-tool-query.ts src/shared/blocks/tools/niche-discovery-tool-page.tsx src/shared/blocks/tools/__tests__/niche-discovery-tool-query.test.ts src/shared/blocks/tools/__tests__/niche-discovery-tool-page.test.tsx src/shared/blocks/tools/niche-discovery-sprint-data.ts src/shared/blocks/tools/__tests__/niche-discovery-sprint-data.test.ts
git rm src/shared/blocks/tools/niche-discovery-sprint.tsx src/shared/blocks/tools/ai-video-sprint-query.ts src/shared/blocks/tools/__tests__/niche-discovery-sprint.test.tsx src/shared/blocks/tools/__tests__/ai-video-sprint-query.test.ts
git commit -m "refactor: move niche discovery sprint into dedicated tool page"
```

### Task 5: Return the AI Video Page to a Generator-First Surface

**Files:**

- Create: `src/shared/blocks/tools/__tests__/ai-video-hub-ui.test.tsx`
- Modify: `src/shared/blocks/tools/ai-video-hub-ui.tsx`
- Modify: `src/shared/blocks/tools/youtube-ops-tool-data.ts`

- [ ] **Step 1: Write the failing AI video cleanup test**

Create `src/shared/blocks/tools/__tests__/ai-video-hub-ui.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AiVideoHubUi } from '@/shared/blocks/tools/ai-video-hub-ui';

vi.mock('@/shared/hooks/use-tool-catalog', () => ({
  useToolCatalog: () => ({
    models: [],
    loading: false,
  }),
}));

vi.mock('@/shared/blocks/tools/use-start-tool-chat', () => ({
  useStartToolChat: () => ({
    isStarting: false,
    startToolChat: vi.fn(),
  }),
}));

describe('AiVideoHubUi', () => {
  it('renders a generator-first surface without business tool workflow UI', () => {
    render(<AiVideoHubUi />);

    expect(
      screen.getByPlaceholderText(/enter your idea to generate/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/niche discovery sprint/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/selected workflow app/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify the old workflow-driven hub still leaks into AI video**

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/ai-video-hub-ui.test.tsx
```

Expected: FAIL because the existing `AiVideoHubUi` still renders tool-workflow UI.

- [ ] **Step 3: Remove tool-workflow logic from the AI video generator page**

Replace `src/shared/blocks/tools/ai-video-hub-ui.tsx` with a generator-first version that keeps prompt entry, prompt chips, and featured previews only:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

import { useToolCatalog } from '@/shared/hooks/use-tool-catalog';

import { type ToolControlValue } from './tool-control-bar';
import { ToolPromptCard } from './tool-prompt-card';
import { useStartToolChat } from './use-start-tool-chat';
import {
  fallbackModelLabels,
  featuredRows,
  promptIdeas,
} from './youtube-ops-tool-data';

export function AiVideoHubUi() {
  const [prompt, setPrompt] = useState('');
  const [controls, setControls] = useState<ToolControlValue>({
    mode: 'text-to-video',
    modelId: '',
    options: {},
  });
  const featuredRailRef = useRef<HTMLDivElement | null>(null);
  const [hasFeaturedOverflow, setHasFeaturedOverflow] = useState(false);
  const { isStarting, startToolChat } = useStartToolChat('video');
  const { models } = useToolCatalog('video');

  const visibleModels =
    models.length > 0 ? models.slice(0, 10).map((item) => item.label) : [];

  const startGeneration = () => {
    if (isStarting || !prompt.trim()) {
      return;
    }

    void startToolChat({
      prompt: prompt.trim(),
      mode: controls.mode as 'text-to-video' | 'image-to-video',
      toolModel: controls.modelId,
      toolOptions: controls.options,
    });
  };

  useEffect(() => {
    const rail = featuredRailRef.current;

    if (!rail) {
      return;
    }

    const syncOverflowState = () => {
      setHasFeaturedOverflow(rail.scrollWidth > rail.clientWidth + 8);
    };

    syncOverflowState();
    window.addEventListener('resize', syncOverflowState);

    return () => window.removeEventListener('resize', syncOverflowState);
  }, []);

  const scrollFeaturedRail = (direction: 'prev' | 'next') => {
    const rail = featuredRailRef.current;

    if (!rail) {
      return;
    }

    const offset = Math.max(rail.clientWidth * 0.82, 320);
    rail.scrollBy({
      left: direction === 'next' ? offset : -offset,
      behavior: 'smooth',
    });
  };

  return (
    <div className="space-y-5">
      <ToolPromptCard
        surface="video"
        prompt={prompt}
        onPromptChange={setPrompt}
        controls={controls}
        onControlsChange={setControls}
        onSubmit={startGeneration}
        submitting={isStarting}
        allowedModes={['text-to-video', 'image-to-video']}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] text-[var(--studio-muted)] transition hover:bg-[var(--studio-hover-strong)] hover:text-[var(--studio-ink)]">
          <RefreshCw className="size-4" />
        </button>
        {promptIdeas.map((chip, index) => (
          <button
            key={chip}
            type="button"
            data-testid={`ai-video-hub-chip-${index}`}
            className="rounded-full border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] px-4.5 py-2.5 text-sm text-[var(--studio-muted)] transition hover:bg-[var(--studio-hover-strong)] hover:text-[var(--studio-ink)]"
            onClick={() => setPrompt(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      <section className="rounded-[30px] border border-[color:var(--studio-line)] bg-[rgb(23_25_32_/_0.74)] px-4 pt-4 pb-5 shadow-[0_18px_48px_rgba(0,0,0,0.22)] md:px-5 md:pt-5 md:pb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="studio-title text-2xl font-semibold tracking-tight">
            Featured Video Generations
          </h2>
          <div className="flex items-center gap-2 text-sm text-[var(--studio-muted)]">
            {(visibleModels.length > 0 ? visibleModels : fallbackModelLabels)
              .slice(0, 3)
              .join(' • ')}
          </div>
        </div>

        <div ref={featuredRailRef} className="flex gap-4 overflow-x-auto pb-2">
          {featuredRows.map((card) => (
            <div key={card.title} className="min-w-[280px] overflow-hidden">
              <div className="overflow-hidden rounded-[22px] border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)]">
                <div className="relative aspect-[1.55/1] overflow-hidden bg-black">
                  <img
                    src={card.poster}
                    alt={card.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <p className="studio-title mt-3 text-[15px] leading-6 font-medium">
                {card.title}
              </p>
            </div>
          ))}
        </div>

        {hasFeaturedOverflow ? (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] text-white"
              onClick={() => scrollFeaturedRail('prev')}
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] text-white"
              onClick={() => scrollFeaturedRail('next')}
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
```

Trim `src/shared/blocks/tools/youtube-ops-tool-data.ts` to generator-only exports:

```ts
export interface FeaturedDemoCard {
  title: string;
  accent: string;
  subtitle: string;
  poster: string;
  video: string;
}

export const featuredRows = [
  {
    title: 'Golden Hour Sneaker Trailers',
    accent: 'DROP TRAILER',
    subtitle: 'VEO3.1 Fast',
    poster: '/demos/video-hub/drop-trailer.jpg',
    video: '/demos/video-hub/drop-trailer.mp4',
  },
  {
    title: 'High-Energy Food Reveal Sequences',
    accent: 'FOOD MOTION',
    subtitle: 'VEO3.1 Fast',
    poster: '/demos/video-hub/food-motion.jpg',
    video: '/demos/video-hub/food-motion.mp4',
  },
  {
    title: 'Cinematic Real Estate Flythrough Hooks',
    accent: 'PROPERTY REVEAL',
    subtitle: 'VEO3.1 Fast',
    poster: '/demos/video-hub/property-reveal.jpg',
    video: '/demos/video-hub/property-reveal.mp4',
  },
  {
    title: 'Faceless Story Intros For YouTube',
    accent: 'CHANNEL OPENERS',
    subtitle: 'Narrative preset',
    poster: '/demos/video-hub/channel-openers.jpg',
    video: '/demos/video-hub/channel-openers.mp4',
  },
] satisfies FeaturedDemoCard[];

export const promptIdeas = [
  'Launch a cinematic sneaker trailer with low-angle reflections and golden-hour haze.',
  'Create a fast-cut recipe reveal with macro textures, steam bursts, and text-safe framing.',
  'Build a faceless opener with tension, visual callbacks, and strong first-three-second motion.',
];

export const fallbackModelLabels = ['VEO3.1 Fast', 'Runway Gen-4', 'Kling 2.1'];
```

- [ ] **Step 4: Run the AI video cleanup test**

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/ai-video-hub-ui.test.tsx
```

Expected: PASS with 1 test passing.

- [ ] **Step 5: Commit the AI video cleanup**

Run:

```bash
git add src/shared/blocks/tools/ai-video-hub-ui.tsx src/shared/blocks/tools/youtube-ops-tool-data.ts src/shared/blocks/tools/__tests__/ai-video-hub-ui.test.tsx
git commit -m "refactor: return AI video page to generator-first flow"
```

### Task 6: Align OpenSpec and Run Full Verification

**Files:**

- Modify: `openspec/changes/add-youtube-ops-tools-hub/design.md`
- Modify: `openspec/changes/add-youtube-ops-tools-hub/specs/youtube-ops-tools/spec.md`
- Modify: `openspec/changes/add-youtube-ops-tools-hub/tasks.md`

- [ ] **Step 1: Update the OpenSpec artifacts so they match the approved IA**

Update `openspec/changes/add-youtube-ops-tools-hub/design.md` so the core decisions match the approved direction:

```md
1. Make `AI Tools` a first-class workspace sibling of `AI Video` and `AI Image`.
   Rationale: business tools should be entered directly from the sidebar instead of nested under the generator surfaces.

2. Keep `/tools` as a minimal discovery route with category tabs and a card grid.
   Rationale: users should recognize the right tool immediately without scrolling through heavy guidance modules.

3. Give each tool its own `/tools/[slug]` page.
   Rationale: tool input and tool results need dedicated layout ownership instead of falling back into the base chat or prompt page.

4. Use `Niche Discovery Sprint` as the first fully interactive tool page.
   Rationale: it is the highest-value faceless-creator workflow already present in deterministic MVP form.
```

Update `openspec/changes/add-youtube-ops-tools-hub/specs/youtube-ops-tools/spec.md` to replace the old AI-video-starter assumptions with route-level requirements:

```md
### Requirement: AI Tools Directory Route

The `/tools` route SHALL act as a lightweight AI tools directory with category tabs and direct tool-page entry.

#### Scenario: Users browse the AI tools directory

- **WHEN** a user opens `/tools`
- **THEN** the page shows category tabs and a card grid
- **AND** each card links directly to a dedicated `/tools/[slug]` page
- **AND** the card UI does not include prompt examples, chat entry, or long descriptions

### Requirement: Dedicated Tool Workspace Pages

Each business tool SHALL own its own detail route under `/tools/[slug]`.

#### Scenario: Users open a tool page

- **WHEN** a user selects a tool card
- **THEN** the product opens a dedicated tool page
- **AND** the page shows a left / center / right workspace layout
- **AND** the tool owns the center-column input and right-column result experience

### Requirement: AI Video Generator Separation

The `AI Video` generator route SHALL remain a prompt-first generator page and SHALL NOT act as the default landing surface for business tools.

#### Scenario: Users open the AI video generator

- **WHEN** a user visits `/ai-video-generator`
- **THEN** the page shows generator controls and previews
- **AND** it does not render business-tool workflow shells by default
```

Update `openspec/changes/add-youtube-ops-tools-hub/tasks.md` to reflect the new task structure:

```md
## 6. AI Tools Workspace Pivot

- [ ] 6.1 Replace the heavy `/tools` discovery page with a minimal category-tab and card-grid directory
- [ ] 6.2 Add dedicated `/tools/[slug]` routes for business tools
- [ ] 6.3 Migrate `Niche Discovery Sprint` into its own tool page with center-column input and right-column output
- [ ] 6.4 Restore `/ai-video-generator` to a generator-first surface without business tool workflow entry
- [ ] 6.5 Verify desktop and mobile layouts for `/tools`, `/tools/niche-discovery-sprint`, and `/ai-video-generator`
```

- [ ] **Step 2: Run the full automated verification**

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/ai-tools-catalog.test.ts src/shared/blocks/tools/__tests__/ai-tools-directory.test.tsx src/shared/blocks/tools/__tests__/ai-tool-page-frame.test.tsx src/shared/blocks/tools/__tests__/niche-discovery-tool-query.test.ts src/shared/blocks/tools/__tests__/niche-discovery-tool-page.test.tsx src/shared/blocks/tools/__tests__/niche-discovery-sprint-data.test.ts src/shared/blocks/tools/__tests__/ai-video-hub-ui.test.tsx
pnpm lint
pnpm build
```

Expected:

- test run: PASS
- lint: PASS
- build: PASS

- [ ] **Step 3: Manually review the three critical routes**

Run:

```bash
pnpm dev
```

Then verify:

- `/tools` at desktop width: tabs + image cards only, no prompt/chat/demo clutter
- `/tools` at mobile width: tabs remain usable and cards stack cleanly
- `/tools/niche-discovery-sprint` at desktop width: left tool switcher, center operator panel, right result panel
- `/tools/niche-discovery-sprint` at mobile width: panels stack without losing the primary CTA
- `/ai-video-generator` at desktop and mobile widths: generator-only surface, no tool-workflow state

- [ ] **Step 4: Commit the spec alignment and verification updates**

Run:

```bash
git add openspec/changes/add-youtube-ops-tools-hub/design.md openspec/changes/add-youtube-ops-tools-hub/specs/youtube-ops-tools/spec.md openspec/changes/add-youtube-ops-tools-hub/tasks.md
git commit -m "docs: align openspec with AI tools workspace pivot"
```
