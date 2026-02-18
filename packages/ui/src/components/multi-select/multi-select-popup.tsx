'use client'
import { useMemo } from 'react'
import { Command as CommandPrimitive } from 'cmdk-base'
import { createStyles, type StylesProps } from '~/utils'
import { Popover, ScrollArea } from '~/components'
import { IconCheck, IconMinus, IconSearch } from '~/icons'
import { useMultiSelectRootContext } from '~/components/multi-select/multi-select-root'
import { type Popover as PopoverPrimitive } from '@base-ui/react/popover'

const commandRootStyles = createStyles({
  slots: {
    container: 'flex flex-col',
    inputWrapper:
      'border-muted dark:border-muted/25 flex items-center gap-3 border-b px-4 py-3',
    inputIcon: 'size-4',
    inputField: 'outline-none',
    group:
      '[&_[cmdk-group-heading]]:text-subtle mt-3 flex flex-col px-2 [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:px-1 [&_[cmdk-group-heading]]:text-sm',
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
    selectedLabel?: string
    itemsLabel?: string
  }

function MultiSelectPopup(props: MultiSelectPopupProps) {
  const {
    className,
    searchPlaceholder = 'Search...',
    selectedLabel = 'Selected',
    itemsLabel = 'Items',
    ...restProps
  } = props

  const { inputRef, search, onSearchChange, value, onValueChange, items } =
    useMultiSelectRootContext()

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
    <Popover.Content>
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

        <ScrollArea.Root className={styles.scrollArea()}>
          <ScrollArea.Viewport className={styles.scrollAreaViewport()}>
            <ScrollArea.Content
              className={styles.list()}
              render={<CommandPrimitive.List />}
            >
              {!search && valueToItems.length > 0 && (
                <CommandPrimitive.Group
                  className={styles.group()}
                  heading={selectedLabel}
                >
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
              )}

              <CommandPrimitive.Group
                className={styles.group()}
                heading={itemsLabel}
              >
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
              <ScrollArea.Thumb className={styles.scrollAreaThumb()} />
            </ScrollArea.Scrollbar>
          </ScrollArea.Viewport>
        </ScrollArea.Root>
      </CommandPrimitive>
    </Popover.Content>
  )
}

export { MultiSelectPopup, type MultiSelectPopupProps }
