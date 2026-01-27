import js from '@eslint/js'
import ts from 'typescript-eslint'
import prettierConfigRecommended from 'eslint-plugin-prettier/recommended'
import turboPlugin from 'eslint-plugin-turbo'
import onlyWarnPlugin from 'eslint-plugin-only-warn'
import checkFilePlugin from 'eslint-plugin-check-file'
import pathAliasPlugin from 'eslint-plugin-path-alias'
import { type ESLintConfig } from '../lib/types'
import prettierRules from '../prettier/base'

/**
 * A shared ESLint configuration for the repository.
 */
const baseConfig = [
  js.configs.recommended,
  ...ts.configs.recommended,
  prettierConfigRecommended,
  {
    plugins: {
      turbo: turboPlugin,
      'only-warn': onlyWarnPlugin,
      'check-file': checkFilePlugin,
      'path-alias': pathAliasPlugin,
    },
    languageOptions: {
      parserOptions: {
        //@ts-expect-error - `import.meta.dirname` is there
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'prettier/prettier': ['warn', prettierRules],
      'turbo/no-undeclared-env-vars': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          fixStyle: 'inline-type-imports',
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'check-file/filename-naming-convention': [
        'warn',
        {
          '**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'path-alias/no-relative': 'warn',
    },
  },
] as ESLintConfig

export default baseConfig
