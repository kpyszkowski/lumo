'use client'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { createStyles, type StylesProps } from '~/utils'

const menuGroupLabelStyles = createStyles({
  slots: {
    container: 'text-subtle select-none px-3 py-1.5 text-sm/none',
  },
})

type MenuGroupLabelProps = MenuPrimitive.GroupLabel.Props &
  StylesProps<typeof menuGroupLabelStyles> & {
    className?: string
  }

/**
 * Accessible heading for a `Menu.Group` or `Menu.RadioGroup`.
 *
 * @example
 * ```tsx
 * <Menu.RadioGroup value={sort} onValueChange={setSort}>
 *   <Menu.GroupLabel>Sort by</Menu.GroupLabel>
 *   <Menu.RadioItem value="newest">Newest first</Menu.RadioItem>
 * </Menu.RadioGroup>
 * ```
 */
function MenuGroupLabel(props: MenuGroupLabelProps) {
  const { className, ...restProps } = props

  const styles = menuGroupLabelStyles()

  return (
    <MenuPrimitive.GroupLabel
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { MenuGroupLabel, type MenuGroupLabelProps, menuGroupLabelStyles }
