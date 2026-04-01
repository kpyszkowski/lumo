'use client'
import { type ReactElement } from 'react'
import { Popover } from '~/components'
import type { PopoverTriggerProps } from '~/components/popover/popover-trigger'
import {
  type RangeSelectRootContextValue,
  useRangeSelectRootContext,
} from '~/components/range-select/range-select-root'
import type { PopoverRootContextValue } from '~/components/popover/popover-root'

type RangeSelectTriggerProps = Omit<PopoverTriggerProps, 'render'> & {
  /**
   * Custom render function; receives the `RangeSelect` context (with `value`, `min`, `max`, `step`)
   * and the `Popover` context. Use to build a trigger that reflects the current range value.
   */
  render?:
    | ((
        rangeSelectContext: RangeSelectRootContextValue,
        popoverContext: PopoverRootContextValue,
      ) => ReactElement)
    | undefined
}

/**
 * Trigger for `RangeSelect`. Extends `Popover.Trigger` with access to the `RangeSelect` context
 * via `render`, enabling the trigger to display the current selected range.
 *
 * @example
 * ```tsx
 * // Default Button trigger
 * <RangeSelect.Trigger>Price</RangeSelect.Trigger>
 *
 * // Custom trigger showing the active range
 * <RangeSelect.Trigger
 *   render={({ value }, { open }) => (
 *     <button aria-expanded={open}>
 *       {value[0]}–{value[1]}
 *     </button>
 *   )}
 * />
 * ```
 */
function RangeSelectTrigger(props: RangeSelectTriggerProps) {
  const { render, ...restProps } = props

  const context = useRangeSelectRootContext()

  if (context.standalone)
    throw new Error(
      '`RangeSelect.Trigger` cannot be used when `standalone` is true on `RangeSelect.Root`',
    )

  return (
    <Popover.Trigger
      render={
        render ? (popoverContext) => render(context, popoverContext) : undefined
      }
      {...restProps}
    />
  )
}

export { RangeSelectTrigger, type RangeSelectTriggerProps }
