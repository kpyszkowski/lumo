export const PATHS = {
  catalogOutput: 'out/data.json',
  techSheetsDir: 'out/tech-sheets',
  filterDataOutput: 'src/generated/filter-data.ts',
  filterLocaleOutput: (localeId: string) =>
    `src/generated/locales/${localeId}.ts`,
} as const
