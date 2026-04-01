'use client'
import { createStyles, type StylesProps } from '~/utils'
import { usePopoverRootContext } from '~/components/popover/popover-root'
import { AnimatePresence, motion } from '~/motion'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'

const MotionRootPopup = motion.create(PopoverPrimitive.Popup)
const popoverContentStyles = createStyles({
  slots: {
    container:
      'bg-main-inv/96 text-main-inv dark:bg-elevated/96 dark:text-main flex flex-col overflow-hidden rounded-xl backdrop-blur-sm dark:backdrop-contrast-75',
  },
})

type PopoverContentProps = StylesProps<typeof popoverContentStyles> &
  Omit<PopoverPrimitive.Positioner.Props, 'keepMounted'> & {
    className?: string
    /** Preferred side of the trigger to position the popup. */
    side?: 'top' | 'bottom' | 'left' | 'right'
    /** Alignment along the cross axis relative to the trigger. */
    align?: 'start' | 'center' | 'end'
    /** Distance in px between the trigger and the popup (default `8`). */
    sideOffset?: number
  }

/**
 * Animated popup panel for a `Popover`. Renders inside a portal, positioned relative to
 * `Popover.Trigger`. Mounts/unmounts with a spring scale + opacity transition.
 *
 * @example
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger>Open</Popover.Trigger>
 *   <Popover.Content side="bottom" align="start">
 *     <p>Content goes here</p>
 *   </Popover.Content>
 * </Popover.Root>
 * ```
 */
function PopoverContent(props: PopoverContentProps) {
  const {
    className,
    align = 'start',
    side = 'bottom',
    sideOffset = 8,
    children,
    ...restProps
  } = props

  const { open } = usePopoverRootContext()

  const styles = popoverContentStyles()

  const sizeProperty = ['top', 'bottom'].includes(side) ? 'height' : 'width'

  return (
    <PopoverPrimitive.Portal keepMounted>
      <PopoverPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        {...restProps}
      >
        <PopoverPrimitive.Viewport>
          <AnimatePresence>
            {open && (
              <MotionRootPopup
                className={styles.container({ className })}
                style={{ transformOrigin: 'var(--transform-origin)' }}
                initial={{
                  opacity: 0,
                  scale: 0.92,
                  [sizeProperty]: `calc(var(--positioner-${sizeProperty}) * 0.96)`,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  [sizeProperty]: `var(--positioner-${sizeProperty})`,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.92,
                  [sizeProperty]: `calc(var(--positioner-${sizeProperty}) * 0.96)`,
                }}
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
              </MotionRootPopup>
            )}
          </AnimatePresence>
        </PopoverPrimitive.Viewport>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

export { PopoverContent, type PopoverContentProps, popoverContentStyles }
