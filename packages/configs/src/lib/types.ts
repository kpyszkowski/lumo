import { type defineConfig } from 'eslint/config'

export type ESLintConfig = Parameters<typeof defineConfig>[number]
