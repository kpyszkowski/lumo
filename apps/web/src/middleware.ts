import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '~/lib/internationalization/routing'
import enMessages from '~/lib/internationalization/translations/en.json'
import plMessages from '~/lib/internationalization/translations/pl.json'

const intlMiddleware = createMiddleware(routing)

type Locale = (typeof routing.locales)[number]

const URL_KEYS: Record<Locale, Record<string, string>> = {
  pl: plMessages.OffersFilter.urlKeys,
  en: enMessages.OffersFilter.urlKeys,
}

const SORT_URL_VALUES: Record<Locale, Record<string, string>> = {
  pl: plMessages.OffersFilter.urlValues.sort,
  en: enMessages.OffersFilter.urlValues.sort,
}

/**
 * Every localized search param name mapped back to its canonical field key —
 * `marka` and `make` both resolve to `make`.
 */
const CANONICAL_KEYS = new Map(
  Object.values(URL_KEYS).flatMap((keys) =>
    Object.entries(keys).map(([canonical, urlKey]) => [urlKey, canonical]),
  ),
)

/** Same, for the sort param's values — `przebieg-malejaco` → `mileage-desc`. */
const CANONICAL_SORT_VALUES = new Map(
  Object.values(SORT_URL_VALUES).flatMap((values) =>
    Object.entries(values).map(([canonical, urlValue]) => [
      urlValue,
      canonical,
    ]),
  ),
)

const getLocale = (pathname: string): Locale => {
  const [, prefix] = pathname.split('/')
  return (routing.locales as readonly string[]).includes(prefix ?? '')
    ? (prefix as Locale)
    : routing.defaultLocale
}

/**
 * `nuqs` reads each param under exactly one name (`urlKeys` is a static map), so
 * a Polish query lands unreadable on an English route and the filters silently
 * vanish. Renaming the params to the target locale on the way in keeps pasted,
 * bookmarked, and locale-switched links working.
 */
export default function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  const locale = getLocale(pathname)
  const urlKeys = URL_KEYS[locale]
  const sortValues = SORT_URL_VALUES[locale]

  const renamed = new URLSearchParams()
  let hasRenamed = false

  for (const [key, value] of searchParams.entries()) {
    const canonical = CANONICAL_KEYS.get(key)
    const localizedKey = canonical ? (urlKeys[canonical] ?? key) : key

    const canonicalValue = CANONICAL_SORT_VALUES.get(value)
    const localizedValue =
      canonical === 'sort' && canonicalValue
        ? (sortValues[canonicalValue] ?? value)
        : value

    if (localizedKey !== key || localizedValue !== value) hasRenamed = true
    renamed.append(localizedKey, localizedValue)
  }

  if (hasRenamed) {
    const url = request.nextUrl.clone()
    url.search = renamed.toString()
    return NextResponse.redirect(url)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
