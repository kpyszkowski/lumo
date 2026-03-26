import { Command } from 'commander'
import { readFile } from 'fs/promises'
import initializeSpinner from 'yocto-spinner'
import { scrapeStream } from '~/features/scraper/lib/scrape-stream'
import { scrapeTechsheetsStream } from '~/features/tech-sheets-scraper/lib/scrape-tech-sheets-stream'
import { buildFilterData } from '~/features/filter-builder/lib/build-filter-data'
import {
  serializeFilterDataToTs,
  serializeFilterLocaleToTs,
} from '~/features/filter-builder/lib/serialize-to-ts'
import { createJsonArrayWriter } from '~/lib/create-json-array-writer'
import { createOutputAggregator } from '~/lib/create-output-aggregator'
import { saveToFile } from '~/lib/save-to-file'
import { PATHS } from '~/lib/paths'
import type { OutputTree } from '~/types'

const spinner = initializeSpinner({ color: 'cyan' })

export const generate = new Command('generate')
  .description(
    'Run the full pipeline: scrape catalog → scrape tech sheets → build filter data',
  )
  .option('-c, --catalog <file>', 'Catalog JSON path', PATHS.catalogOutput)
  .option(
    '-t, --tech-sheets <dir>',
    'Tech sheets directory',
    PATHS.techSheetsDir,
  )
  .option(
    '-o, --output <file>',
    'Filter data output path',
    PATHS.filterDataOutput,
  )
  .option('--skip-catalog', 'Skip catalog scraping (use existing catalog file)')
  .option(
    '--skip-tech-sheets',
    'Skip tech sheets scraping (use existing tech sheets dir)',
  )
  .action(
    async (options: {
      catalog: string
      techSheets: string
      output: string
      skipCatalog?: boolean
      skipTechSheets?: boolean
    }) => {
      const { catalog, techSheets, output, skipCatalog, skipTechSheets } =
        options

      process.on('SIGINT', () => {
        spinner.info('Interrupted')
        process.exit(130)
      })

      // ── Step 1: Catalog ────────────────────────────────────────────────────
      if (!skipCatalog) {
        spinner.start('Step 1/3 — Scraping catalog…')

        const writer = createJsonArrayWriter(catalog)
        const aggregator = createOutputAggregator()
        let makes = 0,
          models = 0,
          generations = 0

        try {
          for await (const event of scrapeStream()) {
            const finished = aggregator.push(event)
            if (finished) writer.write(finished)

            switch (event.type) {
              case 'make':
                makes++
                break
              case 'model':
                models++
                break
              case 'generation':
                generations++
                spinner.text = `Step 1/3 — Scraping catalog… ${makes} makes / ${models} models / ${generations} generations`
                break
            }
          }

          const last = aggregator.flush()
          if (last) writer.write(last)

          spinner.success(
            `Step 1/3 — Catalog: ${makes} makes, ${models} models, ${generations} generations → ${catalog}`,
          )
        } catch (error) {
          writer.close()
          const message =
            error instanceof Error ? error.message : 'Unknown error'
          spinner.error(`Step 1/3 — Catalog scraping failed: ${message}`)
          process.exit(1)
        } finally {
          writer.close()
        }
      } else {
        spinner.info('Step 1/3 — Catalog scraping skipped')
      }

      // ── Step 2: Tech sheets ────────────────────────────────────────────────
      if (!skipTechSheets) {
        spinner.start('Step 2/3 — Scraping tech sheets…')

        try {
          const catalogRaw = await readFile(catalog, 'utf-8')
          const data: OutputTree[] = JSON.parse(catalogRaw)
          let saved = 0

          for await (const sheets of scrapeTechsheetsStream(data)) {
            for (const sheet of sheets) {
              await saveToFile({
                path: `${techSheets}/${sheet.metadata.id}.json`,
                content: JSON.stringify(sheet, null, 2),
              })
              spinner.text = `Step 2/3 — Tech sheets: ${++saved} saved (last: ${sheet.metadata.id})`
            }
          }

          spinner.success(
            `Step 2/3 — Tech sheets: ${saved} saved → ${techSheets}/`,
          )
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Unknown error'
          spinner.error(`Step 2/3 — Tech sheets scraping failed: ${message}`)
          process.exit(1)
        }
      } else {
        spinner.info('Step 2/3 — Tech sheets scraping skipped')
      }

      // ── Step 3: Filter data ────────────────────────────────────────────────
      spinner.start('Step 3/3 — Building filter data…')

      try {
        const { data, locale } = await buildFilterData({
          catalogPath: catalog,
          techSheetsDir: techSheets,
        })

        const outputPath = await saveToFile({
          path: output,
          content: serializeFilterDataToTs(data),
        })

        await saveToFile({
          path: PATHS.filterLocaleOutput(locale.id),
          content: serializeFilterLocaleToTs(locale.id, locale.translations),
        })

        spinner.success(`Step 3/3 — Filter data saved to ${outputPath}`)
        process.exit(0)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        spinner.error(`Step 3/3 — Filter data build failed: ${message}`)
        process.exit(1)
      }
    },
  )
