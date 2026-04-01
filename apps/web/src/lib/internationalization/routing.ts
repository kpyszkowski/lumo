import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/offers': {
      pl: '/oferty',
      en: '/offers',
    },
    '/offers/[make]/[model]': {
      pl: '/oferty/[marka]/[model]',
      en: '/offers/[make]/[model]',
    },
  },
})
