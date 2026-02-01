'use client'
import { createStyles } from '~/utils'
import { type JSX, useMemo } from 'react'
import {
  motion,
  stagger,
  type StaggerOptions,
  type Variant,
} from 'motion/react'

const staggeredTextStyles = createStyles({
  slots: {
    container: 'inline-block',
    chunk: 'inline-block whitespace-pre',
  },
})

type StaggeredTextProps = {
  className?: string
  children: string
  renderAs?: keyof JSX.IntrinsicElements
  delay?: number
  delayOptions?: StaggerOptions
  character?: {
    className?: string
    hidden?: Variant
    visible?: Variant
  }
  hidden?: Variant
  visible?: Variant
  mode?: 'character' | 'word'
}

function StaggeredText(props: StaggeredTextProps) {
  const {
    className,
    children,
    renderAs = 'span',
    delay = 0.12,
    delayOptions,
    character = {},
    hidden = {},
    visible = {},
    mode = 'character',
  } = props

  const styles = staggeredTextStyles()

  const Container = motion(renderAs)

  const containerVariants = {
    hidden,
    visible: {
      ...visible,
      transition: {
        delayChildren: stagger(delay, delayOptions),
      },
    },
  }

  const charVariants = {
    hidden: character.hidden || hidden,
    visible: character.visible || visible,
  }

  const chunks = useMemo(() => {
    if (mode === 'character') {
      return children.split('') // każdy znak osobno
    } else {
      // dopasowuje słowo + spacje po nim
      return children.match(/\S+\s*/g) || []
    }
  }, [children, mode])

  return (
    <Container
      className={styles.container({ className })}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {chunks.map((chunk, index) => (
        <motion.span
          key={`${chunk}-${index}`}
          className={styles.chunk({ className: character.className })}
          variants={charVariants}
        >
          {chunk}
        </motion.span>
      ))}
    </Container>
  )
}

export { StaggeredText, type StaggeredTextProps, staggeredTextStyles }
