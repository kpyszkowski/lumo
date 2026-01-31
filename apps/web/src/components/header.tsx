import { Button, IconButton, Logo } from '@lumo/ui/components'
import {
  IconBell,
  IconHeart,
  IconMessageCircle,
  IconPlus,
  IconSearch,
} from '@lumo/ui/icons'
import { createStyles, type StylesProps } from '@lumo/ui/utils'

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

function Header(props: HeaderProps) {
  const { className, ...restProps } = props

  const styles = headerStyles()

  return (
    <div
      className={styles.container({ className })}
      {...restProps}
    >
      <Logo />

      <div className={styles.searchBarWrapper()}>
        <div className="bg-elevated mx-auto flex w-full max-w-lg items-center gap-3 rounded-4xl px-3 py-2">
          <IconSearch className="text-main size-4" />
          <span className="text-muted text-sm">
            Marka, model, rok produkcji...
          </span>
        </div>
      </div>

      <div className={styles.userPanelWrapper()}>
        <div className={styles.userPanelActionsWrapper()}>
          <IconButton
            icon={IconBell}
            label="Powiadomienia"
            variant="ghost"
          />
          <IconButton
            icon={IconHeart}
            label="Obserwowane ogłoszenia"
            variant="ghost"
          />
          <IconButton
            icon={IconMessageCircle}
            label="Wiadomości"
            variant="ghost"
          />
        </div>

        <Button icon={IconPlus}>Dodaj ogłoszenie</Button>

        <div className={styles.avatar()}>KP</div>
      </div>
    </div>
  )
}

export { Header, type HeaderProps, headerStyles }
