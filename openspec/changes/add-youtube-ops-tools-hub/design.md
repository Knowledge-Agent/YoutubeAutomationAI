## Context

The project already had solid shared generation primitives, but the
previous tool-hub direction still centered too much of the UX on the
base AI video/chat surface. Workflow discovery, demo browsing, and
execution started to blur together.

The approved direction is now route-level and tool-first:

- `AI Tools` is a top-level workspace sibling of `AI Video` and
  `AI Image`
- `/tools` is a minimal discovery page
- each business tool gets its own `/tools/[slug]` route
- chat/generation capabilities remain reusable infrastructure rather
  than the default landing surface

## Goals / Non-Goals

**Goals:**

- make it obvious which tool a faceless creator should use
- simplify `/tools` into a lightweight launcher instead of a cluttered
  hybrid page
- give each business tool its own focused operating surface
- keep `AI Video` and `AI Image` prompt-first for broad generation use
- reuse existing shared primitives instead of rebuilding the stack

**Non-Goals:**

- add backend persistence, projects, or run history
- implement every tool in the directory in phase 1
- collapse all tools back into the chat page
- change the repository SEO framework beyond the intended tool routes

## Decisions

1. Make `AI Tools` a first-class workspace sibling of `AI Video` and
   `AI Image`.
   Rationale: business tools should be entered directly from the
   sidebar, not nested under a generator page.

2. Keep `/tools` as a minimal discovery route with category tabs and a
   card grid.
   Rationale: users should recognize the right tool immediately without
   scrolling through long descriptions, demos, or prompt panels.

3. Give each business tool its own `/tools/[slug]` page.
   Rationale: tool inputs and tool outputs need dedicated layout
   ownership instead of falling back into the base chat or prompt page.

4. Use a left / center / right layout for business tool pages.
   Rationale: the tool switcher, operator input, and generated results
   each need a clear visual home.

5. Use `Niche Discovery Sprint` as the first fully interactive tool
   page.
   Rationale: it is the highest-value faceless-creator workflow and can
   already deliver a meaningful structured result without backend work.

6. Design `Niche Discovery Sprint` around one primary input and one
   recommended path.
   Rationale: simplifying user effort is a hard requirement for this
   phase, especially for users exploring faceless niches.

7. Restore `/ai-video-generator` to a generator-first surface.
   Rationale: `AI Video` should remain the broad media-generation page,
   not the default home for business workflows.

8. Keep shared chat and generation capabilities componentized and pull
   them into tools only when the tool needs them.
   Rationale: shared infrastructure should support tool pages, not
   flatten them into one generic experience.

## Risks / Trade-offs

- Minimal directory cards reduce clutter but shift explanatory burden to
  the tool detail pages. Mitigation: keep richer `when to use / input /
  output` metadata in the tool catalog and detail headers.
- Having dedicated routes for tools increases page count. Mitigation:
  keep the route model shallow and consistent under `/tools/[slug]`.
- Only one tool is fully interactive in phase 1. Mitigation: keep other
  tool pages visually consistent with a clear coming-soon surface.
- Manual desktop/mobile visual review is still required before calling
  the change fully complete.
