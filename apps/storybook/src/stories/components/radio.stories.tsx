import type { Meta, StoryFn, StoryObj } from 'storybook-react-rsbuild'

import { Radio } from '@lumo/ui/components'

const meta: Meta<typeof Radio.Button> = {
  title: 'Components/Radio',
  component: Radio.Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'underline',
  },
}

export default meta
type Story = StoryObj<typeof Radio.Button> | StoryFn<typeof Radio.Button>

export const Default: Story = {
  argTypes: {
    children: { control: 'text' },
  },
  args: {
    children: 'Promoted',
  },
}

export const InGroup: Story = (args) => (
  <Radio.Group
    variant={args.variant}
    aria-labelledby="radiogroup-label"
    defaultValue="advert:promoted"
  >
    <div
      id="radiogroup-label"
      className="sr-only"
    >
      Advert type
    </div>

    <Radio.Button
      {...args}
      value="advert:promoted"
    >
      Promoted
    </Radio.Button>
    <Radio.Button
      {...args}
      value="advert:newest"
    >
      Newest
    </Radio.Button>
    <Radio.Button
      {...args}
      value="advert:popular"
    >
      Most popular
    </Radio.Button>
  </Radio.Group>
)
