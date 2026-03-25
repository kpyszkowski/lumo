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

/**
 * An animated `<li>` inside `StaggeredList.Root`.
 * Receives stagger timing from the parent and plays the `hidden` → `visible` transition.
 *
 * @example
 * ```tsx
 * <StaggeredList.Root delay={0.08}>
 *   <StaggeredList.Item>First</StaggeredList.Item>
 *   <StaggeredList.Item>Second</StaggeredList.Item>
 * </StaggeredList.Root>
 * ```
 */
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
