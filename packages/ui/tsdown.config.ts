import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/**/*@(ts|tsx)', './src/theme.css', '!./src/**/*.test.*'],
  format: ['esm'],
  treeshake: true,
  dts: true,
  unbundle: true,
  minify: true,
  platform: 'neutral',
})
