import type pl from '~/lib/internationalization/translations/pl.json'
import { type routing } from '~/lib/internationalization/routing'

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof pl
  }
}
