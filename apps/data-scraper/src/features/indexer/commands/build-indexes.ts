import { input as inputPrompt } from '@inquirer/prompts'
import { Command } from 'commander'
import initializeSpinner from 'yocto-spinner'
import { readFile } from 'fs/promises'
import { buildDataIndexes } from '~/features/indexer/lib/build-data-indexes'
import { saveToFile } from '~/lib/save-to-file'

const spinner = initializeSpinner({ color: 'cyan' })

export const buildIndexes = new Command('build-indexes')
  .description('Builds indexes from scraped vehicle data')
  .option('-i, --input <file>', 'Input JSON file')
  .option('-o, --output <file>', 'Output JSON file')
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

    spinner.start('Indexing vehicle data…')

    try {
      const fileContent = await readFile(input, 'utf-8')
      const data = JSON.parse(fileContent)

      const indexedData = buildDataIndexes(data)
      await saveToFile({
        path: output,
        content: JSON.stringify(indexedData, null, 2),
      })

      spinner.success(
        `Indexing completed successfully, output saved to ${output}.`,
      )
      process.exit(0)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      spinner.error(`Indexing failed: ${message}`)
      process.exit(1)
    }
  })
