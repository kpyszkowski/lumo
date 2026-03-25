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

  // Surfaces — flat single-layer
  appBg: p['sand-50'],
  appHoverBg: p['mud-100'],
  appBorderColor: p['sand-50'], // invisible

  // Text
  textColor: p['mud-950'],
  textMutedColor: p['mud-600'],
  textInverseColor: p['sand-50'],

  // Toolbar
  barTextColor: p['mud-600'],
  barSelectedColor: p['mud-950'],
  barHoverColor: p['mud-950'],

  // Buttons
  buttonBg: p['mud-100'],
  buttonBorder: p['mud-100'], // flat

  // Boolean toggle — selected bg must be light so dark textColor is readable
  booleanBg: p['mud-200'],
  booleanSelectedBg: p['sand-50'],

  // Inputs
  inputBg: p['mud-100'],
  inputBorder: p['mud-100'], // flat
  inputTextColor: p['mud-950'],
})
