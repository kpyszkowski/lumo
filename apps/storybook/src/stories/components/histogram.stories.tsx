import { useMemo, useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import { Histogram, Slider } from '@lumo/ui/components'

const SAMPLE_DATA = [
  3, 6, 8, 14, 22, 34, 51, 68, 72, 65, 58, 70, 82, 75, 60, 45, 32, 20, 12, 7, 4,
]

const meta: Meta<typeof Histogram> = {
  title: 'Components/Histogram',
  component: Histogram,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-72">
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
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
  },
  args: {
    variant: 'default',
    size: 'md',
    data: SAMPLE_DATA,
    min: 0,
    max: 100,
  },
}

export default meta

export const Default: StoryFn<typeof Histogram> = (args) => (
  <Histogram {...args} />
)

export const WithRange: StoryFn<typeof Histogram> = (args) => (
  <Histogram
    {...args}
    range={[20, 80]}
  />
)

export const WithRangeSlider: StoryFn<typeof Histogram> = (args) => {
  const [value, setValue] = useState<[number, number]>([20, 80])

  const range = useMemo<[number, number]>(() => {
    return value
  }, [value])

  return (
    <div className="flex flex-col gap-1">
      <Histogram
        {...args}
        range={range}
      />
      <Slider.Root
        min={args.min}
        max={args.max}
        value={value}
        onValueChange={(v) => setValue(v as typeof value)}
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
    </div>
  )
}
