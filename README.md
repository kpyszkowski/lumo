<img alt="Lumo" height="40" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 27' fill='%23d53d1a'><path d='M34.2925 13.3563H41.1463C44.9315 13.3563 48 16.4112 48 20.1788C48 23.9457 44.9321 27 41.1476 27H40.9585C37.203 27 34.1882 23.9147 34.2925 20.1781V13.3563H19.3887C15.3107 13.3563 12.1902 9.74145 12.8043 5.72871C13.2867 2.5765 15.9552 0.21264 19.1568 0.101612L21.9118 0.00607053C26.1609 -0.141287 30.0376 2.40595 31.5712 6.35294L34.2925 13.3563Z'/><path d='M6.85374 13.3563C3.06853 13.3563 0 16.4105 0 20.1781C0 23.9457 3.06853 27 6.85374 27C10.639 27 13.7075 23.9457 13.7075 20.1781C13.7075 16.4105 10.639 13.3563 6.85374 13.3563Z'/></svg>"><path d="M34.2925 13.3563H41.1463C44.9315 13.3563 48 16.4112 48 20.1788C48 23.9457 44.9321 27 41.1476 27H40.9585C37.203 27 34.1882 23.9147 34.2925 20.1781V13.3563H19.3887C15.3107 13.3563 12.1902 9.74145 12.8043 5.72871C13.2867 2.5765 15.9552 0.21264 19.1568 0.101612L21.9118 0.00607053C26.1609 -0.141287 30.0376 2.40595 31.5712 6.35294L34.2925 13.3563Z"/><path d="M6.85374 13.3563C3.06853 13.3563 0 16.4105 0 20.1781C0 23.9457 3.06853 27 6.85374 27C10.639 27 13.7075 23.9457 13.7075 20.1781C13.7075 16.4105 10.639 13.3563 6.85374 13.3563Z"/></svg>

# Lumo

Car marketplace — component library, web application, and edge deployment in one monorepo.

---

## Monorepo Structure

```
lumo/
├── apps/
│   ├── web/           # Next.js 16 marketplace app → Cloudflare Workers
│   ├── storybook/     # Component development environment
│   └── data-scraper/  # Puppeteer CLI — scrapes vehicle catalog & tech sheets
├── packages/
│   ├── ui/            # @lumo/ui — React component library
│   └── configs/       # @lumo/configs — shared ESLint + TypeScript configs
```

