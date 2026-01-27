import type { Config } from 'prettier'

/**
 * A shared Prettier configuration for the repository.
 */
const config: Config = {
  semi: false,
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  plugins: [import.meta.resolve('prettier-plugin-tailwindcss')],
  tailwindFunctions: ['createStyles', 'tv'],
  singleAttributePerLine: true,
}

export default config
