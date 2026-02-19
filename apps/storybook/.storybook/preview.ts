import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react'

import './styles.css'
import './satoshi-variable.ttf'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    design: {
      type: 'figma',
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
