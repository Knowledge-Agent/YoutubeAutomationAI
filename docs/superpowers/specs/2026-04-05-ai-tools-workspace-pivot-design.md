# AI Tools Workspace Pivot Design

## Goal

Shift the product from a chat-first workflow launcher to a tool-first
workspace for faceless YouTube creators.

The product must make it immediately obvious which tool to use, let each
tool own its own operating surface, and keep shared generator/chat
capabilities as reusable infrastructure instead of the default landing
point for every workflow.

## Confirmed Decisions

- `AI Tools` is a first-class left-sidebar product line.
- `AI Tools` is a sibling of `AI Video` and `AI Image`, not a child of
  either generator page.
- `/tools` remains a dedicated directory page.
- `/tools` is intentionally minimal and discovery-focused.
- The `/tools` directory uses lightweight category tabs plus a card
  grid.
- Each directory card shows only a cover image and the tool name.
- Clicking a tool card opens a dedicated tool page.
- Each tool page uses a left / center / right workspace structure.
- The center column is owned by the tool and contains the tool input
  flow.
- The right column is owned by the tool and contains the tool result
  flow.
- Shared chat capability may be embedded inside a tool when useful, but
  chat is no longer the default execution surface for all workflows.

## Non-Goals

- Do not rebuild the existing shared primitives for chat, prompt
  execution, uploaders, model controls, export helpers, or result
  containers.
- Do not collapse `AI Video`, `AI Image`, and `AI Tools` into a single
  catch-all workspace.
- Do not turn `/tools` into a marketplace-style page with heavy copy,
  promo modules, demos, or onboarding blocks.
- Do not route every tool back into the base chat page.
- Do not change the repository SEO framework or canonical structure
  beyond adding and shaping the intended tool routes.

## Problem Statement

The current direction mixes too many responsibilities in one place:

- workflow discovery
- prompt-first generation
- demo browsing
- chat-based execution

That creates a cluttered mental model. Users click a workflow card but
still land inside a generic chat or prompt surface, which makes the
product feel indirect and harder to trust.

For faceless creators, the system should answer a simpler question:
"Which tool solves my current job?" After that, the product should open
that tool directly and let the user operate inside a focused workspace.

## Information Architecture

The workspace should expose three top-level product lines:

- `/ai-video-generator`
- `/ai-image-generator`
- `/tools`

`AI Video` and `AI Image` remain capability pages.

`AI Tools` becomes the business-tool layer for creator workflows such as
niche discovery, script rewriting, and repurposing.

Suggested tool route pattern:

- `/tools`
- `/tools/niche-discovery-sprint`
- `/tools/script-rewrite-studio`
- `/tools/shorts-reframer`
- `/tools/thumbnail-brief-builder`

This route model makes the product hierarchy legible:

- generator pages are for broad media generation
- tool pages are for job-specific workflows

## Directory Page: `/tools`

The `/tools` page is a discovery and routing surface only.

Its job is to help the user recognize the right tool quickly and enter
that tool page with one click.

### Required Structure

- a light category tab row
- a card grid
- direct card click-through into a tool page

Suggested top tabs:

- `Video Tools`
- `Image Tools`
- `Script Tools`

These labels can evolve later, but the interaction pattern should stay
lightweight.

### Card Content Rules

Each tool card shows only:

- cover image
- tool name

The directory explicitly avoids:

- long descriptions
- multi-line feature lists
- prompt examples
- demo rails
- recent items
- recommended modules
- quick-entry utility panels
- embedded forms
- embedded chat
- multiple CTAs per card

The page should feel closer to a clean app launcher than a template
marketplace.

## Tool Detail Page: `/tools/[slug]`

Each tool page uses a three-column workspace pattern:

- left column: global navigation plus tool switching
- center column: tool-owned input and controls
- right column: tool-owned output and next actions

This structure is the default shell for every business tool under
`AI Tools`.

### Left Column Responsibilities

- first-level workspace navigation
- tool switching within the `AI Tools` family
- optional current-tool status or section state

### Center Column Responsibilities

The center column is the operator panel for the current tool.

It should contain only the information the user needs to complete the
current job.

Rules:

