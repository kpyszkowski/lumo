import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReactProps from '../lib/eslint-plugin-react-props'
import globals from 'globals'
import { type ESLintConfig } from '../lib/types'

/**
 * A custom ESLint configuration for libraries that use React.
 */
const baseConfig = [
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended?.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-props': pluginReactProps,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react-props/must-destructure-first': 'warn',
      'react-props/no-destructure-in-params': 'warn',
    },
  },
] as ESLintConfig

export default baseConfig
