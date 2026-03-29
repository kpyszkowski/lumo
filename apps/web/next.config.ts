import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

initOpenNextCloudflareForDev()

const withNextIntl = createNextIntlPlugin(
  './src/lib/internationalization/request.ts',
)

export default withNextIntl({
  output: 'standalone',
} satisfies NextConfig)
