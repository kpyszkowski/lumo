'use client'
import { type ReactNode } from 'react'
import { motion, type MotionProps } from 'motion/react'
import { type StaggeredTextProps } from '~/components'

export type StaggeredListItemProps = Omit<
  MotionProps,
  'variants' | 'animate' | 'initial'
> & {
  className?: string
  children: ReactNode
} & Pick<StaggeredTextProps, 'hidden' | 'visible'>

export function StaggeredListItem(props: StaggeredListItemProps) {
  const { className, children, hidden = {}, visible = {}, ...restProps } = props

  return (
    <motion.li
      className={className}
      variants={{
        hidden,
        visible,
      }}
      {...restProps}
    >
      {children}
    </motion.li>
  )
}
