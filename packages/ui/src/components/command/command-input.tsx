'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Command as CommandPrimitive } from 'cmdk-base'
import { forwardRef, type ComponentProps } from 'react'
import { useCommandRootContext } from '~/components/command/command-root'
import { Chip, type ChipProps } from '~/components'
import { AnimatePresence, motion, type MotionProps } from '~/motion'

const MotionCommandPrimitiveInput = motion.create(CommandPrimitive.Input)

const commandInputStyles = createStyles({
  slots: {
    container: 'flex flex-wrap items-center gap-x-2 gap-y-1.5 px-6 py-4',
    input: 'min-h-8 min-w-32 flex-1 bg-transparent outline-none',
  },
  variants: {
    variant: {
      inverted: {
        container: 'placeholder:text-subtle-inv',
      },
    },
  },
  defaultVariants: {
    variant: 'inverted',
  },
})

type CommandInputProps = ComponentProps<typeof CommandPrimitive.Input> &
  StylesProps<typeof commandInputStyles> & {
    className?: string
    /** Optional content (e.g. chips) rendered before the text input. */
    chips?: ChipProps[]
  }

const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
  (props, ref) => {
    const { className, variant: propsVariant, chips, ...restProps } = props

    const { variant: contextVariant } = useCommandRootContext() ?? {}

    const styles = commandInputStyles({
      variant: propsVariant ?? contextVariant,
    })

    return (
      <motion.div
        layout
        layoutRoot
        className={styles.container({ className })}
      >
        <AnimatePresence mode="popLayout">
          {chips?.map((chipProps) => (
            <Chip
              key={chipProps.label}
              {...chipProps}
            />
          ))}
        </AnimatePresence>

        <MotionCommandPrimitiveInput
          ref={ref}
          layout="position"
          layoutId={'command-input'}
          className={styles.input()}
          {...(restProps as MotionProps)}
        />
      </motion.div>
    )
  },
)

CommandInput.displayName = 'CommandInput'

export { CommandInput, type CommandInputProps, commandInputStyles }
