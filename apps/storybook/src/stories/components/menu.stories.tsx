import type { Meta, StoryFn } from 'storybook-react-rsbuild'
import { useState } from 'react'

import { Button, Menu } from '@lumo/ui/components'
import { IconArrowsSort, IconBell, IconHeart, IconX } from '@lumo/ui/icons'

const meta: Meta<typeof Menu.Root> = {
  title: 'Components/Menu',
  component: Menu.Root,
  tags: ['autodocs'],
  args: {
    defaultOpen: false,
  },
}

export default meta
type Story = StoryFn<typeof Menu.Root>

export const Default: Story = (args) => (
  <Menu.Root {...args}>
    <Menu.Trigger>Actions</Menu.Trigger>
    <Menu.Content>
      <Menu.Item icon={IconHeart}>Save to favourites</Menu.Item>
      <Menu.Item icon={IconBell}>Notify about price drops</Menu.Item>
      <Menu.Separator />
      <Menu.Item icon={IconX}>Hide this offer</Menu.Item>
    </Menu.Content>
  </Menu.Root>
)

export const Sorting: Story = (args) => {
  const [sort, setSort] = useState('relevance')

  return (
    <Menu.Root {...args}>
      <Menu.Trigger
        variant="ghost"
        icon={IconArrowsSort}
      >
        Sort
      </Menu.Trigger>
      <Menu.Content align="end">
        <Menu.RadioGroup
          value={sort}
          onValueChange={setSort}
        >
          <Menu.GroupLabel>Sort by</Menu.GroupLabel>
          <Menu.RadioItem value="relevance">Relevance</Menu.RadioItem>
          <Menu.RadioItem value="price-asc">Price: low to high</Menu.RadioItem>
          <Menu.RadioItem value="price-desc">Price: high to low</Menu.RadioItem>
          <Menu.RadioItem value="year-desc">Newest first</Menu.RadioItem>
          <Menu.RadioItem value="mileage-asc">Lowest mileage</Menu.RadioItem>
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  )
}

export const Groups: Story = (args) => (
  <Menu.Root {...args}>
    <Menu.Trigger variant="outline">Open menu</Menu.Trigger>
    <Menu.Content>
      <Menu.Group>
        <Menu.GroupLabel>Follow</Menu.GroupLabel>
        <Menu.Item icon={IconHeart}>Save to favourites</Menu.Item>
        <Menu.Item icon={IconBell}>Notify about price drops</Menu.Item>
      </Menu.Group>
      <Menu.Separator />
      <Menu.Group>
        <Menu.GroupLabel>Dismiss</Menu.GroupLabel>
        <Menu.Item
          icon={IconX}
          disabled
        >
          Hide this offer
        </Menu.Item>
      </Menu.Group>
    </Menu.Content>
  </Menu.Root>
)

export const Sides: Story = () => (
  <div className="flex items-center justify-center gap-4">
    {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
      <Menu.Root key={side}>
        <Menu.Trigger variant="outline">{side}</Menu.Trigger>
        <Menu.Content side={side}>
          <Menu.Item>First</Menu.Item>
          <Menu.Item>Second</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    ))}
  </div>
)

export const CustomTrigger: Story = (args) => (
  <Menu.Root {...args}>
    <Menu.Trigger
      render={({ open }) => (
        <Button variant="ghost">{open ? 'Close menu' : 'Open menu'}</Button>
      )}
    />
    <Menu.Content>
      <Menu.Item>First</Menu.Item>
      <Menu.Item>Second</Menu.Item>
    </Menu.Content>
  </Menu.Root>
)
