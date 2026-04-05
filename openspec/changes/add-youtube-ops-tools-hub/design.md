## Context

The repository already had reusable chat, generation, and workspace
primitives, but the previous tools direction still pushed too much of
the UX back into the generic chat surface. That made discovery and
execution feel mixed together.

The rebuilt direction is now route-level and tool-first:

- `Tools` lives beside `AI Video` and `AI Image` in the primary
  workspace navigation
- `/tools` is a directory-only launcher
- `/tools/[slug]` reuses the shared detail shell instead of inventing a
  separate tools-only chrome
- chat remains an underlying capability, not the default workflow
  destination

## Goals / Non-Goals

**Goals:**

- make it obvious which tool a faceless creator should open first
- simplify `/tools` into a lightweight launcher with low cognitive load
- keep tool detail pages inside the existing shared workspace shell
- give each tool ownership of its input and result panels
- preserve shared platform primitives instead of rebuilding parallel
  shells

**Non-Goals:**

- add backend persistence, projects, or run history
- implement every directory tool in phase 1
- route every workflow back through the base chat page
- change the repository SEO framework beyond the intended tool routes

## Decisions

1. Keep `Tools` as a primary sidebar destination, not a top-ribbon tab.
   Rationale: business workflows should be entered directly from the
   first navigation layer.

2. Keep `/tools` as a directory-only launcher with category filters and
   image-first cards.
   Rationale: users should identify the right tool quickly without
   parsing long descriptions or mixed demo/chat content.

3. Reuse the shared detail shell for `/tools/[slug]`.
   Rationale: tool detail routes should inherit the existing detail-page
   header and drawer instead of shipping a second sidebar framework.

4. Treat tool switching as an in-content module inside the shared shell.
   Rationale: switching tools should feel lightweight and local, not
   like a second navigation system.

5. Reconnect `Niche Discovery Sprint` as the first fully interactive
   tool on the corrected shell.
   Rationale: it is the highest-value faceless-creator workflow already
   supported by the current front-end data model.

6. Keep `Niche Discovery Sprint` centered on one main run CTA plus local
   topic and hook refinement.
   Rationale: simplifying user effort remains a hard requirement for
   this workspace.

7. Keep `AI Video` and `AI Image` generator-first.
   Rationale: broad generation routes should remain separate from
   business-tool operating surfaces.

8. Use shared chat and generation capabilities only when a tool needs
   them.
   Rationale: infrastructure should support tools, not flatten every
   tool into one generic chat page.

## Risks / Trade-offs

- Minimal directory cards reduce clutter but move more explanatory work
  into tool detail pages. Mitigation: keep richer `when to use / input /
  output` metadata in the tool catalog and tool headers.
- Dedicated tool routes increase page count. Mitigation: keep the route
  model shallow and consistent under `/tools/[slug]`.
- Only one tool is fully interactive in phase 1. Mitigation: keep
  coming-soon tools visually consistent and easy to switch between.
- Manual desktop/mobile visual review is still required before calling
  the change fully complete.
