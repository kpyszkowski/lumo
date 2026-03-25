import type { Meta, StoryObj } from 'storybook-react-rsbuild'
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
    icon: {
      options: Object.keys(icons),
      mapping: icons,
      control: { type: 'select' },
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
