import { createStyles } from '@lumo/ui/utils'
import type { ReactNode } from 'react'

const dashboardLayoutRootStyles = createStyles({
  slots: {
    container: 'flex size-full min-h-screen',
  },
})

type DashboardLayoutRootProps = {
  className?: string
  children: ReactNode
}

function DashboardLayoutRoot(props: DashboardLayoutRootProps) {
  const { className, children, ...restProps } = props

  const styles = dashboardLayoutRootStyles()

  return (
    <div
      className={styles.container({ className })}
      {...restProps}
    >
      {children}
    </div>
  )
}

export {
  DashboardLayoutRoot,
  type DashboardLayoutRootProps,
  dashboardLayoutRootStyles,
}
