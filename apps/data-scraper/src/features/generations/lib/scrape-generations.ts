import { type Make } from '~/features/makes/lib/scrape-makes'
import { type Model } from '~/features/models/lib/scrape-models'
import { getBrowser } from '~/lib/get-browser'
import { getPathFromURL } from '~/utils/get-path-from-url'
import { getXPathSelector } from '~/utils/get-x-path-selector'
import { slugify } from '~/utils/slugify'

export interface Generation {
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
  /**
   * The production years of the generation.
   */
  productionYears: number[]
}

type MakeModelGenerationsRecord = {
  make: Make
  models: (Model & { generations: Generation[] })[]
}

type PageContext = {
  irContent: {
    modelGeneration: {
      generations: {
        url: string
        buildingPeriod: {
          fromYear: number
          tillYear: number | null
        }
        mdbAssignment: {
          brands: [
            {
              models: [
                {
                  generations: [
                    {
                      name: string
                    },
                  ]
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

type ScrapeGenerationsOptions = {
  models: {
    make: Make
    models: Model[]
  }[]
  onProgress?: (make: Make, models: string[]) => void
}

/**
 * Scrapes vehicle models for each make from the source website.
 * @param makes - An array of {@link Make} objects to scrape models for.
 * @returns A promise that resolves to an array of tuples, each containing a make ID and an array of its corresponding {@link Model} objects.
 */
export async function scrapeGenerations(
  options: ScrapeGenerationsOptions,
): Promise<MakeModelGenerationsRecord[]> {
  const { models: modelsData } = options

  const browser = await getBrowser()

  const data: MakeModelGenerationsRecord[] = []

  for (const { make, models } of modelsData) {
    const modelsWithGenerations: MakeModelGenerationsRecord['models'] = []

    for (const model of models) {
      const page = await browser.newPage()

      await page.goto(
        `https://www.autobild.de/marken-modelle/${make.sourceId}/${model.sourceId}`,
      )

      const generationsData = await page.$eval(
        PAGE_CONTEXT_XPATH,
        (element) => {
          const data = JSON.parse(element.textContent) as PageContext
          return data.irContent.modelGeneration.generations.map(
            ({ buildingPeriod, mdbAssignment, url }) => {
              const name = mdbAssignment.brands[0].models[0].generations[0].name
              const { fromYear, tillYear } = buildingPeriod

              return {
                url,
                name,
                productionYears: tillYear ? [fromYear, tillYear] : [fromYear],
              }
            },
          )
        },
      )

      const generations = generationsData.map(
        ({ name, url, productionYears }) => {
          const id = slugify(name)
          const [, sourceId] = getPathFromURL(url)

          if (!sourceId) {
            throw new Error()
          }

          return {
            id,
            sourceId,
            name,
            productionYears,
          }
        },
      )

      console.log(
        `Scraped ${generations.length} generations for ${make.name} ${model.name}`,
      )

      modelsWithGenerations.push({
        ...model,
        generations,
      })

      page.close()
    }

    data.push({
      make,
      models: modelsWithGenerations,
    })
  }

  return data
}
