import { input } from '@inquirer/prompts'
import { Command } from 'commander'
import initializeSpinner from 'yocto-spinner'

import { scrapeStream } from '~/scrapers/scrape-stream'
import { createOutputAggregator } from '~/lib/create-output-aggregator'
import { createJsonArrayWriter } from '~/lib/create-json-array-writer'

const spinner = initializeSpinner({ color: 'cyan' })

export const scrape = new Command('scrape')
  .description('Scrape vehicle makes, models and generations')
  .option('-o, --output <file>', 'Output JSON file')
  .action(async (options: { output?: string }) => {
    process.on('SIGINT', () => {
      spinner.info('Interrupted, closing output file…')
      writer.close()
      process.exit(130)
    })

    const output =
      options.output ??
      (await input({
        message: 'Where would you like to save the output?',
        default: options.output,
        required: !options.output,
      }))

    const writer = createJsonArrayWriter(output)
    const aggregator = createOutputAggregator()

    let makes = 0
    let models = 0
    let generations = 0

    spinner.start('Scraping vehicle data…')

    try {
      for await (const event of scrapeStream()) {
        const finishedMake = aggregator.push(event)

        if (finishedMake) {
          writer.write(finishedMake)
        }

        switch (event.type) {
          case 'make':
            makes++
            break
          case 'model':
            models++
            break
          case 'generation':
            generations++
            spinner.text = `Scraped ${event.make.name} ${event.model.name} (${event.generation.type})\n(${makes} makes / ${models} models / ${generations} generations)`
            break
        }
      }

      const last = aggregator.flush()
      if (last) {
        writer.write(last)
      }

      spinner.success(
        `Scraped ${makes} makes, ${models} models, ${generations} generations`,
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      spinner.error(`Scraping failed: ${message}`)
      process.exitCode = 1
    } finally {
      writer.close()
    }
  })
