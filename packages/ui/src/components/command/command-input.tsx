'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Command as CommandPrimitive } from 'cmdk-base'
import { type ComponentProps } from 'react'
import { useCommandRootContext } from '~/components/command/command-root'

const commandInputStyles = createStyles({
  slots: {
    container: 'p-6',
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
  }

function CommandInput(props: CommandInputProps) {
  const { className, variant: propsVariant, ...restProps } = props

  const { variant: contextVariant } = useCommandRootContext() ?? {}

  const styles = commandInputStyles({
    variant: propsVariant ?? contextVariant,
  })

  return (
    <CommandPrimitive.Input
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { CommandInput, type CommandInputProps, commandInputStyles }
