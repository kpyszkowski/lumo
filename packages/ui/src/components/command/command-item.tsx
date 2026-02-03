'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Command as CommandPrimitive } from 'cmdk-base'
import { type ComponentProps } from 'react'
import { useCommandRootContext } from '~/components/command/command-root'
import { type Icon } from '~/icons'

const commandItemStyles = createStyles({
  slots: {
    container: 'flex items-center gap-3 rounded-xl px-3 py-2',
    icon: 'size-3',
  },
  variants: {
    variant: {
      inverted: {
        container:
          'data-[selected=true]:bg-elevated-inv peer peer-data-[selected=false]:hover:bg-elevated-inv peer-data-[selected=false]:active:bg-highlighted-inv',
        icon: 'text-subtle-inv',
      },
    },
  },
  defaultVariants: {
    variant: 'inverted',
  },
})

type CommandItemProps = Omit<
  ComponentProps<typeof CommandPrimitive.Item>,
  'children'
> &
  StylesProps<typeof commandItemStyles> & {
    className?: string
    icon?: Icon
    children: string
  }

function CommandItem(props: CommandItemProps) {
  const {
    className,
    children,
    icon: Icon,
    variant: propsVariant,
    ...restProps
  } = props

  const { variant: contextVariant } = useCommandRootContext() ?? {}

  const styles = commandItemStyles({ variant: propsVariant ?? contextVariant })

  return (
    <CommandPrimitive.Item
      className={styles.container({ className })}
      {...restProps}
    >
      {Icon && <Icon className={styles.icon()} />}

      {children}
    </CommandPrimitive.Item>
  )
}

export { CommandItem, type CommandItemProps, commandItemStyles }
