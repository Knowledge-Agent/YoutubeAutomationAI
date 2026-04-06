# Tools Detail Linear Redesign

## Goal

Rebuild the `tools detail` business UI so it follows the approved
global design baseline:

- `Linear-style workspace method`
- `existing orange brand signal`
- `creator-tool operating feel`

The current structure is technically correct, but the page still reads
like an internal prototype instead of a user-ready tool surface.

## Product Scope

This tools workspace is for `faceless YouTube creators`.

In the current phase, the tool system is centered on four creator jobs:

1. finding a viable faceless niche
2. rewriting a script into a stronger retention-friendly version
3. packaging a video with thumbnail/title direction
4. reframing long content into short-form cuts

The tool catalog can show all four jobs, but only some tools may be
marked `ready` in this phase.

## Tool List For This Phase

### Ready Tools

These tools must be truly usable, not placeholder-like:

1. `Niche Discovery Sprint`
   - job: turn one vague direction into a usable faceless niche path
   - output: niche path, topic ladder, hook options, script-ready pack
2. `Script Rewrite Studio`
   - job: turn an existing draft or transcript into a stronger faceless
     script
   - output: rewritten hook, improved structure, full rewrite, visual
     beat notes

### Planned Tools

These tools may appear in the catalog, but they are not allowed to
pretend they are fully interactive yet:

1. `Thumbnail Brief Builder`
   - job: turn an approved topic into thumbnail/title packaging
   - output target: thumbnail concepts, title angles, composition brief
2. `Shorts Reframer`
   - job: turn long-form material into multiple short-form cut angles
   - output target: short angles, hooks, edit notes, caption direction

## Page Types

There are only two valid tool-detail page types.

### 1. Ready Tool Page

This is a real working surface.

Rules:

- left column = live operator input and one primary action
- right column = real structured output workspace
- the user must be able to complete one meaningful task in a single run
- the page must not depend on the base chat page to be understandable

### 2. Planned Tool Page

This is a state-and-routing page, not a fake interactive tool page.

Rules:

- the page must clearly say the tool is not live yet
- the page must not look like a form that simply hasn't been filled in
- it must provide one primary next step
- the right side must show a realistic example deliverable, not vague
  placeholder cards

Valid primary actions for planned tools:

- go to an available substitute tool
- preview a realistic example output
- join a notify / waitlist flow

If a planned tool page has no meaningful next action, it fails.

## Confirmed Direction

- Keep the existing routing and shared detail shell.
- Do not rebuild navigation.
- Keep `Tools` as its own top-level destination.
- Focus only on the business UI inside `/tools/[slug]`.
- Start with `Niche Discovery Sprint`.
- Use the same design logic for `coming soon` tools so detail pages stay
  visually coherent.

## Problems In The Current Detail Page

1. The switcher still looks like a full card instead of a lightweight
   local switch control.
2. The input area still reads like an explanatory card instead of an
   operator control panel.
3. The control grouping is unclear. `Story / Shorts / Stock Footage /
   Screenshots` visually reads as one flat set even though it represents
   two different decision groups.
4. The empty results panel feels unfinished because it shows too much
   empty space and too little output structure.
5. The final page lacks the "3 second understandability" required for a
   tool workspace.
6. Some tool pages still read like product previews instead of usable
   operator surfaces.
7. The current `coming soon` pages risk feeling like dead ends because
   they explain the tool without giving the user a useful next step.

## Design Decisions

### 1. The Switcher Becomes A Lightweight Strip

The tool switcher should remain in the left column, but visually it
should downgrade from "card" to "local utility".

Rules:

- smaller top spacing
- tighter pill sizing
- lighter framing
- no oversized visual emphasis

### 2. The Input Area Becomes A Real Control Panel

The main left panel should feel like a single operating surface.

It should contain:

- tool title
- short supporting sentence
- seed input
- grouped mode controls
- grouped asset controls
- one main CTA

The layout should express that `format` and `asset type` are different
control groups.

### 3. The Results Area Must Explain The Output Before Generation

The empty state should preview what the sprint produces.

The right panel should show:

- what the output is
- which modules appear after generation
- what the user can refine after generation

This should remove the "unfinished page" feeling.

### 4. Generated Results Should Feel Like A Deliverable

Once the sprint runs, the right side should be organized into a clear
result workspace:

- recommended niche summary
- topic options
- hook options
- selected script pack

Each block should read as part of one result system, not as independent
floating widgets.

### 5. Coming-Soon Detail Pages Should Share The Same Language

Coming-soon pages should use the same lower-noise switcher and a simpler
control/result rhythm, so users do not feel like each tool detail page
belongs to a different product.

That visual consistency does **not** mean ready tools and planned tools
should share the same content model.

Ready tools are execution surfaces. Planned tools are state-and-routing
surfaces.

## Usability Standard

The implementation is only acceptable if the page feels like a
production tool, not an internal demo.

### Core Standard

A user should be able to answer these questions in under three seconds:

1. what this tool does
2. whether it is usable right now
3. what action they should take next

If any of those answers are unclear, the page is not ready.

### Ready Tool Standard

A `ready` tool only counts as usable if:

- the page has one dominant CTA
- the required input is short and obvious
- one run produces structured output on the same page
- the output can be used immediately for the next creator step
- the user can refine or continue from the output
- the page does not send the user into a dead end

For this phase, that means:

- `Niche Discovery Sprint` must let the user move directly from seed
  topic to a usable niche/script direction
- `Script Rewrite Studio` must let the user move directly from rough
  draft to a stronger usable rewrite

### Planned Tool Standard

A `planned` tool page only counts as acceptable if:

- the page explicitly communicates `Coming Soon`
- the page does not mimic a ready form without real execution
- the primary CTA routes the user to something useful now
- the right side shows a high-confidence example deliverable
- the page still helps the user make progress today

## Anti-Toy Rules

The tools workspace must not feel like a toy, template, or speculative
mockup.

The following are not acceptable as final states:

- placeholder cards with low-information labels like generic `Output
  Module` blocks as the main value area
- large empty right-side panels with minimal content
- multiple informational cards stacked on the left without a clear user
  action
- pages that explain a workflow but do not help the user progress
- fake tool pages that appear interactive but are actually dead ends
- decorative copy that weakens action clarity

## Acceptance Criteria

The redesign is successful when:

- `Niche Discovery Sprint` is a clearly usable working tool
- `Script Rewrite Studio` is defined and implemented as the second
  clearly usable working tool
- `Thumbnail Brief Builder` and `Shorts Reframer` are clearly marked as
  planned unless and until they meet the ready-tool standard
- every tool detail page has one obvious next step
- planned tool pages feel intentional and useful, not broken or half
  built
- ready tool pages feel operational and structured, not explanatory
- the page looks consistent with the approved global `DESIGN.md`
- the detail page feels user-ready rather than prototype-like

## Launch Gate

A tool page may only be marked complete for this phase if all items
below are true:

1. the page type is correctly identified as `ready` or `planned`
2. the first screen communicates the tool purpose clearly
3. there is exactly one primary CTA
4. the user is never left at a dead end
5. the right panel is either a real result workspace or a realistic
   example deliverable
6. the page supports the user making progress immediately
7. the page does not read like an internal prototype

## Out Of Scope

- route changes
- shell changes
- backend persistence
- new tools beyond visual consistency work for existing detail pages
- chat workflow redesign
