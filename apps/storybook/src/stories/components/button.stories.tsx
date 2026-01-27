import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@lumo/ui/components'
import * as icons from '@lumo/ui/icons'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      url: 'https://www.figma.com/design/Q6gHpqqCadBiEmuHzJBSAK/Untitled?node-id=39-130&t=xaxh0HRWc3j83nrO-4',
    },
  },
  argTypes: {
    variant: {
      options: ['solid', 'outline', 'ghost'],
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
  },
  args: {
    children: 'Button',
    variant: 'solid',
    size: 'md',
    iconPosition: 'left',
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Solid: Story = {
  args: {
    variant: 'solid',
  },
}

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
