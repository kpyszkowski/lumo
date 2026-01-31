'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { type Icon } from '~/icons'

const buttonStyles = createStyles({
  slots: {
    container: 'inline-block cursor-pointer transition-all',
    wrapper: 'flex h-6 items-center justify-center transition-all outline-none',
    label: 'whitespace-nowrap antialiased',
    icon: 'stroke-[1.5]',
  },
  variants: {
    variant: {
      outline: {
        container:
          'border-subtle hover:border-muted focus-visible:border-muted active:border-accent border-2 active:scale-96',
        wrapper: 'text-primary -m-0.5',
        icon: 'text-accent',
      },
      ghost: {
        container: 'hover:bg-elevated active:bg-highlighted',
        wrapper: 'active:text-accent',
      },
    },
    size: {
      sm: {
        container: 'rounded-2xl px-3 py-1',
        label: 'px-2 text-sm/none font-medium',
        icon: 'size-4',
      },
      md: {
        container: 'rounded-3xl px-4 py-2.5',
        label: 'px-3 text-base/none font-medium',
        icon: 'size-5',
      },
      lg: {
        container: 'rounded-4xl px-5 py-4',
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
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
    iconPosition: 'left',
  },
})

type ButtonProps = Omit<ButtonPrimitive.Props, 'children' | 'nativeButton'> &
  StylesProps<typeof buttonStyles> & {
    children: string
    icon?: Icon
  }

function Button(props: ButtonProps) {
  const {
    className,
    children,
    icon: Icon,
    render,
    variant,
    iconPosition,
    size,
    ...restProps
  } = props

  const styles = buttonStyles({
    variant,
    iconPosition,
    size,
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
