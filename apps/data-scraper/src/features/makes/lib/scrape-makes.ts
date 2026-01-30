import { getBrowser } from '~/lib/get-browser'
import { getPathFromURL } from '~/utils/get-path-from-url'
import { getXPathSelector } from '~/utils/get-x-path-selector'
import { slugify } from '~/utils/slugify'

export interface Make {
  /**
   * The unique identifier for the make. It's slugified version of the name.
   * @dev It's a prefferred way to reference makes in consumer applications.
   */
  id: string
  /**
   * The source identifier for the make.
   * @dev Used to link to the original data source - eg. in URLs or selectors.
   */
  sourceId: string
  /**
   * The human-readable name of the make.
   */
  name: string
}

type PageContext = {
  irContent: {
    brandsAZ: {
      brands: {
        name: string
        url: string
      }[]
    }
  }
}

const PAGE_CONTEXT_XPATH = getXPathSelector('//*[@id="vike_pageContext"]')

/**
 * Scrapes a list of vehicle makes from a specified source.
 * @returns A promise that resolves to an array of {@link Make} objects.
 */
export async function scrapeMakes(): Promise<Make[]> {
  const browser = await getBrowser()

  const page = await browser.newPage()
  await page.goto('https://www.autobild.de/marken-modelle/')

  const data = await page.$eval(PAGE_CONTEXT_XPATH, (element) => {
    const data = JSON.parse(element.textContent) as PageContext

    return data.irContent.brandsAZ.brands.map(({ name, url }) => {
      return {
        url,
        name,
      }
    })
  })

  await browser.close()

  return data.map(({ name, url }) => {
    const [, sourceId = ''] = getPathFromURL(url)
    const id = slugify(name)
    return {
      id,
      sourceId,
      name,
    }
  })
}
