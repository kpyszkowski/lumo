import type { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
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

export const RangeWithInputs: StoryFn<typeof Slider.Root> = (args) => {
  const [value, setValue] = useState<[number, number]>([25, 75])

  return (
    <div className="flex flex-col gap-4">
      <Slider.Root
        {...args}
        value={value}
        onValueChange={(v) => setValue(v as [number, number])}
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
      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Min
          <input
            type="number"
            min={args.min}
            max={value[1]}
            step={args.step}
            value={value[0]}
            onChange={(e) => setValue([Number(e.target.value), value[1]])}
            className="rounded border px-2 py-1"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Max
          <input
            type="number"
            min={value[0]}
            max={args.max}
            step={args.step}
            value={value[1]}
            onChange={(e) => setValue([value[0], Number(e.target.value)])}
            className="rounded border px-2 py-1"
          />
        </label>
      </div>
    </div>
  )
}
