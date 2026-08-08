'use client'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { type ComponentProps } from 'react'
import { createStyles, type StylesProps } from '~/utils'

const menuSeparatorStyles = createStyles({
  slots: {
    container: 'bg-elevated-inv dark:bg-elevated my-1 h-px w-full',
  },
})

type MenuSeparatorProps = ComponentProps<typeof MenuPrimitive.Separator> &
  StylesProps<typeof menuSeparatorStyles> & {
    className?: string
  }

/**
 * Thin divider between groups of `Menu` items.
 *
 * @example
 * ```tsx
 * <Menu.Item>Rename</Menu.Item>
 * <Menu.Separator />
 * <Menu.Item>Delete</Menu.Item>
 * ```
 */
function MenuSeparator(props: MenuSeparatorProps) {
  const { className, ...restProps } = props

  const styles = menuSeparatorStyles()

  return (
    <MenuPrimitive.Separator
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { MenuSeparator, type MenuSeparatorProps, menuSeparatorStyles }
