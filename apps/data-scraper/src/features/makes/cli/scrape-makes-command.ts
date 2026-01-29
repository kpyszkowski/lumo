import { Command } from 'commander'
import initializeSpinner from 'yocto-spinner'
import { scrapeMakes } from '~/features/makes/lib/scrape-makes'

const spinner = initializeSpinner({
  color: 'cyan',
})

export const scrapeMakesCommand = new Command('scrape-makes')
  .description('Scrape vehicle makes data from the source website')
  // TODO: Add `output` argument to store makes in a file
  // TODO: Add `format` argument to specify the output format (e.g., JSON, CSV)
  .action(async () => {
    try {
      spinner.start('Starting to scrape makes...')
      // TODO: Add progress reporting to the spinner
      const makes = await scrapeMakes()
      spinner.success(`Successfully scraped ${makes.length} makes.`)

      process.exit(0)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      spinner.error(`Error scraping makes: ${errorMessage}`)

      process.exit(1)
    } finally {
      spinner.stop()
    }
  })
