'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Command as CommandPrimitive } from 'cmdk-base'
import { type ComponentProps } from 'react'

const commandEmptyStyles = createStyles({
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

type CommandEmptyProps = ComponentProps<typeof CommandPrimitive.Empty> &
  StylesProps<typeof commandEmptyStyles> & {
    className?: string
  }

function CommandEmpty(props: CommandEmptyProps) {
  const { className, orientation, variant, ...restProps } = props

  const styles = commandEmptyStyles({ orientation, variant })

  return (
    <CommandPrimitive.Empty
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { CommandEmpty, type CommandEmptyProps, commandEmptyStyles }
