import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '~/app/globals.css'
import '~/rpc/server'
import { Providers } from '~/app/providers'
import { Header } from '~/components/header'
import { routing } from '~/lib/internationalization/routing'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

type Locale = (typeof routing.locales)[number]

const satoshiVariable = localFont({
  src: '../../fonts/satoshi-variable.ttf',
  fallback: ['system-ui'],
  variable: '--font-sans',
})

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]'>, 'children'>,
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'Metadata',
  })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout(props: LayoutProps<'/[locale]'>) {
  const { children, params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      className={satoshiVariable.variable}
    >
      <body>
        <Providers>
          <main>
            <Header />

            <div>{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  )
}
