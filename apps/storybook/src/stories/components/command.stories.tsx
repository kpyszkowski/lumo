import type { Meta, StoryFn } from '@storybook/react-vite'

import { Command } from '@lumo/ui/components'
import { IconHeart } from '@lumo/ui/icons'

const meta: Meta<typeof Command.Root> = {
  title: 'Components/Command',
  component: Command.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryFn<typeof Command.Root>

export const Default: Story = (args) => (
  <Command.Root {...args}>
    <Command.Input placeholder="Marka, model, generacja pojazdu..." />
    <Command.List className="flex w-full gap-6 px-6">
      <Command.Group heading="Popularne">
        <Command.Item icon={IconHeart}>OMODA</Command.Item>

        <Command.Item icon={IconHeart}>Jaecoo</Command.Item>

        <Command.Item icon={IconHeart}>BYD</Command.Item>
      </Command.Group>

      <Command.Group heading="Alfabetyczne">
        <Command.Item icon={IconHeart}>Audi</Command.Item>

        <Command.Item icon={IconHeart}>BMW</Command.Item>

        <Command.Item icon={IconHeart}>Chevrolet</Command.Item>
      </Command.Group>
    </Command.List>
  </Command.Root>
)
