import { Command } from 'commander'
import initializeSpinner from 'yocto-spinner'
import { getTemporaryFilePath } from '~/lib/get-temporary-file'
import { readFile } from 'fs/promises'
import { type Make } from '~/features/makes/lib/scrape-makes'
import {
  type Generation,
  scrapeGenerations,
} from '~/features/generations/lib/scrape-generations'
import { extname } from 'path'
import { formatAsCSV } from '~/utils/format-as-csv'
import { saveToFile } from '~/lib/save-to-file'
import { type Model } from '~/features/models/lib/scrape-models'

const spinner = initializeSpinner({
  color: 'cyan',
})

const DEFAULT_SOURCE = getTemporaryFilePath()

export const scrapeGenerationsCommand = new Command('scrape-generations')
  .description('Scrape vehicle generations data from source websites')
  .option(
    '-s, --source <makesFile>',
    'Input file path containing makes data to scrape generations for (in JSON format)',
    DEFAULT_SOURCE,
  )
  .requiredOption(
    '-o, --output <file>',
    'Output file path to save the scraped makes data (format determined by extension: .json, .csv).',
  )
  .action(async (options: { output: string; source: string }) => {
    const { output, source } = options

    try {
      spinner.start('Scraping generations...')

      if (source !== DEFAULT_SOURCE) {
        spinner.info(`Using makes data from source file: ${source}`)
      }

      const models = await readFile(source, 'utf-8').then<
        {
          make: Make
          models: (Model & { generations: Generation[] })[]
        }[]
      >(JSON.parse)

      const generations = await scrapeGenerations({
        models,
        onProgress: (make, generations) =>
          // TODO: Investigate why it doesn't work
          spinner.info(
            `Scraped ${generations.length} generations for make: ${make.name}`,
          ),
      })

      const extension = extname(output).toLowerCase()
      const format = extension === '.csv' ? 'CSV' : 'JSON'

      let content: string

      switch (format) {
        case 'CSV':
          content = formatAsCSV(generations)
          break
        case 'JSON':
          content = JSON.stringify(generations, null, 2)
          break
      }

      const outputPath = await saveToFile({
        path: options.output,
        content,
      })

      spinner.success(
        `Successfully scraped ${generations.length} makes saved as ${format.toUpperCase()} to ${outputPath}.`,
      )

      process.exit(0)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      spinner.error(`Error scraping generations: ${errorMessage}`)

      process.exit(1)
    }
  })
