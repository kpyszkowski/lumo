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
  /** Plain string content to animate. JSX nodes are not supported. */
  children: string
  /** HTML element to render the container as. @default 'span' */
  renderAs?: keyof JSX.IntrinsicElements
  /** Stagger delay between each animated chunk in seconds. @default 0.12 */
  delay?: number
  /** Options forwarded to `motion/react` `stagger()`, e.g. `{ from: 'last' }` for reverse order. */
  delayOptions?: StaggerOptions
  /** Per-chunk motion variant overrides and optional `className`. Defaults to `hidden`/`visible`. */
  character?: {
    className?: string
    hidden?: Variant
    visible?: Variant
  }
  /** Container `hidden` motion variant — applied on mount. */
  hidden?: Variant
  /** Container `visible` motion variant — applied after mount. */
  visible?: Variant
  /** Whether to split by `'character'` or by `'word'`. @default 'character' */
  mode?: 'character' | 'word'
}

/**
 * Animates text by staggering each character or word using `motion/react`.
 * The container mounts in `hidden` state and immediately transitions to `visible`.
 *
 * @example
 * ```tsx
 * // Basic stagger (characters fade in one by one)
 * <StaggeredText delay={0.04}>Hello world</StaggeredText>
 *
 * // Slide up by word, reversed
 * <StaggeredText
 *   mode="word"
 *   delay={0.06}
 *   delayOptions={{ from: 'last' }}
 *   character={{ hidden: { y: '100%' }, visible: { y: '0%' } }}
 * >
 *   Animate by word
 * </StaggeredText>
 * ```
 */
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
