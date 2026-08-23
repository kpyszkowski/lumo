'use client'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { createStyles, type StylesProps } from '~/utils'
import { IconCheck } from '~/icons'

const menuRadioItemStyles = createStyles({
  slots: {
    container: [
      'grid cursor-pointer grid-cols-[1rem_1fr] items-center gap-3 rounded-md px-3 py-2 outline-none select-none',
      'hover:bg-highlighted-inv dark:hover:bg-highlighted focus:bg-highlighted-inv dark:focus:bg-highlighted',
      'data-disabled:text-subtle-inv dark:data-disabled:text-subtle data-disabled:pointer-events-none',
    ],
    indicator: 'col-start-1 flex items-center justify-center',
    indicatorIcon: 'size-4',
    label: 'col-start-2',
  },
})

type MenuRadioItemProps = Omit<MenuPrimitive.RadioItem.Props, 'nativeButton'> &
  StylesProps<typeof menuRadioItemStyles> & {
    className?: string
    /** Value set on the parent `Menu.RadioGroup` when this item is selected. */
    value: string
    /** Whether clicking the item closes the menu (default `true`). */
    closeOnClick?: boolean
  }

/**
 * Single-choice option inside a `Menu.RadioGroup`. Shows a check indicator when selected
 * and closes the menu on click by default.
 *
 * @example
 * ```tsx
 * <Menu.RadioItem value="relevance">Relevance</Menu.RadioItem>
 * <Menu.RadioItem value="price-desc" closeOnClick={false}>Price: high to low</Menu.RadioItem>
 * ```
 */
function MenuRadioItem(props: MenuRadioItemProps) {
  const { className, closeOnClick = true, children, ...restProps } = props

  const styles = menuRadioItemStyles()

  return (
    <MenuPrimitive.RadioItem
      className={styles.container({ className })}
      closeOnClick={closeOnClick}
      {...restProps}
    >
      <MenuPrimitive.RadioItemIndicator className={styles.indicator()}>
        <IconCheck className={styles.indicatorIcon()} />
      </MenuPrimitive.RadioItemIndicator>
      <span className={styles.label()}>{children}</span>
    </MenuPrimitive.RadioItem>
  )
}

export { MenuRadioItem, type MenuRadioItemProps, menuRadioItemStyles }
