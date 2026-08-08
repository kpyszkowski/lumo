'use client'
import { useRender } from '@lumo/ui/hooks'
import { type MouseEventHandler } from 'react'
import { useOffersFilterContext } from '~/features/offers/components/offers-filter/offers-filter-root'

type OffersFilterCommandTriggerProps = useRender.ComponentProps<'button'>

/**
 * Opens the offers filter command dialog rendered by `OffersFilter.Command`.
 * Renders a native `<button>` by default; pass `render` — or compose it into
 * another component's `render` — to use any element as the trigger.
 *
 * Works anywhere inside `OffersFilter.Root`, so the trigger does not have to sit
 * next to the dialog it opens.
 *
 * @example
 * ```tsx
 * // Standalone trigger
 * <OffersFilter.CommandTrigger>Filter</OffersFilter.CommandTrigger>
 *
 * // Composed into a styled Button
 * <Button
 *   variant="ghost"
 *   icon={IconAdjustmentsHorizontal}
 *   render={<OffersFilter.CommandTrigger />}
 * >
 *   Filter
 * </Button>
 * ```
 */
function OffersFilterCommandTrigger(props: OffersFilterCommandTriggerProps) {
  const { render, ref, onClick, ...restProps } = props

  const { commandOpen, setCommandOpen } = useOffersFilterContext()

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    setCommandOpen(true)
  }

  return useRender({
    render,
    ref,
    defaultTagName: 'button',
    props: {
      type: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': commandOpen,
      ...restProps,
      onClick: handleClick,
    },
  })
}

export { OffersFilterCommandTrigger, type OffersFilterCommandTriggerProps }
