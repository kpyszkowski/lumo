import type { Meta, StoryObj } from '@storybook/react-vite'

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
    variant: {
      options: ['outline', 'ghost'],
      control: { type: 'radio' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
    iconPosition: {
      options: ['left', 'right'],
      control: { type: 'radio' },
    },
    icon: {
      control: {
        type: 'select',
      },
      options: Object.keys(icons),
      mapping: icons,
    },
    shape: {
      options: ['pill', 'rounded'],
      control: { type: 'radio' },
    },
    inverted: {
      control: { type: 'boolean' },
    },
    contentAlignment: {
      options: ['center', 'start', 'end'],
      control: { type: 'radio' },
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
