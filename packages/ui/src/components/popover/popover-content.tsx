'use client'
import { createStyles, type StylesProps } from '~/utils'
import { AnimatePresence, motion } from '~/motion'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { usePopoverRootContext } from '~/components/popover/popover-root'

// The animation is ported from https://github.com/mui/base-ui/blob/v1.7.0/docs/src/app/(docs)/react/components/popover/demos/detached-triggers-full/tailwind/index.tsx
// Ideally it should be done entirely with `motion` library but I hit a ceiling and gave up.
// TODO: Cycle back and see if we can do it entirely with `motion` library.

const popoverContentStyles = createStyles({
  slots: {
    container: [
      'bg-main-inv/96 text-main-inv dark:bg-elevated/96 dark:text-main',
      'relative flex h-(--popup-height,auto) w-(--popup-width,auto) flex-col',
      'overflow-hidden rounded-xl',
      'backdrop-blur-sm dark:backdrop-contrast-75',
      'transition-[width,height] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]',
    ],
    positioner: [
      'h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)',
      'transition-[top,left,right,bottom,transform] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none',
    ],
    viewport: [
      'relative h-full w-full overflow-clip',
      '**:data-current:w-(--popup-width)',
      '**:data-current:translate-x-0',
      '**:data-current:opacity-100',
      '**:data-current:transition-[translate,opacity]',
      '**:data-current:duration-[350ms,175ms]',
      '**:data-current:ease-[cubic-bezier(0.22,1,0.36,1)]',
      "data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:-translate-x-1/2",
      "data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:opacity-0",
      "data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:translate-x-1/2",
      "data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:opacity-0",
      '**:data-previous:w-(--popup-width)',
      '**:data-previous:translate-x-0',
      '**:data-previous:opacity-100',
      '**:data-previous:transition-[translate,opacity]',
      '**:data-previous:duration-[350ms,175ms]',
      '**:data-previous:ease-[cubic-bezier(0.22,1,0.36,1)]',
      "data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:translate-x-1/2",
      "data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:opacity-0",
      "data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:-translate-x-1/2",
      "data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:opacity-0",
    ],
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

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={styles.positioner()}
        {...restProps}
      >
        <AnimatePresence>
          {open && (
            <PopoverPrimitive.Popup
              className={styles.container({ className })}
              style={{ transformOrigin: 'var(--transform-origin)' }}
              render={
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.92,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.92,
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
                />
              }
            >
              <PopoverPrimitive.Viewport className={styles.viewport()}>
                {children}
              </PopoverPrimitive.Viewport>
            </PopoverPrimitive.Popup>
          )}
        </AnimatePresence>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

export { PopoverContent, type PopoverContentProps, popoverContentStyles }
