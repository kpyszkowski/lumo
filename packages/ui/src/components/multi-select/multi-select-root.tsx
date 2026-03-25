'use client'
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Popover } from '~/components'

type MultiSelectRootProps = Pick<
  Popover.RootProps,
  'defaultOpen' | 'open' | 'onOpenChange'
> & {
  className?: string
  /** Controlled array of selected item values. */
  value?: string[]
  /** Callback fired when the selection changes. */
  onValueChange?: Dispatch<SetStateAction<string[]>>
  /** Uncontrolled initial selection (default `[]`). */
  defaultValue?: string[]
  /** Full list of available options as `{ value, label }` pairs. */
  items: { value: string; label: string }[]
  children: ReactNode
  /** Controlled open state of the dropdown. */
  open?: boolean
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean
  /** Callback fired when the dropdown opens or closes. */
  onOpenChange?: (open: boolean) => void
}

type MultiSelectRootContextValue = {
  inputRef: RefObject<HTMLInputElement | null>
  search: string
  onSearchChange: Dispatch<SetStateAction<string>>
  value: NonNullable<MultiSelectRootProps['value']>
  onValueChange: NonNullable<MultiSelectRootProps['onValueChange']>
  items: NonNullable<MultiSelectRootProps['items']>
}

const MultiSelectRootContext =
  createContext<MultiSelectRootContextValue | null>(null)

/**
 * Hook to access the `MultiSelectRoot` context.
 * @returns The `MultiSelectRoot` context value.
 * @throws If used outside a `MultiSelectRoot`.
 */
const useMultiSelectRootContext = () => {
  const context = useContext(MultiSelectRootContext)
  if (!context) {
    throw new Error(
      'useMultiSelectRootContext must be used within a MultiSelectRoot',
    )
  }
  return useMemo(() => context, [context])
}

/**
 * Root of the `MultiSelect` compound component. Manages selection state, search input ref,
 * and wraps `Popover.Root` for dropdown positioning.
 *
 * @example
 * ```tsx
 * const items = [
 *   { value: 'react', label: 'React' },
 *   { value: 'vue', label: 'Vue' },
 *   { value: 'svelte', label: 'Svelte' },
 * ]
 *
 * <MultiSelect.Root items={items}>
 *   <MultiSelect.Trigger>Select frameworks</MultiSelect.Trigger>
 *   <MultiSelect.Popup />
 * </MultiSelect.Root>
 * ```
 */
function MultiSelectRoot(props: MultiSelectRootProps) {
  const {
    value: controlledValue,
    onValueChange: controlledOnValueChange,
    defaultValue = [],
    items,
    ...restProps
  } = props

  const [_value, _onValueChange] = useState<string[]>(defaultValue)
  const [search, onSearchChange] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  const value = controlledValue !== undefined ? controlledValue : _value
  const onValueChange =
    controlledOnValueChange !== undefined
      ? controlledOnValueChange
      : _onValueChange

  return (
    <MultiSelectRootContext.Provider
      value={{
        inputRef,
        value,
        onValueChange,
        search,
        onSearchChange,
        items,
      }}
    >
      <Popover.Root {...restProps} />
    </MultiSelectRootContext.Provider>
  )
}

export {
  MultiSelectRoot,
  type MultiSelectRootProps,
  useMultiSelectRootContext,
  type MultiSelectRootContextValue,
}
