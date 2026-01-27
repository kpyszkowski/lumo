import { defineConfig, globalIgnores } from 'eslint/config'
import baseConfig from '@lumo/configs/eslint/base.ts'
import reactConfig from '@lumo/configs/eslint/react.ts'
import next from '@next/eslint-plugin-next'

export default defineConfig([
  baseConfig,
  reactConfig,
  globalIgnores([
    '.next/**',
    'next-env.d.ts',
    'out/**',
    'build/**',
    '.open-next/**',
    'cloudflare-env.d.ts',
  ]),
  {
    plugins: {
      // @ts-expect-error Next plugin types are too strict for `defineConfig`
      '@next/next': next,
    },
    // @ts-expect-error Next plugin types are too strict for `defineConfig`
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
    },
  },
])
