'use client'
import { createStyles, type StylesProps } from '~/utils'
import { IconX } from '~/icons'
import { AnimatePresence, motion } from '~/motion'
import { type CSSProperties, forwardRef } from 'react'

const chipStyles = createStyles({
  slots: {
    container: 'bg-elevated-inv text-main-inv px-2.5 py-1',
    wrapper: 'inline-flex items-center gap-1 overflow-hidden',
    label: 'text-xs font-medium whitespace-nowrap',
    removeButton:
      'text-muted-inv hover:text-main-inv cursor-pointer rounded-full transition-colors',
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

const Chip = forwardRef<HTMLDivElement, ChipProps>((props, ref) => {
  const { label, className, onRemove, style, ...restProps } = props

  const styles = chipStyles({ className })

  return (
    <motion.div
      ref={ref}
      layout
      className={styles.container()}
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
          <button
            type="button"
            className={styles.removeButton()}
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            aria-label={`Usuń filtr: ${label}`}
          >
            <IconX className={styles.removeIcon()} />
          </button>
        )}
      </motion.span>
    </motion.div>
  )
})

Chip.displayName = 'Chip'

export { Chip, chipStyles, type ChipProps }
