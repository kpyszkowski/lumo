# Agent Instructions — Lumo

Quick orientation for any Claude session working in this repo.

## Project Overview

Lumo is a monorepo with a Next.js web app and a shared React UI component library (`@lumo/ui`).

**Stack:** React 19, Next.js 16 (App Router), Tailwind CSS v4, `@base-ui/react`, `tailwind-variants`, `motion/react`, TypeScript strict, pnpm workspaces, Turborepo.

## Before You Start

1. **Read `packages/ui/CLAUDE.md`** before creating any UI component — it is the primary authoring guide.
2. **Fetch live docs via context7** before touching `@base-ui/react`, `tailwind-variants`, or `motion/react`:
   - `resolve-library-id` → `get-library-docs` with the package name and topic.
3. **Never use raw colours** — use semantic tokens from `packages/ui/src/theme.css`.
4. **Named exports only** — `export default` is never used in this codebase.

## Files in This Directory

| File | Covers |
|------|--------|
| [monorepo.md](./monorepo.md) | Workspace layout, pnpm scripts, Turbo task graph, tsdown, package exports |
| [ui-components.md](./ui-components.md) | Component authoring supplement: full examples, context patterns, controlled state |
| [styling.md](./styling.md) | `createStyles` API, `StylesProps`, theme tokens, Tailwind v4 data-variants |
| [base-ui-patterns.md](./base-ui-patterns.md) | `@base-ui/react` import conventions, render callbacks, confirmed gotchas |
| [animation.md](./animation.md) | `motion/react` patterns, `AnimatePresence`, spring config, `layoutId` |
| [typescript.md](./typescript.md) | Type patterns, props composition, context hooks, strict rules |
| [storybook.md](./storybook.md) | Story authoring, `Meta`/`StoryFn`/`StoryObj`, `argTypes`, naming |
| [nextjs.md](./nextjs.md) | App Router, server/client components, Tailwind setup, RPC, DB, deployment |
| [scraper.md](./scraper.md) | Scraping pipeline, tech sheet fields, filter-builder, output format, i18n approach |
