# Styling

## `createStyles` API

`createStyles` is a thin wrapper around `tailwind-variants`. Import from `~/utils` (packages/ui) or `@lumo/ui/utils` (apps/web).

```ts
import { createStyles, type StylesProps } from '~/utils'

const fooStyles = createStyles({
  slots: {
    container: 'base-classes',   // one slot per meaningful DOM element
    wrapper: 'flex items-center',
    label: 'whitespace-nowrap antialiased',
    icon: 'stroke-[1.5]',
  },
  variants: {
    variant: {
      outline: { container: 'border-2 border-subtle-inv hover:border-muted-inv' },
      ghost:   { container: 'hover:bg-elevated active:bg-highlighted' },
    },
    size: {
      sm: { container: 'px-3 py-1', label: 'text-sm/none' },
      md: { container: 'px-4 py-2.5', label: 'text-base/none' },
    },
  },
  defaultVariants: { variant: 'outline', size: 'md' },
  compoundSlots: [
    // Only use when a style applies only when two+ variants combine
    { variant: 'outline', size: 'sm', slots: ['container'], className: 'rounded-lg' },
  ],
})
```

### Rules
- One slot per semantic DOM element (`container`, `wrapper`, `label`, `icon`, `indicator`, `track`, …)
- Only define **real visual states** in variants — no placeholder/unused entries
- Use `compoundSlots` only when a style is exclusive to a combination of variants

## Applying Styles in JSX

```tsx
const styles = fooStyles({ variant, size })

<div className={styles.container({ className })}>
  <span className={styles.label()}>{children}</span>
  {Icon && <Icon className={styles.icon()} />}
</div>
```

When `className` may be a render callback from base-ui:

```tsx
className={(state) =>
  styles.container({
    className: typeof className === 'function' ? className(state) : className,
  })
}
```

## `StylesProps<typeof styles>`

Extracts variant union types from a `createStyles` call for use in props:

```ts
type FooProps = FooPrimitive.Root.Props &
  StylesProps<typeof fooStyles> & {
    className?: string
  }
```

This gives the component `variant`, `size`, etc. typed to the exact union defined in `createStyles`.

## Theme Tokens

Defined in `packages/ui/src/theme.css`. **Never use raw colours** — always use these tokens.

| Category | Tokens |
|----------|--------|
| Text | `text-main` `text-muted` `text-subtle` |
| Text (inverted surface) | `text-main-inv` `text-muted-inv` `text-subtle-inv` |
| Background | `bg-main` `bg-elevated` `bg-highlighted` |
| Background (inverted) | `bg-main-inv` `bg-elevated-inv` `bg-highlighted-inv` |
| Border | `border-subtle-inv` `border-muted-inv` |
| Accent | `border-accent` `text-accent` |

Dark mode is handled by the token definitions themselves (`@custom-variant dark` with `data-theme="dark"`).
In most cases you **do not need** `dark:` prefixes — the tokens swap automatically.

**Exception:** Popup/overlay surfaces need explicit opacity + dark override:
```
bg-main-inv/96 dark:bg-elevated/96 dark:text-main
```

### Colour Palettes (raw, for reference only)
- `mud-*` — neutral warm greys (oklch)
- `sand-*` — warm background tones (oklch)
- `vermilion-*` — accent/red (oklch)

## Tailwind v4 Data/State Variants

Confirmed patterns in this codebase:

| Variant | Meaning | Where to use |
|---------|---------|--------------|
| `data-disabled:` | Matches `[data-disabled]` attribute | Root, Thumb, Indicator, Value (set by base-ui) |
| `has-disabled:` | Matches `:has(:disabled)` | Control elements (detects inner `<input disabled>`) |
| `has-focus-visible:` | Matches `:has(:focus-visible)` | Wrapper elements for keyboard focus styling |
| `group-data-{key}:` | Ancestor has `[data-{key}]` | Child elements needing parent state |

`data-disabled:` canonical form (no brackets) is preferred over `data-[disabled]:`.

## CSS Variables Injected by base-ui

base-ui sets these CSS custom properties on positioned elements — use them in inline styles:

```ts
style={{ transformOrigin: 'var(--transform-origin)' }}
```

| Variable | Purpose |
|----------|---------|
| `--transform-origin` | Origin point for scale animations on popups |
| `--positioner-height` | Measured height of the positioner |
| `--positioner-width` | Measured width of the positioner |
