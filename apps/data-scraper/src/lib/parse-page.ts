import { type Page } from 'puppeteer'
import { getBrowser, type LaunchOptions } from '~/lib/get-browser'

export interface ParsePageOptions<TEvaluated> {
  /** The URL of the webpage to scrape. */
  url: string
  /** A callback function that handles the parsing of the page. */
  handleParse: (page: Page) => TEvaluated
  /**
   * Optional Puppeteer's {@link LaunchOptions }.
   */
  browserOptions?: LaunchOptions
}

/**
 * Handles the scraping of a webpage.
 * @param options.url            The URL of the webpage to scrape.
 * @param options.onEvaluatePage A callback function that handles the parsing of
 *                               the page.
 * @param options.browserOptions Optional Puppeteer launch options.
 * @returns The result of the evaluation from the onEvaluatePage callback.
 */
export async function parsePage<TEvaluated>(
  options: ParsePageOptions<TEvaluated>,
): Promise<TEvaluated> {
  const { url, handleParse, browserOptions } = options

  const browser = await getBrowser(browserOptions)

  const page = await browser.newPage()
  await page.exposeFunction('handleParse', handleParse)
  await page.goto(url)

  try {
    return await handleParse(page)
  } catch (error) {
    console.error(`Error while scraping ${url}:`, error)
    throw error
  } finally {
    page.close()
  }
}
