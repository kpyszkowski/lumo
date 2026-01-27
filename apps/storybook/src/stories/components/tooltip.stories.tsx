import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite'
import { Button, Tooltip } from '@lumo/ui/components'
import { useRef } from 'react'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
    side: {
      options: ['top', 'right', 'bottom', 'left', 'inline-start', 'inline-end'],
      control: { type: 'radio' },
    },
    align: {
      options: ['start', 'center', 'end'],
      control: { type: 'radio' },
    },
  },
  args: {
    children: <span>Tooltip content</span>,
    content: 'This is a tooltip',
  },
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof Tooltip> | StoryFn<typeof Tooltip>

export const Default: Story = {}

export const WithLongContent: Story = {
  args: {
    content:
      'This is a tooltip with a significantly longer content to demonstrate how the tooltip handles larger amounts of text without breaking the layout or overflowing its container.',
  },
}

export const WithTriggerWithRefAttached: Story = (props) => {
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <Tooltip {...props}>
      <Button ref={ref}>Hover me</Button>
    </Tooltip>
  )
}
