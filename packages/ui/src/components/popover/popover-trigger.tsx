'use client'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import {
  cloneElement,
  forwardRef,
  type ReactElement,
  type ReactNode,
} from 'react'
import { Button, type ButtonProps } from '~/components'
import {
  type PopoverRootContextValue,
  usePopoverRootContext,
} from '~/components/popover/popover-root'

type PopoverTriggerProps = Omit<ButtonProps, 'render' | 'children'> &
  (
    | {
        /** Label rendered inside the default `Button`. */
        children: ReactNode
      }
    | {
        /**
         * Custom render function; receives the `PopoverRoot` context (including `open` state).
         * Use this to render a non-Button trigger or to reflect open state in the trigger.
         */
        render: ((context: PopoverRootContextValue) => ReactNode) | undefined
      }
  )

/**
 * Trigger element for a `Popover`. Renders as a `Button` by default.
 * Pass `render` to use a fully custom element; the function receives the popover context.
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
const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
  // eslint-disable-next-line react-props/must-destructure-first
>((props, ref) => {
  const context = usePopoverRootContext()

  if ('children' in props) {
    const { children, ...restPropsWithChildren } = props
    return (
      <PopoverPrimitive.Trigger
        ref={ref}
        render={(triggerProps) => (
          <Button
            {...restPropsWithChildren}
            {...triggerProps}
          >
            {children as ButtonProps['children']}
          </Button>
        )}
      />
    )
  }

  const { render, ...restPropsWithRenderFunction } = props

  return (
    <PopoverPrimitive.Trigger
      ref={ref}
      render={
        render
          ? (triggerProps) =>
              cloneElement(render(context) as ReactElement, {
                ...triggerProps,
                ...restPropsWithRenderFunction,
              })
          : undefined
      }
    />
  )
})

PopoverTrigger.displayName = 'PopoverTrigger'

export { PopoverTrigger, type PopoverTriggerProps }
