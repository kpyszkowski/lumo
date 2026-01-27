import { dirname, join } from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'

function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config = {
  stories: ['../src/**/*.stories.{ts,tsx}', '../src/**/*.mdx'],

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-designs'),
    getAbsolutePath('@storybook/addon-vitest'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
} satisfies StorybookConfig

export default config
