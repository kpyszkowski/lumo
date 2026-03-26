import { Command } from 'commander'
import initializeSpinner from 'yocto-spinner'
import { buildFilterData } from '~/features/filter-builder/lib/build-filter-data'
import {
  serializeFilterDataToTs,
  serializeFilterLocaleToTs,
} from '~/features/filter-builder/lib/serialize-to-ts'
import { saveToFile } from '~/lib/save-to-file'
import { PATHS } from '~/lib/paths'

const spinner = initializeSpinner({ color: 'cyan' })

export const buildFilterDataCommand = new Command('build-filter-data')
  .description(
    'Parses scraped tech sheets and builds vehicle filter data for the web app',
  )
  .option(
    '-c, --catalog <file>',
    'Path to the catalog JSON file',
    PATHS.catalogOutput,
  )
  .option(
    '-t, --tech-sheets <dir>',
    'Path to the tech sheets directory',
    PATHS.techSheetsDir,
  )
  .option(
    '-o, --output <file>',
    'Output path for the generated filter data JSON',
    PATHS.filterDataOutput,
  )
  .action(
    async (options: {
      catalog: string
      techSheets: string
      output: string
    }) => {
      const { catalog, techSheets, output } = options

      spinner.start('Building filter data from tech sheets…')

      try {
        const { data, locale } = await buildFilterData({
          catalogPath: catalog,
          techSheetsDir: techSheets,
        })

        const outputPath = await saveToFile({
          path: output,
          content: serializeFilterDataToTs(data),
        })

        const localeOutputPath = await saveToFile({
          path: PATHS.filterLocaleOutput(locale.id),
          content: serializeFilterLocaleToTs(locale.id, locale.translations),
        })

        spinner.success(
          `Filter data saved to ${outputPath}, locale to ${localeOutputPath}`,
        )
        process.exit(0)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        spinner.error(`Failed to build filter data: ${message}`)
        process.exit(1)
      }
    },
  )
