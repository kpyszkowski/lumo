import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { formatHex } from 'culori'

const __dirname = dirname(fileURLToPath(import.meta.url))
const uiSrc = resolve(__dirname, '../../../packages/ui/src')

const css = readFileSync(resolve(uiSrc, 'theme.css'), 'utf-8')
const re = /--color-([a-z0-9-]+):\s*oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/g
const lines: string[] = []

for (const [, name, l, c, h] of css.matchAll(re)) {
  lines.push(
    `  "${name}": "${formatHex({ mode: 'oklch', l: +l, c: +c, h: +h })!}"`,
  )
}

writeFileSync(
  resolve(__dirname, 'palette.ts'),
  [
    '// Auto-generated from packages/ui/src/theme.css — do not edit',
    'export const palette = {',
    lines.join(',\n'),
    '} as const',
    '',
  ].join('\n'),
)
