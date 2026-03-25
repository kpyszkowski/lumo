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
    /** Visual style (inherited from `Radio.Group` context if not set). @default 'underline' */
    variant?: 'underline'
  }

/**
 * Individual radio option inside a `Radio.Group`.
 * When selected, an animated underline indicator slides in using a shared layout animation.
 *
 * @example
 * ```tsx
 * <Radio.Group defaultValue="newest">
 *   <Radio.Button value="promoted">Promoted</Radio.Button>
 *   <Radio.Button value="newest">Newest</Radio.Button>
 *   <Radio.Button value="popular" disabled>Most popular</Radio.Button>
 * </Radio.Group>
 * ```
 */
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
