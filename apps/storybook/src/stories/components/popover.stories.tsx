import type { Meta, StoryFn } from 'storybook-react-rsbuild'

import { Button, Popover } from '@lumo/ui/components'

const meta: Meta<typeof Popover.Root> = {
  title: 'Components/Popover',
  component: Popover.Root,
  tags: ['autodocs'],
  args: {
    defaultOpen: false,
  },
}

export default meta
type Story = StoryFn<typeof Popover.Root>

export const Default: Story = (args) => (
  <Popover.Root {...args}>
    <Popover.Trigger>Open popover</Popover.Trigger>
    <Popover.Content>
      <div className="p-4">
        <p className="text-sm">This is the popover content.</p>
      </div>
    </Popover.Content>
  </Popover.Root>
)

export const Sides: Story = () => (
  <div className="flex items-center justify-center gap-4">
    {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
      <Popover.Root key={side}>
        <Popover.Trigger variant="outline">{side}</Popover.Trigger>
        <Popover.Content side={side}>
          <div className="p-4">
            <p className="text-sm">Placed on the {side}.</p>
          </div>
        </Popover.Content>
      </Popover.Root>
    ))}
  </div>
)

export const CustomTrigger: Story = (args) => (
  <Popover.Root {...args}>
    <Popover.Trigger
      render={({ open }) => (
        <Button variant="ghost">{open ? 'Close' : 'Open'}</Button>
      )}
    />
    <Popover.Content>
      <div className="p-4">
        <p className="text-sm">Triggered by a custom render function.</p>
      </div>
    </Popover.Content>
  </Popover.Root>
)
