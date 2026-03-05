import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReactProps from '../lib/eslint-plugin-react-props'
import globals from 'globals'
import { type ESLintConfig } from '../lib/types'

const SCRIPT_FILES = ['**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}']

/**
 * A custom ESLint configuration for libraries that use React.
 */
const baseConfig = [
  { ...pluginReact.configs.flat.recommended, files: SCRIPT_FILES },
  {
    files: SCRIPT_FILES,
    languageOptions: {
      ...pluginReact.configs.flat.recommended?.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    files: SCRIPT_FILES,
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
