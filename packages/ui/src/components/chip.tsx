'use client'
import { createStyles, type StylesProps } from '~/utils'
import { IconX } from '~/icons'

const chipStyles = createStyles({
  slots: {
    container:
      'bg-elevated-inv text-main-inv inline-flex items-center gap-1 rounded-full px-2.5 py-1',
    label: 'whitespace-nowrap text-xs font-medium',
    removeButton:
      'text-muted-inv hover:text-main-inv cursor-pointer rounded-full transition-colors',
    removeIcon: 'size-3 stroke-[2.5]',
  },
})

type ChipProps = StylesProps<typeof chipStyles> & {
  /** Text label shown inside the chip. */
  label: string
  /** Called when the remove button is clicked. If omitted, no remove button is rendered. */
  onRemove?: () => void
}

function Chip(props: ChipProps) {
  const { label, onRemove } = props

  const styles = chipStyles()

  return (
    <span className={styles.container()}>
      <span className={styles.label()}>{label}</span>
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
    </span>
  )
}

export { Chip, chipStyles, type ChipProps }
