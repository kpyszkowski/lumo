import { Command } from 'commander'
import { extname } from 'node:path'
import initializeSpinner from 'yocto-spinner'
import { scrapeMakes } from '~/features/makes/lib/scrape-makes'
import { saveToFile } from '~/lib/save-to-file'
import { formatAsCSV } from '~/utils/format-as-csv'
import { getTemporaryFilePath } from '~/lib/get-temporary-file'

const spinner = initializeSpinner({
  color: 'cyan',
})

const DEFAULT_OUTPUT = getTemporaryFilePath()

export const scrapeMakesCommand = new Command('scrape-makes')
  .description('Scrape vehicle makes data from the source website')
  .option(
    '-o, --output <file>',
    'Output file path to save the scraped makes data (format determined by extension: .json, .csv)',
    DEFAULT_OUTPUT,
  )
  .action(async (options: { output: string }) => {
    const { output } = options

    try {
      spinner.start('Scraping makes...')
      const makes = await scrapeMakes()

      const extension = extname(output).toLowerCase()
      const format = extension === '.csv' ? 'CSV' : 'JSON'

      let content: string

      switch (format) {
        case 'CSV':
          content = formatAsCSV(makes)
          break
        case 'JSON':
          content = JSON.stringify(makes, null, 2)
          break
      }

      const outputPath = await saveToFile({
        path: options.output,
        content,
      })

      if (outputPath === DEFAULT_OUTPUT) {
        console.log('\n', JSON.stringify(makes, null, 2))
        spinner.success(`Successfully scraped ${makes.length} makes.`)
      }

      spinner.success(
        `Successfully scraped ${makes.length} makes saved as ${format.toUpperCase()} to ${outputPath}.`,
      )

      process.exit(0)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      spinner.error(`Error scraping makes: ${errorMessage}`)

      process.exit(1)
    }
  })
