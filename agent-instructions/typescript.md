# TypeScript Conventions

## Named Exports Only

`export default` is never used in this codebase.

```ts
// Correct
export { Button, buttonStyles, type ButtonProps }

// Wrong
export default Button  // ❌
```

## Props Parameter Rule

Never destructure in the function signature. Use `props` as the parameter name.
The **first line of the body** must destructure `props`.

```ts
// Correct
function Button(props: ButtonProps) {
  const { className, children, variant, size, ...restProps } = props
  // ...
}

// Wrong
function Button({ className, children }: ButtonProps) {  // ❌
```

This is enforced by ESLint rules: `react-props/no-destructure-in-params` and `react-props/must-destructure-first`.

## Props Type Composition

Three patterns depending on how much of the primitive surface you expose:

```ts
// 1. Full extend — expose all primitive props
type ScrollAreaRootProps = ScrollAreaPrimitive.Root.Props &
  StylesProps<typeof scrollAreaRootStyles> & {
    className?: string
  }

// 2. Omit — primitive has a prop you handle internally
type ButtonProps = Omit<ButtonPrimitive.Props, 'nativeButton'> &
  StylesProps<typeof buttonStyles> & {
    icon?: Icon
  }

// 3. Pick — Root component, curated surface only
type PopoverRootProps = Pick<
  PopoverPrimitive.Root.Props,
  'defaultOpen' | 'open' | 'onOpenChange'
> & {
  className?: string
  children: ReactNode
}
```

## `StylesProps<typeof styles>`

The correct way to type variant props:

```ts
import { type StylesProps } from '~/utils'  // or '@lumo/ui/utils'

type FooProps = FooPrimitive.Root.Props & StylesProps<typeof fooStyles>
```

Do not manually re-declare the variant union types — `StylesProps` extracts them.

## Context Patterns

Two patterns, each for different use cases:

```ts
// Pattern 1: Error-throwing — when children cannot work without the parent
const FooContext = createContext<FooContextValue | null>(null)

const useFooContext = () => {
  const context = useContext(FooContext)
  if (!context) throw new Error('useFooContext must be used within a FooRoot')
  return useMemo(() => context, [context])
}

// Pattern 2: Nullable — when children work independently, context provides defaults
const FooContext = createContext<FooContextValue | null>(null)
const useFooContext = () => useContext(FooContext)  // returns null when outside provider

// Usage in child:
const { variant: contextVariant } = useFooContext() ?? {}
const styles = fooStyles({ variant: propsVariant ?? contextVariant })
```

## Icon Type

```ts
import { type Icon } from '~/icons'  // in packages/ui
import { type Icon } from '@lumo/ui/icons'  // in apps/web

// Usage in props
type FooProps = { icon?: Icon }

// Usage in JSX
{Icon && <Icon className={styles.icon()} />}
```

## No `any`

Strict TypeScript throughout. If a type assertion is genuinely needed, use `as SpecificType`.
The only known exception is internal provider composition utilities in `apps/web`.

## Variant Props: Destructure Explicitly

All variant props must be **explicitly destructured** before `...restProps` — never spread them into the primitive.

```ts
// Correct
const { className, variant, size, shape, ...restProps } = props
const styles = fooStyles({ variant, size, shape })
<Primitive {...restProps} />  // variant/size/shape not passed to DOM

// Wrong
const { className, ...restProps } = props
<Primitive {...restProps} />  // ❌ variant/size/shape end up on DOM element
```
