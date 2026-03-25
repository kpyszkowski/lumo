'use client'
import { type ReactNode } from 'react'
import { motion, type MotionProps, stagger, type Variants } from 'motion/react'
import { type StaggeredTextProps } from '~/components'

export type StaggeredListRootProps = Omit<MotionProps, 'variants'> & {
  className?: string
  children: ReactNode
} & Pick<StaggeredTextProps, 'delay' | 'delayOptions' | 'hidden' | 'visible'>

/**
 * Animated `<ul>` container for a staggered list. Each `StaggeredList.Item` child
 * enters with a sequential delay driven by `motion/react`.
 *
 * @example
 * ```tsx
 * <StaggeredList.Root
 *   delay={0.08}
 *   hidden={{ opacity: 0, y: 16 }}
 *   visible={{ opacity: 1, y: 0 }}
 * >
 *   <StaggeredList.Item>First</StaggeredList.Item>
 *   <StaggeredList.Item>Second</StaggeredList.Item>
 *   <StaggeredList.Item>Third</StaggeredList.Item>
 * </StaggeredList.Root>
 * ```
 */
export function StaggeredListRoot(props: StaggeredListRootProps) {
  const {
    className,
    children,
    delay,
    delayOptions,
    hidden = {},
    visible = {},
    ...restProps
  } = props

  const variants: Variants = {
    hidden,
    visible: {
      ...visible,
      transition: {
        delayChildren: stagger(delay, delayOptions),
      },
    },
  }

  return (
    <motion.ul
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
      {...restProps}
    >
      {children}
    </motion.ul>
  )
}
