# Next.js (apps/web)

## App Router — No Pages Router

All routes live in `src/app/`. Next.js 16 with React 19.

```
src/app/
├── layout.tsx              # Root layout — server component
├── page.tsx                # Homepage — server component
├── providers.ts            # Provider composition (ThemeProvider + RPCProvider)
├── globals.css             # Tailwind imports + body defaults
└── rpc/
    └── [[...rest]]/
        └── route.ts        # ORPC catch-all API route
```

Feature code lives in `src/features/<feature>/components/`.

## Server vs Client Components

**Default: server components.** Add `'use client'` only when the component needs:
- `useState`, `useEffect`, or other React hooks
- Browser-only APIs
- Event handlers (`onClick`, etc.) in JSX

```ts
// Server component (no directive needed)
async function Page() {
  const data = await db.query(...)
  return <ClientWidget data={data} />
}

// Client component
'use client'
function ClientWidget(props) {
  const [open, setOpen] = useState(false)
  // ...
}
```

Use `cache()` from React for server-component-level DB query deduplication:

```ts
import { cache } from 'react'
export const getItems = cache(async () => db.select().from(items))
```

## Path Alias

Same as `packages/ui`: `~/` → `src/`

```ts
import { Header } from '~/components/header'
import { createStyles } from '~/utils/styles'
import '~/app/globals.css'
```

## Tailwind CSS v4 Setup

**No `tailwind.config.ts`** — configuration is done through CSS.

`src/app/globals.css`:
```css
@import "tailwindcss";
@import "@lumo/ui/theme";

/* Required: tells Tailwind to scan UI package for class names */
@source "../../node_modules/@lumo/ui";

body {
  font-family: var(--font-sans);
  color: var(--color-main);
  background-color: var(--background-color-main);
}
```

`postcss.config.js`:
```js
export default { plugins: { '@tailwindcss/postcss': {} } }
```

`createStyles` / `StylesProps` from `@lumo/ui/utils` work identically in the web app.

## Font Setup

Local variable font registered with `next/font/local` and exposed as a CSS variable:

```ts
// layout.tsx
import localFont from 'next/font/local'

const satoshiVariable = localFont({
  src: '../fonts/satoshi-variable.ttf',
  fallback: ['system-ui'],
  variable: '--font-sans',  // exposes as CSS var used in globals.css
})

// Applied to <html>
<html className={satoshiVariable.variable} ...>
```

## Theme (Dark Mode)

`next-themes` with `data-theme` attribute (matches `packages/ui/src/theme.css`):

```ts
// providers.ts
{ provider: ThemeProvider, props: { attribute: 'data-theme' } }
```

`<html>` needs `suppressHydrationWarning` to suppress React hydration mismatch from `next-themes`:

```tsx
<html suppressHydrationWarning lang="en" className={satoshiVariable.variable}>
```

## RPC Layer (ORPC)

All API endpoints go through a single catch-all route:

```
GET/POST/PUT/PATCH/DELETE/HEAD /rpc/*
→ src/app/rpc/[[...rest]]/route.ts
→ src/rpc/server.ts (ORPC handler with CORS)
→ src/rpc/router.ts (route definitions)
```

Client-side usage via TanstackQuery:

```ts
import { rpc } from '~/rpc/client'

// In a client component or hook
const result = await rpc.someRoute.query(input)
```

## Database

Neon serverless PostgreSQL + Drizzle ORM.

```ts
// src/db/db.ts — singleton client
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const sql = neon(env.DATABASE_URL)
export const db = drizzle(sql)
```

Schema lives in `src/db/schema.ts`. Migrations via `drizzle-kit`.

## Deployment

Cloudflare Workers via OpenNext.js:

```ts
// next.config.ts
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
initOpenNextCloudflareForDev()

export default { output: 'standalone' } satisfies NextConfig
```

`open-next.config.ts` configures R2 bucket for incremental cache.
`wrangler.jsonc` configures the Cloudflare Worker (Node.js compat, bindings).

Deploy task in Turbo: `pnpm deploy` (requires `CLOUDFLARE_*` env vars).
