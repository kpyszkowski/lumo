import { type Browser } from 'puppeteer'
import { type Model, type Make, type PageData } from '~/types'
import { getPathFromURL } from '~/utils/get-path-from-url'
import { slugify } from '~/utils/slugify'

const PAGE_DATA_SELECTOR = '#__NEXT_DATA__'

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
  await page.goto(
    `https://www.auto-motor-und-sport.de/marken-modelle/${make.sourceId}`,
  )

  const data = await page.$eval(PAGE_DATA_SELECTOR, (element) => {
    const pageData = JSON.parse(element.textContent) as PageData

    const { current = [], past = [] } =
      pageData.props.pageProps.pageData.data.mobile.find(
        (item) => item.id === 'brandtree.listSeries',
      ) ?? {}

    return [...past, ...current].map(({ title, url }) => {
      return {
        name: title,
        url,
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
