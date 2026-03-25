'use client'
import { type ReactElement } from 'react'
import { Popover } from '~/components'
import {
  type MultiSelectRootContextValue,
  useMultiSelectRootContext,
} from '~/components/multi-select/multi-select-root'
import { type PopoverRootContextValue } from '~/components/popover/popover-root'

type MultiSelectTriggerProps = Omit<Popover.TriggerProps, 'render'> & {
  /**
   * Custom render function; receives the `MultiSelect` context (with `value`, `items`, etc.)
   * and the `Popover` context. Use to build a trigger that reflects the current selection.
   */
  render?:
    | ((
        multiSelectContext: MultiSelectRootContextValue,
        popoverContext: PopoverRootContextValue,
      ) => ReactElement)
    | undefined
}

/**
 * Trigger for `MultiSelect`. Extends `Popover.Trigger` with access to the `MultiSelect` context
 * via `render`, enabling the trigger to display selection state (count, labels, etc.).
 *
 * @example
 * ```tsx
 * // Default Button trigger
 * <MultiSelect.Trigger>Select items</MultiSelect.Trigger>
 *
 * // Custom trigger showing selection count
 * <MultiSelect.Trigger
 *   render={({ value }, { open }) => (
 *     <button aria-expanded={open}>
 *       {value.length ? `${value.length} selected` : 'Select items'}
 *     </button>
 *   )}
 * />
 * ```
 */
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
