'use client'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { Popover } from '~/components'
import type { PopoverRootProps } from '~/components/popover/popover-root'

type RangeSelectRootContextValue = {
  value: [number, number]
  onValueChange: (v: [number, number]) => void
  min: number
  max: number
  step: number
  standalone?: boolean
  onValueCommitted?: (v: [number, number]) => void
}

const RangeSelectRootContext =
  createContext<RangeSelectRootContextValue | null>(null)

/**
 * Hook to access the `RangeSelectRoot` context.
 * @returns The `RangeSelectRoot` context value.
 * @throws If used outside a `RangeSelectRoot`.
 */
const useRangeSelectRootContext = () => {
  const context = useContext(RangeSelectRootContext)
  if (!context) {
    throw new Error(
      'useRangeSelectRootContext must be used within a RangeSelectRoot',
    )
  }
  return useMemo(() => context, [context])
}

type RangeSelectRootProps = Pick<
  PopoverRootProps,
  'defaultOpen' | 'open' | 'onOpenChange'
> & {
  children: ReactNode
  /** Minimum value of the range (required). */
  min: number
  /** Maximum value of the range (required). */
  max: number
  /** Step increment for the slider and inputs (required). */
  step: number
  /** Controlled selected range `[min, max]`. */
  value?: [number, number]
  /** Uncontrolled initial range (defaults to `[min, max]`). */
  defaultValue?: [number, number]
  /** Callback fired when the range changes. */
  onValueChange?: (v: [number, number]) => void
  /** Callback fired when the range value is committed (e.g., on slider release). */
  onValueCommitted?: (v: [number, number]) => void
  /** If `true`, the component will not render a `Popover` and will instead render its children directly. Useful for embedding the range select content in a non-dropdown context. */
  standalone?: boolean
}

/**
 * Root of the `RangeSelect` compound component. Manages the `[min, max]` value state
 * and wraps `Popover.Root` for dropdown positioning.
 *
 * @example
 * ```tsx
 * <RangeSelect.Root min={0} max={100} step={1}>
 *   <RangeSelect.Trigger>Range</RangeSelect.Trigger>
 *   <RangeSelect.Content histogramData={data} />
 * </RangeSelect.Root>
 *
 * <RangeSelect.Root min={0} max={500000} step={1000} value={price} onValueChange={setPrice}>
 *   <RangeSelect.Trigger render={({ value, min, max }) => <button>{value[0]}–{value[1]}</button>} />
 *   <RangeSelect.Content histogramData={data} unit="zł" />
 * </RangeSelect.Root>
 * ```
 */
function RangeSelectRoot(props: RangeSelectRootProps) {
  const {
    value: controlledValue,
    defaultValue,
    onValueChange: controlledOnValueChange,
    onValueCommitted,
    min,
    max,
    step,
    open,
    defaultOpen,
    onOpenChange,
    children,
    standalone = false,
  } = props

  const [_value, _onValueChange] = useState<[number, number]>(
    defaultValue ?? [min, max],
  )

  const value = controlledValue !== undefined ? controlledValue : _value
  const onValueChange = useCallback(
    (v: [number, number]) => {
      if (controlledOnValueChange !== undefined) {
        controlledOnValueChange(v)
      } else {
        _onValueChange(v)
      }
    },
    [controlledOnValueChange],
  )

  return (
    <RangeSelectRootContext.Provider
      value={{
        value,
        onValueChange,
        min,
        max,
        step,
        standalone,
        onValueCommitted,
      }}
    >
      {standalone ? (
        children
      ) : (
        <Popover.Root
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
        >
          {children}
        </Popover.Root>
      )}
    </RangeSelectRootContext.Provider>
  )
}

export {
  RangeSelectRoot,
  type RangeSelectRootProps,
  useRangeSelectRootContext,
  type RangeSelectRootContextValue,
}
