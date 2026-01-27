import { GraduationCap } from '@lumo/ui/icons'
import { createStyles } from '@lumo/ui/utils'

const logoStyles = createStyles({
  slots: {
    container: 'flex items-center gap-4',
    icon: 'bg-accent-primary-muted text-accent-primary dark:text-accent-content size-12 rounded-md p-2.5',
    typography: 'flex flex-col',
    brandName: 'text-lg',
    leading: 'text-secondary text-sm font-light',
  },
})

type LogoProps = {
  className?: string
}

function Logo(props: LogoProps) {
  const { className, ...restProps } = props

  const styles = logoStyles()

  return (
    <div
      className={styles.container({ className })}
      {...restProps}
    >
      <GraduationCap className={styles.icon()} />
      <div className={styles.typography()}>
        <span className={styles.brandName()}>Lumo</span>
        <span className={styles.leading()}>Get yourself a future</span>
      </div>
    </div>
  )
}

export default Logo
