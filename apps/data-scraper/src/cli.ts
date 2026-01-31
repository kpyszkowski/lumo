import { Command } from 'commander'
import { getAppMetadata } from '~/lib/get-app-metadata'

import { slugify } from '~/utils/slugify'
import { scrape } from '~/features/scraper/commands/scrape'
import { buildIndexes } from '~/features/indexer/commands/build-indexes'

const program = new Command()
const appMetadata = getAppMetadata()

program
  .name(slugify(appMetadata.name))
  .description(appMetadata.description)
  .version(appMetadata.version)

program.addCommand(scrape)
program.addCommand(buildIndexes)

program.parse()
