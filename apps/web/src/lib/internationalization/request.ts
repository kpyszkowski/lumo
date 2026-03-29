import { getRequestConfig } from 'next-intl/server'
import { routing } from '~/lib/internationalization/routing'

type Locale = (typeof routing.locales)[number]

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale
  }

  return {
    locale: locale as Locale,
    messages: (
      await import(`~/lib/internationalization/translations/${locale}.json`)
    ).default,
  }
})
