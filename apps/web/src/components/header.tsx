import { Button, IconButton, Logo } from '@lumo/ui/components'
import {
  IconBell,
  IconHeart,
  IconMessageCircle,
  IconPlus,
} from '@lumo/ui/icons'
import { createStyles, type StylesProps } from '@lumo/ui/utils'
import { AdFilterCommand } from '~/features/ads/components/ad-filter-command'
import { getTranslations } from 'next-intl/server'

const headerStyles = createStyles({
  slots: {
    container: 'flex place-content-center p-6',
    searchBarWrapper: 'flex flex-1 justify-center',
    userPanelWrapper: 'flex place-items-center gap-10',
    userPanelActionsWrapper: 'flex place-content-center gap-2',
    avatar:
      'bg-elevated text-muted flex size-12 items-center justify-center rounded-full text-sm',
  },
})

type HeaderProps = StylesProps<typeof headerStyles> & {
  className?: string
}

async function Header(props: HeaderProps) {
  const { className, ...restProps } = props

  const styles = headerStyles()
  const t = await getTranslations('Header')

  return (
    <div
      className={styles.container({ className })}
      {...restProps}
    >
      <Logo />

      <div className={styles.searchBarWrapper()}>
        <AdFilterCommand />
      </div>

      <div className={styles.userPanelWrapper()}>
        <div className={styles.userPanelActionsWrapper()}>
          <IconButton
            icon={IconBell}
            label={t('notifications')}
            variant="ghost"
          />
          <IconButton
            icon={IconHeart}
            label={t('watchedAds')}
            variant="ghost"
          />
          <IconButton
            icon={IconMessageCircle}
            label={t('messages')}
            variant="ghost"
          />
        </div>

        <Button icon={IconPlus}>{t('addAd')}</Button>

        <div className={styles.avatar()}>KP</div>
      </div>
    </div>
  )
}

export { Header, type HeaderProps, headerStyles }
