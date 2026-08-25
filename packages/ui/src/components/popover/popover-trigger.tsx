'use client'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import {
  cloneElement,
  forwardRef,
  type ReactElement,
  type ReactNode,
} from 'react'
import { Button, type ButtonProps } from '~/components'

type PopoverTriggerProps = Omit<ButtonProps, 'render'> &
  Omit<PopoverPrimitive.Trigger.Props, 'render' | 'children'> & {
    children?: ReactNode
    render?: PopoverPrimitive.Trigger.Props['render']
  }

/**
 * Trigger element for a `Popover`. Renders as a `Button` by default.
 *
 * @example
 * ```tsx
 * // Default Button trigger
 * <Popover.Trigger variant="outline">Open popover</Popover.Trigger>
 *
 * // Custom trigger that reflects open state
 * <Popover.Trigger render={({ open }) => (
 *   <button aria-expanded={open}>Toggle</button>
 * )} />
 * ```
 */
const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  (props, ref) => {
    const {
      children,
      render,
      icon,
      variant,
      shape,
      inverted,
      iconPosition,
      size,
      contentAlignment,
      ...triggerProps
    } = props

    if (render === undefined) {
      return (
        <PopoverPrimitive.Trigger
          ref={ref}
          {...triggerProps}
          render={(triggerProps) => (
            <Button
              icon={icon}
              variant={variant}
              shape={shape}
              inverted={inverted}
              iconPosition={iconPosition}
              size={size}
              contentAlignment={contentAlignment}
              {...triggerProps}
            >
              {children}
            </Button>
          )}
        />
      )
    }

    return (
      <PopoverPrimitive.Trigger
        ref={ref}
        {...triggerProps}
        render={
          render
            ? (triggerProps, state) =>
                cloneElement(
                  (typeof render === 'function'
                    ? render(triggerProps, state)
                    : render) as ReactElement,
                  {
                    ...triggerProps,
                  },
                )
            : undefined
        }
      />
    )
  },
)

PopoverTrigger.displayName = 'PopoverTrigger'

export { PopoverTrigger, type PopoverTriggerProps }
