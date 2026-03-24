# Monorepo

## Workspace Layout

```
lumo/
├── apps/
│   ├── web/           # Next.js 16 app (Cloudflare Workers deployment)
│   ├── storybook/     # Storybook v10 (rsbuild runtime)
│   └── data-scraper/  # Data scraper (standalone)
├── packages/
│   ├── ui/            # @lumo/ui — shared component library
│   └── configs/       # Shared ESLint + TypeScript configs (@lumo/configs)
├── turbo.json
├── pnpm-workspace.yaml
└── vitest.config.ts   # Root vitest config
```

## pnpm Scripts (root)

| Script | What it does |
|--------|-------------|
| `pnpm dev` | Starts all `dev` tasks (tsdown watch + Storybook + Next.js dev) |
| `pnpm build` | Full build: lint → check-types → build per package |
| `pnpm test` | Vitest run |
| `pnpm lint` | ESLint across all packages |
| `pnpm format` | Prettier across all packages |
| `pnpm check-types` | `tsc --noEmit` across all packages |

## Turbo Task Graph

```
build
  └── depends on: lint, check-types, ^build (upstream packages built first)

check-types
  └── depends on: ^check-types, ^build

lint
  └── depends on: ^lint

deploy
  └── depends on: build
```

`dev` is persistent and uncached. `test` uses `$TURBO_DEFAULT$` inputs.

## `@lumo/ui` — tsdown Build

- **Tool:** `tsdown` (ESM only, `unbundle: true`, `treeshake: true`, `dts: true`)
- **Entry:** `./src/**/*.{ts,tsx}` + `./src/theme.css` (excludes `*.test.*`)
- **Output:** `dist/` — `.mjs` + `.d.ts` files, preserves directory structure

### Package Exports

```json
{
  "./theme":      "./dist/theme.css",
  "./components": { "types": "./dist/components.d.ts",    "default": "./dist/components.mjs" },
  "./icons":      { "types": "./dist/icons/index.d.ts",   "default": "./dist/icons/index.mjs" },
  "./utils":      { "types": "./dist/utils.d.ts",         "default": "./dist/utils.mjs" },
  "./motion":     { "types": "./dist/motion.d.ts",        "default": "./dist/motion.mjs" }
}
```

## Path Alias

`~/` → `src/` — used in **both** `packages/ui` and `apps/web`.

```ts
// packages/ui
import { createStyles } from '~/utils'   // → src/utils.ts

// apps/web
import { Header } from '~/components/header'  // → src/components/header.tsx
```

## Key Internal Imports

```ts
// In packages/ui components
import { createStyles, type StylesProps } from '~/utils'
import { motion, AnimatePresence } from '~/motion'
import { type Icon } from '~/icons'

// In apps/web
import { Button, Popover, Slider } from '@lumo/ui/components'
import { IconSearch } from '@lumo/ui/icons'
import { createStyles, type StylesProps } from '@lumo/ui/utils'
import '@lumo/ui/theme'  // in globals.css via @import
```
