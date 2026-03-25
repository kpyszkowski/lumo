'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Command as CommandPrimitive } from 'cmdk-base'
import { type ComponentProps } from 'react'

const commandListStyles = createStyles({
  slots: {
    container:
      'flex gap-6 [&_[cmdk-list-sizer]]:w-full [&_[cmdk-list-sizer]]:space-y-6',
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

type CommandListProps = ComponentProps<typeof CommandPrimitive.List> &
  StylesProps<typeof commandListStyles> & {
    className?: string
  }

function CommandList(props: CommandListProps) {
  const { className, orientation, variant, ...restProps } = props

  const styles = commandListStyles({ orientation, variant })

  return (
    <CommandPrimitive.List
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { CommandList, type CommandListProps, commandListStyles }
