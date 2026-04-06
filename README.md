# YouTube Automation AI

SEO-first product site for a long-video-to-short-video workflow platform.

## Current Scope

- Homepage focused on demand validation and waitlist capture
- Blog-first content strategy for SEO traffic
- Base platform capabilities retained (auth, billing, admin)

## Dev

```bash
pnpm dev
```

## Build

```bash
pnpm build
pnpm start
```

## OpenSpec

This repository is initialized for OpenSpec with Codex support.

- Project context lives in `openspec/project.md`
- Long-lived specs live in `openspec/specs/`
- Active proposals live in `openspec/changes/`
- Codex workflow skills were generated under `.codex/skills/`

Typical flow:

```bash
openspec list
```

Then use the Codex slash commands after restarting the IDE:

- `/opsx:propose "your idea"`
- `/opsx:apply`
- `/opsx:archive`
