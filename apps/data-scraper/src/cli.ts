import { Command } from 'commander'
import { getAppMetadata } from '~/lib/get-app-metadata'
import { scrapeMakes } from '~/commands/scrape-makes'
import initializeSpinner from 'yocto-spinner'

const program = new Command()

const spinner = initializeSpinner({
  color: 'cyan',
})

const appMetadata = getAppMetadata()

program
  .name(appMetadata.name)
  .description(appMetadata.description)
  .version(appMetadata.version)

program
  .command('scrape-makes')
  .description('Scrape vehicle makes data from the source website')
  // TODO: Add `output` argument to store makes in a file
  // TODO: Add `format` argument to specify the output format (e.g., JSON, CSV)
  .action(async () => {
    try {
      spinner.start('Starting to scrape makes...')
      // TODO: Add progress reporting to the spinner
      const makes = await scrapeMakes()
      spinner.success(`Successfully scraped ${makes.length} makes.`)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      spinner.error(`Error scraping makes: ${errorMessage}`)
      process.exit(1)
    } finally {
      spinner.stop()
    }
  })

program.parse()
