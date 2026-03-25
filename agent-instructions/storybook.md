# Storybook

## File Location

```
apps/storybook/src/stories/components/<name>.stories.tsx
```

## Imports

```ts
import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import { ComponentName } from '@lumo/ui/components'
```

When the component has an `icon` prop, import all icons as a namespace:

```ts
import * as icons from '@lumo/ui/icons'
```

## Meta Shape

`argTypes` are **inferred automatically** from TypeScript types via `react-docgen-typescript` — do not define them explicitly. The only exception is the `icon` prop, which needs a custom control to map icon names to their components:

```ts
const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',   // PascalCase, no nesting
  component: ComponentName,
  tags: ['autodocs'],                  // always present
  parameters: { layout: 'centered' }, // for most components
  // no argTypes — inferred from TypeScript types automatically
  args: {
    children: 'Label',
    variant: 'outline',
    size: 'md',
  },
}
export default meta
```

For components with an `icon` prop, add only that `argType`:

```ts
argTypes: {
  icon: {
    options: Object.keys(icons),
    mapping: icons,
    control: { type: 'select' },
  },
},
```

## Story Types

**`StoryObj`** — for simple variant overrides (no interactive state needed):

```ts
type Story = StoryObj<typeof ComponentName>

export const Outline: Story = { args: { variant: 'outline' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
```

**`StoryFn`** — for compound components and anything with state:

```ts
type Story = StoryFn<typeof ComponentName>

export const Default: Story = (args) => (
  <Foo.Root {...args}>
    <Foo.Trigger>Open</Foo.Trigger>
    <Foo.Content>Content</Foo.Content>
  </Foo.Root>
)

export const AsDialog: Story = (args) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Foo.Dialog open={open} onOpenChange={setOpen} {...args}>
        {/* ... */}
      </Foo.Dialog>
    </>
  )
}
```

## Naming Rules

| Thing | Rule | Example |
|-------|------|---------|
| `title` | `Components/<PascalCase>` | `Components/RadioButton` |
| Story export | `PascalCase` | `Default`, `Outline`, `AsDialog`, `Range` |
| File | `<kebab-case>.stories.tsx` | `radio-button.stories.tsx` |

## `tags: ['autodocs']`

Always include. Enables the auto-generated docs page in Storybook.

## Range Story Gotcha

When `meta.args` has a **number** `defaultValue`, Range stories must override it **after** spreading `{...args}`:

```ts
// meta.args = { defaultValue: 50 }  ← number default

export const Range: Story = (args) => (
  <Slider.Root
    {...args}
    defaultValue={[25, 75]}  // must come AFTER {...args} to override
  />
)
```

If you place `defaultValue` before `{...args}`, meta's number value overwrites the array.
