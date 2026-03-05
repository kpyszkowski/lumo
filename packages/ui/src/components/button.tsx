'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { type Icon } from '~/icons'

const buttonStyles = createStyles({
  slots: {
    container: 'block cursor-pointer transition-all',
    wrapper: 'flex h-6 items-center justify-center outline-none transition-all',
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
          'border-subtle-inv hover:border-muted-inv focus-visible:border-muted-inv active:border-accent active:scale-96 border-2',
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
    icon?: Icon
  }

function Button(props: ButtonProps) {
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
        {Icon && (
          <Icon
            className={styles.icon()}
            data-testid="button-icon"
          />
        )}
      </div>
    </ButtonPrimitive>
  )
}

export { Button, buttonStyles, type ButtonProps }
