import { parsePage } from '~/lib/parse-page'
import { removeURLTrailingSlash } from '~/utils/remove-url-trailing-slash'
import { slugify } from '~/utils/slugify'

interface Make {
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

const MAKES_URL = 'https://www.autobild.de/marken-modelle/'

const MAKE_ELEMENT_SELECTOR = '.brandTeaser'
const MAKE_ELEMENT_ANCHOR_SELECTOR = 'a.brandTeaser__link'
const MAKE_ELEMENT_NAME_SELECTOR = '.brandTeaser__title'

/**
 * Scrapes a list of vehicle makes from a specified source.
 * @param onProgress Optional callback function that reports progress with current count of scraped makes
 * @returns A promise that resolves to an array of {@link Make} objects.
 */
export async function scrapeMakes(): Promise<Make[]> {
  return parsePage({
    url: MAKES_URL,
    handleParse: async (page) => {
      const parsed: Make[] = []
      const makeElements = await page.$$(MAKE_ELEMENT_SELECTOR)

      for (const makeElement of makeElements) {
        const makeAnchorElement = await makeElement.$(
          MAKE_ELEMENT_ANCHOR_SELECTOR,
        )
        if (!makeAnchorElement) continue

        const makeNameElement = await makeElement.$(MAKE_ELEMENT_NAME_SELECTOR)
        if (!makeNameElement) continue

        const makeAnchorElementHref =
          await makeAnchorElement.getProperty('href')
        const makeAnchorElementHrefValue =
          await makeAnchorElementHref.jsonValue()

        const makeURL = removeURLTrailingSlash(
          new URL(makeAnchorElementHrefValue),
        )

        // Pathname shape is `/marken-modelle/{sourceId}`
        const [, sourceId] = makeURL.pathname.split('/').slice(1)
        const name = await makeNameElement.evaluate((element) =>
          element.textContent.trim(),
        )

        if (!sourceId || !name) continue

        const id = slugify(name)

        parsed.push({
          id,
          sourceId,
          name,
        })
      }

      return parsed
    },
  })
}
