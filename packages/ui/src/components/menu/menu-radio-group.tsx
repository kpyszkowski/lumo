'use client'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { createStyles, type StylesProps } from '~/utils'

const menuRadioGroupStyles = createStyles({
  slots: {
    container: 'flex flex-col gap-0.5',
  },
})

type MenuRadioGroupProps = MenuPrimitive.RadioGroup.Props &
  StylesProps<typeof menuRadioGroupStyles> & {
    className?: string
    /** Controlled value of the currently selected `Menu.RadioItem`. */
    value?: string
    /** Uncontrolled initial selected value. */
    defaultValue?: string
    /** Callback fired when the selected value changes. */
    onValueChange?: (value: string) => void
  }

/**
 * Groups `Menu.RadioItem` children into a single-choice set — only one item can be
 * selected at a time. Controlled via `value` / `onValueChange`, uncontrolled via `defaultValue`.
 *
 * @example
 * ```tsx
 * <Menu.RadioGroup value={sort} onValueChange={setSort}>
 *   <Menu.RadioItem value="relevance">Relevance</Menu.RadioItem>
 *   <Menu.RadioItem value="price-asc">Price: low to high</Menu.RadioItem>
 * </Menu.RadioGroup>
 *
 * <Menu.RadioGroup defaultValue="newest">
 *   <Menu.RadioItem value="newest">Newest first</Menu.RadioItem>
 * </Menu.RadioGroup>
 * ```
 */
function MenuRadioGroup(props: MenuRadioGroupProps) {
  const { className, ...restProps } = props

  const styles = menuRadioGroupStyles()

  return (
    <MenuPrimitive.RadioGroup
      className={styles.container({ className })}
      // `Menu.GroupLabel` reads the group context, which `MenuPrimitive.RadioGroup`
      // does not provide on its own — compose it with `MenuPrimitive.Group`.
      render={<MenuPrimitive.Group />}
      {...restProps}
    />
  )
}

export { MenuRadioGroup, type MenuRadioGroupProps, menuRadioGroupStyles }
