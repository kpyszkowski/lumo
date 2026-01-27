import { createStyles } from '@lumo/ui/utils'
import type { ReactNode } from 'react'

const dashboardLayoutContentStyles = createStyles({
  slots: {
    container: 'flex-1 p-6',
    wrapper: 'mx-auto size-full max-w-7xl',
  },
})

type DashboardLayoutContentProps = {
  className?: string
  children: ReactNode
}

function DashboardLayoutContent(props: DashboardLayoutContentProps) {
  const { children, className, ...restProps } = props

  const styles = dashboardLayoutContentStyles()

  return (
    <div
      className={styles.container({ className })}
      {...restProps}
    >
      <div className={styles.wrapper()}>{children}</div>
    </div>
  )
}

export {
  DashboardLayoutContent,
  type DashboardLayoutContentProps,
  dashboardLayoutContentStyles,
}
