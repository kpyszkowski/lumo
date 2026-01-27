import { createStyles, type StylesProps } from '~/utils'
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { type Icon } from '~/icons'

const buttonStyles = createStyles({
  slots: {
    container: 'inline-block cursor-pointer transition-all',
    wrapper: 'flex h-6 items-center justify-center outline-none',
    label: 'whitespace-nowrap antialiased',
    icon: 'text-current',
  },
  variants: {
    variant: {
      solid: {
        container:
          'bg-accent-primary hover:bg-accent-secondary focus-visible:bg-accent-primary active:bg-accent-primary',
        wrapper: 'text-primary-inv dark:text-primary',
      },
      outline: {
        container:
          'border-accent-primary hover:border-accent-secondary focus-visible:border-accent-primary active:border-accent-primary border-2',
        wrapper: 'text-primary -m-0.5',
      },
      ghost: {
        container:
          'hover:bg-accent-primary-muted active:bg-accent-secondary-muted',
      },
    },
    size: {
      sm: {
        container: 'rounded-lg px-3 py-1',
        label: 'px-2 text-sm/none font-medium',
        icon: 'size-4',
      },
      md: {
        container: 'rounded-xl px-4 py-2.5',
        label: 'px-3 text-base/none font-medium',
        icon: 'size-5',
      },
      lg: {
        container: 'rounded-2xl px-5 py-4',
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
    variant: 'solid',
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
