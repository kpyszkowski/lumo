import { getBrowser } from '~/lib/get-browser'
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

/**
 * Scrapes a list of vehicle makes from a specified source.
 * @returns A promise that resolves to an array of {@link Make} objects.
 */
export async function scrapeMakes(): Promise<Make[]> {
  const browser = await getBrowser()

  const page = await browser.newPage()
  await page.goto('https://www.autobild.de/marken-modelle/')

  const content = await page.evaluate(() => {
    const MAKE_ELEMENT_SELECTOR = '.brandTeaser'
    const MAKE_ELEMENT_ANCHOR_SELECTOR = 'a.brandTeaser__link'
    const MAKE_ELEMENT_NAME_SELECTOR = '.brandTeaser__title'

    const makeElements = Array.from(
      document.querySelectorAll<HTMLElement>(MAKE_ELEMENT_SELECTOR),
    )

    return makeElements.map((element) => {
      const anchorElement = element.querySelector<HTMLAnchorElement>(
        MAKE_ELEMENT_ANCHOR_SELECTOR,
      )
      const nameElement = element.querySelector<HTMLElement>(
        MAKE_ELEMENT_NAME_SELECTOR,
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

  await browser.close()

  const data = content.map((make) => ({
    ...make,
    id: slugify(make.name),
  }))

  return data
}
