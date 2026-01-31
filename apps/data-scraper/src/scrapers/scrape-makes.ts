import { type Browser } from 'puppeteer'
import { type Make, type PageData } from '~/types'
import { getPathFromURL } from '~/utils/get-path-from-url'
import { slugify } from '~/utils/slugify'

const PAGE_DATA_SELECTOR = '#__NEXT_DATA__'

/**
 * Scrapes a list of vehicle makes from a specified source.
 * @returns A promise that resolves to an array of {@link Make} objects.
 */
export async function scrapeMakes(browser: Browser): Promise<Make[]> {
  const page = await browser.newPage()
  await page.goto('https://www.auto-motor-und-sport.de/marken-modelle/')

  const data = await page.$eval(PAGE_DATA_SELECTOR, (element) => {
    const pageData = JSON.parse(element.textContent) as PageData

    const makesData =
      pageData.props.pageProps.pageData.data.mobile.find(
        (item) => item.id === 'brandtree.overview',
      )?.data.allBrands ?? []

    return makesData.map(({ title, url }) => {
      return {
        url,
        title,
      }
    })
  })

  await page.close()

  return data.map(({ title, url }) => {
    const [, sourceId = ''] = getPathFromURL(url)
    const id = slugify(title)
    return {
      id,
      sourceId,
      name: title,
    }
  })
}
