import { Command } from 'commander'
import { extname } from 'node:path'
import initializeSpinner from 'yocto-spinner'
import { scrapeMakes } from '~/features/makes/lib/scrape-makes'
import { saveToFile } from '~/lib/save-to-file'
import { formatAsCSV } from '~/utils/format-as-csv'

const spinner = initializeSpinner({
  color: 'cyan',
})

export const scrapeMakesCommand = new Command('scrape-makes')
  .description('Scrape vehicle makes data from the source website')
  .option(
    '-o, --output <file>',
    'Output file path to save the scraped makes data (format determined by extension: .json, .csv)',
  )
  .action(async (options: { output?: string }) => {
    try {
      spinner.start('Starting to scrape makes...')
      const makes = await scrapeMakes()

      if (options.output) {
        const extension = extname(options.output).toLowerCase()
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

        spinner.success(
          `Successfully scraped ${makes.length} makes saved as ${format.toUpperCase()} to ${outputPath}.`,
        )
        process.exit(0)
      }

      console.log('\n', JSON.stringify(makes, null, 2))
      spinner.success(`Successfully scraped ${makes.length} makes.`)
      process.exit(0)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      spinner.error(`Error scraping makes: ${errorMessage}`)

      process.exit(1)
    }
  })
