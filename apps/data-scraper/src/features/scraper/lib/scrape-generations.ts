import { type Browser } from 'puppeteer'
import { type Generation, type Make, type Model, type PageData } from '~/types'
import { getPathFromURL } from '~/utils/get-path-from-url'
import { slugify } from '~/utils/slugify'

const PAGE_DATA_SELECTOR = '#__NEXT_DATA__'

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
    `https://www.auto-motor-und-sport.de/marken-modelle/${make.sourceId}/${model.sourceId}`,
  )

  const data = await page.$eval(PAGE_DATA_SELECTOR, (element) => {
    const data = JSON.parse(element.textContent) as PageData

    return (
      data.props.pageProps.pageData.data.mobile
        .find((item) => item.id === 'brandtree.listGenerationsBySeriesOverview')
        ?.data.map(({ name, type, url, productionStart, productionEnd }) => ({
          name,
          type,
          url,
          production: {
            start: parseInt(productionStart),
            end: parseInt(productionEnd) || null,
          },
        })) ?? []
    )
  })

  await page.close()

  const generations = data.map(({ name, type, url, production }) => {
    const id = slugify(type ?? name)
    const [, , , sourceId = ''] = getPathFromURL(url)

    return {
      id,
      sourceId,
      name,
      type,
      production,
    }
  })

  return generations
}
