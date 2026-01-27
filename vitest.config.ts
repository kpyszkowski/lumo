import sharedVitestConfig from '@lumo/configs/vitest/config.json'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
  sharedVitestConfig,
  defineConfig({
    test: {
      projects: [
        {
          root: './packages',
          test: {
            // Project-specific configuration for packages
            ...sharedVitestConfig.test
          }
        },
        {
          root: './apps',
          test: {
            // Project-specific configuration for apps
            ...sharedVitestConfig.test,
            environment: 'jsdom'
          }
        }
      ]
    }
  })
)
