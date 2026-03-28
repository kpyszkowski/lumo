'use client'
import { Command } from '@lumo/ui/components'
import { buttonStyles } from '@lumo/ui/components'
import type { Icon } from '@lumo/ui/icons'

type CommandItemProps = {
  className?: string
  children: string
  value?: string
  icon?: Icon
  onSelect?: () => void
}

function CommandItem(props: CommandItemProps) {
  const { className, children, value, icon: Icon, onSelect } = props

  const styles = buttonStyles({
    variant: 'ghost',
    shape: 'rounded',
    inverted: true,
    contentAlignment: 'start',
  })

  return (
    //@ts-expect-error `children` prop are `string` type but `ReactNode` is fine
    <Command.Item
      value={value}
      onSelect={onSelect}
      className={styles.container({ className })}
    >
      <div className={styles.wrapper()}>
        {Icon && <Icon className={styles.icon()} />}
        <span className={styles.label()}>{children}</span>
      </div>
    </Command.Item>
  )
}

export { CommandItem, type CommandItemProps }
