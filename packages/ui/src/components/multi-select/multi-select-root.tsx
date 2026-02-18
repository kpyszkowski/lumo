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
  value?: string[]
  onValueChange?: Dispatch<SetStateAction<string[]>>
  defaultValue?: string[]
  items: { value: string; label: string }[]
  children: ReactNode
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
 * Hook to access the ToggleGroup context
 * @returns The ToggleGroup context
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
