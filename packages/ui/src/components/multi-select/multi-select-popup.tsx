'use client'
import { useMemo } from 'react'
import { Command as CommandPrimitive } from 'cmdk-base'
import { createStyles, type StylesProps } from '~/utils'
import { ScrollArea } from '~/components'
import { IconCheck, IconMinus, IconSearch } from '~/icons'
import { useMultiSelectRootContext } from '~/components/multi-select/multi-select-root'
import { AnimatePresence, motion } from '~/motion'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'

const MotionRootPopup = motion.create(PopoverPrimitive.Popup)
const commandRootStyles = createStyles({
  slots: {
    container:
      'bg-main-inv/96 text-main-inv dark:bg-elevated/96 dark:text-main flex flex-col rounded-xl backdrop-blur-sm dark:backdrop-contrast-75',
    inputWrapper: 'flex items-center gap-3 px-4 py-3',
    inputIcon: 'size-4',
    inputField: 'outline-none',
    separator: 'border-muted dark:border-muted/25 border-t',
    group: 'flex flex-col px-2 py-2',
    item: [
      'group flex cursor-pointer items-center gap-3 rounded-md px-3 py-2',
      'hover:bg-elevated-inv dark:hover:bg-elevated focus:bg-elevated-inv dark:focus:bg-elevated data-[selected=true]:bg-highlighted-inv dark:data-[selected=true]:bg-highlighted',
    ],
    itemIcon:
      'text-muted-inv dark:text-muted bg-elevated-inv dark:bg-highlighted group-data-[selected=true]:dark:bg-elevated size-4 rounded-sm stroke-2 p-0.5 [transition-property:color] not-data-[checked=true]:text-transparent',
    list: 'gap-6',
    scrollArea: 'grow overflow-hidden',
    scrollAreaViewport: 'h-full max-h-96 min-w-64 pr-2',
    scrollAreaScrollbar: 'group p-1.5',
    scrollAreaThumb:
      'bg-elevated-inv group-data-scrolling:bg-highlighted-inv transition-colors',
  },
})

type MultiSelectPopupProps = StylesProps<typeof commandRootStyles> &
  Omit<PopoverPrimitive.Positioner.Props, 'keepMounted'> & {
    className?: string
    searchPlaceholder?: string
  }

function MultiSelectPopup(props: MultiSelectPopupProps) {
  const {
    className,
    align = 'start',
    sideOffset = 8,
    searchPlaceholder = 'Search...',
    ...restProps
  } = props

  const {
    inputRef,
    search,
    onSearchChange,
    value,
    onValueChange,
    items,
    open,
  } = useMultiSelectRootContext()

  const styles = commandRootStyles()

  const handleValueChange = (selectedValue: string) => {
    const normalizedValue = selectedValue.replace('-selected', '')

    onValueChange((previousValues) => {
      if (previousValues.includes(normalizedValue)) {
        return previousValues.filter((value) => value !== normalizedValue)
      }
      return [...previousValues, normalizedValue]
    })
  }

  const valueToItems = useMemo(
    () =>
      value
        ? value.map((value) => ({
            value: `${value}-selected`,
            label: items.find((item) => item.value === value)?.label || value,
          }))
        : [],
    [value, items],
  )

  return (
    <PopoverPrimitive.Portal keepMounted>
      <PopoverPrimitive.Positioner
        align={align}
        sideOffset={sideOffset}
        {...restProps}
      >
        <PopoverPrimitive.Viewport>
          <AnimatePresence>
            {open && (
              <MotionRootPopup
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ ease: 'easeOut' }}
              >
                <CommandPrimitive
                  className={styles.container({ className })}
                  onKeyDown={() => {
                    // It forwards focus to input when it's blurred allowing user to type
                    // anytime
                    inputRef.current?.focus()
                  }}
                  {...restProps}
                >
                  <div className={styles.inputWrapper()}>
                    <IconSearch className={styles.inputIcon()} />
                    <CommandPrimitive.Input
                      className={styles.inputField()}
                      placeholder={searchPlaceholder}
                      value={search}
                      onValueChange={onSearchChange}
                      ref={inputRef}
                    />
                  </div>

                  <CommandPrimitive.Separator className={styles.separator()} />

                  <ScrollArea.Root className={styles.scrollArea()}>
                    <ScrollArea.Viewport
                      className={styles.scrollAreaViewport()}
                    >
                      <ScrollArea.Content
                        className={styles.list()}
                        render={<CommandPrimitive.List />}
                      >
                        {!search && valueToItems.length > 0 && (
                          <>
                            <CommandPrimitive.Group className={styles.group()}>
                              {valueToItems.map((item) => (
                                <CommandPrimitive.Item
                                  className={styles.item()}
                                  key={item.value}
                                  value={item.value}
                                  onSelect={handleValueChange}
                                >
                                  <IconMinus
                                    className={styles.itemIcon()}
                                    data-checked
                                  />
                                  {item.label}
                                </CommandPrimitive.Item>
                              ))}
                            </CommandPrimitive.Group>

                            <CommandPrimitive.Separator
                              className={styles.separator()}
                            />
                          </>
                        )}

                        <CommandPrimitive.Group className={styles.group()}>
                          {items.map((item) => (
                            <CommandPrimitive.Item
                              className={styles.item()}
                              key={item.value}
                              value={item.value}
                              onSelect={handleValueChange}
                            >
                              <IconCheck
                                className={styles.itemIcon()}
                                data-checked={value.includes(item.value)}
                              />
                              {item.label}
                            </CommandPrimitive.Item>
                          ))}
                        </CommandPrimitive.Group>
                      </ScrollArea.Content>

                      <ScrollArea.Scrollbar
                        orientation="vertical"
                        className={styles.scrollAreaScrollbar()}
                      >
                        <ScrollArea.Thumb
                          className={styles.scrollAreaThumb()}
                        />
                      </ScrollArea.Scrollbar>
                    </ScrollArea.Viewport>
                  </ScrollArea.Root>
                </CommandPrimitive>
              </MotionRootPopup>
            )}
          </AnimatePresence>
        </PopoverPrimitive.Viewport>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

export { MultiSelectPopup, type MultiSelectPopupProps }
