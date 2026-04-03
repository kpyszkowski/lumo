'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { type Icon } from '~/icons'
import { forwardRef, isValidElement, cloneElement } from 'react'

const buttonStyles = createStyles({
  slots: {
    container:
      'block cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-40',
    wrapper: 'flex h-6 items-center justify-center transition-all outline-none',
    label: 'whitespace-nowrap antialiased',
    icon: 'stroke-[1.5]',
  },
  variants: {
    shape: {
      pill: {},
      rounded: {},
    },
    inverted: {
      true: {},
    },
    variant: {
      outline: {
        container:
          'border-muted-inv hover:border-subtle-inv focus-visible:border-subtle-inv border-2 active:scale-98',
        wrapper: 'text-main dark:text-main-inv -m-0.5',
      },
      ghost: {
        container: 'hover:bg-elevated active:bg-highlighted',
        wrapper: 'text-main',
      },
      solid: {
        container:
          'bg-elevated hover:bg-highlighted focus-visible:bg-highlighted',
        wrapper: 'text-muted',
      },
      accent: {
        container:
          'bg-accent hover:bg-accent/90 focus-visible:bg-accent/90 active:scale-96',
        wrapper: 'text-main-inv',
      },
    },
    size: {
      sm: {
        container: 'px-3 py-1',
        label: 'px-2 text-sm/none font-medium',
        icon: 'size-4',
      },
      md: {
        container: 'px-4 py-2.5',
        label: 'px-3 text-base/none font-medium',
        icon: 'size-5',
      },
      lg: {
        container: 'px-5 py-4',
        label: 'px-4 text-lg/none font-medium',
        icon: 'size-6',
      },
    },
    iconPosition: {
      left: {
        wrapper: 'flex-row-reverse',
        icon: 'mr-0',
      },
      right: {
        wrapper: 'flex-row',
        icon: 'ml-0',
      },
    },
    contentAlignment: {
      center: {
        wrapper: 'justify-center',
      },
      start: {
        wrapper: 'justify-end',
      },
      end: {
        wrapper: 'justify-start',
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
    shape: 'pill',
    inverted: false,
    size: 'md',
    iconPosition: 'left',
  },
  compoundSlots: [
    {
      shape: 'pill',
      slots: ['container'],
      className: 'rounded-full',
    },
    {
      shape: 'rounded',
      size: 'sm',
      slots: ['container'],
      className: 'rounded-lg',
    },
    {
      shape: 'rounded',
      size: 'md',
      slots: ['container'],
      className: 'rounded-xl',
    },
    {
      shape: 'rounded',
      size: 'lg',
      slots: ['container'],
      className: 'rounded-2xl',
    },
    {
      inverted: true,
      variant: 'ghost',
      slots: ['container'],
      className: 'hover:bg-elevated-inv active:bg-highlighted-inv',
    },
    {
      inverted: true,
      variant: 'ghost',
      slots: ['wrapper'],
      className: 'text-main-inv',
    },
  ],
})

type ButtonProps = Omit<ButtonPrimitive.Props, 'nativeButton'> &
  StylesProps<typeof buttonStyles> & {
    /** Tabler icon component or JSX element rendered alongside the label. */
    icon?: Icon | React.ReactElement
    /** Visual style of the button. @default 'outline' */
    variant?: 'outline' | 'ghost' | 'solid' | 'accent'
    /** Size of the button. @default 'md' */
    size?: 'sm' | 'md' | 'lg'
    /** Border radius: `'pill'` (fully rounded) or `'rounded'` (scales with `size`). @default 'pill' */
    shape?: 'pill' | 'rounded'
    /** Swap to inverted colour scheme for placement on dark/inverted surfaces. @default false */
    inverted?: boolean
    /** Side the icon appears on relative to the label. @default 'left' */
    iconPosition?: 'left' | 'right'
    /** Horizontal alignment of the label and icon inside the button. */
    contentAlignment?: 'center' | 'start' | 'end'
  }

/**
 * A versatile button with multiple visual styles, sizes, and optional icon support.
 *
 * @example
 * ```tsx
 * <Button variant="outline" size="md">Save</Button>
 * <Button variant="ghost" icon={IconTrash} iconPosition="right">Delete</Button>
 * <Button variant="solid" inverted>Confirm</Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    className,
    children,
    icon: Icon,
    render,
    variant,
    shape,
    inverted,
    iconPosition,
    size,
    contentAlignment,
    ...restProps
  } = props

  const styles = buttonStyles({
    variant,
    iconPosition,
    size,
    shape,
    inverted,
    contentAlignment,
  })

  return (
    <ButtonPrimitive
      ref={ref}
      className={(state) =>
        styles.container({
          className:
            typeof className === 'function' ? className(state) : className,
        })
      }
      render={render}
      nativeButton={!render}
      {...restProps}
    >
      <div className={styles.wrapper()}>
        <span className={styles.label()}>{children}</span>
        {Icon &&
          (isValidElement(Icon) ? (
            cloneElement(Icon, { className: styles.icon() } as object)
          ) : (
            <Icon
              className={styles.icon()}
              data-testid="button-icon"
            />
          ))}
      </div>
    </ButtonPrimitive>
  )
})

Button.displayName = 'Button'

export { Button, buttonStyles, type ButtonProps }
