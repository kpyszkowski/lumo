import baseConfig from '@lumo/configs/eslint/base.ts'
import reactConfig from '@lumo/configs/eslint/react.ts'
import storybook from 'eslint-plugin-storybook'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  baseConfig,
  reactConfig,
  storybook.configs['flat/recommended'],
  {
    ignores: ['storybook-static'],
    rules: {
      'react-props/must-destructure-first': 'off',
      'react-props/no-destructure-in-params': 'off',
    },
  },
)
