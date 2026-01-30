import { type Make } from '~/features/makes/lib/scrape-makes'
import { getBrowser } from '~/lib/get-browser'
import { getPathFromURL } from '~/utils/get-path-from-url'
import { getXPathSelector } from '~/utils/get-x-path-selector'
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

type MakeModelsPair = { make: Make; models: Model[] }

type PageContext = {
  irContent: {
    brandPage: {
      models: {
        url: string
        mdbAssignment: {
          brands: [
            {
              models: [
                {
                  name: string
                },
              ]
            },
          ]
        }
      }[]
    }
  }
}

const PAGE_CONTEXT_XPATH = getXPathSelector('//*[@id="vike_pageContext"]')

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

  const data: { url: string; name: string }[][] = []

  for (const make of makes) {
    const page = await browser.newPage()
    await page.goto(`https://www.autobild.de/marken-modelle/${make.sourceId}/`)

    const item = await page.$eval(PAGE_CONTEXT_XPATH, (element) => {
      const data = JSON.parse(element.textContent) as PageContext
      return data.irContent.brandPage.models.map(({ mdbAssignment, url }) => {
        const name = mdbAssignment.brands[0].models[0].name

        return {
          url,
          name,
        }
      })
    })

    console.log(`Found ${item.length} models of ${make.name}`)

    if (onProgress) {
      onProgress(
        make,
        item.map(({ name }) => name),
      )
    }

    data.push(item)
  }

  await browser.close()

  if (data.length !== makes.length) {
    throw new Error(
      'Scraped models data length does not match makes data length',
    )
  }

  return data.map((modelsData, index) => {
    const make = makes[index]! // Non-null assertion as lengths are verified above

    const models = modelsData.map(({ name, url }) => {
      const [, , sourceId = ''] = getPathFromURL(url)
      const id = slugify(name)

      return {
        id,
        sourceId,
        name,
      }
    })

    return { make, models }
  })
}
