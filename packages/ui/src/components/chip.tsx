'use client'
import { createStyles, type StylesProps } from '~/utils'
import { IconX } from '~/icons'
import { AnimatePresence, motion } from '~/motion'
import { type CSSProperties, forwardRef } from 'react'

const chipStyles = createStyles({
  slots: {
    container: 'bg-elevated-inv text-main-inv px-2.5 py-1',
    wrapper: 'inline-flex items-center gap-1 overflow-hidden',
    label: 'whitespace-nowrap text-xs font-medium',
    removeIconWrapper:
      'text-muted-inv hover:text-main-inv rounded-full transition-colors',
    removeIcon: 'size-3 stroke-[2.5]',
  },
})

type ChipProps = StylesProps<typeof chipStyles> & {
  /** Optional additional class name. */
  className?: string
  /** Text label shown inside the chip. */
  label: string
  /** Called when the remove button is clicked. If omitted, no remove button is rendered. */
  onRemove?: () => void
  style?: CSSProperties
}

const Chip = forwardRef<HTMLElement, ChipProps>((props, ref) => {
  const { label, className, onRemove, style, ...restProps } = props

  const styles = chipStyles({ className })

  const Element = onRemove ? motion.button : motion.div

  return (
    <Element
      //@ts-expect-error TODO: Fix this
      ref={ref}
      type="button"
      onClick={onRemove}
      layout
      className={styles.container({
        className: onRemove ? 'cursor-pointer' : undefined,
      })}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      style={{
        ...style,
        borderRadius: 9999,
      }}
      {...restProps}
    >
      <motion.span
        layout
        className={styles.wrapper()}
      >
        <AnimatePresence
          mode="popLayout"
          initial={false}
        >
          {label && (
            <motion.span
              key={label}
              layout="position"
              className={styles.label()}
              initial={{ y: -12 }}
              animate={{ y: 0 }}
              exit={{ y: 12 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
        {onRemove && (
          <span className={styles.removeIconWrapper()}>
            <IconX className={styles.removeIcon()} />
          </span>
        )}
      </motion.span>
    </Element>
  )
})

Chip.displayName = 'Chip'

export { Chip, chipStyles, type ChipProps }
