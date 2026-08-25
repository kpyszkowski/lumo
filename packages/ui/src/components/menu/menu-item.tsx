'use client'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { createStyles, type StylesProps } from '~/utils'
import { type Icon } from '~/icons'

const menuItemStyles = createStyles({
  slots: {
    container: [
      'flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2 text-sm/none outline-none',
      'hover:bg-highlighted-inv dark:hover:bg-highlighted focus:bg-highlighted-inv dark:focus:bg-highlighted',
      'data-disabled:text-subtle-inv dark:data-disabled:text-subtle data-disabled:pointer-events-none',
    ],
    icon: 'size-4 shrink-0',
  },
})

type MenuItemProps = Omit<MenuPrimitive.Item.Props, 'nativeButton'> &
  StylesProps<typeof menuItemStyles> & {
    className?: string
    /** Tabler icon component rendered before the label. */
    icon?: Icon
    /** Whether clicking the item closes the menu (default `true`). */
    closeOnClick?: boolean
  }

/**
 * Interactive item in a `Menu`. Use for actions; for single-choice options use
 * `Menu.RadioItem` inside a `Menu.RadioGroup`.
 *
 * @example
 * ```tsx
 * <Menu.Item onClick={onDuplicate}>Duplicate</Menu.Item>
 * <Menu.Item icon={IconTrash} onClick={onDelete}>Delete</Menu.Item>
 * ```
 */
function MenuItem(props: MenuItemProps) {
  const { className, icon: IconComponent, children, ...restProps } = props

  const styles = menuItemStyles()

  return (
    <MenuPrimitive.Item
      className={styles.container({ className })}
      {...restProps}
    >
      {IconComponent && <IconComponent className={styles.icon()} />}
      {children}
    </MenuPrimitive.Item>
  )
}

export { MenuItem, type MenuItemProps, menuItemStyles }
