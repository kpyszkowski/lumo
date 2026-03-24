# Animation

## Imports

```ts
import { motion, AnimatePresence } from '~/motion'
```

(`~/motion` re-exports from `motion/react`)

## Rule: `motion.create()` at Module Scope

Create motion-wrapped primitives **at the top of the file**, never inside a component function.

```ts
// Correct — module scope
const MotionPopup = motion.create(FooPrimitive.Popup)

function FooContent(props) {
  return <MotionPopup ... />
}

// Wrong — inside render, creates a new component on every render
function FooContent(props) {
  const MotionPopup = motion.create(FooPrimitive.Popup)  // ❌
}
```

## Rule: Visibility via Context State + `AnimatePresence`

Never toggle visibility with CSS `display: none`. Drive it through context state and `AnimatePresence`:

```tsx
const { open } = useFooRootContext()

<AnimatePresence>
  {open && (
    <MotionPopup
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

## Standard Spring Config

Used consistently across all popup/overlay animations:

```ts
transition: {
  type: 'spring',
  stiffness: 240,
  damping: 16,
  mass: 0.8,
  // Opacity gets its own easing (spring looks wrong for opacity)
  opacity: { type: 'tween', ease: [0.16, 1, 0.3, 1] },
}
```

## Dynamic Size Animation with base-ui CSS Variables

Popover/popup content can animate its dimensions using base-ui's measured size variables:

```ts
const sizeProperty = ['top', 'bottom'].includes(side) ? 'height' : 'width'

initial={{
  opacity: 0,
  scale: 0.92,
  [sizeProperty]: `calc(var(--positioner-${sizeProperty}) * 0.92)`,
}}
animate={{
  opacity: 1,
  scale: 1,
  [sizeProperty]: `var(--positioner-${sizeProperty})`,
}}
exit={{
  opacity: 0,
  scale: 0.92,
  [sizeProperty]: `calc(var(--positioner-${sizeProperty}) * 0.92)`,
}}
```

Also set `style={{ transformOrigin: 'var(--transform-origin)' }}` on the popup.

## Shared Layout Animations (`layoutId`)

For elements that should animate their position between different render locations (e.g., a selection indicator moving between radio buttons):

```tsx
<motion.span
  layoutId="radio-button-indicator"
  className="absolute inset-0 rounded-full bg-elevated"
/>
```

The `layoutId` must be unique within the page. Consistent string literal — define it as a constant if reused across files.
