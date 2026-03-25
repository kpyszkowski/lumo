# @base-ui/react Patterns

> Always fetch live docs via context7 before using a primitive you haven't used before.
> `resolve-library-id('@base-ui/react')` → `get-library-docs` with the specific primitive.

## Import Convention

Always import with an alias ending in `Primitive`:

```ts
import { Foo as FooPrimitive } from '@base-ui/react/foo'
```

Each primitive is a separate entry point. Parts are accessed as sub-exports of the namespace:

```ts
<FooPrimitive.Root>
<FooPrimitive.Trigger>
<FooPrimitive.Popup>
<FooPrimitive.Positioner>
<FooPrimitive.Portal>
<FooPrimitive.Viewport>
```

## Primitives Used in This Codebase

| Primitive | Import path | Parts used |
|-----------|------------|------------|
| Button | `@base-ui/react/button` | `Button` (flat) |
| Popover | `@base-ui/react/popover` | Root, Trigger, Popup, Positioner, Portal, Viewport |
| Slider | `@base-ui/react/slider` | Root, Control, Track, Thumb, Indicator, Value |
| Radio Group | `@base-ui/react/radio-group` | Root, Item (radio button) |
| Toggle Group | `@base-ui/react/toggle-group` | Root, Item |
| Scroll Area | `@base-ui/react/scroll-area` | Root, Viewport, Scrollbar, Thumb |

## Render Callbacks

base-ui passes a state object to `className` when the element has interactive states.
Always handle both a plain string and a function:

```ts
// Incoming prop: className?: string | ((state: SomeState) => string)
className={(state) =>
  styles.container({
    className: typeof className === 'function' ? className(state) : className,
  })
}
```

Not all base-ui elements use render callbacks — only those with state (e.g., Button, Thumb). Simple structural elements (Portal, Positioner, Viewport) accept plain strings.

## `data-disabled` Placement

base-ui sets `data-disabled` on **some** parts only:

| Part | Has `data-disabled`? |
|------|---------------------|
| Root | Yes |
| Thumb | Yes |
| Indicator | Yes |
| Value | Yes |
| Control | **No** — use `has-disabled:` instead |

To style a disabled Control, detect the inner `<input disabled>`:

```ts
// On Control
className="has-disabled:pointer-events-none has-disabled:opacity-50"
```

## Slider: `transition-colors` on Thumb (not `transition-all`)

Using `transition-all` on a Slider Thumb causes position lag because transitions affect the CSS `left`/`transform` property used for positioning.

```ts
// Correct
className="transition-colors"

// Wrong — causes jitter/lag when dragging
className="transition-all"
```

## Positioner and Portal Pattern

For popup components, the standard nesting is:

```tsx
<Primitive.Portal keepMounted>
  <Primitive.Positioner align="start" side="bottom" sideOffset={8} {...restProps}>
    <Primitive.Viewport>
      <AnimatePresence>
        {open && <MotionPopup ...>{children}</MotionPopup>}
      </AnimatePresence>
    </Primitive.Viewport>
  </Primitive.Positioner>
</Primitive.Portal>
```

- `keepMounted` on Portal keeps the DOM node alive for exit animations
- `AnimatePresence` + context `open` drives visibility (not CSS display)
- `transformOrigin: 'var(--transform-origin)'` on the popup for correct scale origin
