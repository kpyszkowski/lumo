'use client'
import { createStyles, type StylesProps } from '~/utils'
import * as ToggleGroupPrimitive from '@base-ui/react/toggle-group'
import { createContext, useContext } from 'react'

const toggleGroupStyles = createStyles({
  slots: {
    container: 'relative z-0 flex gap-2 rounded-3xl p-1',
  },
  variants: {
    variant: {
      default: {
        container: 'bg-transparent',
      },
      elevated: {
        container: 'bg-elevated',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const ToggleGroupContext = createContext<{
  variant: ToggleGroupProps['variant']
} | null>(null)

/**
 * Hook to access the ToggleGroup context
 * @returns The ToggleGroup context
 */
const useToggleGroupContext = () => useContext(ToggleGroupContext)

type ToggleGroupProps = ToggleGroupPrimitive.ToggleGroupProps &
  StylesProps<typeof toggleGroupStyles> & {
    className?: string
    /** Surface style of the group container. */
    variant?: 'default' | 'elevated'
  }

/**
 * Container that groups `Toggle.Button` items. Distributes `variant` via context
 * and manages single- or multi-select state via `value` / `defaultValue`.
 *
 * @example
 * ```tsx
 * <Toggle.Group defaultValue={['suv']}>
 *   <Toggle.Button value="suv" icon={IconCarBodySuv} />
 *   <Toggle.Button value="estate" icon={IconCarBodyEstate} />
 *   <Toggle.Button value="coupe" icon={IconCarBodyCoupe} />
 * </Toggle.Group>
 * ```
 */
function ToggleGroup(props: ToggleGroupProps) {
  const { className, variant, ...restProps } = props

  const styles = toggleGroupStyles({ variant })

  return (
    <ToggleGroupContext.Provider value={{ variant }}>
      <ToggleGroupPrimitive.ToggleGroup
        className={styles.container({ className })}
        {...restProps}
      />
    </ToggleGroupContext.Provider>
  )
}

export {
  ToggleGroup,
  type ToggleGroupProps,
  toggleGroupStyles,
  useToggleGroupContext,
}
