import { Command } from 'commander'
import { getAppMetadata } from '~/lib/get-app-metadata'

import { scrapeMakesCommand } from '~/features/makes/cli/scrape-makes-command'
import { slugify } from '~/utils/slugify'

const program = new Command()
const appMetadata = getAppMetadata()

program
  .name(slugify(appMetadata.name))
  .description(appMetadata.description)
  .version(appMetadata.version)

program.addCommand(scrapeMakesCommand)

program.parse()
