'use client'
import { Logo, Button } from '@lumo/ui/components'
import { createStyles } from '@lumo/ui/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const dashboardLayoutSidebarStyles = createStyles({
  slots: {
    container:
      'bg-elevated sticky top-0 left-0 size-full min-h-[inherit] max-w-64 bg-linear-65 px-3 py-6 dark:from-[-100%]',
    logo: 'mx-auto mb-12',
    list: 'flex flex-col justify-stretch gap-3',
    button: 'w-full [&>div]:justify-end',
    activeButton: 'bg-vermilion-100 text-accent',
  },
})

type DashboardLayoutSidebarProps = {
  className?: string
}

const NAVIGATION_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/profile', label: 'Profile' },
  { href: '/job-offers', label: 'Job offers' },
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
