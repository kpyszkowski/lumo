import { type Make } from '~/features/makes/lib/scrape-makes'
import { getBrowser } from '~/lib/get-browser'
import { slugify } from '~/utils/slugify'

interface Model {
  /**
   * The unique identifier for the model. It's slugified version of the name.
   * @dev It's a prefferred way to reference models in consumer applications.
   */
  id: string
  /**
   * The source identifier for the model.
   * @dev Used to link to the original data source - eg. in URLs or selectors.
   */
  sourceId: string
  /**
   * The human-readable name of the model.
   */
  name: string
}

type MakeModelsPair = { makeId: string; models: Model[] }

type ScrapeModelsOptions = {
  makes: Make[]
  onProgress?: (make: Make, models: string[]) => void
}

/**
 * Scrapes vehicle models for each make from the source website.
 * @param makes - An array of {@link Make} objects to scrape models for.
 * @returns A promise that resolves to an array of tuples, each containing a make ID and an array of its corresponding {@link Model} objects.
 */
export async function scrapeModels(
  options: ScrapeModelsOptions,
): Promise<MakeModelsPair[]> {
  const { makes, onProgress } = options

  const browser = await getBrowser()

  const contents: Pick<Model, 'sourceId' | 'name'>[][] = []

  for (const make of makes) {
    const page = await browser.newPage()
    await page.goto(`https://www.autobild.de/marken-modelle/${make.sourceId}/`)

    const results = await page.evaluate(() => {
      const MODEL_ELEMENT_SELECTOR = '.modelTeaser'
      const MODEL_ELEMENT_ANCHOR_SELECTOR = 'a.modelTeaser__link'
      const MODEL_ELEMENT_NAME_SELECTOR = '.modelTeaser__title'

      const makeElements = Array.from(
        document.querySelectorAll<HTMLElement>(MODEL_ELEMENT_SELECTOR),
      )

      return makeElements.map((element) => {
        const anchorElement = element.querySelector<HTMLAnchorElement>(
          MODEL_ELEMENT_ANCHOR_SELECTOR,
        )
        const nameElement = element.querySelector<HTMLElement>(
          MODEL_ELEMENT_NAME_SELECTOR,
        )

        if (!anchorElement || !nameElement) {
          throw new Error('Make element is missing required child elements')
        }

        const url = new URL(anchorElement.href)
        const [, sourceId] = url.pathname.split('/').slice(1)
        if (!sourceId) {
          throw new Error('Unable to extract sourceId from make URL')
        }

        const name = nameElement.textContent?.trim() ?? ''

        return {
          sourceId,
          name,
        }
      })
    })

    if (onProgress) {
      onProgress(
        make,
        results.map((result) => result.name),
      )
    }

    await page.close()

    contents.push(results)
  }

  await browser.close()

  if (contents.length !== makes.length) {
    throw new Error(
      'Scraped models data length does not match makes data length',
    )
  }

  const data = contents.map((modelsData, index) => {
    const makeId = makes[index]!.id // Non-null assertion as lengths are verified above
    const models = modelsData.map((model) => ({
      ...model,
      id: slugify(model.name),
    }))

    return { makeId, models } satisfies MakeModelsPair
  })

  return data
}
