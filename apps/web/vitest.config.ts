import { fileURLToPath } from 'node:url'
import sharedVitestConfig from '@lumo/configs/vitest/config.json' with { type: 'json' }
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

// @ts-expect-error Config types do not match
export default defineConfig(({ mode }) => ({
  ...sharedVitestConfig,
  test: {
    ...sharedVitestConfig.test,
    env: loadEnv(mode, process.cwd(), ''),
    setupFiles: ['./src/setup-tests.ts'],
  },
  resolve: {
    alias: {
      '~/': fileURLToPath(new URL('./src/', import.meta.url)),
    },
  },
}))
