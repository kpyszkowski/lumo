import { Input as InputPrimitive } from '@base-ui/react/input'
import { forwardRef } from 'react'
import { createStyles, type StylesProps } from '~/utils'

const inputStyles = createStyles({
  slots: {
    container:
      'border-secondary-inv bg-tertiary placeholder:text-tertiary focus-visible:ring-a11y rounded-lg border px-5 py-4 transition-all outline-none',
  },
  variants: {
    size: {
      sm: {
        container: 'px-4 py-3 text-xs',
      },
      md: {
        container: 'px-5 py-4 text-sm',
      },
      lg: {
        container: 'px-6 py-5 text-base',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

type InputProps = StylesProps<typeof inputStyles> &
  Omit<InputPrimitive.Props, 'size'>

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, size, ...restProps } = props

  const styles = inputStyles({ size })

  return (
    <InputPrimitive
      render={(internalProps, state) => (
        <input
          {...internalProps}
          {...restProps}
          ref={(node) => {
            if (typeof internalProps.ref === 'function') {
              internalProps.ref(node)
            } else if (internalProps.ref) {
              internalProps.ref.current = node
            }

            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          className={styles.container({
            className:
              typeof className === 'function' ? className(state) : className,
          })}
        />
      )}
    />
  )
})

Input.displayName = 'Input'

export { Input, type InputProps, inputStyles }
