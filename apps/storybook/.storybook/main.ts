// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import {
  type FrameworkOptions,
  type StorybookConfig,
} from 'storybook-react-rsbuild'
import { mergeRsbuildConfig } from '@rsbuild/core'

type Config = Omit<StorybookConfig, 'framework'> & {
  framework: {
    name: string
    options: FrameworkOptions
  }
}

const require = createRequire(import.meta.url)

function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: Config = {
  stories: ['../src/**/*.stories.{ts,tsx}', '../src/**/*.mdx'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-designs'),
    getAbsolutePath('@storybook/addon-vitest'),
  ],
  framework: {
    name: getAbsolutePath('storybook-react-rsbuild'),
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: () => true,
    },
    check: true,
  },
  rsbuildFinal: (config) => {
    return mergeRsbuildConfig(config, {
      tools: {
        postcss: {
          postcssOptions: {
            plugins: ['@tailwindcss/postcss'],
          },
        },
      },
    })
  },
}

export default config
