import { fileURLToPath } from 'node:url'
import sharedVitestConfig from '@lumo/configs/vitest/config.json' with { type: 'json' }
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
  sharedVitestConfig,
  defineConfig({
    test: {
      setupFiles: fileURLToPath(new URL('./setup-tests.ts', import.meta.url)),
      environment: 'jsdom',
      exclude: ['dist', 'node_modules'],
    },
    resolve: {
      alias: {
        '~/': fileURLToPath(new URL('./src/', import.meta.url)),
      },
    },
  }),
)
