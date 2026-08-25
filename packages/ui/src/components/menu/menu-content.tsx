'use client'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { createStyles, type StylesProps } from '~/utils'
import { AnimatePresence, motion } from '~/motion'
import { useMenuRootContext } from '~/components/menu/menu-root'

const MotionMenuPopup = motion.create(MenuPrimitive.Popup)

const menuContentStyles = createStyles({
  slots: {
    positioner: 'outline-none',
    container:
      'bg-main-inv/96 text-main-inv dark:bg-elevated/96 dark:text-main flex min-w-48 flex-col gap-0.5 overflow-hidden rounded-xl p-1.5 backdrop-blur-sm outline-none dark:backdrop-contrast-75',
  },
})

type MenuContentProps = StylesProps<typeof menuContentStyles> &
  Omit<MenuPrimitive.Positioner.Props, 'keepMounted'> & {
    className?: string
    /** Preferred side of the trigger to position the popup. */
    side?: 'top' | 'bottom' | 'left' | 'right'
    /** Alignment along the cross axis relative to the trigger. */
    align?: 'start' | 'center' | 'end'
    /** Distance in px between the trigger and the popup (default `8`). */
    sideOffset?: number
  }

/**
 * Animated popup panel for a `Menu`. Renders inside a portal, positioned relative to
 * `Menu.Trigger`. Mounts/unmounts with a spring scale + opacity transition.
 *
 * @example
 * ```tsx
 * <Menu.Content align="end">
 *   <Menu.Item>Duplicate</Menu.Item>
 *   <Menu.Separator />
 *   <Menu.Item>Delete</Menu.Item>
 * </Menu.Content>
 *
 * <Menu.Content side="top" sideOffset={12}>
 *   <Menu.RadioGroup defaultValue="newest">
 *     <Menu.RadioItem value="newest">Newest first</Menu.RadioItem>
 *   </Menu.RadioGroup>
 * </Menu.Content>
 * ```
 */
function MenuContent(props: MenuContentProps) {
  const {
    className,
    align = 'start',
    side = 'bottom',
    sideOffset = 8,
    children,
    ...restProps
  } = props

  const { open } = useMenuRootContext()

  const styles = menuContentStyles()

  return (
    <MenuPrimitive.Portal keepMounted>
      <MenuPrimitive.Positioner
        className={styles.positioner()}
        align={align}
        side={side}
        sideOffset={sideOffset}
        {...restProps}
      >
        <AnimatePresence>
          {open && (
            <MotionMenuPopup
              className={styles.container({ className })}
              style={{ transformOrigin: 'var(--transform-origin)' }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 16,
                mass: 0.8,
                opacity: {
                  type: 'tween',
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.04,
                },
              }}
            >
              {children}
            </MotionMenuPopup>
          )}
        </AnimatePresence>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

export { MenuContent, type MenuContentProps, menuContentStyles }
