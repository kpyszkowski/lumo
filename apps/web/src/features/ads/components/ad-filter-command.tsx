'use client'
import {
  Button,
  buttonStyles,
  Command,
  Histogram,
  Input,
  ScrollArea,
  Slider,
} from '@lumo/ui/components'
import {
  type Icon,
  IconMakes,
  IconModels,
  IconGenerations,
  IconSearch,
  IconCarBodySuv,
  IconGasStation,
  IconManualGearbox,
  IconGauge,
  IconCalendarDot,
} from '@lumo/ui/icons'
import { createStyles, type StylesProps } from '@lumo/ui/utils'
import { useMemo, useRef, useState } from 'react'

type ListFilterPage = {
  type: 'list'
  icon: Icon
  label: string
  data: { label: string; data: string[] }[]
}

type RangeFilterPage = {
  type: 'range'
  icon: Icon
  label: string
  min: number
  max: number
  step: number
  unit: string
  histogramData: number[]
}

type FilterPage = ListFilterPage | RangeFilterPage

type CommandItemProps = {
  className?: string
  children: string
  value?: string
  icon?: Icon
}

function CommandItem(props: CommandItemProps) {
  const { className, children, value, icon: Icon } = props

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
        className,
      })}
    >
      <div className={styles.wrapper()}>
        {Icon && <Icon className={styles.icon()} />}
        <span className={styles.label()}>{children}</span>
      </div>
    </Command.Item>
  )
}

const adFilterCommandStyles = createStyles({
  slots: {
    triggerButton:
      'text-muted active:[&>div]:text-muted bg-elevated hover:bg-highlighted focus-visible::bg-highlighted mx-auto w-full max-w-lg [&>div]:justify-end',
    commandWrapper: 'flex overflow-hidden',
    commandPageButtons: 'mb-6 flex w-64 flex-col gap-1 px-4',
    commandPageButton: 'data-[page-active=true]:bg-elevated-inv',
    commandItem: 'data-[selected=true]:bg-elevated-inv transition-none',
    commandList: 'flex w-full gap-6 px-4',
    commandScrollAreaViewport: 'pb-6',
    commandScrollAreaScrollbar: 'pb-6',
    rangeContent: 'flex min-w-0 flex-1 flex-col gap-4 px-11 pt-2 pb-6',
    rangeInputRow: 'flex gap-3',
    rangeInputLabel: 'flex flex-1 flex-col gap-1',
    rangeInputLabelText: 'text-subtle text-xs font-medium',
    rangeInput:
      'bg-elevated border-subtle-inv text-main placeholder:text-muted focus:border-accent focus:ring-accent/20 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2',
  },
})

const MOCK: FilterPage[] = [
  {
    type: 'list',
    icon: IconMakes,
    label: 'Marka pojazdu',
    data: [
      {
        label: 'Popularne',
        data: ['Volkswagen', 'Toyota', 'Mercedes', 'BMW'],
      },
      {
        label: 'Pozostałe',
        data: [
          'Alfa Romeo',
          'Audi',
          'Chevrolet',
          'Citroen',
          'Dacia',
          'Fiat',
          'Ford',
          'Honda',
          'Hyundai',
          'Kia',
          'Mazda',
          'Nissan',
          'Opel',
          'Peugeot',
          'Renault',
          'Seat',
          'Skoda',
          'Subaru',
          'Suzuki',
          'Volvo',
        ],
      },
    ],
  },
  {
    type: 'list',
    icon: IconModels,
    label: 'Model pojazdu',
    data: [
      {
        label: 'Alfabetycznie',
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
      },
    ],
  },
  {
    type: 'list',
    icon: IconGenerations,
    label: 'Generacja',
    data: [
      {
        label: 'Alfabetycznie',
        data: [
          'E12 (1972 - 1981)',
          'E28 (1981 - 1988)',
          'E34 (1988 - 1996)',
          'E39 (1995 - 2003)',
          'E60/E61 (2003 - 2010)',
          'F10/F11/F07 (2010 - 2017)',
          'G30/G31 (2017 - 2023)',
          'G60/G61 (2023 - obecnie)',
        ],
      },
    ],
  },
  {
    type: 'list',
    icon: IconCarBodySuv,
    label: 'Typ nadwozia',
    data: [
      {
        label: 'Alfabetycznie',
        data: [
          'Coupe',
          'Hatchback',
          'Kabriolet',
          'Kombi',
          'Pickup',
          'Sedan',
          'SUV',
          'Van',
        ],
      },
    ],
  },
  {
    type: 'range',
    icon: IconGauge,
    label: 'Cena',
    min: 0,
    max: 500000,
    step: 1000,
    unit: 'zł',
    histogramData: [
      2, 5, 9, 16, 28, 42, 58, 70, 65, 55, 44, 35, 25, 17, 11, 7, 4, 2, 1, 1,
    ],
  },
  {
    type: 'range',
    icon: IconCalendarDot,
    label: 'Rok produkcji',
    min: 1990,
    max: 2026,
    step: 1,
    unit: '',
    histogramData: [
      1, 1, 2, 2, 3, 4, 5, 6, 7, 9, 11, 13, 16, 18, 21, 24, 28, 32, 36, 40,
    ],
  },
  {
    type: 'list',
    icon: IconGasStation,
    label: 'Rodzaj paliwa',
    data: [
      {
        label: 'Alfabetycznie',
        data: ['Benzyna', 'Diesel', 'LPG', 'Elektryczny', 'Hybryda'],
      },
    ],
  },
  {
    type: 'list',
    icon: IconManualGearbox,
    label: 'Skrzynia biegów',
    data: [
      {
        label: 'Alfabetycznie',
        data: ['Manualna', 'Automatyczna'],
      },
    ],
  },
  {
    type: 'range',
    icon: IconGauge,
    label: 'Przebieg',
    min: 0,
    max: 300000,
    step: 1000,
    unit: 'km',
    histogramData: [
      40, 36, 30, 24, 19, 15, 12, 9, 7, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1,
    ],
  },
]

