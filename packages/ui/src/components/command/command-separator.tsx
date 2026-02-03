'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Command as CommandPrimitive } from 'cmdk-base'
import { type ComponentProps } from 'react'

const commandSeparatorStyles = createStyles({
  slots: {
    container: 'flex gap-6',
  },
  variants: {
    orientation: {
      horizontal: {
        container: 'flex-row',
      },
      vertical: {
        container: 'flex-col',
      },
    },
    variant: {
      underline: {},
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'underline',
  },
})

type CommandSeparatorProps = ComponentProps<typeof CommandPrimitive.Separator> &
  StylesProps<typeof commandSeparatorStyles> & {
    className?: string
  }

function CommandSeparator(props: CommandSeparatorProps) {
  const { className, orientation, variant, ...restProps } = props

  const styles = commandSeparatorStyles({ orientation, variant })

  return (
    <CommandPrimitive.Separator
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { CommandSeparator, type CommandSeparatorProps, commandSeparatorStyles }
