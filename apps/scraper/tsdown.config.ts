import { defineConfig } from 'tsdown'

// TODO: Consider creating a shared config package for tsdown configs across monorepo
export default defineConfig({
  entry: ['./src/**/*.ts'],
  format: ['esm'],
  treeshake: true,
  dts: true,
  unbundle: true,
  minify: true,
  platform: 'node',
})
