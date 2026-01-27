import baseConfig from './src/eslint/base'
import { defineConfig } from 'eslint/config'

export default defineConfig(baseConfig, {
  rules: {
    'path-alias/no-relative': 'off',
  },
})
