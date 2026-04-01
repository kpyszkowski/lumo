'use client'
import { Command as CommandPrimitive } from 'cmdk-base'
import { type ReactNode, type ComponentProps } from 'react'
import { type Icon } from '~/icons'

type CommandItemProps = Omit<
  ComponentProps<typeof CommandPrimitive.Item>,
  'children'
> & {
  className?: string
  icon?: Icon
  children?: ReactNode
}

function CommandItem(props: CommandItemProps) {
  const { children, ...restProps } = props

  return (
    <CommandPrimitive.Item {...restProps}>{children}</CommandPrimitive.Item>
  )
}

export { CommandItem, type CommandItemProps }
