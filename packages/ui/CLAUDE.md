# packages/ui — Component Authoring Guidelines

Reference for creating components that are consistent with the existing
codebase. All rules are derived from reading the actual source.

---

## Before Creating Any Component — Fetch Live Docs First

A `context7` MCP server is wired into this project. Before writing any component
code, resolve and fetch documentation for the libraries you will use:

1. Call `resolve-library-id` with the package name to get its Context7 ID
2. Call `get-library-docs` with that ID and a topic (e.g. the specific primitive
   or API surface)

Libraries to fetch when relevant:

| Library             | When to fetch                                                         |
| ------------------- | --------------------------------------------------------------------- |
| `@base-ui/react`    | Any component that wraps a base-ui primitive                          |
| `tailwind-variants` | Any time you use `createStyles` / slots / compoundSlots               |
| `motion/react`      | Any component that has animation (`motion.create`, `AnimatePresence`) |
| `@storybook/react`  | When creating or modifying story files                                |

Always fetch docs **before** writing code, not after encountering an error.

---

## Stack & Key Imports

| What                | How                                                                            |
| ------------------- | ------------------------------------------------------------------------------ |
| Headless primitives | `@base-ui/react/<name>` (button, radio-group, toggle, popover, scroll-area, …) |
| Styling             | `createStyles`, `StylesProps` from `~/utils` (aliases for `tailwind-variants`) |
| Animation           | `motion`, `AnimatePresence` from `~/motion`                                    |
| Icons               | `Icon` type + individual icons from `~/icons`                                  |
| Path alias          | `~/` → `src/`                                                                  |

```ts
import { createStyles, type StylesProps } from '~/utils'
import { Foo as FooPrimitive } from '@base-ui/react/foo'
import { motion, AnimatePresence } from '~/motion'
import { type Icon } from '~/icons'
```

---

## File & Directory Structure

```text
src/components/
├── button.tsx               ← simple component (single file)
├── icon-button.tsx
└── popover/                 ← compound component (folder)
    ├── popover-root.tsx
    ├── popover-trigger.tsx
    ├── popover-content.tsx
    └── index.ts             ← barrel, always present in folders
```

Rules:

- **Simple component** (no context needed) → single `kebab-case.tsx` directly in
  `src/components/`
- **Compound component** (multiple parts or needs context) → `kebab-case/`
  folder with sub-files named `<name>-<part>.tsx`
- Every folder **must** have an `index.ts` barrel file
- Register the new component in `src/components.ts`

---

## Naming Conventions

| Thing              | Pattern                               | Example                                         |
| ------------------ | ------------------------------------- | ----------------------------------------------- |
| File               | `kebab-case.tsx`                      | `radio-button.tsx`                              |
| Folder             | `kebab-case/`                         | `multi-select/`                                 |
| Component function | `PascalCase` full name                | `RadioButton`, `PopoverContent`                 |
| Props type         | `<ComponentName>Props`                | `RadioButtonProps`                              |
| Styles object      | `<componentName>Styles`               | `buttonStyles`, `radioGroupStyles`              |
| Context value type | `<ComponentName>ContextValue`         | `PopoverRootContextValue`                       |
| Context object     | `<ComponentName>Context`              | `PopoverRootContext`                            |
| Context hook       | `use<ComponentName>Context`           | `usePopoverRootContext`                         |
| `displayName`      | Always set on `forwardRef` components | `PopoverTrigger.displayName = 'PopoverTrigger'` |

---

## Component Shape

Every component file starts with `'use client'` and uses **named exports only**
(never `export default`).

```ts
'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Foo as FooPrimitive } from '@base-ui/react/foo'

const fooStyles = createStyles({
  slots: {
    container: 'base classes here',
  },
  variants: {
    variant: { primary: { container: '...' } },
  },
  defaultVariants: { variant: 'primary' },
})

type FooProps = FooPrimitive.Root.Props &
  StylesProps<typeof fooStyles> & {
    className?: string
  }

function Foo(props: FooProps) {
  const { className, variant, ...restProps } = props
  const styles = fooStyles({ variant })
  return (
    <FooPrimitive.Root
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { Foo, type FooProps, fooStyles }
```

Key rules:

- **Never destructure props in the function signature** — always use `props` as
  the parameter name (`react-props/no-destructure-in-params`)
- **First line of the body must destructure `props`** — `const { ... } = props`
  must be the very first statement (`react-props/must-destructure-first`)
- Destructure all variant props **explicitly** before spreading `...restProps`
- Instantiate styles _inside_ the function (`const styles = fooStyles(...)`)
- Export the styles object so other components can reuse or extend it

