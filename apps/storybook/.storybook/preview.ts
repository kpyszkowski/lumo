import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react-vite'

import './styles.css'
import './satoshi-variable.ttf'

// TODO: Add Figma token rotation in CI for preview deployment
const isFigmaAccessTokenProvided = !!import.meta.env
  .STORYBOOK_FIGMA_ACCESS_TOKEN

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    design: {
      type: isFigmaAccessTokenProvided ? 'figspec' : 'figma',
    },
  },

  decorators: [
    withThemeByDataAttribute({
      defaultTheme: 'light',
      themes: {
        light: 'light',
        dark: 'dark',
      },
      attributeName: 'data-theme',
    }),
  ],

  tags: ['autodocs'],
}

export default preview
