import { Command } from 'commander'
import initializeSpinner from 'yocto-spinner'
import { getTemporaryFilePath } from '~/lib/get-temporary-file'
import { readFile } from 'fs/promises'
import { type Make } from '~/features/makes/lib/scrape-makes'
import { scrapeModels } from '~/features/models/lib/scrape-models'
import { extname } from 'path'
import { formatAsCSV } from '~/utils/format-as-csv'
import { saveToFile } from '~/lib/save-to-file'

const spinner = initializeSpinner({
  color: 'cyan',
})

const DEFAULT_SOURCE = getTemporaryFilePath()

export const scrapeModelsCommand = new Command('scrape-models')
  .description('Scrape vehicle models data from source websites')
  .option(
    '-s, --source <makesFile>',
    'Input file path containing makes data to scrape models for (in JSON format)',
    DEFAULT_SOURCE,
  )
  .requiredOption(
    '-o, --output <file>',
    'Output file path to save the scraped makes data (format determined by extension: .json, .csv).',
  )
  .action(async (options: { output: string; source: string }) => {
    const { output, source } = options

    try {
      spinner.start('Scraping models...')

      if (source !== DEFAULT_SOURCE) {
        spinner.info(`Using makes data from source file: ${source}`)
      }

      const makes = await readFile(source, 'utf-8').then<Make[]>(JSON.parse)

      const models = await scrapeModels({
        makes,
        onProgress: (make, models) =>
          // TODO: Investigate why it doesn't work
          spinner.info(
            `Scraped ${models.length} models for make: ${make.name}`,
          ),
      })

      const extension = extname(output).toLowerCase()
      const format = extension === '.csv' ? 'CSV' : 'JSON'

      let content: string

      switch (format) {
        case 'CSV':
          content = formatAsCSV(models)
          break
        case 'JSON':
          content = JSON.stringify(models, null, 2)
          break
      }

      const outputPath = await saveToFile({
        path: options.output,
        content,
      })

      spinner.success(
        `Successfully scraped ${models.length} makes saved as ${format.toUpperCase()} to ${outputPath}.`,
      )

      process.exit(0)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      spinner.error(`Error scraping models: ${errorMessage}`)

      process.exit(1)
    }
  })
