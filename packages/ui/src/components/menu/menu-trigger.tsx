'use client'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import {
  cloneElement,
  forwardRef,
  type ReactElement,
  type ReactNode,
} from 'react'
import { Button, type ButtonProps } from '~/components'
import {
  type MenuRootContextValue,
  useMenuRootContext,
} from '~/components/menu/menu-root'

type MenuTriggerProps = Omit<ButtonProps, 'render' | 'children'> &
  (
    | {
        /** Label rendered inside the default `Button`. */
        children: ReactNode
      }
    | {
        /**
         * Custom render function; receives the `MenuRoot` context (including `open` state).
         * Use this to render a non-Button trigger or to reflect open state in the trigger.
         */
        render: ((context: MenuRootContextValue) => ReactNode) | undefined
      }
  )

/**
 * Trigger element for a `Menu`. Renders as a `Button` by default.
 * Pass `render` to use a fully custom element; the function receives the menu context.
 *
 * @example
 * ```tsx
 * // Default Button trigger
 * <Menu.Trigger variant="ghost" icon={IconArrowsSort}>Sort</Menu.Trigger>
 *
 * // Custom trigger that reflects open state
 * <Menu.Trigger render={({ open }) => (
 *   <button aria-expanded={open}>Toggle</button>
 * )} />
 * ```
 */
const MenuTrigger = forwardRef<
  HTMLButtonElement,
  MenuTriggerProps
  // eslint-disable-next-line react-props/must-destructure-first
>((props, ref) => {
  const context = useMenuRootContext()

  if ('children' in props) {
    const { children, ...restPropsWithChildren } = props
    return (
      <MenuPrimitive.Trigger
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
    <MenuPrimitive.Trigger
      ref={ref}
      render={
        render
          ? (triggerProps) =>
              cloneElement(render(context) as ReactElement, {
                ...triggerProps,
                ...restPropsWithRenderFunction,
              })
          : undefined
      }
    />
  )
})

MenuTrigger.displayName = 'MenuTrigger'

export { MenuTrigger, type MenuTriggerProps }
