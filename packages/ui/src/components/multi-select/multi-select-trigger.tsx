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
  type MultiSelectRootContextValue,
  useMultiSelectRootContext,
} from '~/components/multi-select/multi-select-root'

type MultiSelectTriggerProps = Omit<ButtonProps, 'render' | 'children'> &
  (
    | {
        children: ReactNode
      }
    | {
        render: (context: MultiSelectRootContextValue) => ReactNode
      }
  )

const MultiSelectTrigger = forwardRef<
  HTMLButtonElement,
  MultiSelectTriggerProps
  // eslint-disable-next-line react-props/must-destructure-first
>((props, ref) => {
  const context = useMultiSelectRootContext()

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

MultiSelectTrigger.displayName = 'MultiSelectTrigger'

export { MultiSelectTrigger, type MultiSelectTriggerProps }
