# UI Components

> **Primary reference:** `packages/ui/CLAUDE.md` — read it first. This file adds details
> not covered there: full worked examples, context patterns, and non-obvious rules.

## Simple Component — Full Example (`button.tsx`)

```ts
'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { type Icon } from '~/icons'

const buttonStyles = createStyles({
  slots: {
    container: 'block cursor-pointer transition-all',
    wrapper: 'flex h-6 items-center justify-center outline-none',
    label: 'whitespace-nowrap antialiased',
    icon: 'stroke-[1.5]',
  },
  variants: {
    variant: {
      outline: { container: 'border-subtle-inv hover:border-muted-inv border-2' },
      ghost:   { container: 'hover:bg-elevated active:bg-highlighted' },
      solid:   { container: 'bg-elevated hover:bg-highlighted' },
    },
    size: {
      sm: { container: 'px-3 py-1', label: 'text-sm/none', icon: 'size-4' },
      md: { container: 'px-4 py-2.5', label: 'text-base/none', icon: 'size-5' },
    },
    shape: { pill: {}, rounded: {} },
  },
  defaultVariants: { variant: 'outline', size: 'md', shape: 'pill' },
  compoundSlots: [
    { shape: 'pill', slots: ['container'], className: 'rounded-full' },
    { shape: 'rounded', size: 'sm', slots: ['container'], className: 'rounded-lg' },
  ],
})

type ButtonProps = Omit<ButtonPrimitive.Props, 'nativeButton'> &
  StylesProps<typeof buttonStyles> & {
    icon?: Icon
  }

function Button(props: ButtonProps) {
  const { className, children, icon: Icon, render, variant, size, shape, ...restProps } = props

  const styles = buttonStyles({ variant, size, shape })

  return (
    <ButtonPrimitive
      className={(state) =>
        styles.container({
          className: typeof className === 'function' ? className(state) : className,
        })
      }
      render={render}
      nativeButton={!render}
      {...restProps}
    >
      <div className={styles.wrapper()}>
        <span className={styles.label()}>{children}</span>
        {Icon && <Icon className={styles.icon()} />}
      </div>
    </ButtonPrimitive>
  )
}

export { Button, buttonStyles, type ButtonProps }
```

## Compound Component — Full Example (`popover/`)

### `popover-root.tsx`

```ts
'use client'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { createContext, type ReactNode, useContext, useMemo, useState } from 'react'

type PopoverRootContextValue = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PopoverRootContext = createContext<PopoverRootContextValue | null>(null)

const usePopoverRootContext = () => {
  const context = useContext(PopoverRootContext)
  if (!context) throw new Error('usePopoverRootContext must be used within a PopoverRoot')
  return useMemo(() => context, [context])
}

type PopoverRootProps = Pick<
  PopoverPrimitive.Root.Props,
  'defaultOpen' | 'open' | 'onOpenChange'
> & { className?: string; children: ReactNode }

function PopoverRoot(props: PopoverRootProps) {
  const { open: controlledOpen, onOpenChange: controlledOnOpenChange, defaultOpen = false, ...restProps } = props

  const [_open, _onOpenChange] = useState(defaultOpen)
  const open = controlledOpen !== undefined ? controlledOpen : _open
  const onOpenChange = controlledOnOpenChange !== undefined ? controlledOnOpenChange : _onOpenChange

  return (
    <PopoverRootContext.Provider value={{ open, onOpenChange }}>
      <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen} {...restProps} />
    </PopoverRootContext.Provider>
  )
}

export { PopoverRoot, type PopoverRootProps, usePopoverRootContext, type PopoverRootContextValue }
```

### `popover/index.ts`

```ts
export { PopoverRoot as Root, type PopoverRootProps as RootProps } from './popover-root'
export { PopoverTrigger as Trigger, type PopoverTriggerProps as TriggerProps } from './popover-trigger'
export { PopoverContent as Content, type PopoverContentProps as ContentProps } from './popover-content'
```

### `src/components.ts` registration

```ts
// Simple components — flat export
export * from '~/components/button'

// Compound components — namespace export
export * as Popover from '~/components/popover'
```

## Context Variant Inheritance (Slider pattern)

When child components need to inherit variant defaults from a parent Root, use a **nullable context** (no error guard) and a `??` fallback:

```ts
// slider-root.tsx — context holds StylesProps directly
type SliderRootContextValue = StylesProps<typeof sliderRootStyles>
const SliderRootContext = createContext<SliderRootContextValue | null>(null)
const useSliderRootContext = () => useContext(SliderRootContext)  // nullable — no throw

function SliderRoot(props: SliderRootProps) {
  const { className, variant, size, ...restProps } = props
  return (
    <SliderRootContext.Provider value={{ variant, size }}>
      <SliderPrimitive.Root ... />
    </SliderRootContext.Provider>
  )
}

// slider-thumb.tsx — props win over context
function SliderThumb(props: SliderThumbProps) {
  const { variant: propsVariant, size: propsSize, ...restProps } = props
  const { variant: contextVariant, size: contextSize } = useSliderRootContext() ?? {}
  const styles = sliderThumbStyles({
    variant: propsVariant ?? contextVariant,
    size: propsSize ?? contextSize,
  })
  // ...
}
```

**Use error-throwing hook** when children cannot work without a parent (e.g., PopoverContent needs `open`).
**Use nullable hook** when children work independently but prefer inherited defaults (e.g., SliderThumb).

## Controlled / Uncontrolled State Wiring

Standard pattern for any Root that manages open/value state:

```ts
// Uncontrolled fallback — local state
const [_open, _onOpenChange] = useState(defaultOpen)

// Controlled — external prop wins when provided
const open = controlledOpen !== undefined ? controlledOpen : _open
const onOpenChange = controlledOnOpenChange !== undefined ? controlledOnOpenChange : _onOpenChange
```

Always accept both `open` + `onOpenChange` (controlled) and `defaultOpen` (uncontrolled).

## Render Callback from base-ui

base-ui passes a state object to `className` as a function. Always handle both cases:

```ts
className={(state) =>
  styles.container({
    className: typeof className === 'function' ? className(state) : className,
  })
}
```

## Pick vs Omit vs Direct Extend

| Use | When |
|-----|------|
| Direct extend (`Primitive.Props & StylesProps<...>`) | Simple wrapper, expose all primitive props |
| `Omit<Primitive.Props, 'handledProp'>` | Primitive has a prop you handle internally (e.g., `nativeButton`) |
| `Pick<Primitive.Props, 'prop1' \| 'prop2'>` | Root component — only expose a curated surface area |
