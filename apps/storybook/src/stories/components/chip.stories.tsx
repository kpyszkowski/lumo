import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Chip } from '@lumo/ui/components'

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Toyota',
  },
}

export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = {}

export const WithRemove: Story = {
  args: {
    onRemove: () => {},
  },
}
