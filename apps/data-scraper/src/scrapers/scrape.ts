import { scrapeGenerations } from '~/scrapers/scrape-generations'
import { scrapeMakes } from '~/scrapers/scrape-makes'
import { scrapeModels } from '~/scrapers/scrape-models'
import { type Make, type Model, type Generation } from '~/types'

/**
 * Scrapes vehicle makes, models, or generations from the source website.
 */
export async function scrape(): Promise<Make[]>

/**
 * Scrapes vehicle models for a specific make from the source website.
 * @param make - The {@link Make} object to scrape models for.
 */
export async function scrape(make: Make): Promise<Model[]>

/**
 * Scrapes vehicle generations for a specific make and model from the source website.
 * @param make The {@link Make} object to scrape generations for.
 * @param model The {@link Model} object to scrape generations for.
 */
export async function scrape(make: Make, model: Model): Promise<Generation[]>

export async function scrape(
  make?: Make,
  model?: Model,
): Promise<Make[] | Model[] | Generation[]> {
  if (!make) {
    const makes = await scrapeMakes()
    return makes
  }

  if (make && !model) {
    const models = await scrapeModels({ make })
    return models
  }

  if (make && model) {
    const generations = await scrapeGenerations({ make, model })
    return generations
  }

  throw new Error('Invalid arguments')
}
