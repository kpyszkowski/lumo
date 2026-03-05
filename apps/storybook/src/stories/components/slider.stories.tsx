import type { Meta, StoryFn } from '@storybook/react'
import { Slider } from '@lumo/ui/components'

const meta: Meta<typeof Slider.Root> = {
  title: 'Components/Slider',
  component: Slider.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      options: ['default'],
      control: { type: 'radio' },
    },
    size: {
      options: ['md'],
      control: { type: 'radio' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    min: {
      control: { type: 'number' },
    },
    max: {
      control: { type: 'number' },
    },
    step: {
      control: { type: 'number' },
    },
    defaultValue: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
  args: {
    variant: 'default',
    size: 'md',
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    defaultValue: 50,
  },
}

export default meta

export const Default: StoryFn<typeof Slider.Root> = (args) => (
  <Slider.Root {...args}>
    <Slider.Control>
      <Slider.Track>
        <Slider.Indicator />
        <Slider.Thumb aria-label="Value" />
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
)

export const Range: StoryFn<typeof Slider.Root> = (args) => (
  <Slider.Root
    {...args}
    defaultValue={[25, 75]}
  >
    <Slider.Control>
      <Slider.Track>
        <Slider.Indicator />
        <Slider.Thumb
          index={0}
          aria-label="Minimum value"
        />
        <Slider.Thumb
          index={1}
          aria-label="Maximum value"
        />
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
)

export const Disabled: StoryFn<typeof Slider.Root> = (args) => (
  <Slider.Root
    {...args}
    disabled
  >
    <Slider.Control>
      <Slider.Track>
        <Slider.Indicator />
        <Slider.Thumb
          index={0}
          aria-label="Minimum value"
        />
        <Slider.Thumb
          index={1}
          aria-label="Maximum value"
        />
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
)
