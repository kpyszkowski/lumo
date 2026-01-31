import { input as inputPrompt } from '@inquirer/prompts'
import { Command } from 'commander'
import initializeSpinner from 'yocto-spinner'
import { readFile } from 'fs/promises'
import { scrapeTechsheetsStream } from '~/features/tech-sheets-scraper/lib/scrape-tech-sheets-stream'
import { saveToFile } from '~/lib/save-to-file'

const spinner = initializeSpinner({ color: 'cyan' })

export const scrateTechSheets = new Command('scrape-tech-sheets')
  .description('Scrape vehicle tech sheets')
  .option('-i, --input <file>', 'Input JSON file')
  .option('-o, --output <file>', 'Output catalog for scraped tech sheets')
  .action(async (options: { input?: string; output?: string }) => {
    const input =
      options.input ??
      (await inputPrompt({
        message: 'Where is the input file located?',
        default: options.input,
        required: true,
      }))

    const output =
      options.output ??
      (await inputPrompt({
        message: 'Where would you like to save the output?',
        default: options.output,
        required: !options.output,
      }))

    process.on('SIGINT', () => {
      spinner.info('Interrupted, closing output file…')
      process.exit(130)
    })

    spinner.start('Scraping vehicle tech data sheets...')

    try {
      const fileContent = await readFile(input, 'utf-8')
      const data = JSON.parse(fileContent)

      // TODO: Implement checkpointing to avoid losing progress on interruption
      // TODO: Implement ETL to extract key information from tech sheets

      let savedSheets = 0

      for await (const techSheets of scrapeTechsheetsStream(data)) {
        for (const techSheet of techSheets) {
          await saveToFile({
            path: `${output}/${techSheet.metadata.id}.json`,
            content: JSON.stringify(techSheet, null, 2),
          })

          spinner.text = [
            `Saved ${savedSheets++} tech sheets`,
            `Recently saved: ${techSheet.metadata.id}`,
          ].join('\n  ')
        }
      }

      spinner.success(
        `Scraped and saved ${savedSheets} tech sheets successfully!`,
      )
      process.exit(0)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      spinner.error(`Scraping failed: ${message}`)
      process.exit(1)
    }
  })
