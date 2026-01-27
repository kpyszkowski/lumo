import baseConfig from '@lumo/configs/eslint/base.ts'
import reactConfig from '@lumo/configs/eslint/react.ts'
import { defineConfig } from 'eslint/config'

export default defineConfig(baseConfig, reactConfig, {
  ignores: ['dist'],
})
