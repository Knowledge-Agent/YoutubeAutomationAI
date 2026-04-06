# Tools Detail Linear Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/tools/[slug]` into a production-feeling tool workspace where `Niche Discovery Sprint` and `Script Rewrite Studio` are truly usable ready tools, while `Thumbnail Brief Builder` and `Shorts Reframer` are clearly useful planned-tool pages instead of fake interactive surfaces.

**Architecture:** Keep the existing shared detail shell and tool directory intact. Split tool detail pages into two explicit page types: `ready` pages with a Pollo-style left input / right result execution surface, and `planned` pages with one primary next action plus a realistic example deliverable. Route branching should be data-driven from the tool catalog, with dedicated components for the two ready tools.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Vitest, Testing Library, pnpm

---

## File Structure

**Create:**

- `src/shared/blocks/tools/script-rewrite-tool-data.ts`
- `src/shared/blocks/tools/script-rewrite-tool-form.tsx`
- `src/shared/blocks/tools/script-rewrite-tool-results.tsx`
- `src/shared/blocks/tools/script-rewrite-tool-page.tsx`
- `src/shared/blocks/tools/__tests__/script-rewrite-tool-page.test.tsx`

**Modify:**

- `src/shared/blocks/tools/ai-tools-catalog.ts`
- `src/shared/blocks/tools/__tests__/ai-tools-catalog.test.ts`
- `src/app/[locale]/(landing)/tools/[slug]/page.tsx`
- `src/app/[locale]/(landing)/tools/[slug]/page.test.tsx`
- `src/shared/blocks/tools/ai-tool-coming-soon-page.tsx`
- `src/shared/blocks/tools/__tests__/ai-tool-coming-soon-page.test.tsx`
- `src/shared/blocks/tools/niche-discovery-tool-page.tsx`
- `src/shared/blocks/tools/niche-discovery-tool-form.tsx`
- `src/shared/blocks/tools/niche-discovery-tool-results.tsx`
- `src/shared/blocks/tools/__tests__/niche-discovery-tool-page.test.tsx`

## Responsibilities

- `ai-tools-catalog.ts`: the single source of truth for `ready` vs `planned`, substitute actions, and example deliverables.
- `[slug]/page.tsx`: route-level switchboard that chooses the correct detail-page type.
- `niche-discovery-*`: the first polished ready tool surface.
- `script-rewrite-*`: the second polished ready tool surface.
- `ai-tool-coming-soon-page.tsx`: the planned-tool page model with one useful action and one realistic sample output.

## Task 1: Make Tool Detail Routing Explicitly Ready-vs-Planned

**Files:**

- Modify: `src/shared/blocks/tools/ai-tools-catalog.ts`
- Modify: `src/shared/blocks/tools/__tests__/ai-tools-catalog.test.ts`
- Modify: `src/app/[locale]/(landing)/tools/[slug]/page.tsx`
- Modify: `src/app/[locale]/(landing)/tools/[slug]/page.test.tsx`

- [ ] **Step 1: Write failing catalog and route tests**

Add expectations for:

- `script-rewrite-studio` is treated as `ready`
- `thumbnail-brief-builder` and `shorts-reframer` are treated as `planned`
- the detail route renders:
  - `NicheDiscoveryToolPage` for `niche-discovery-sprint`
  - `ScriptRewriteToolPage` for `script-rewrite-studio`
  - `AiToolComingSoonPage` for planned tools

Run:

```bash
pnpm test:run -- \
  src/shared/blocks/tools/__tests__/ai-tools-catalog.test.ts \
  src/app/[locale]/(landing)/tools/[slug]/page.test.tsx
```

Expected: FAIL because the catalog still marks `script-rewrite-studio` as coming soon and the route only knows about one ready tool.

- [ ] **Step 2: Update catalog metadata**

Change `src/shared/blocks/tools/ai-tools-catalog.ts` so the data model supports the real page split:

- replace the old binary status meaning with explicit `ready` and `planned`
- mark:
  - `niche-discovery-sprint` as `ready`
  - `script-rewrite-studio` as `ready`
  - `thumbnail-brief-builder` as `planned`
  - `shorts-reframer` as `planned`
- add metadata needed by planned pages:
  - primary action label
  - primary action href
  - realistic example deliverable sections

- [ ] **Step 3: Update the route switchboard**

Change `src/app/[locale]/(landing)/tools/[slug]/page.tsx` so it branches by tool slug / page type instead of funneling everything except niche into the planned page.

