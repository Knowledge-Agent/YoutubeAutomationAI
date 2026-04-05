## ADDED Requirements

### Requirement: AI Tools Directory Route

The `/tools` route SHALL act as a lightweight AI tools directory with
category tabs and direct tool-page entry.

#### Scenario: Users browse the AI tools directory

- **WHEN** a user opens `/tools`
- **THEN** the page shows category tabs and a card grid
- **AND** each card links directly to a dedicated `/tools/[slug]` page
- **AND** the card UI does not include prompt examples, chat entry, or
  long descriptions

#### Scenario: Users switch directory categories

- **WHEN** a user changes the active tools category
- **THEN** the visible card set updates for that category
- **AND** the selected category can be represented in lightweight URL
  state

### Requirement: Dedicated Tool Workspace Pages

Each business tool SHALL own its own detail route under `/tools/[slug]`.

#### Scenario: Users open a tool page

- **WHEN** a user selects a tool card
- **THEN** the product opens a dedicated tool page
- **AND** the page reuses the shared detail shell header and drawer
- **AND** tool switching appears as an in-content module instead of a
  second sidebar
- **AND** the tool owns its input and result experience inside that
  shell

### Requirement: Niche Discovery Sprint Workspace

`Niche Discovery Sprint` SHALL run as a dedicated tool workspace for
faceless creators.

#### Scenario: Users run the niche discovery sprint

- **WHEN** a user enters one seed topic and triggers the sprint
- **THEN** the workspace returns a recommended niche path
- **AND** the result includes topic and hook options plus a script-ready
  pack
- **AND** the page keeps one primary run CTA for generating the sprint
- **AND** alternate hooks or topics can be refined locally without
  rerunning the full flow

#### Scenario: Users revisit a sprint result

- **WHEN** a user reloads or shares the niche discovery tool route
- **THEN** lightweight URL state can restore the prior sprint context
  and selected result

### Requirement: AI Video Generator Separation

The `AI Video` generator route SHALL remain a prompt-first generator
page and SHALL NOT act as the default landing surface for business
tools.

#### Scenario: Users open the AI video generator

- **WHEN** a user visits `/ai-video-generator`
- **THEN** the page shows generator controls, prompt chips, and featured
  generation previews
- **AND** it does not render business-tool workflow cards or business
  tool workspace shells by default
