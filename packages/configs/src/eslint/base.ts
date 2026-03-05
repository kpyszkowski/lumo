import js from '@eslint/js'
import markdown from '@eslint/markdown'
import ts from 'typescript-eslint'
import prettierConfigRecommended from 'eslint-plugin-prettier/recommended'
import prettierPlugin from 'eslint-plugin-prettier'
import turboPlugin from 'eslint-plugin-turbo'
import onlyWarnPlugin from 'eslint-plugin-only-warn'
import checkFilePlugin from 'eslint-plugin-check-file'
import pathAliasPlugin from 'eslint-plugin-path-alias'
import { type ESLintConfig } from '../lib/types'
import prettierRules from '../prettier/base'

const SCRIPT_FILES = ['**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}']

/**
 * A shared ESLint configuration for the repository.
 */
const baseConfig = [
  { ...js.configs.recommended, files: SCRIPT_FILES },
  ...ts.configs.recommended.map((config) => ({
    ...config,
    files: SCRIPT_FILES,
  })),
  { ...prettierConfigRecommended, files: SCRIPT_FILES },
  {
    files: SCRIPT_FILES,
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
  ...markdown.configs.recommended,
  {
    files: ['**/*.md'],
    plugins: { prettier: prettierPlugin },
    rules: {
      'markdown/no-missing-label-refs': 'off',
      'prettier/prettier': [
        'warn',
        { ...prettierRules, parser: 'markdown', proseWrap: 'always' },
      ],
    },
  },
] as ESLintConfig

export default baseConfig