- one primary task per page
- one primary CTA per page state
- required inputs first
- advanced inputs hidden behind a secondary affordance
- use selectors, presets, and compact fields instead of blank-page
  writing whenever possible

For `Niche Discovery Sprint`, the center column should begin with a
small number of direct inputs such as:

- one seed topic
- content format
- outcome preference
- optional audience or tone constraints

The user should not need to "start a chat" in order to operate the
tool.

### Right Column Responsibilities

The right column is the result workspace.

It should present:

- the current result state
- structured output sections
- local refinement actions
- export or handoff actions
- tool-local history when needed

Right-column actions should prefer local refinement over redirecting the
user into a generic chat surface.

Examples:

- regenerate hooks
- expand selected script
- rewrite one opening
- export brief

If chat is used, it should appear as a scoped capability attached to a
specific result, not as the entire page mode.

## Tool Recognition Principles

Users should understand which tool to use without reading dense UI.

Every tool definition, whether shown in routing config, card data, or
tool-page header metadata, should answer three product questions:

- when to use it
- what the user inputs
- what the user gets

These descriptors do not need to appear on the directory card itself,
but they should exist in the tool system and appear inside the detail
page header or supporting metadata.

This keeps the directory visually simple while preserving clear product
semantics inside each tool page.

## Shared Infrastructure vs Tool-Owned UI

### Shared Infrastructure That Stays Reusable

- workspace shell
- top-level navigation
- card primitives
- loading, empty, and error states
- upload primitives
- model controls
- export helpers
- result containers
- scoped chat capability

### Tool-Owned UI That Must Not Be Centralized Back Into Chat

- center-column input structure
- page-specific CTA copy and action flow
- right-column result layout
- tool-local refinement controls
- tool-local result history
- tool-local empty states and instructional framing

The system should share capabilities, not share one generic interaction
landing page.

## Superseded Assumptions

This design intentionally replaces the earlier phase-one assumption that
new workflows should continue reusing the `AI Video` page as the primary
execution surface.

That earlier approach was useful for validating a fast MVP, but it no
longer matches the approved UX direction.

From this point forward:

- `/tools` is the discovery entry for business tools
- each business tool gets its own page
- shared chat or generator features are pulled into a tool when needed
- the base chat surface is not the default destination for workflow
  entry

## State and Data Flow

The intended state model is simple:

- directory state lives at `/tools` and may optionally use lightweight
  URL state for active category tabs
- tool input state lives inside the current tool page
- tool output state lives inside the current tool page
- handoff into shared capabilities happens from a tool context, not from
  a top-level directory card

This keeps discovery state separate from creation state and avoids the
confusing transition where a user thinks they opened a tool but actually
opened a generic chat session.

## Error Handling and Empty States

The new workspace should keep error handling local and legible.

Directory page:

- failed data for card metadata should degrade gracefully to static card
  rendering
- an empty category should show a simple "coming soon" grid state rather
  than redirecting users elsewhere

Tool page:

- before first run, the right column should show a structured empty
  state describing the upcoming result
- generation errors should remain inside the tool page and preserve the
  user input
- local retry actions should be preferred over global resets
- partial result refinement failures should not wipe the full tool state

## Testing Expectations for Implementation

When implementation begins, the plan should cover at least:

- route coverage for `/tools` and at least one dedicated tool route
- directory navigation behavior
- category-tab filtering behavior if URL-backed
- tool-page empty, loading, success, and error states
- proof that a tool no longer auto-dumps into the base chat page on
  entry
- proof that shared chat can still be invoked as a scoped capability
  from inside a tool when required

Manual verification should include:

- sidebar hierarchy is visually clear
- `/tools` feels lighter than generator pages
- cards are immediately scannable
- entering a tool page feels like entering a dedicated workspace, not a
  starter preset

## Initial Implementation Bias

The first implementation pass should optimize for the clearest IA shift,
not the broadest feature list.

Recommended order:

- establish the `AI Tools` navigation model
- simplify `/tools` into the minimal tab-plus-grid directory
- introduce one dedicated tool page with the three-column pattern
- migrate `Niche Discovery Sprint` into that page
- pull shared capabilities into the tool page only where needed

This sequence makes the UX pivot visible early and reduces the risk of
sliding back into the old chat-first structure.
