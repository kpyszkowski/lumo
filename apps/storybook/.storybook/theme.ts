import { create } from 'storybook/theming'
import { palette as p } from './palette'

export const lightTheme = create({
  brandTitle: 'Lumo',
  fontBase: '"Satoshi Variable", sans-serif',
  fontCode: 'monospace',
  base: 'light',
  brandImage: '/logo.svg',

  colorPrimary: p['vermilion-500'],
  colorSecondary: p['vermilion-500'],

  // Surfaces
  appBg: 'white',
  appHoverBg: p['mud-50'],
  appBorderColor: 'white', // flat

  // Text
  textColor: p['mud-950'],
  textMutedColor: p['mud-600'],
  textInverseColor: p['sand-50'],

  // Toolbar
  barTextColor: p['mud-600'],
  barSelectedColor: p['mud-950'],
  barHoverColor: p['mud-950'],

  // Buttons
  buttonBg: p['mud-50'],
  buttonBorder: p['mud-50'], // flat

  // Boolean toggle
  booleanBg: p['mud-200'],
  booleanSelectedBg: p['sand-50'],

  // Inputs
  inputBg: p['mud-50'],
  inputBorder: p['mud-50'], // flat
  inputTextColor: p['mud-950'],
})
