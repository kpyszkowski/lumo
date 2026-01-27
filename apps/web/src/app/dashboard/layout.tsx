import type { PropsWithChildren } from 'react'
import * as DashboardLayout from '~/components/dashboard-layout'

function Layout(props: PropsWithChildren) {
  const { children } = props

  return (
    <DashboardLayout.Root>
      <DashboardLayout.Sidebar />

      <DashboardLayout.Content>{children}</DashboardLayout.Content>
    </DashboardLayout.Root>
  )
}

export default Layout
