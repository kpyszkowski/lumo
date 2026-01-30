import { getBrowser } from '~/lib/get-browser'
import { scrapeGenerations } from '~/scrapers/scrape-generations'
import { scrapeMakes } from '~/scrapers/scrape-makes'
import { scrapeModels } from '~/scrapers/scrape-models'
import { type Make, type Model, type Generation } from '~/types'

export type ScrapeEvent =
  | { type: 'make'; make: Make }
  | { type: 'model'; make: Make; model: Model }
  | { type: 'generation'; make: Make; model: Model; generation: Generation }

export async function* scrapeStream(): AsyncGenerator<ScrapeEvent> {
  const browser = await getBrowser()

  const makes = await scrapeMakes(browser)

  for (const make of makes) {
    yield { type: 'make', make }

    const models = await scrapeModels(browser, { make })

    for (const model of models) {
      yield { type: 'model', make, model }

      const generations = await scrapeGenerations(browser, { make, model })
      for (const generation of generations) {
        yield {
          type: 'generation',
          make,
          model,
          generation,
        }
      }
    }
  }
}