The route must keep the shared `WorkspaceDetailShell` and only swap the business surface inside it.

- [ ] **Step 4: Re-run focused tests**

Run:

```bash
pnpm test:run -- \
  src/shared/blocks/tools/__tests__/ai-tools-catalog.test.ts \
  src/app/[locale]/(landing)/tools/[slug]/page.test.tsx
```

Expected: PASS

## Task 2: Tighten Niche Discovery Sprint Into The Ready-Tool Standard

**Files:**

- Modify: `src/shared/blocks/tools/niche-discovery-tool-page.tsx`
- Modify: `src/shared/blocks/tools/niche-discovery-tool-form.tsx`
- Modify: `src/shared/blocks/tools/niche-discovery-tool-results.tsx`
- Modify: `src/shared/blocks/tools/__tests__/niche-discovery-tool-page.test.tsx`

- [ ] **Step 1: Write failing niche-detail expectations**

Extend the test so it verifies:

- there is one dominant CTA
- the form reads as an operator panel, not stacked explanation cards
- the right side reads as a result workspace before and after generation
- the tool still produces a usable niche/script direction in one run

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/niche-discovery-tool-page.test.tsx
```

Expected: FAIL if the current page still over-indexes on explanation rather than task flow.

- [ ] **Step 2: Rework the niche left panel**

Keep the current inputs, but make the page more clearly execution-first:

- keep the lightweight switcher
- keep one operator panel
- keep one main CTA
- remove or avoid any extra explanation blocks that compete with the CTA

The left side should read like a tool control surface in the Pollo-style sense:

- tool identity
- seed topic
- mode group
- asset group
- one action

- [ ] **Step 3: Rework the niche right panel**

Make the empty state and result state feel like a high-confidence output workspace:

- empty state must preview the exact output structure
- filled state must feel like one result system, not disconnected widgets
- the user should be able to move from output to the next creator step immediately

- [ ] **Step 4: Re-run the niche test**

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/niche-discovery-tool-page.test.tsx
```

Expected: PASS

## Task 3: Ship Script Rewrite Studio As The Second Real Ready Tool

**Files:**

- Create: `src/shared/blocks/tools/script-rewrite-tool-data.ts`
- Create: `src/shared/blocks/tools/script-rewrite-tool-form.tsx`
- Create: `src/shared/blocks/tools/script-rewrite-tool-results.tsx`
- Create: `src/shared/blocks/tools/script-rewrite-tool-page.tsx`
- Create: `src/shared/blocks/tools/__tests__/script-rewrite-tool-page.test.tsx`
- Modify: `src/app/[locale]/(landing)/tools/[slug]/page.tsx`

- [ ] **Step 1: Write the failing ready-tool test**

Create `src/shared/blocks/tools/__tests__/script-rewrite-tool-page.test.tsx` to cover:

- one main textarea / script input
- short, direct control groups
- one main CTA
- same-page structured results after one run
- outputs including rewritten hook, structure, full rewrite, and visual beat notes

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/script-rewrite-tool-page.test.tsx
```

Expected: FAIL because the page does not exist yet.

- [ ] **Step 2: Add the deterministic data builder**

Create `script-rewrite-tool-data.ts` with a deterministic helper that turns:

- draft text
- format
- duration
- tone

into a structured output object for the ready page.

The helper should be deterministic and front-end local, similar in spirit to the current niche sprint data builder, so the page can feel usable before any backend orchestration is added.

- [ ] **Step 3: Build the form and results surface**

Create:

- `script-rewrite-tool-form.tsx`
- `script-rewrite-tool-results.tsx`
- `script-rewrite-tool-page.tsx`

Requirements:

- left side mirrors the ready-tool standard
- right side is a real result workspace
- one CTA triggers a full same-page rewrite result
- the output should look production-oriented rather than decorative

- [ ] **Step 4: Wire the route**

Update the tool route so `script-rewrite-studio` renders the new page instead of the planned page.

- [ ] **Step 5: Re-run the new test**

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/script-rewrite-tool-page.test.tsx
```

Expected: PASS

## Task 4: Rebuild Planned Tool Pages As State-And-Routing Pages

**Files:**

- Modify: `src/shared/blocks/tools/ai-tool-coming-soon-page.tsx`
- Modify: `src/shared/blocks/tools/__tests__/ai-tool-coming-soon-page.test.tsx`
- Modify: `src/shared/blocks/tools/ai-tools-catalog.ts`

- [ ] **Step 1: Write the failing planned-page test**

