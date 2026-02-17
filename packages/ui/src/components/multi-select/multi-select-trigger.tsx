'use client'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { cloneElement, type ReactElement, type ReactNode } from 'react'
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

// eslint-disable-next-line react-props/must-destructure-first
function MultiSelectTrigger(props: MultiSelectTriggerProps) {
  const context = useMultiSelectRootContext()

  if ('children' in props) {
    const { children, ...restPropsWithChildren } = props
    return (
      <PopoverPrimitive.Trigger
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
      render={(triggerProps) =>
        cloneElement(render(context) as ReactElement, {
          ...restPropsWithRenderFunction,
          ...triggerProps,
        })
      }
    />
  )
}

export { MultiSelectTrigger, type MultiSelectTriggerProps }
