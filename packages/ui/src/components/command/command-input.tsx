'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Command as CommandPrimitive } from 'cmdk-base'
import { type ComponentProps, type ReactNode } from 'react'
import { useCommandRootContext } from '~/components/command/command-root'

const commandInputStyles = createStyles({
  slots: {
    wrapper: 'flex flex-wrap items-center gap-x-2 gap-y-1.5 px-6 py-4',
    container: 'min-w-32 flex-1 bg-transparent outline-none',
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
    chips?: ReactNode
  }

function CommandInput(props: CommandInputProps) {
  const { className, variant: propsVariant, chips, ...restProps } = props

  const { variant: contextVariant } = useCommandRootContext() ?? {}

  const styles = commandInputStyles({
    variant: propsVariant ?? contextVariant,
  })

  return (
    <div className={styles.wrapper()}>
      {chips}
      <CommandPrimitive.Input
        className={styles.container({ className })}
        {...restProps}
      />
    </div>
  )
}

export { CommandInput, type CommandInputProps, commandInputStyles }
