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
 * Hook to access the ToggleGroup context
 * @returns The ToggleGroup context
 */
const useRadioGroupContext = () => useContext(RadioGroupContext)

type RadioGroupProps = RadioGroupPrimitive.RadioGroupProps &
  StylesProps<typeof radioGroupStyles> & {
    className?: string
  }

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