Update the planned-page test so it requires:

- explicit `Coming Soon` status
- exactly one primary next action
- a realistic sample deliverable on the right
- no generic low-value `Output Module` treatment as the main output surface

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/ai-tool-coming-soon-page.test.tsx
```

Expected: FAIL because the current page still reads as a low-density explanation surface.

- [ ] **Step 2: Rebuild the planned-tool left panel**

The left side must become:

- tool identity
- concise use-case explanation
- explicit `Coming Soon`
- one clear next action

Do not stack multiple explanation cards that dilute the page purpose.

- [ ] **Step 3: Rebuild the planned-tool right panel**

Replace generic module placeholders with a realistic example deliverable based on tool metadata.

Examples:

- `Thumbnail Brief Builder`: sample thumbnail concept, title directions, composition notes
- `Shorts Reframer`: sample short angles, hook options, edit notes

The right side should feel like “this is what you’ll get” rather than “here are some abstract boxes”.

- [ ] **Step 4: Re-run the planned-page test**

Run:

```bash
pnpm test:run -- src/shared/blocks/tools/__tests__/ai-tool-coming-soon-page.test.tsx
```

Expected: PASS

## Task 5: Final Verification Against The Launch Gate

**Files:**

- Modify: `openspec/changes/add-youtube-ops-tools-hub/tasks.md` (only if a new task record is needed)
- Modify: `docs/superpowers/specs/2026-04-05-tools-detail-linear-redesign.md` (only if implementation drift appears)

- [ ] **Step 1: Run focused tests**

Run:

```bash
pnpm test:run -- \
  src/shared/blocks/tools/__tests__/ai-tools-catalog.test.ts \
  src/app/[locale]/(landing)/tools/[slug]/page.test.tsx \
  src/shared/blocks/tools/__tests__/niche-discovery-tool-page.test.tsx \
  src/shared/blocks/tools/__tests__/script-rewrite-tool-page.test.tsx \
  src/shared/blocks/tools/__tests__/ai-tool-coming-soon-page.test.tsx
```

Expected: PASS

- [ ] **Step 2: Run repo verification**

Run:

```bash
pnpm lint
pnpm test:run
pnpm build
```

Expected:

- `lint` passes
- `test:run` passes
- `build` either passes or is documented with fresh evidence if the known local build hang persists

- [ ] **Step 3: Run manual launch-gate review**

Manually review:

- `/tools/niche-discovery-sprint`
- `/tools/script-rewrite-studio`
- `/tools/thumbnail-brief-builder`
- `/tools/shorts-reframer`

At desktop and mobile breakpoints using the launch gate from the spec:

1. page type is obvious
2. purpose is clear on first screen
3. there is exactly one primary CTA
4. there is no dead end
5. the right panel is a real workspace or realistic example output
6. the user can make progress today
7. the page does not read like an internal prototype

- [ ] **Step 4: Commit the implementation**

Use focused commits, for example:

```bash
git add src/shared/blocks/tools/ai-tools-catalog.ts \
  src/app/[locale]/(landing)/tools/[slug]/page.tsx \
  src/app/[locale]/(landing)/tools/[slug]/page.test.tsx \
  src/shared/blocks/tools/__tests__/ai-tools-catalog.test.ts
git commit -m "refactor: split tool detail pages by ready and planned states"
```

Then:

```bash
git add src/shared/blocks/tools/niche-discovery-tool-page.tsx \
  src/shared/blocks/tools/niche-discovery-tool-form.tsx \
  src/shared/blocks/tools/niche-discovery-tool-results.tsx \
  src/shared/blocks/tools/__tests__/niche-discovery-tool-page.test.tsx
git commit -m "refactor: tighten niche sprint ready tool surface"
```

Then:

```bash
git add src/shared/blocks/tools/script-rewrite-tool-data.ts \
  src/shared/blocks/tools/script-rewrite-tool-form.tsx \
  src/shared/blocks/tools/script-rewrite-tool-results.tsx \
  src/shared/blocks/tools/script-rewrite-tool-page.tsx \
  src/shared/blocks/tools/__tests__/script-rewrite-tool-page.test.tsx
git commit -m "feat: add script rewrite studio ready tool workspace"
```

Then:

```bash
git add src/shared/blocks/tools/ai-tool-coming-soon-page.tsx \
  src/shared/blocks/tools/__tests__/ai-tool-coming-soon-page.test.tsx
git commit -m "refactor: rebuild planned tool detail pages"
```
