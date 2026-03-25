'use client'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react'

type PopoverRootProps = Pick<
  PopoverPrimitive.Root.Props,
  'defaultOpen' | 'open' | 'onOpenChange'
> & {
  className?: string
  children: ReactNode
  /** Controlled open state. */
  open?: boolean
  /** Uncontrolled initial open state (default `false`). */
  defaultOpen?: boolean
  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void
}

type PopoverRootContextValue = {
  open: NonNullable<PopoverRootProps['open']>
  onOpenChange: NonNullable<PopoverRootProps['onOpenChange']>
}

const PopoverRootContext = createContext<PopoverRootContextValue | null>(null)

/**
 * Hook to access the `PopoverRoot` context
 * @returns The `PopoverRoot` context
 */
const usePopoverRootContext = () => {
  const context = useContext(PopoverRootContext)
  if (!context) {
    throw new Error('usePopoverRootContext must be used within a PopoverRoot')
  }
  return useMemo(() => context, [context])
}

/**
 * Root of the `Popover` compound component. Manages open state and exposes it via context
 * to `Popover.Trigger` and `Popover.Content`.
 *
 * @example
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger>Open</Popover.Trigger>
 *   <Popover.Content>
 *     <p>Popover body</p>
 *   </Popover.Content>
 * </Popover.Root>
 * ```
 */
function PopoverRoot(props: PopoverRootProps) {
  const {
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    defaultOpen = false,
    ...restProps
  } = props

  const [_open, _onOpenChange] = useState(defaultOpen)

  const open = controlledOpen !== undefined ? controlledOpen : _open
  const onOpenChange =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : _onOpenChange

  return (
    <PopoverRootContext.Provider
      value={{
        open,
        onOpenChange,
      }}
    >
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        defaultOpen={defaultOpen}
        {...restProps}
      />
    </PopoverRootContext.Provider>
  )
}

export {
  PopoverRoot,
  type PopoverRootProps,
  usePopoverRootContext,
  type PopoverRootContextValue,
}
