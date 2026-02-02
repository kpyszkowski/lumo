'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { motion, type MotionProps } from 'motion/react'
import { useRadioGroupContext } from '~/components/radio/radio-group'

const radioButtonStyles = createStyles({
  slots: {
    container: 'cursor-pointer transition-colors',
    indicator: '',
  },
  variants: {
    variant: {
      underline: {
        container:
          'data-checked:text-main text-subtle -mx-3 flex flex-col gap-1 p-3 font-medium',
        indicator: 'border-subtle w-full border-b',
      },
    },
  },
  defaultVariants: {
    variant: 'underline',
  },
})

const MotionRadioPrimitiveRoot = motion.create(RadioPrimitive.Root)

type RadioButtonProps = Omit<RadioPrimitive.Root.Props, 'render'> &
  StylesProps<typeof radioButtonStyles> & {
    className?: string
  }

function RadioButton(props: RadioButtonProps) {
  const { className, children, variant: propsVariant, ...restProps } = props

  const { variant: contextVariant } = useRadioGroupContext() ?? {}

  const styles = radioButtonStyles({ variant: propsVariant ?? contextVariant })

  return (
    <MotionRadioPrimitiveRoot
      className={styles.container({ className })}
      render={(toggleProps, toggleState) => (
        <span {...toggleProps}>
          {children}

          {toggleState.checked && (
            <RadioPrimitive.Indicator
              className={styles.indicator()}
              render={<motion.span layoutId="radio-button-indicator" />}
            />
          )}
        </span>
      )}
      {...(restProps as MotionProps)}
    />
  )
}

export { RadioButton, type RadioButtonProps, radioButtonStyles }
