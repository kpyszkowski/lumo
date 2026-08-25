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
      render={(_, { open }) => (
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

const popoverHandle = Popover.createHandle<React.ComponentType>()

const createPayload = (title: string): React.ComponentType =>
  function Payload() {
    return (
      <div className="px-4 py-2">
        <h1 className="mb-3 text-lg font-semibold">{title}</h1>
        <p className={title === 'Messages' ? 'h-32 w-48' : ''}>
          This is the content for {title}.
        </p>
      </div>
    )
  }

export const MultipleInstances: Story = (args) => (
  <>
    <div className="flex gap-3">
      <Popover.Trigger
        handle={popoverHandle}
        payload={createPayload('Notifications')}
      >
        Notifications
      </Popover.Trigger>

      <Popover.Trigger
        handle={popoverHandle}
        payload={createPayload('Activities')}
      >
        Activities
      </Popover.Trigger>

      <Popover.Trigger
        handle={popoverHandle}
        payload={createPayload('Messages')}
      >
        Messages
      </Popover.Trigger>
    </div>

    <Popover.Root
      {...args}
      handle={popoverHandle}
    >
      {({ payload: Payload }) => (
        <Popover.Content>
          {Payload !== undefined ? <Payload /> : null}
        </Popover.Content>
      )}
    </Popover.Root>
  </>
)
