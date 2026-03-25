'use client'
import { buttonStyles } from '~/components/button'
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import type { Icon } from '~/icons'
import { createStyles, type StylesProps } from '~/utils'

const {
  variants: { variant: baseVariantStyles },
  slots: { container: baseContainer },
} = buttonStyles

const iconButtonStyles = createStyles({
  slots: {
    container: baseContainer,
    label: 'sr-only',
    icon: 'pointer-events-none stroke-[1.5] text-current',
  },
  variants: {
    variant: {
      outline: {
        container: baseVariantStyles.outline.container,
        icon: baseVariantStyles.outline.wrapper,
      },
      ghost: {
        container: baseVariantStyles.ghost.container,
        icon: baseVariantStyles.ghost.container,
      },
    },
    size: {
      sm: {
        container: 'rounded-2xl p-2',
        icon: 'size-4',
      },
      md: {
        container: 'rounded-3xl p-2.5',
        icon: 'size-6',
      },
      lg: {
        container: 'rounded-4xl p-3',
        icon: 'size-8',
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
  },
})

type IconButtonProps = Omit<
  ButtonPrimitive.Props,
  'children' | 'nativeButton'
> &
  StylesProps<typeof iconButtonStyles> & {
    /** Tabler icon component to render. */
    icon: Icon
    /** Accessible label read by screen readers; visually hidden. */
    label: string
    /** Visual style of the button. */
    variant?: 'outline' | 'ghost'
    /** Size of the button. */
    size?: 'sm' | 'md' | 'lg'
  }

/**
 * An icon-only button with an accessible visually-hidden label.
 *
 * @example
 * ```tsx
 * <IconButton icon={IconHeart} label="Add to favourites" />
 * <IconButton icon={IconTrash} label="Delete" variant="ghost" size="sm" />
 * ```
 */
function IconButton(props: IconButtonProps) {
  const {
    className,
    icon: Icon,
    label,
    render,
    size,
    variant,
    ...restProps
  } = props

  const styles = iconButtonStyles({
    size,
    variant,
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
      <Icon
        className={styles.icon()}
        aria-hidden="true"
      />
      <span className={styles.label()}>{label}</span>
    </ButtonPrimitive>
  )
}

export { IconButton, buttonStyles, type IconButtonProps }
