'use client'
import { createStyles, type StylesProps } from '~/utils'
import * as RadioGroupPrimitive from '@base-ui/react/radio-group'
import { createContext, useContext } from 'react'

const radioGroupStyles = createStyles({
  slots: {
    container: 'flex gap-6',
  },
  variants: {
    orientation: {
      horizontal: {
        container: 'flex-row',
      },
      vertical: {
        container: 'flex-col',
      },
    },
    variant: {
      underline: {},
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'underline',
  },
})

const RadioGroupContext = createContext<StylesProps<
  typeof radioGroupStyles
> | null>(null)

/**
 * Hook to access the `RadioGroup` context.
 * @returns The `RadioGroup` context value, or `null` if used outside a group.
 */
const useRadioGroupContext = () => useContext(RadioGroupContext)

type RadioGroupProps = RadioGroupPrimitive.RadioGroupProps &
  StylesProps<typeof radioGroupStyles> & {
    className?: string
    /** Layout direction of the group. */
    orientation?: 'horizontal' | 'vertical'
    /** Visual style shared across all child `Radio.Button` items. */
    variant?: 'underline'
  }

/**
 * Container that groups `Radio.Button` items. Distributes `variant` and `orientation`
 * via context so individual buttons inherit defaults automatically.
 *
 * @example
 * ```tsx
 * <Radio.Group defaultValue="b" aria-label="Choose option">
 *   <Radio.Button value="a">Option A</Radio.Button>
 *   <Radio.Button value="b">Option B</Radio.Button>
 *   <Radio.Button value="c">Option C</Radio.Button>
 * </Radio.Group>
 * ```
 */
function RadioGroup(props: RadioGroupProps) {
  const { className, orientation, variant, ...restProps } = props

  const styles = radioGroupStyles({ orientation, variant })

  return (
    <RadioGroupContext.Provider value={{ orientation, variant }}>
      <RadioGroupPrimitive.RadioGroup
        className={styles.container({ className })}
        {...restProps}
      />
    </RadioGroupContext.Provider>
  )
}

export {
  RadioGroup,
  type RadioGroupProps,
  radioGroupStyles,
  useRadioGroupContext,
}
