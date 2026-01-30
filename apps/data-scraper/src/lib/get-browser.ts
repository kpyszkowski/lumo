import { type Browser, type LaunchOptions } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

export type { LaunchOptions }

puppeteer.use(StealthPlugin())

/**
 * Get a singleton browser instance with the given launch options.
 * @param options {@link LaunchOptions} for the browser.
 * @returns A promise that resolves to the browser instance.
 */
export function getBrowser(
  options: LaunchOptions = {
    headless: true,
  },
): Promise<Browser> {
  try {
    return puppeteer.launch(options)
  } catch (error) {
    console.error('Error launching browser:', error)
    throw error
  }
}
