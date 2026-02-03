import type { Meta, StoryFn } from '@storybook/react-vite'

import { ScrollArea } from '@lumo/ui/components'

const meta: Meta<typeof ScrollArea.Root> = {
  title: 'Components/ScrollArea',
  component: ScrollArea.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryFn<typeof ScrollArea.Root>

export const Default: Story = (args) => (
  <ScrollArea.Root {...args}>
    <ScrollArea.Viewport className="bg-main-inv text-main-inv max-h-48 w-sm rounded-xl p-6">
      <ScrollArea.Content>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam quo
        fuga, explicabo consectetur minima quia autem nesciunt alias atque
        quasi? Iste ipsam fuga doloremque maiores! Et, nisi. Ipsa, maiores
        quasi. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
        sequi labore, similique explicabo, adipisci, qui eum cum tempora
        pariatur sint maiores laboriosam illo dolore sit vero in eaque quaerat
        reiciendis! Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        Doloremque doloribus nemo ex reprehenderit quis hic sed animi
        voluptatibus at consequuntur, possimus, sapiente, commodi nostrum
        laudantium voluptates. Minima ex autem cumque?
      </ScrollArea.Content>
    </ScrollArea.Viewport>

    <ScrollArea.Scrollbar
      orientation="vertical"
      className="group px-1"
    >
      <ScrollArea.Thumb className="bg-elevated-inv group-data-scrolling:bg-highlighted-inv transition-colors" />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
)
