import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite'

import { Toggle } from '@lumo/ui/components'

import * as icons from '@lumo/ui/icons'

const meta: Meta<typeof Toggle.Button> = {
  title: 'Components/Toggle',
  component: Toggle.Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      options: ['default', 'elevated'],
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
    variant: 'default',
    icon: icons.IconHeart,
  },
}

export default meta
type Story = StoryObj<typeof Toggle.Button> | StoryFn<typeof Toggle.Button>

export const Default: Story = {}

export const InGroup: Story = (args) => (
  <Toggle.Group variant={args.variant}>
    <Toggle.Button
      {...args}
      icon={icons.IconCarBodyLimousine}
    />
    <Toggle.Button
      {...args}
      icon={icons.IconCarBodySuv}
    />
    <Toggle.Button
      {...args}
      icon={icons.IconCarBodyEstate}
    />
    <Toggle.Button
      {...args}
      icon={icons.IconCarBodyCoupe}
    />
  </Toggle.Group>
)
