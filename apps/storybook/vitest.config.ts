import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import sharedVitestConfig from '@lumo/configs/vitest/config.json' with { type: 'json' }
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
  sharedVitestConfig,
  // @ts-expect-error Config types are not matching
  defineConfig({
    plugins: [
      storybookTest({
        configDir: fileURLToPath(new URL('.storybook', import.meta.url)),
      }),
      // @ts-expect-error Config types are not matching
      react(),
    ],
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        provider: playwright({}),
        instances: [{ browser: 'chromium' }],
      },
      setupFiles: ['.storybook/vitest.setup.ts'],
    },
    define: {
      global: 'globalThis',
    },
    optimizeDeps: {
      exclude: ['@storybook/*', 'storybook'],
    },
  }),
)
