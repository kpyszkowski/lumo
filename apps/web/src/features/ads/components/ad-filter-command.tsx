'use client'
import { Button, buttonStyles, Command, ScrollArea } from '@lumo/ui/components'
import {
  type Icon,
  IconMakes,
  IconModels,
  IconGenerations,
  IconSearch,
} from '@lumo/ui/icons'
import { createStyles, type StylesProps } from '@lumo/ui/utils'
import { useRef, useState } from 'react'

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
    commandWrapper: 'flex gap-6 overflow-hidden px-6',
    commandPageButtons: 'mb-6 flex w-64 flex-col gap-1',
    commandPageButton: 'data-[page-active=true]:bg-elevated-inv',
    commandItem: 'data-[selected=true]:bg-elevated-inv transition-none',
    commandList: 'flex w-full gap-6',
    commandScrollArea: 'grow',
    commandScrollAreaViewport: 'h-full pb-6',
    commandScrollAreaScrollbar: 'group -mr-6 px-2.5 pb-6',
    commandScrollAreaThumb:
      'bg-elevated-inv group-data-scrolling:bg-highlighted-inv transition-colors',
  },
})

const MOCK = [
  {
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
    icon: IconModels,
    label: 'Model pojazdu',
    data: [
      {
        label: 'Alafbetycznie',
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
    icon: IconGenerations,
    label: 'Generacja',
    data: [
      {
        label: 'Alafbetycznie',
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
]

type AdFilterCommandProps = StylesProps<typeof adFilterCommandStyles> & {
  className?: string
}

export default function AdFilterCommand(props: AdFilterCommandProps) {
  const { className, ...restProps } = props

  const [open, setOpen] = useState(false)
  const [activePage, setActivePage] = useState(0)

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
          // It forwards focus to input when it's blurred allowing user to type
          // anytime
          inputRef.current?.focus()

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

          <ScrollArea.Root className={styles.commandScrollArea()}>
            <ScrollArea.Viewport
              className={styles.commandScrollAreaViewport()}
              ref={scrollViewportRef}
            >
              <ScrollArea.Content>
                <Command.List
                  className={styles.commandList()}
                  key={MOCK[activePage!]?.label}
                >
                  {MOCK[activePage]?.data.map((group) => (
                    <Command.Group
                      heading={group.label}
                      key={group.label}
                    >
                      {group.data.map((item) => (
                        <CommandItem
                          className={styles.commandItem()}
                          key={item}
                          value={`${item}`}
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
                <ScrollArea.Thumb className={styles.commandScrollAreaThumb()} />
              </ScrollArea.Scrollbar>
            </ScrollArea.Viewport>
          </ScrollArea.Root>
        </div>
      </Command.Dialog>
    </>
  )
}
