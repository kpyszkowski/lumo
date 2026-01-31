import { createStyles, type StylesProps } from '~/utils'

const logoStyles = createStyles({
  slots: {
    container: 'flex w-fit items-center gap-4',
    wordmark: 'text-main text-2xl font-bold',
    icon: '[&>path]:fill-accent h-7 w-12 fill-none',
  },
  variants: {
    variant: {
      logo: {},
      wordmark: {
        container: '',
        icon: 'hidden',
      },
      icon: {
        container: '',
        wordmark: 'hidden',
      },
    },
    orientation: {
      horizontal: {
        container: 'flex-row',
      },
      vertical: {
        container: 'flex-col gap-2',
      },
    },
  },
})

type LogoProps = StylesProps<typeof logoStyles> & {
  className?: string
}

function Logo(props: LogoProps) {
  const { className, variant, orientation, ...restProps } = props

  const styles = logoStyles({ variant, orientation })

  return (
    <div
      className={styles.container({ className })}
      {...restProps}
    >
      <svg
        className={styles.icon()}
        viewBox="0 0 48 27"
      >
        <path d="M34.2925 13.3563H41.1463C44.9315 13.3563 48 16.4112 48 20.1788C48 23.9457 44.9321 27 41.1476 27H40.9585C37.203 27 34.1882 23.9147 34.2925 20.1781V13.3563H19.3887C15.3107 13.3563 12.1902 9.74145 12.8043 5.72871C13.2867 2.5765 15.9552 0.21264 19.1568 0.101612L21.9118 0.00607053C26.1609 -0.141287 30.0376 2.40595 31.5712 6.35294L34.2925 13.3563Z" />
        <path d="M6.85374 13.3563C3.06853 13.3563 0 16.4105 0 20.1781C0 23.9457 3.06853 27 6.85374 27C10.639 27 13.7075 23.9457 13.7075 20.1781C13.7075 16.4105 10.639 13.3563 6.85374 13.3563Z" />
      </svg>

      <span className={styles.wordmark()}>Lumo</span>
    </div>
  )
}

export { Logo, type LogoProps, logoStyles }
