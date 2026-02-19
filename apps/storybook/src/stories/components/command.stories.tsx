import type { Meta, StoryFn } from '@storybook/react'

import { Button, buttonStyles, Command, ScrollArea } from '@lumo/ui/components'
import { type Icon, IconHeart } from '@lumo/ui/icons'
import { useState } from 'react'

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

const popularBrands = {
  heading: 'Popularne',
  data: ['OMODA', 'Jaecoo', 'BYD'],
}

const alphabeticalBrands = {
  heading: 'Alfabetyczne',
  data: [
    'Audi',
    'BMW',
    'Chevrolet',
    'Dacia',
    'Fiat',
    'Ford',
    'Honda',
    'Hyundai',
    'Kia',
    'Mazda',
    'Mercedes-Benz',
    'Nissan',
    'Opel',
    'Peugeot',
    'Renault',
    'Seat',
    'Skoda',
    'Suzuki',
    'Toyota',
    'Volkswagen',
    'Volvo',
  ],
}

const exampleBMWModels = {
  heading: 'Alfabetyczne',
  data: [
    'Seria 3',
    'Seria 4',
    'Seria 5',
    'M2',
    'M3',
    'M4',
    'M5',
    'X1',
    'X3',
    'X5',
    'i3',
    'i4',
    'iX',
  ],
}

const exampleBMW5SeriesGenerations = {
  heading: 'Alfabetyczne',
  data: [
    'E12 (1972–1981)',
    'E28 (1981–1988)',
    'E34 (1988–1996)',
    'E39 (1995–2003)',
    'E60/E61 (2003–2010)',
    'F10/F11/F07 (2010–2017)',
    'G30/G31 (2017–present)',
  ],
}

const tabs = [
  { label: 'Marka pojazdu', data: [popularBrands, alphabeticalBrands] },
  { label: 'Model pojazdu', data: [exampleBMWModels] },
  { label: 'Generacja pojazdu', data: [exampleBMW5SeriesGenerations] },
]

const CommandItem = ({
  children,
  value,
  icon: Icon,
}: {
  children: string
  value?: string
  icon?: Icon
}) => {
  const styles = buttonStyles({
    variant: 'ghost',
    shape: 'rounded',
    inverted: true,
    contentAlignment: 'start',
  })

  return (
    //@ts-expect-error `children` prop are `string` type but `ReactNode` is fine
    <Command.Item
      value={value}
      className={styles.container({
        className: 'data-[selected=true]:bg-elevated-inv transition-none',
      })}
    >
      <div className={styles.wrapper()}>
        {Icon && <Icon className={styles.icon()} />}
        <span className={styles.label()}>{children}</span>
      </div>
    </Command.Item>
  )
}

export const Default: Story = (args) => (
  <Command.Root {...args}>
    <Command.Input placeholder="Type a command or search..." />
    <Command.List className="px-6">
      <Command.Group heading="Fruits">
        <CommandItem icon={IconHeart}>Apple</CommandItem>
        <CommandItem icon={IconHeart}>Banana</CommandItem>
        <CommandItem icon={IconHeart}>Cherry</CommandItem>
      </Command.Group>

      <Command.Group heading="Vegetables">
        <CommandItem icon={IconHeart}>Carrot</CommandItem>
        <CommandItem icon={IconHeart}>Lettuce</CommandItem>
        <CommandItem icon={IconHeart}>Spinach</CommandItem>
      </Command.Group>
    </Command.List>
  </Command.Root>
)

export const AsDialog: Story = (args) => {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open command</Button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        loop
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault()
            setActiveTab((prev) => {
              const nextIndex = prev + (e.shiftKey ? -1 : 1)
              return (nextIndex + tabs.length) % tabs.length
            })
          }
        }}
        {...args}
      >
        <Command.Input placeholder="Marka, model, generacja pojazdu..." />
        <div className="flex overflow-hidden">
          <div className="flex flex-col gap-1 px-2">
            {tabs.map((tab, index) => (
              <Button
                className={index === activeTab ? 'bg-elevated-inv' : ''}
                key={tab.label}
                onClick={() => setActiveTab?.(index)}
                variant="ghost"
                inverted
                contentAlignment="start"
                shape="rounded"
                icon={IconHeart}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <ScrollArea.Root>
            <ScrollArea.Viewport>
              <ScrollArea.Content className="mb-6 px-4">
                <Command.List
                  className="flex w-full gap-6"
                  key={tabs[activeTab!]?.label}
                >
                  {tabs[activeTab]?.data.map((group) => (
                    <Command.Group
                      heading={group.heading}
                      key={group.heading}
                    >
                      {group.data.map((item) => (
                        <CommandItem key={item}>{item}</CommandItem>
                      ))}
                    </Command.Group>
                  ))}
                </Command.List>
              </ScrollArea.Content>

              <ScrollArea.Scrollbar orientation="vertical">
                <ScrollArea.Thumb />
              </ScrollArea.Scrollbar>
            </ScrollArea.Viewport>
          </ScrollArea.Root>
        </div>
      </Command.Dialog>
    </>
  )
}
