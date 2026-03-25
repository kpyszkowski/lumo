// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type FrameworkOptions,
  type StorybookConfig,
} from 'storybook-react-rsbuild'
import { mergeRsbuildConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import './generate-palette.ts'

type Config = Omit<StorybookConfig, 'framework'> & {
  framework: {
    name: string
    options: FrameworkOptions
  }
}

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))
const uiSrc = resolve(__dirname, '../../../packages/ui/src')

function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: Config = {
  staticDirs: ['../public'],
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
      tsconfigPath: resolve(__dirname, '../tsconfig.json'),
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => {
        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules/@types/react')
        }
        return true
      },
    },
    check: true,
  },
  rsbuildFinal: (config) => {
    return mergeRsbuildConfig(config, {
      plugins: [pluginReact()],
      logLevel: 'silent',
      source: {
        alias: {
          '@lumo/ui/components': resolve(uiSrc, 'components.ts'),
          '@lumo/ui/icons': resolve(uiSrc, 'icons/index.ts'),
          '@lumo/ui/motion': resolve(uiSrc, 'motion.ts'),
        },
      },
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
