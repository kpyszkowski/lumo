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
        children: ReactNode
      }
    | {
        render: (context: PopoverRootContextValue) => ReactNode
      }
  )

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
      render={(triggerProps) =>
        cloneElement(render(context) as ReactElement, {
          ...restPropsWithRenderFunction,
          ...triggerProps,
        })
      }
    />
  )
})

PopoverTrigger.displayName = 'PopoverTrigger'

export { PopoverTrigger, type PopoverTriggerProps }
