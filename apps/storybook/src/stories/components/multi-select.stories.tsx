import type { Meta, StoryFn } from '@storybook/react-vite'

import { Button, MultiSelect } from '@lumo/ui/components'
import { IconChevronDown } from '@lumo/ui/icons'
import { motion } from '@lumo/ui/motion'

const meta: Meta<typeof MultiSelect.Root> = {
  title: 'Components/MultiSelect',
  component: MultiSelect.Root,
  tags: ['autodocs'],
}

export default meta
type Story = StoryFn<typeof MultiSelect.Root>

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

export const Default: Story = (args) => (
  <MultiSelect.Root
    {...args}
    items={brands}
  >
    <MultiSelect.Trigger
      render={({ value, open, items }) => {
        const selectedItem =
          value.length === 1
            ? items.find((item) => item.value === value[0])
            : null

        return (
          <Button variant="solid">
            <div className="flex items-center gap-3">
              Marka pojazdu
              {value.length > 0 && (
                <span className="bg-elevated-inv text-main-inv dark:text-main rounded-xl px-2 py-0.5 text-sm">
                  {selectedItem ? selectedItem.label : value.length}
                </span>
              )}
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
