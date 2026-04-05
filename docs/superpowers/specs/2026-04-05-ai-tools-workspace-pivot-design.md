# AI Tools Workspace Rebuild Design

## Status

This design supersedes the earlier tools pivot direction previously
captured in this file.

The previous direction introduced the right product goal but attached it
to the wrong page shells and the wrong navigation hierarchy.

This rebuild resets the structure before more tools are added.

## Goal

Rebuild `Tools` so it behaves like an independent business-tool product
line while still reusing the existing shared navigation and detail
shells.

The product should make three things obvious:

- `AI Video` and `AI Image` are base capabilities
- `Tools` is a separate tool directory and tool-workspace layer
- tool detail pages reuse the existing common detail shell instead of
  inventing another sidebar system

## Confirmed Decisions

- The global product navigation has a primary sidebar level.
- The primary sidebar is responsible for `AI Video`, `AI Image`, and
  `Tools`.
- `Tools` is not a visual tab blended into the base generator content
  area.
- When `Tools` is selected, the right-side content area becomes a tools
  directory surface that is visually separate from the base generator
  pages.
- `/tools` is a directory page, not an execution surface.
- `/tools/[slug]` is a tool detail page.
- Tool detail pages reuse the existing shared detail shell.
- The shared detail shell remains the dominant structure.
- Tool switching may appear inside the shared detail shell, but only as
  one module inside that shell.
- New work should focus on tool business content, not on rebuilding a
  second navigation framework.

## Problem Statement

The current tools implementation has three structural issues:

1. `Tools` is still visually fused with the base capability tab system.
2. The tools detail page introduces a second custom sidebar pattern
   instead of reusing the shared detail shell.
3. Tool business content and navigation chrome are coupled together,
   which makes every new tool harder to add cleanly.

The result is a product hierarchy that feels inconsistent:

- the user cannot clearly separate base capability pages from tools
- the tools directory inherits the wrong visual language
- tool detail pages drift away from the common interaction model already
  established elsewhere in the product

## Structural Model

### Level 1: Global Product Navigation

This is the always-available navigation layer.

It owns:

- `AI Video`
- `AI Image`
- `Tools`

It does not own:

- tool-specific switching
- tool-specific detail states
- business workflow panels

### Level 2: Shared Detail Shell

This is the existing common detail-page shell already used in the
product.

It owns:

- the common left-side detail structure
- the return-to-home behavior
- the reserved space for future extensibility
- the common visual language for detail pages

It should remain reusable and should not be reimplemented for tools.

### Level 3: Tool Business Content

This is the only layer that should be rebuilt specifically for tools.

It owns:

- tool-specific input flows
- tool-specific results
- tool-specific local switching where needed
- tool-specific empty states
- tool-specific action flow

## `/tools` Directory Page

The `/tools` page is the browse-and-enter surface for business tools.

Its responsibilities are intentionally narrow:

- show category tabs
- show the tool list
- let users click into a tool

It must not:

- embed generator controls
- embed chat execution
- reuse AI video demo content
- act like a hybrid directory plus execution workspace

The desired experience is close to a clean application directory:

- fast scan
- low clutter
- obvious click target

## `/tools/[slug]` Detail Page

Each tool detail page should be composed inside the shared detail shell.

The page structure should be:

- shared detail shell
- tool-switching module inside the shell
- tool-owned business content area

This means the current custom tools detail sidebar direction is
explicitly wrong and should be removed.

## Deletion Scope

Delete the current tools implementation where it conflicts with this
structure:

- the current top-level tools tab treatment that blends tools into the
  generator workspace chrome
- the current custom tools detail sidebar
- the current tools-specific page shell that duplicates common detail
  shell responsibilities
- the current layout decisions that mix tools directory UI with base
  capability UI

## Preservation Scope

Preserve and reuse anything that still fits the corrected structure:

- the existing global primary navigation system
- the existing shared detail shell
- reusable tool catalog and route metadata where still valid
- reusable business logic for concrete tools
- reusable data generators such as `Niche Discovery Sprint` structured
  output logic
- reusable tests that assert business behavior rather than the discarded
  shell shape

## First Rebuild Target

The first tool to reconnect after the shell reset should remain
`Niche Discovery Sprint`.

It is still the right first business tool because it already has a
clear job:

- one seed input
- one recommended path
- structured outputs for faceless creators

What changes is not the tool concept itself, but the shell it lives in.

## Non-Goals

- Do not rebuild the shared global navigation primitives.
- Do not rebuild the shared detail shell from scratch.
- Do not collapse tools back into the generic chat landing page.
- Do not mix `/tools` back into AI video generator content.
- Do not expand scope into backend persistence or a full multi-tool
  platform implementation.
- Do not change the repository SEO framework beyond the intended tools
  routes.

## Validation Criteria

The rebuild is successful only if all of the following are true:

- `Tools` reads as a separate destination in the primary sidebar.
- selecting `Tools` shows a directory-only content surface
- `/tools` does not inherit base capability page content
- `/tools/[slug]` uses the existing shared detail shell
- tool switching appears as part of the shared detail shell rather than
  replacing it
- the first rebuilt tool can be operated without introducing a second
  custom navigation system

## Implementation Boundaries

The next implementation plan should be organized in this order:

1. remove incorrect tools chrome and layout assumptions
2. rebuild `/tools` as a directory-only page
3. reconnect `/tools/[slug]` to the shared detail shell
4. add a tools-switching module inside that shell
5. reconnect `Niche Discovery Sprint` business content
6. update tests and docs to match the corrected structure

## Risks

- Reusing the shared detail shell too loosely could still allow tools to
  drift into a parallel UI system. Mitigation: treat the shell as a hard
  dependency, not an inspiration.
- Reusing too little could waste existing product consistency.
  Mitigation: only rebuild tool business content, not common chrome.
- Keeping too much of the discarded implementation could preserve bad
  assumptions. Mitigation: explicitly delete shell-level mistakes before
  reconnecting business logic.
