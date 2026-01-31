import { type Browser } from 'puppeteer'
import {
  type Model,
  type Make,
  type PageData,
  type Generation,
  type PageDataTechSheets,
} from '~/types'
import { slugify } from '~/utils/slugify'

const PAGE_DATA_SELECTOR = '#__NEXT_DATA__'

type ScrapeModelsParameters = {
  make: Make
  model: Model
  generation: Generation
}

export interface TechSheet {
  data: PageDataTechSheets['techData'][number]['techdata']
  metadata: {
    id: string
    sourceIds: {
      make: string
      model: string
      generation: string
    }
    createdAt: string
  }
}

/**
 * Scrapes vehicle tech sheets for a given make, model, and generation from the source website.
 * @param browser An instance of the Puppeteer Browser.
 * @param options An {@link ScrapeModelsParameters} object containing make, model, and generation information.
 * @returns A promise that resolves to an array of {@link TechSheet} objects.
 */
export async function scrapeTechSheets(
  browser: Browser,
  options: ScrapeModelsParameters,
): Promise<TechSheet[]> {
  const { make, model, generation } = options

  const page = await browser.newPage()
  await page.goto(
    `https://www.auto-motor-und-sport.de/marken-modelle/${make.sourceId}/${model.sourceId}/${generation.sourceId}`,
  )
  await page.waitForSelector(PAGE_DATA_SELECTOR, {
    timeout: 10000,
  })

  // It ocassionally timeouts couldn't find selector.
  // TODO: Investigate

  const data = await page.$eval(PAGE_DATA_SELECTOR, (element) => {
    const pageData = JSON.parse(element.textContent) as PageData

    return (
      pageData.props.pageProps.pageData.data.mobile.find(
        (item) => item.id === 'brandtree.navigation',
      )?.techData ?? []
    )
  })

  await page.close()

  return data.map(({ techdata }) => {
    const versionId = slugify(techdata.Modell_Name)
    const id = slugify([make.name, versionId].join(' '))

    return {
      data: techdata,
      metadata: {
        id,
        sourceIds: {
          make: make.sourceId,
          model: model.sourceId,
          generation: generation.sourceId,
        },
        createdAt: new Date().toISOString(),
      },
    }
  })
}
