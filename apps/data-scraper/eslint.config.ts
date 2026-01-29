import baseConfig from '@lumo/configs/eslint/base.ts'
import { defineConfig } from 'eslint/config'

export default defineConfig(baseConfig, {
  ignores: ['dist'],
})
