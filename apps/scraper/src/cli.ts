import { Command } from 'commander'
import { getAppMetadata } from '~/lib/get-app-metadata'

import { slugify } from '~/utils/slugify'
import { scrape } from '~/features/scraper/commands/scrape'
import { scrateTechSheets } from '~/features/tech-sheets-scraper/commands/scrape-tech-sheets'
import { buildFilterDataCommand } from '~/features/filter-builder/commands/build-filter-data'
import { generate } from '~/features/pipeline/commands/generate'

const program = new Command()
const appMetadata = getAppMetadata()

program
  .name(slugify(appMetadata.name))
  .description(appMetadata.description)
  .version(appMetadata.version)

program.addCommand(scrape)
program.addCommand(scrateTechSheets)
program.addCommand(buildFilterDataCommand)
program.addCommand(generate)

program.parse()
