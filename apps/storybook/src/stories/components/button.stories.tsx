import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '@lumo/ui/components'

import * as icons from '@lumo/ui/icons'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    icon: {
      options: Object.keys(icons),
      mapping: icons,
      control: {
        type: 'select',
      },
    },
  },
  args: {
    children: 'Button',
    variant: 'outline',
    size: 'md',
    iconPosition: 'left',
    shape: 'pill',
    inverted: false,
    contentAlignment: 'center',
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
}

export const Solid: Story = {
  args: {
    variant: 'solid',
  },
}
