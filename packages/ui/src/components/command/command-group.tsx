'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Command as CommandPrimitive } from 'cmdk-base'
import { type ComponentProps } from 'react'
import { useCommandRootContext } from '~/components/command/command-root'

const commandGroupStyles = createStyles({
  slots: {
    container:
      '[&_[cmdk-group-heading]]:text-subtle-inv [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-items]]:space-y-1',
  },
  variants: {
    variant: {
      inverted: {},
    },
  },
  defaultVariants: {
    variant: 'inverted',
  },
})

type CommandGroupProps = ComponentProps<typeof CommandPrimitive.Group> &
  StylesProps<typeof commandGroupStyles> & {
    className?: string
  }

function CommandGroup(props: CommandGroupProps) {
  const { className, variant: propsVariant, ...restProps } = props

  const { variant: contextVariant } = useCommandRootContext() ?? {}

  const styles = commandGroupStyles({ variant: propsVariant ?? contextVariant })

  return (
    <CommandPrimitive.Group
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { CommandGroup, type CommandGroupProps, commandGroupStyles }