Built with [Turborepo](https://turborepo.com) + [pnpm workspaces](https://pnpm.io/workspaces).

---

## Stack

### Web App (`apps/web`)

| Layer | Technology |
|---|---|
| Framework | Next.js 16, React 19 |
| RPC | oRPC (contract-first, type-safe) |
| Data fetching | TanStack React Query via `@orpc/tanstack-query` |
| Database | Drizzle ORM + Neon serverless Postgres |
| Auth | JWT via `jose` |
| Deployment | Cloudflare Workers via `@opennextjs/cloudflare` |
| Local DB | Docker + Postgres |

### Component Library (`packages/ui`)

| Layer | Technology |
|---|---|
| Headless primitives | `@base-ui/react` |
| Styling | Tailwind CSS v4 + semantic token system |
| Variants | `tailwind-variants` (`createStyles` abstraction) |
| Animation | `motion/react` (`AnimatePresence`, `motion.create`) |
| Icons | `@tabler/icons-react` |
| Build | tsdown (ESM-only, tree-shakeable) |

### Data Scraper (`apps/data-scraper`)

| Layer | Technology |
|---|---|
| Browser automation | Puppeteer + `puppeteer-extra-plugin-stealth` |
| CLI | Commander.js |
| Runtime | Node.js, TypeScript, tsdown |

Scrapes vehicle makes/models/generations hierarchy and 15K+ tech sheet JSONs from Auto Motor und Sport. Streaming generator pipeline, `build-indexes` ETL command, interactive prompts via Inquirer.

### Tooling

- **Turborepo** — task orchestration with dependency-aware build graph
- **Lefthook** — pre-commit: auto-format + type-check before every commit
- **ESLint** — custom `@lumo/configs` plugin enforcing props destructuring pattern
- **Vitest** — unit tests across packages
- **Storybook 10** — component stories with theme switching and Figma integration

---

## Architecture

```
┌─────────────────────────────────┐
│           apps/web              │
│   Next.js 16 + React 19         │
│                                 │
│  ┌───────────┐  ┌────────────┐  │
│  │  oRPC     │  │  TanStack  │  │
│  │ contract  │  │   Query    │  │
│  └─────┬─────┘  └────────────┘  │
│        │                        │
│  ┌─────▼──────────────────────┐ │
│  │  Drizzle ORM + Neon PG     │ │
│  └────────────────────────────┘ │
│                                 │
│  consumes @lumo/ui components   │
└────────────────┬────────────────┘
                 │ deployed via
                 ▼
        Cloudflare Workers
        (@opennextjs/cloudflare)

┌─────────────────────────────────┐
│         packages/ui             │
│  @base-ui/react headless prims  │
│  + Tailwind v4 semantic tokens  │
│  + tailwind-variants slots      │
│  + motion/react animations      │
│  → compound component pattern   │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│        apps/storybook           │
│  Storybook 10 + rsbuild         │
│  11 stories, theme switching    │
└─────────────────────────────────┘
```

---

## Component Library

13 components — all built on the same pattern: `@base-ui/react` primitive → `createStyles` slots/variants → compound component with context.

| Component | Type | Notes |
|---|---|---|
| `Button` | Simple | Variant + size system, icon support |
| `IconButton` | Simple | Accessible icon-only button |
| `Logo` | Simple | Brand mark |
| `StaggeredText` | Simple | Animated text reveal |
| `Histogram` | Simple | Data visualisation bar chart |
| `Toggle` | Compound | `Toggle.Group` + `Toggle.Button`, shared layout animation |
| `Radio` | Compound | `Radio.Group` + `Radio.Button`, variant propagation via context |
| `Command` | Compound | `Command.Root/Input/List/Item` + `Command.Dialog` with backdrop blur |
| `Popover` | Compound | `Popover.Root/Trigger/Content` with spring animation |
| `ScrollArea` | Compound | `ScrollArea.Root/Viewport/Scrollbar/Thumb` |
| `MultiSelect` | Compound | `MultiSelect.Root/Trigger/Popup` built on Popover |
| `Slider` | Compound | `Slider.Root/Control/Track/Thumb/Indicator` with range support |
| `StaggeredList` | Compound | `StaggeredList.Root/Item` staggered entrance animation |

Stories available in Storybook for all components.

### Design system conventions

- **Semantic tokens only** — no raw colours anywhere. Tokens cover text, background, border, and accent, with `*-inv` variants for inverted surfaces.
- **`createStyles` slots** — every component's DOM elements map to named slots, keeping class management explicit and co-located.
- **Compound component pattern** — complex components expose sub-components via namespaced exports (`Radio.Group`, `Radio.Button`) and share state through React context.
- **Props destructuring rule** — a custom ESLint rule (`react-props/no-destructure-in-params`, `react-props/must-destructure-first`) enforces a consistent props access pattern across the entire library.

---

## Getting Started

**Prerequisites:** Node.js 22+, pnpm 10+, Docker (for local DB)

```bash
# Install dependencies
pnpm install

# Set up pre-commit hooks
pnpm exec lefthook install
```

### Environment

```bash
cp apps/web/.env.example apps/web/.env.local
# Set SESSION_TOKEN_SECRET and DATABASE_URL
```

### Development

```bash
# All workspaces in parallel
pnpm dev

# Individual workspaces
pnpm --filter @lumo/web dev        # starts Docker DB + Next.js on :3000
pnpm --filter storybook dev        # Storybook on :6006
pnpm --filter @lumo/ui dev         # tsdown watch mode
```

### Database

```bash
pnpm --filter @lumo/web db:generate   # generate Drizzle migrations
pnpm --filter @lumo/web db:migrate    # run migrations against Neon
pnpm --filter @lumo/web db:studio     # open Drizzle Studio
```

---

## Development Workflow

```bash
pnpm check-types   # TypeScript across all packages
pnpm lint          # ESLint across all packages
pnpm test          # Vitest
pnpm build         # lint + check-types + build (Turbo graph)
```

Turbo task order: `lint` → `check-types` → `build` → `deploy`. Downstream packages wait for upstream builds automatically.

```bash
# Cloudflare
pnpm --filter @lumo/web preview   # local Workers preview
pnpm --filter @lumo/web deploy    # deploy to Cloudflare Workers
```

---

## Status

Web app UI is complete with mock data. Backend layer in active development.

| Area | Status |
|---|---|
| Component library (`@lumo/ui`) | ✅ 13 components, 11 Storybook stories |
| Web app UI | ✅ listing page, header, search command, filters |
| oRPC contract + router scaffolding | ✅ contract, server, client wired |
| Cloudflare deployment config | ✅ `wrangler.jsonc`, `@opennextjs/cloudflare` |
| Drizzle schema + migrations | 🚧 in progress |
| oRPC procedure implementations | 🚧 in progress |
| Data scraper CLI | 🌿 separate branch |