type AdFilterCommandProps = StylesProps<typeof adFilterCommandStyles> & {
  className?: string
}

export default function AdFilterCommand(props: AdFilterCommandProps) {
  const { className, ...restProps } = props

  const [open, setOpen] = useState(false)
  const [activePage, setActivePage] = useState(0)

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])
  const [yearRange, setYearRange] = useState<[number, number]>([1990, 2026])
  const [mileageRange, setMileageRange] = useState<[number, number]>([
    0, 300000,
  ])

  const rangeStateByLabel = useMemo(
    () => ({
      Cena: { value: priceRange, onChange: setPriceRange },
      'Rok produkcji': { value: yearRange, onChange: setYearRange },
      Przebieg: { value: mileageRange, onChange: setMileageRange },
    }),
    [priceRange, yearRange, mileageRange],
  )

  const scrollViewportRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const styles = adFilterCommandStyles()

  const handlePageChange = (setValue: ((value: number) => number) | number) => {
    setActivePage(setValue)
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({ top: 0 })
    }
  }

  return (
    <>
      <Button
        variant="solid"
        onClick={() => setOpen(true)}
        icon={IconSearch}
        className={styles.triggerButton({ className })}
      >
        Marka, model, rok produkcji...
      </Button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        loop
        onKeyDown={(event) => {
          if ((event.target as HTMLElement).tagName !== 'INPUT') {
            inputRef.current?.focus()
          }

          if (event.key === 'Tab') {
            event.preventDefault()
            handlePageChange((previousIndex) => {
              const nextIndex = previousIndex + (event.shiftKey ? -1 : 1)
              return (nextIndex + MOCK.length) % MOCK.length
            })
          }
        }}
        {...restProps}
      >
        <Command.Input
          placeholder="Marka, model, generacja pojazdu..."
          ref={inputRef}
        />
        <div className={styles.commandWrapper()}>
          <div className={styles.commandPageButtons()}>
            {MOCK.map((tab, index) => (
              <Button
                className={styles.commandPageButton()}
                data-page-active={activePage === index}
                variant="ghost"
                inverted
                shape="rounded"
                contentAlignment="start"
                key={tab.label}
                icon={tab.icon}
                onClick={() => handlePageChange(index)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {(() => {
            const page = MOCK[activePage]
            if (!page) return null

            if (page.type === 'range') {
              const rangeState =
                rangeStateByLabel[page.label as keyof typeof rangeStateByLabel]
              if (!rangeState) return null
              const { value, onChange } = rangeState

              return (
                <div className={styles.rangeContent()}>
                  <Histogram
                    data={page.histogramData}
                    min={page.min}
                    max={page.max}
                    range={value}
                    size="md"
                    variant="inverted"
                  />
                  <Slider.Root
                    min={page.min}
                    max={page.max}
                    step={page.step}
                    value={value}
                    onValueChange={(v) => onChange(v as [number, number])}
                  >
                    <Slider.Control>
                      <Slider.Track>
                        <Slider.Indicator className="opacity-75" />
                        <Slider.Thumb
                          index={0}
                          aria-label="Wartość minimalna"
                        />
                        <Slider.Thumb
                          index={1}
                          aria-label="Wartość maksymalna"
                        />
                      </Slider.Track>
                    </Slider.Control>
                  </Slider.Root>
                  <div className={styles.rangeInputRow()}>
                    <label className={styles.rangeInputLabel()}>
                      <span className={styles.rangeInputLabelText()}>
                        Od{page.unit ? ` (${page.unit})` : ''}
                      </span>
                      <Input
                        type="number"
                        variant="inverted"
                        size="sm"
                        min={page.min}
                        max={value[1]}
                        step={page.step}
                        value={value[0]}
                        onChange={(e) =>
                          onChange([Number(e.target.value), value[1]])
                        }
                      />
                    </label>
                    <label className={styles.rangeInputLabel()}>
                      <span className={styles.rangeInputLabelText()}>
                        Do{page.unit ? ` (${page.unit})` : ''}
                      </span>
                      <Input
                        type="number"
                        variant="inverted"
                        size="sm"
                        min={value[0]}
                        max={page.max}
                        step={page.step}
                        value={value[1]}
                        onChange={(e) =>
                          onChange([value[0], Number(e.target.value)])
                        }
                      />
                    </label>
                  </div>
                </div>
              )
            }

            return (
              <ScrollArea.Root>
                <ScrollArea.Viewport
                  className={styles.commandScrollAreaViewport()}
                  ref={scrollViewportRef}
                >
                  <ScrollArea.Content>
                    <Command.List
                      className={styles.commandList()}
                      key={page.label}
                    >
                      {page.data.map((group) => (
                        <Command.Group
                          heading={group.label}
                          key={group.label}
                        >
                          {group.data.map((item) => (
                            <CommandItem
                              className={styles.commandItem()}
                              key={item}
                              value={item}
                            >
                              {item}
                            </CommandItem>
                          ))}
                        </Command.Group>
                      ))}
                    </Command.List>
                  </ScrollArea.Content>

                  <ScrollArea.Scrollbar
                    orientation="vertical"
                    className={styles.commandScrollAreaScrollbar()}
                  >
                    <ScrollArea.Thumb />
                  </ScrollArea.Scrollbar>
                </ScrollArea.Viewport>
              </ScrollArea.Root>
            )
          })()}
        </div>
      </Command.Dialog>
    </>
  )
}
