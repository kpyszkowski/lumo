import { createStyles } from '@lumo/ui/utils'
import Image from 'next/image'
import HelloButton from '~/components/hello-button'

const pageStyles = createStyles({
  slots: {
    container: 'flex min-h-screen flex-col items-center justify-center',
    main: 'my-auto flex max-w-xl flex-col items-center justify-between gap-4 p-24',
    logo: 'h-10 w-auto',
    logoDark: 'hidden dark:block',
    logoLight: 'block dark:hidden',
    paragraph: 'text-center text-base',
    button: 'w-full flex-1',
    code: 'bg-elevated rounded-md px-2 py-0.5 font-[monospace] text-sm',
  },
})

export default async function Home() {
  const styles = pageStyles()

  return (
    <div className={styles.container()}>
      <main className={styles.main()}>
        <Image
          alt="Turborepo logo"
          className={styles.logo({ className: styles.logoDark() })}
          height={38}
          priority
          src="turborepo-light.svg"
          width={180}
        />

        <Image
          alt="Turborepo logo"
          className={styles.logo({ className: styles.logoLight() })}
          height={38}
          priority
          src="turborepo-dark.svg"
          width={180}
        />

        <p className={styles.paragraph()}>
          Get started by editing{' '}
          <code className={styles.code()}>apps/dapp/app/page.tsx</code>
          Save and see your changes instantly!
        </p>

        <HelloButton className={styles.button()} />
      </main>
    </div>
  )
}
