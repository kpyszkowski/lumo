'use client'
import { type Icon } from '@tabler/icons-react'
import { createStyles, type StylesProps } from '~/utils'
import * as TogglePrimitive from '@base-ui/react/toggle'
import { useToggleGroupContext } from '~/components/toggle/toggle-group'
import { motion, type MotionProps } from 'motion/react'

const toggleButtonStyles = createStyles({
  slots: {
    container:
      'group relative cursor-pointer rounded-[20px] px-2 py-1 transition-transform active:scale-95',
    icon: 'stroke-main group-data-pressed:stroke-accent pointer-events-none size-10 stroke-1 transition-colors',
    indicator: 'absolute inset-0 -z-10 rounded-3xl',
  },
  variants: {
    variant: {
      default: {
        indicator: 'group-data-pressed:bg-elevated',
      },
      elevated: {
        indicator: 'group-data-pressed:bg-main',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const MotionTogglePrimitiveToggle = motion.create(TogglePrimitive.Toggle)

type ToggleButtonProps = Omit<TogglePrimitive.ToggleProps, 'render'> &
  StylesProps<typeof toggleButtonStyles> & {
    className?: string
    /** Tabler icon component to render inside the button. */
    icon: Icon
    /** Visual style (inherited from `Toggle.Group` context if not set). @default 'default' */
    variant?: 'default' | 'elevated'
  }

/**
 * An icon toggle button. When pressed, a background indicator animates in using a shared
 * layout animation that slides between buttons inside the same `Toggle.Group`.
 *
 * @example
 * ```tsx
 * // Inside a group (shared layout animation across buttons)
 * <Toggle.Group defaultValue={['heart']}>
 *   <Toggle.Button value="heart" icon={IconHeart} />
 *   <Toggle.Button value="star" icon={IconStar} />
 * </Toggle.Group>
 *
 * // Standalone
 * <Toggle.Button value="fav" icon={IconHeart} defaultPressed />
 * ```
 */
function ToggleButton(props: ToggleButtonProps) {
  const { className, icon: Icon, variant: propsVariant, ...restProps } = props

  const { variant: contextVariant } = useToggleGroupContext() ?? {}

  const styles = toggleButtonStyles({ variant: propsVariant ?? contextVariant })

  return (
    <MotionTogglePrimitiveToggle
      className={styles.container({ className })}
      render={(toggleProps, toggleState) => (
        <button {...toggleProps}>
          <Icon className={styles.icon()} />

          {toggleState.pressed && (
            <motion.span
              layoutId="toggle-button-indicator"
              className={styles.indicator()}
            />
          )}
        </button>
      )}
      {...(restProps as MotionProps)}
    />
  )
}

export { ToggleButton, type ToggleButtonProps, toggleButtonStyles }
