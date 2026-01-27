'use client'
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from 'motion/react'
import {
  cloneElement,
  Fragment,
  type ReactElement,
  type ReactNode,
  useState,
} from 'react'
import { createStyles, type StylesProps } from '~/utils'

const tooltipStyles = createStyles({
  slots: {
    content:
      'bg-tertiary-inv text-primary-inv dark:bg-tertiary dark:text-primary max-w-xs',
    arrow:
      'fill-(--background-color-tertiary-inv) dark:fill-(--background-color-tertiary)',
  },
  variants: {
    size: {
      sm: {
        content: 'rounded-md px-3 py-1.5 text-sm',
        arrow: 'size-2',
      },
      md: {
        content: 'rounded-lg px-5 py-2.5 text-base',
        arrow: 'size-2.5',
      },
      lg: {
        content: 'rounded-xl px-6 py-3 text-lg',
        arrow: 'size-3',
      },
    },
    side: {
      top: { arrow: 'top-full rotate-180' },
      right: { arrow: 'right-full -rotate-90' },
      bottom: { arrow: 'bottom-full' },
      left: { arrow: 'left-full rotate-90' },
      'inline-start': { arrow: 'left-full rotate-90' },
      'inline-end': { arrow: 'right-full -rotate-90' },
    },
  },
  defaultVariants: {
    size: 'md',
    side: 'bottom',
  },
})

const popupVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1 },
}

const popupTransition: Transition = {
  type: 'spring',
  stiffness: 240,
  damping: 20,
}

type TooltipProps = TooltipPrimitive.Root.Props &
  Pick<TooltipPrimitive.Portal.Props, 'keepMounted'> &
  TooltipPrimitive.Positioner.Props &
  Omit<TooltipPrimitive.Trigger.Props, 'render'> &
  StylesProps<typeof tooltipStyles> & {
    children: ReactElement
    content: ReactNode
    contentClassName?: string
  }

function Tooltip(props: TooltipProps) {
  const {
    className,
    contentClassName,
    children,
    keepMounted,
    content,
    size,
    open: uncontrolledOpen,
    onOpenChange: uncontrolledOnOpenChange,
    defaultOpen = false,
    delay,
    ...restProps
  } = props

  const styles = tooltipStyles({ size })

  const [controlledOpen, controlledOnOpenChange] = useState(defaultOpen)

  const open = uncontrolledOpen ?? controlledOpen
  const onOpenChange = uncontrolledOnOpenChange ?? controlledOnOpenChange

  if (children.type === Fragment)
    throw new Error('Tooltip children cannot be a Fragment.')

  return (
    <TooltipPrimitive.Root
      onOpenChange={onOpenChange}
      open={open}
    >
      <TooltipPrimitive.Trigger
        className={className}
        delay={delay}
        // TODO: Fix missing props. This solution makes trigger props lost.
        render={(triggerProps) => cloneElement(children, triggerProps)}
      />

      <AnimatePresence initial={false}>
        {open && (
          <TooltipPrimitive.Portal keepMounted={keepMounted}>
            <TooltipPrimitive.Positioner
              sideOffset={8}
              {...restProps}
            >
              <TooltipPrimitive.Popup
                render={
                  <motion.div
                    animate="visible"
                    exit="hidden"
                    initial="hidden"
                    style={{
                      transformOrigin: 'var(--transform-origin)',
                    }}
                    transition={popupTransition}
                    variants={popupVariants}
                  />
                }
              >
                <div
                  className={styles.content({ className: contentClassName })}
                >
                  {content}
                </div>

                <TooltipPrimitive.Arrow
                  render={(props, state) => {
                    return (
                      <svg
                        aria-label="Tooltip arrow"
                        className={styles.arrow({ side: state.side })}
                        role="img"
                        viewBox="0 0 8 8"
                        {...props}
                      >
                        <path
                          // Path occupies only half of the viewbox for
                          // consistent rotation when changing sides
                          d="M0 8L8 8L4 4"
                        />
                      </svg>
                    )
                  }}
                />
              </TooltipPrimitive.Popup>
            </TooltipPrimitive.Positioner>
          </TooltipPrimitive.Portal>
        )}
      </AnimatePresence>
    </TooltipPrimitive.Root>
  )
}

export { Tooltip, type TooltipProps, tooltipStyles }
