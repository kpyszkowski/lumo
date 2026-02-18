'use client'
import { type ReactElement } from 'react'
import { Popover } from '~/components'
import {
  type MultiSelectRootContextValue,
  useMultiSelectRootContext,
} from '~/components/multi-select/multi-select-root'
import { type PopoverRootContextValue } from '~/components/popover/popover-root'

type MultiSelectTriggerProps = Omit<Popover.TriggerProps, 'render'> & {
  render?:
    | ((
        multiSelectContext: MultiSelectRootContextValue,
        popoverContext: PopoverRootContextValue,
      ) => ReactElement)
    | undefined
}

function MultiSelectTrigger(props: MultiSelectTriggerProps) {
  const { ref, render, ...restProps } = props

  const context = useMultiSelectRootContext()

  return (
    <Popover.Trigger
      ref={ref}
      render={
        render ? (popoverContext) => render(context, popoverContext) : undefined
      }
      {...restProps}
    />
  )
}

export { MultiSelectTrigger, type MultiSelectTriggerProps }
