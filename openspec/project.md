# Project Context

## Overview

YouTube Automation AI is a `Next.js 16` App Router application for a
YouTube automation product site plus an authenticated tool workspace.

The repository is SEO-first and production-facing. Marketing pages,
blog content, docs, auth, billing, admin, and AI tooling all live in
the same codebase.

## Primary Goals

- Keep the marketing site fast, indexable, and stable.
- Preserve the existing SEO structure unless a task explicitly requires
  a structural SEO migration.
- Reuse existing app and shared UI patterns instead of introducing
  parallel structures.
- Prefer incremental improvements in a brownfield codebase.

## Tech Stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `pnpm`
- Tailwind CSS with project Prettier plugins for import and class
  ordering
- Fumadocs/MDX content under `content/`
- Better Auth, Drizzle, and payment/service integrations already exist

## Repository Map

- `src/app/`: App Router routes, layouts, and API handlers
- `src/shared/`: reusable blocks, services, hooks, utilities, and UI
- `src/themes/default/`: landing-page layouts and themed blocks
- `src/config/`: app, locale, theme, and database configuration
- `content/`: docs, legal pages, and blog content
- `public/`: images and other static assets
- `scripts/`: one-off operational helpers

## Development Conventions

- Use `pnpm` with Node `22.x`.
- Keep TypeScript as the default implementation language.
- Follow the repository Prettier and import-order conventions.
- Use `PascalCase` for components, `camelCase` for functions and
  variables, and kebab-case for route folders and content slugs.
- Keep shared primitives in `src/shared/components/ui/`.
- Put feature-specific blocks in `src/shared/blocks/` or
  `src/themes/default/blocks/`.

## Delivery Constraints

- Do not change routes, sitemap behavior, robots handling, canonical
  strategy, or content organization unless the task explicitly requires
  it.
- Keep locale content in sync when editing user-visible copy.
- Reuse existing folders and layering instead of creating parallel
  module trees.
- Do not commit secrets from `.env`.

## Validation

Before shipping meaningful code changes, prefer:

- `pnpm lint`
- `pnpm build`
- Manual verification of the affected route or API flow

## OpenSpec Guidance

Use OpenSpec for non-trivial work that benefits from explicit planning.

- Source-of-truth specs belong in `openspec/specs/`.
- Proposed work belongs in `openspec/changes/<change-name>/`.
- Review proposal, design, tasks, and spec deltas before implementation.
- Archive completed changes so the accepted deltas are folded back into
  the long-lived specs.
