## Why

The previous tool-hub direction kept pushing business workflows back
into the shared AI video/chat surface. That made the product harder to
understand: discovery, prompt entry, demos, and workflow execution all
lived on the same page.

For faceless creators, the higher-value UX is simpler. Users should be
able to recognize the right tool quickly, open that tool directly, and
operate inside a focused workspace without first translating their job
into a generic prompt or chat session.

## What Changes

Pivot the tool system to a route-level AI tools workspace:

- promote `AI Tools` to a first-class workspace sibling of `AI Video`
  and `AI Image`
- turn `/tools` into a minimal discovery directory with category tabs
  and image cards
- add dedicated `/tools/[slug]` pages for business tools
- move `Niche Discovery Sprint` into its own tool workspace
- restore `/ai-video-generator` to a generator-first page instead of a
  business-tool launcher

This change does not:

- add backend persistence or saved project history
- create bespoke backend pipelines for every listed tool
- rebuild existing shared chat or generation primitives
- change the repository SEO framework beyond the intended tool routes

## Capabilities

### New Capabilities

- `youtube-ops-tools`: a dedicated AI tools directory and tool-workspace
  layer for creator workflows

### Modified Capabilities

- `youtube-ops-tools`: refined from AI-video-starter discovery into
  dedicated tool routes and focused tool-owned workspaces

## Impact

- Affected routes:
  - `src/app/[locale]/(landing)/tools/page.tsx`
  - `src/app/[locale]/(landing)/tools/[slug]/page.tsx`
  - `src/app/[locale]/(landing)/(ai)/ai-video-generator/page.tsx`
- Affected shared UI:
  - `src/shared/blocks/tools/ai-tools-catalog.ts`
  - `src/shared/blocks/tools/ai-tools-directory.tsx`
  - `src/shared/blocks/tools/ai-tool-page-frame.tsx`
  - `src/shared/blocks/tools/niche-discovery-tool-page.tsx`
  - `src/shared/blocks/tools/ai-video-hub-ui.tsx`
- Existing shared chat/generation primitives remain reusable
- No new backend generation endpoints are required in this phase
