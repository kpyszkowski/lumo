import type { Meta, StoryFn } from 'storybook-react-rsbuild'
import { useState } from 'react'
import { Button, RangeSelect } from '@lumo/ui/components'
import { IconChevronDown } from '@lumo/ui/icons'
import { motion } from '@lumo/ui/motion'

const meta: Meta<typeof RangeSelect.Root> = {
  title: 'Components/RangeSelect',
  component: RangeSelect.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  args: {
    min: 0,
    max: 100,
    step: 1,
  },
}

export default meta

const sampleHistogram = [
  2, 4, 7, 12, 18, 28, 42, 55, 63, 58, 48, 35, 22, 14, 8, 5, 3, 2, 1, 1,
]

const MotionIconChevronDown = motion.create(IconChevronDown)

export const Default: StoryFn<typeof RangeSelect.Root> = (args) => {
  const [value, setValue] = useState<[number, number]>([20, 80])

  return (
    <RangeSelect.Root
      {...args}
      value={value}
      onValueChange={setValue}
    >
      <RangeSelect.Trigger
        render={({ value: rangeValue, min, max }, { open }) => (
          <Button variant="ghost">
            <div className="flex items-center gap-2">
              <span>
                {rangeValue[0] === min && rangeValue[1] === max
                  ? 'Range'
                  : `${rangeValue[0]}–${rangeValue[1]}`}
              </span>
              <MotionIconChevronDown
                className="size-4"
                animate={{ rotate: open ? 180 : 0 }}
              />
            </div>
          </Button>
        )}
      />
      <RangeSelect.Content histogramData={sampleHistogram} />
    </RangeSelect.Root>
  )
}

export const WithUnit: StoryFn<typeof RangeSelect.Root> = (args) => {
  const [value, setValue] = useState<[number, number]>([50_000, 300_000])

  return (
    <RangeSelect.Root
      {...args}
      min={0}
      max={500_000}
      step={1_000}
      value={value}
      onValueChange={setValue}
    >
      <RangeSelect.Trigger
        render={({ value: rangeValue, min, max }, { open }) => {
          const isActive = rangeValue[0] !== min || rangeValue[1] !== max
          return (
            <Button variant={isActive ? 'outline' : 'ghost'}>
              <div className="flex items-center gap-2">
                <span>
                  {isActive
                    ? `${(rangeValue[0] / 1000).toFixed(0)}k–${(rangeValue[1] / 1000).toFixed(0)}k zł`
                    : 'Price'}
                </span>
                <MotionIconChevronDown
                  className="size-4"
                  animate={{ rotate: open ? 180 : 0 }}
                />
              </div>
            </Button>
          )
        }}
      />
      <RangeSelect.Content
        histogramData={sampleHistogram}
        unit="zł"
        fromLabel="From"
        toLabel="To"
      />
    </RangeSelect.Root>
  )
}

export const Standalone: StoryFn<typeof RangeSelect.Root> = (args) => {
  const [value, setValue] = useState<[number, number]>([20, 80])

  return (
    <RangeSelect.Root
      {...args}
      value={value}
      onValueChange={setValue}
      standalone
    >
      <RangeSelect.Content
        histogramData={sampleHistogram}
        variant="default"
      />
    </RangeSelect.Root>
  )
}
