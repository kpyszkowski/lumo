import type { Meta, StoryObj } from '@storybook/react'

import { Logo } from '@lumo/ui/components'

const meta: Meta<typeof Logo> = {
  title: 'Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {},
  },
  argTypes: {
    variant: {
      options: ['icon', 'wordmark', 'logo'],
      control: { type: 'radio' },
    },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'radio' },
    },
  },
  args: {
    variant: 'logo',
    orientation: 'horizontal',
  },
}

export default meta
type Story = StoryObj<typeof Logo>

export const Default: Story = {}
