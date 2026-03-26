import {
  scrapeTechSheets,
  type TechSheet,
} from '~/features/tech-sheets-scraper/lib/scrape-tech-sheets'
import { getBrowser } from '~/lib/get-browser'
import { type OutputTree } from '~/types'

export async function* scrapeTechsheetsStream(
  input: OutputTree[],
): AsyncGenerator<TechSheet[]> {
  const browser = await getBrowser()

  for (const { make, models } of input) {
    for (const { generations, ...model } of models) {
      for (const generation of generations) {
        const techSheets = await scrapeTechSheets(browser, {
          make,
          model,
          generation,
        })

        yield techSheets
      }
    }
  }
}
