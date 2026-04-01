import type { ComponentProps } from 'react'
import type { Meta, StoryFn } from 'storybook-react-rsbuild'

import { Button, Chip, MultiSelect } from '@lumo/ui/components'
import { type ButtonProps } from '@lumo/ui/components'
import { IconChevronDown } from '@lumo/ui/icons'
import { motion } from '@lumo/ui/motion'

const meta: Meta<
  ComponentProps<typeof MultiSelect.Root> & { variant: ButtonProps['variant'] }
> = {
  title: 'Components/MultiSelect',
  component: MultiSelect.Root,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['outline', 'ghost', 'solid'],
      control: { type: 'select' },
    },
  },
  args: {
    variant: 'solid',
  },
}

export default meta
type Story = StoryFn<
  ComponentProps<typeof MultiSelect.Root> & { variant: ButtonProps['variant'] }
>

const brands = [
  { label: 'Audi', value: 'audi' },
  { label: 'BMW', value: 'bmw' },
  { label: 'Chevrolet', value: 'chevrolet' },
  { label: 'Dacia', value: 'dacia' },
  { label: 'Fiat', value: 'fiat' },
  { label: 'Ford', value: 'ford' },
  { label: 'Honda', value: 'honda' },
  { label: 'Hyundai', value: 'hyundai' },
  { label: 'Kia', value: 'kia' },
  { label: 'Mazda', value: 'mazda' },
  { label: 'Mercedes-Benz', value: 'mercedes-benz' },
  { label: 'Nissan', value: 'nissan' },
  { label: 'Opel', value: 'opel' },
  { label: 'Peugeot', value: 'peugeot' },
  { label: 'Renault', value: 'renault' },
  { label: 'Seat', value: 'seat' },
  { label: 'Skoda', value: 'skoda' },
  { label: 'Suzuki', value: 'suzuki' },
  { label: 'Toyota', value: 'toyota' },
  { label: 'Volkswagen', value: 'volkswagen' },
  { label: 'Volvo', value: 'volvo' },
]

const MotionIconChevronDown = motion.create(IconChevronDown)

export const Default: Story = (args) => {
  const { variant, ...rootArgs } = args

  return (
    <MultiSelect.Root
      {...rootArgs}
      items={brands}
    >
      <MultiSelect.Trigger
        render={({ value, items }, { open }) => {
          const selectedItem =
            value.length === 1
              ? items.find((item) => item.value === value[0])
              : null

          return (
            <Button variant={variant}>
              <div className="flex items-center gap-2">
                <span>Marka pojazdu</span>
                {selectedItem ? (
                  <Chip label={selectedItem.label} />
                ) : value.length > 1 ? (
                  <Chip label={`${value.length}`} />
                ) : null}
                <MotionIconChevronDown
                  className="-mr-3 size-4"
                  animate={{
                    rotate: open ? 180 : 0,
                  }}
                />
              </div>
            </Button>
          )
        }}
      />

      <MultiSelect.Popup
        searchPlaceholder="Szukaj marek..."
        selectedLabel="Wybrane"
        itemsLabel="Alfabetycznie"
      />
    </MultiSelect.Root>
  )
}
