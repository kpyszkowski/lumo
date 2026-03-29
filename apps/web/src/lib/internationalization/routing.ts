import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/oferty': {
      pl: '/oferty',
      en: '/offers',
    },
    '/oferty/[marka]/[model]': {
      pl: '/oferty/[marka]/[model]',
      en: '/offers/[make]/[model]',
    },
  },
})
