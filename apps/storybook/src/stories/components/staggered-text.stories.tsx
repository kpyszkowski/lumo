import type { Meta, StoryObj } from '@storybook/react'

import { StaggeredText } from '@lumo/ui/components'

const meta: Meta<typeof StaggeredText> = {
  title: 'Components/StaggeredText',
  component: StaggeredText,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {},
  },
  argTypes: {
    delay: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
    },
    mode: {
      control: { type: 'radio' },
      options: ['character', 'word'],
    },
  },
  args: {
    className: 'text-4xl/[1.24] font-bold overflow-hidden',
    delay: 0.04,
    children: 'Staggered Text',
  },
}

export default meta
type Story = StoryObj<typeof StaggeredText>

export const Default: Story = {}

export const SlideUp: Story = {
  args: {
    character: {
      hidden: { y: '100%' },
      visible: {
        y: '0%',
        transition: { type: 'spring', stiffness: 180, damping: 24 },
      },
    },
  },
}

export const ReversedSlideUp: Story = {
  args: {
    delayOptions: {
      from: 'last',
    },
  },
}
