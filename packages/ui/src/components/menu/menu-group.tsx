'use client'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { createStyles, type StylesProps } from '~/utils'

const menuGroupStyles = createStyles({
  slots: {
    container: 'flex flex-col gap-0.5',
  },
})

type MenuGroupProps = MenuPrimitive.Group.Props &
  StylesProps<typeof menuGroupStyles> & {
    className?: string
  }

/**
 * Groups related `Menu.Item` children under a shared `Menu.GroupLabel`.
 *
 * @example
 * ```tsx
 * <Menu.Group>
 *   <Menu.GroupLabel>Danger zone</Menu.GroupLabel>
 *   <Menu.Item>Delete</Menu.Item>
 * </Menu.Group>
 * ```
 */
function MenuGroup(props: MenuGroupProps) {
  const { className, ...restProps } = props

  const styles = menuGroupStyles()

  return (
    <MenuPrimitive.Group
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { MenuGroup, type MenuGroupProps, menuGroupStyles }
