'use client'
import { type ReactNode } from 'react'
import { motion, type MotionProps, stagger, type Variants } from 'motion/react'
import { type StaggeredTextProps } from '~/components'

export type StaggeredListRootProps = Omit<MotionProps, 'variants'> & {
  className?: string
  children: ReactNode
} & Pick<StaggeredTextProps, 'delay' | 'delayOptions' | 'hidden' | 'visible'>

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
