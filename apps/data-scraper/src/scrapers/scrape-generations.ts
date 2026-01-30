import { type Browser } from 'puppeteer'
import {
  type Generation,
  type PageContext,
  type Make,
  type Model,
} from '~/types'
import { getPathFromURL } from '~/utils/get-path-from-url'
import { getXPathSelector } from '~/utils/get-x-path-selector'
import { slugify } from '~/utils/slugify'

const PAGE_CONTEXT_XPATH = getXPathSelector('//*[@id="vike_pageContext"]')

type ScrapeGenerationsParameters = {
  make: Make
  model: Model
}

/**
 * Scrapes vehicle models for each make from the source website.
 * @param makes - An array of {@link Make} objects to scrape models for.
 * @returns A promise that resolves to an array of tuples, each containing a make ID and an array of its corresponding {@link Model} objects.
 */
export async function scrapeGenerations(
  browser: Browser,
  options: ScrapeGenerationsParameters,
): Promise<Generation[]> {
  const { make, model } = options

  const page = await browser.newPage()

  await page.goto(
    `https://www.autobild.de/marken-modelle/${make.sourceId}/${model.sourceId}`,
  )

  const data = await page.$eval(PAGE_CONTEXT_XPATH, (element) => {
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
  })

  await page.close()

  const generations = data.map(({ name, url, productionYears }) => {
    const id = slugify(name)
    const [, , , sourceId = ''] = getPathFromURL(url)

    return {
      id,
      sourceId,
      name,
      productionYears,
    }
  })

  return generations
}
