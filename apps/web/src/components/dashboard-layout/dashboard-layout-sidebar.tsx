'use client'
import { Button } from '@lumo/ui/components'
import { BriefcaseBusiness, LayoutDashboard, UserRound } from '@lumo/ui/icons'
import { createStyles } from '@lumo/ui/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '~/components/logo'

const dashboardLayoutSidebarStyles = createStyles({
  slots: {
    container:
      'border-secondary-inv to-primary dark:from-primary dark:to-secondary sticky top-0 left-0 size-full min-h-[inherit] max-w-64 border-r bg-linear-65 px-3 py-6 dark:from-[-100%]',
    logo: 'mb-12',
    list: 'flex flex-col justify-stretch gap-3',
    button: 'w-full [&>div]:justify-end',
    activeButton:
      'bg-accent-primary-muted text-accent-primary dark:text-accent-content',
  },
})

type DashboardLayoutSidebarProps = {
  className?: string
}

const NAVIGATION_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'Profile', icon: UserRound },
  { href: '/job-offers', label: 'Job offers', icon: BriefcaseBusiness },
]

function DashboardLayoutSidebar(props: DashboardLayoutSidebarProps) {
  const { className, ...restProps } = props
  const pathname = usePathname()

  const styles = dashboardLayoutSidebarStyles()

  return (
    <nav
      className={styles.container({ className })}
      {...restProps}
    >
      <Logo className={styles.logo()} />

      <ul className={styles.list()}>
        {NAVIGATION_ITEMS.map((item) => {
          const isActiveItem = item.href.startsWith(pathname)

          return (
            <li key={item.href}>
              <Button
                render={<Link href={item.href} />}
                variant="ghost"
                className={styles.button({
                  className: isActiveItem ? styles.activeButton() : undefined,
                })}
                icon={item.icon}
              >
                {item.label}
              </Button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export {
  DashboardLayoutSidebar,
  type DashboardLayoutSidebarProps,
  dashboardLayoutSidebarStyles,
}
