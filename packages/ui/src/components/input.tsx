'use client'
import { forwardRef } from 'react'
import { Input as InputPrimitive } from '@base-ui/react/input'
import { createStyles, type StylesProps } from '~/utils'

const inputStyles = createStyles({
  slots: {
    container:
      'w-full border antialiased outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50',
  },
  variants: {
    variant: {
      default: {
        container:
          'bg-elevated border-subtle-inv text-main placeholder:text-muted data-focused:border-accent data-focused:ring-accent/20 data-focused:ring-2',
      },
      inverted: {
        container:
          'bg-elevated-inv text-main-inv placeholder:text-muted-inv data-focused:border-accent data-focused:ring-accent/20 data-focused:ring-2 border-transparent',
      },
    },
    size: {
      sm: {
        container: 'rounded-lg px-2.5 py-1.5 text-sm/none',
      },
      md: {
        container: 'rounded-xl px-3 py-2 text-base/none',
      },
      lg: {
        container: 'rounded-2xl px-4 py-3 text-lg/none',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

type InputProps = Omit<InputPrimitive.Props, 'size'> &
  StylesProps<typeof inputStyles> & {
    /** Visual style of the input. Use `'inverted'` for placement on dark/inverted surfaces. @default 'default' */
    variant?: 'default' | 'inverted'
    /** Size of the input. @default 'md' */
    size?: 'sm' | 'md' | 'lg'
  }

/**
 * A styled input element based on the base-ui Input primitive.
 * Use `variant="inverted"` when placing on a dark or inverted-surface background.
 *
 * @example
 * ```tsx
 * <Input placeholder="Search..." />
 * <Input variant="inverted" size="sm" type="number" placeholder="0" />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, variant, size, ...restProps } = props

  const styles = inputStyles({ variant, size })

  return (
    <InputPrimitive
      ref={ref}
      className={(state) =>
        styles.container({
          className:
            typeof className === 'function' ? className(state) : className,
        })
      }
      {...restProps}
    />
  )
})

Input.displayName = 'Input'

export { Input, inputStyles, type InputProps }
