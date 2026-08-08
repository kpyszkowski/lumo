'use client'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react'

type MenuRootProps = Pick<
  MenuPrimitive.Root.Props,
  | 'defaultOpen'
  | 'open'
  | 'onOpenChange'
  | 'modal'
  | 'orientation'
  | 'disabled'
  | 'loopFocus'
> & {
  children: ReactNode
  /** Controlled open state. */
  open?: boolean
  /** Uncontrolled initial open state (default `false`). */
  defaultOpen?: boolean
  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void
  /**
   * Whether the menu traps interaction while open — locks page scroll and
   * disables pointer events outside (default `false`).
   */
  modal?: boolean
}

type MenuRootContextValue = {
  open: NonNullable<MenuRootProps['open']>
  onOpenChange: NonNullable<MenuRootProps['onOpenChange']>
}

const MenuRootContext = createContext<MenuRootContextValue | null>(null)

/**
 * Hook to access the `MenuRoot` context
 * @returns The `MenuRoot` context
 */
const useMenuRootContext = () => {
  const context = useContext(MenuRootContext)
  if (!context) {
    throw new Error('useMenuRootContext must be used within a MenuRoot')
  }
  return useMemo(() => context, [context])
}

/**
 * Root of the `Menu` compound component. Manages open state and exposes it via context
 * to `Menu.Trigger` and `Menu.Content`. Renders no DOM element of its own.
 *
 * @example
 * ```tsx
 * <Menu.Root>
 *   <Menu.Trigger>Actions</Menu.Trigger>
 *   <Menu.Content>
 *     <Menu.Item>Duplicate</Menu.Item>
 *     <Menu.Item>Delete</Menu.Item>
 *   </Menu.Content>
 * </Menu.Root>
 *
 * // Single-choice menu (sorting, view mode, …)
 * <Menu.Root>
 *   <Menu.Trigger icon={IconArrowsSort}>Sort</Menu.Trigger>
 *   <Menu.Content align="end">
 *     <Menu.RadioGroup value={sort} onValueChange={setSort}>
 *       <Menu.RadioItem value="relevance">Relevance</Menu.RadioItem>
 *       <Menu.RadioItem value="price-asc">Price: low to high</Menu.RadioItem>
 *     </Menu.RadioGroup>
 *   </Menu.Content>
 * </Menu.Root>
 * ```
 */
function MenuRoot(props: MenuRootProps) {
  const {
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    defaultOpen = false,
    modal = false,
    ...restProps
  } = props

  const [_open, _onOpenChange] = useState(defaultOpen)

  const open = controlledOpen !== undefined ? controlledOpen : _open
  const onOpenChange =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : _onOpenChange

  return (
    <MenuRootContext.Provider
      value={{
        open,
        onOpenChange,
      }}
    >
      <MenuPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        defaultOpen={defaultOpen}
        modal={modal}
        {...restProps}
      />
    </MenuRootContext.Provider>
  )
}

export {
  MenuRoot,
  type MenuRootProps,
  useMenuRootContext,
  type MenuRootContextValue,
}