---

## Props Type Patterns

```ts
// Simple wrapper — extend primitive props directly
type ScrollAreaRootProps = ScrollAreaPrimitive.Root.Props &
  StylesProps<typeof scrollAreaRootStyles> & {
    className?: string
  }

// Remove primitive props that are handled internally
type ButtonProps = Omit<ButtonPrimitive.Props, 'nativeButton'> &
  StylesProps<typeof buttonStyles> & {
    icon?: Icon
  }

// Pick only the props you expose (for Root components that delegate to primitives)
type PopoverRootProps = Pick<
  PopoverPrimitive.Root.Props,
  'defaultOpen' | 'open' | 'onOpenChange'
> & {
  className?: string
  children: ReactNode
}
```

---

## Styling with `createStyles`

```ts
const componentStyles = createStyles({
  slots: {
    container: 'block transition-all', // one slot per semantic element
    wrapper: 'flex items-center',
    label: 'whitespace-nowrap antialiased',
    icon: 'stroke-[1.5]',
  },
  variants: {
    variant: {
      outline: {
        container: 'border-subtle-inv hover:border-muted-inv border-2',
      },
      ghost: { container: 'hover:bg-elevated active:bg-highlighted' },
    },
    size: {
      sm: { container: 'px-3 py-1', label: 'text-sm/none' },
      md: { container: 'px-4 py-2.5', label: 'text-base/none' },
    },
  },
  defaultVariants: { variant: 'outline', size: 'md' },
  compoundSlots: [
    // Only use compoundSlots when a style applies to a specific combination of variants
    {
      variant: 'outline',
      size: 'sm',
      slots: ['container'],
      className: 'rounded-lg',
    },
  ],
})
```

Rules:

- One slot per meaningful DOM element — `container`, `wrapper`, `label`, `icon`,
  `indicator`, etc.
- Variants describe **real visual states** — never add placeholder/unused
  variants
- `compoundSlots` for styles that only apply when two or more variants combine
- Apply in JSX: `styles.slotName({ className })`
- When `className` may be a function (base-ui render state callbacks):
  ```ts
  className={(state) =>
    styles.container({
      className: typeof className === 'function' ? className(state) : className,
    })
  }
  ```

---

## Compound Component Pattern

### Root file (`<name>-root.tsx`)

```ts
'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { Foo as FooPrimitive } from '@base-ui/react/foo'

type FooRootContextValue = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const FooRootContext = createContext<FooRootContextValue | null>(null)

const useFooRootContext = () => {
  const context = useContext(FooRootContext)
  if (!context) throw new Error('useFooRootContext must be used within a FooRoot')
  return useMemo(() => context, [context])
}

type FooRootProps = Pick<FooPrimitive.Root.Props, 'open' | 'onOpenChange' | 'defaultOpen'> & {
  children: ReactNode
}

function FooRoot(props: FooRootProps) {
  const {
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    defaultOpen = false,
    ...restProps
  } = props

  const [_open, _onOpenChange] = useState(defaultOpen)
  const open = controlledOpen !== undefined ? controlledOpen : _open
  const onOpenChange = controlledOnOpenChange !== undefined ? controlledOnOpenChange : _onOpenChange

  return (
    <FooRootContext.Provider value={{ open, onOpenChange }}>
      <FooPrimitive.Root open={open} onOpenChange={onOpenChange} {...restProps} />
    </FooRootContext.Provider>
  )
}

export { FooRoot, type FooRootProps, useFooRootContext, type FooRootContextValue }
```

### Passing variant defaults via context (see `radio-group.tsx`)

```ts
// Group context holds StylesProps so children can inherit defaults
const RadioGroupContext = createContext<StylesProps<typeof radioGroupStyles> | null>(null)
const useRadioGroupContext = () => useContext(RadioGroupContext) // nullable — no error guard

// In RadioGroup:
<RadioGroupContext.Provider value={{ orientation, variant }}>

// In RadioButton — prop wins over context:
const { variant: contextVariant } = useRadioGroupContext() ?? {}
const styles = radioButtonStyles({ variant: propsVariant ?? contextVariant })
```

---

## `forwardRef` — Use Sparingly

Only use when the component is a **trigger or anchor** that external code needs
to ref for positioning:

```ts
const FooTrigger = forwardRef<HTMLButtonElement, FooTriggerProps>(
  (props, ref) => {
    // ...
  },
)
FooTrigger.displayName = 'FooTrigger'
```

The vast majority of components do **not** use `forwardRef`.

