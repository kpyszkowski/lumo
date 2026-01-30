import { type Browser } from 'puppeteer'
import { type Model, type Make, type PageContext } from '~/types'
import { getPathFromURL } from '~/utils/get-path-from-url'
import { getXPathSelector } from '~/utils/get-x-path-selector'
import { slugify } from '~/utils/slugify'

const PAGE_CONTEXT_XPATH = getXPathSelector('//*[@id="vike_pageContext"]')

type ScrapeModelsParameters = {
  make: Make
}

/**
 * Scrapes vehicle models for each make from the source website.
 * @param makes - An array of {@link Make} objects to scrape models for.
 * @returns A promise that resolves to an array of tuples, each containing a make ID and an array of its corresponding {@link Model} objects.
 */
export async function scrapeModels(
  browser: Browser,
  options: ScrapeModelsParameters,
): Promise<Model[]> {
  const { make } = options

  const page = await browser.newPage()
  await page.goto(`https://www.autobild.de/marken-modelle/${make.sourceId}`)

  const data = await page.$eval(PAGE_CONTEXT_XPATH, (element) => {
    const data = JSON.parse(element.textContent) as PageContext
    return data.irContent.brandPage.models.map(({ mdbAssignment, url }) => {
      const name = mdbAssignment.brands[0].models[0].name

      return {
        url,
        name,
      }
    })
  })

  await page.close()

  const models = data.map(({ name, url }) => {
    const [, , sourceId = ''] = getPathFromURL(url)
    const id = slugify(name)

    return {
      id,
      sourceId,
      name,
    } satisfies Model
  })

  return models
}
