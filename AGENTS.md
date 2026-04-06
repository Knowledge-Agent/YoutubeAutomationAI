# Repository Guidelines

## Project Structure & Module Organization
This repository is a `Next.js 16` App Router project for the YouTube Automation AI marketing site and tool workspace. Primary code lives in `src/`.

- `src/app/`: route groups, pages, and API handlers.
- `src/shared/`: reusable UI, blocks, hooks, models, services, and utilities.
- `src/themes/default/`: landing-page layouts and themed content blocks.
- `src/config/`: app, locale, theme, and database configuration.
- `content/`: MDX docs, legal pages, and blog posts.
- `public/`: static images, logos, and SEO assets.
- `scripts/`: one-off RBAC setup helpers.

## Build, Test, and Development Commands
Use `pnpm` with Node `22.x`.

- `pnpm dev`: start local development with Turbopack.
- `pnpm build`: run a production build.
- `pnpm build:fast`: production build with higher Node memory.
- `pnpm start`: serve the built app.
- `pnpm lint`: run ESLint across the repo.
- `pnpm format` / `pnpm format:check`: apply or verify Prettier formatting.
- `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:push`: manage Drizzle schema changes.
- `pnpm rbac:init`, `pnpm rbac:assign`: bootstrap and assign RBAC roles.

## Coding Style & Naming Conventions
TypeScript is the default. Follow the existing Prettier config: 2-space indentation, single quotes, semicolons, trailing commas (`es5`), and 80-character line width. Imports are auto-sorted by `@ianvs/prettier-plugin-sort-imports`; Tailwind classes are sorted by `prettier-plugin-tailwindcss`.

Use `PascalCase` for React components, `camelCase` for functions and variables, and kebab-case for route folders and content slugs. Keep shared primitives in `src/shared/components/ui/` and feature-specific blocks in `src/shared/blocks/` or `src/themes/default/blocks/`.

## Testing Guidelines
There is no committed unit or e2e test suite yet. Before opening a PR, run `pnpm lint` and `pnpm build`, then manually verify the affected route or API flow. If you add tests later, place them beside the feature or under `src/**/__tests__/`, and name them `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit prefixes such as `feat:` and `refactor:`. Keep commits scoped and descriptive, for example: `feat: add tool workspace billing guard`.

PRs should include a short summary, impacted routes or modules, environment or migration notes, and screenshots for UI changes. Link the related issue when one exists.

## Security & Content Notes
Do not commit secrets from `.env`; update `.env.example` when introducing new variables. Treat `content/` and SEO documents as production-facing assets, and keep locale content in sync when editing user-visible copy.

## Agent-Specific Rules
Do not change the repository's SEO structure unless the task explicitly requires a structural SEO migration. Keep routes, sitemap behavior, robots handling, canonical strategy, and content organization stable; update copy, metadata, and article content without breaking the existing SEO framework.

All code, file placement, and directory changes must follow the current project conventions. Reuse existing folders such as `src/app/`, `src/shared/`, `src/themes/default/`, `content/`, and `public/` instead of creating parallel structures. When adding new modules, match the established naming, import order, and layering patterns already used in the repository.

## OpenSpec Workflow
For meaningful feature work or cross-cutting changes, prefer creating an OpenSpec change before implementation. Keep active proposals in `openspec/changes/<change-name>/` and long-lived capability specs in `openspec/specs/`.

Use `openspec/project.md` as the shared source for repository context, stack conventions, and delivery constraints when drafting or refining proposals. Any OpenSpec change must still follow the SEO, routing, and directory conventions in this file.