---

## Animation

Create motion-wrapped primitives **at module scope** (never inside render):

```ts
import { AnimatePresence, motion } from '~/motion'

const MotionFooPopup = motion.create(FooPrimitive.Popup)
```

Drive visibility through context state, not CSS display:

```tsx
<AnimatePresence>
  {open && (
    <MotionFooPopup
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{
        type: 'spring',
        stiffness: 240,
        damping: 16,
        mass: 0.8,
        opacity: { type: 'tween', ease: [0.16, 1, 0.3, 1] },
      }}
    />
  )}
</AnimatePresence>
```

Shared layout animations use `layoutId`:

```tsx
<motion.span layoutId="foo-indicator" />
```

---

## Barrel / Export Files

### `<component-folder>/index.ts`

Rename to semantic sub-namespace members:

```ts
export { FooRoot as Root, type FooRootProps as RootProps } from './foo-root'
export {
  FooTrigger as Trigger,
  type FooTriggerProps as TriggerProps,
} from './foo-trigger'
export {
  FooContent as Content,
  type FooContentProps as ContentProps,
} from './foo-content'
```

### `src/components.ts`

```ts
// Simple (single-file) components — flat export
export * from '~/components/button'

// Compound components — namespace export
export * as Foo from '~/components/foo'
```

This gives consumers `<Foo.Root>`, `<Foo.Trigger>`, `<Foo.Content>`.

---

## Theme Tokens

Use **semantic CSS tokens** defined in `src/theme.css`. Never use raw colours.

| Category                | Tokens                                               |
| ----------------------- | ---------------------------------------------------- |
| Text                    | `text-main` `text-muted` `text-subtle`               |
| Text (inverted surface) | `text-main-inv` `text-muted-inv` `text-subtle-inv`   |
| Background              | `bg-main` `bg-elevated` `bg-highlighted`             |
| Background (inverted)   | `bg-main-inv` `bg-elevated-inv` `bg-highlighted-inv` |
| Border                  | `border-subtle-inv` `border-muted-inv`               |
| Accent                  | `border-accent` `text-accent`                        |
| Dark mode modifier      | `dark:text-main` `dark:bg-elevated` etc.             |

For popup/overlay surfaces use opacity modifiers: `bg-main-inv/96`,
`dark:bg-elevated/96`.

CSS custom properties injected by base-ui primitives: `var(--transform-origin)`,
`var(--positioner-height)`, `var(--positioner-width)`.

---

## Storybook Stories

File: `apps/storybook/src/stories/components/<name>.stories.tsx`

```ts
import type { Meta, StoryFn } from '@storybook/react'
import { ComponentName } from '@lumo/ui/components'

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    variant: { options: ['outline', 'ghost'], control: { type: 'radio' } },
    size:    { options: ['sm', 'md', 'lg'],   control: { type: 'radio' } },
  },
  args: {
    children: 'Label',
    variant: 'outline',
    size: 'md',
  },
}
export default meta

type Story = StoryFn<typeof ComponentName>

// Object form — for simple variant overrides
export const Outline: Story = { args: { variant: 'outline' } }

// Render function form — for compound or stateful components
export const Default: Story = (args) => (
  <ComponentName.Root {...args}>
    <ComponentName.Trigger>Open</ComponentName.Trigger>
    <ComponentName.Content>Content</ComponentName.Content>
  </ComponentName.Root>
)
```

Rules:

- `title`: `Components/<PascalCase>`
- Always include `tags: ['autodocs']`
- `argTypes` for every variant/size/boolean prop
- Render function (`StoryFn`) for complex compositions; object form for simple
  variant overrides
- Story export names: `PascalCase` (`Default`, `Outline`, `Ghost`, `AsDialog`)

---

## Checklist for a New Component

- [ ] `'use client'` at the top of every file
- [ ] Styles declared with `createStyles` and exported
- [ ] Props type intersects primitive props + `StylesProps<typeof styles>` +
      `{ className?: string }`
- [ ] Function signature uses `props` param (never destructure in params)
- [ ] First line of body is `const { ... } = props`
- [ ] Variant props destructured explicitly; non-variant props spread via
      `...restProps`
- [ ] Folder has `index.ts` with renamed exports
- [ ] `src/components.ts` updated with new export
- [ ] Motion primitives created at module scope with `motion.create()`
- [ ] `forwardRef` only on trigger/anchor components; `displayName` set
- [ ] Only semantic theme tokens used (no raw colours)
- [ ] Story file created at
      `apps/storybook/src/stories/components/<name>.stories.tsx`
