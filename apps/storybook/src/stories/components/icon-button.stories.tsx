import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconButton } from '@lumo/ui/components'
import * as icons from '@lumo/ui/icons'

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
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
    icon: {
      control: {
        type: 'select',
      },
      options: Object.keys(icons),
      mapping: icons,
    },
  },
  args: {
    icon: icons.IconHeart,
    variant: 'outline',
    size: 'md',
  },
}

export default meta
type Story = StoryObj<typeof IconButton>

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
