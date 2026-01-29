import puppeteer, { type Browser, type LaunchOptions } from 'puppeteer'
import { createHash } from 'crypto'

let BROWSER: Browser | null
let BROWSER_LAUNCH_HASH: string | null

export type { LaunchOptions }

/**
 * Get a singleton browser instance with the given launch options.
 * @param options {@link LaunchOptions} for the browser.
 * @returns A promise that resolves to the browser instance.
 */
export function getBrowser(options: LaunchOptions = {}): Promise<Browser> {
  const launchHash = createHash('sha256')
    .update(JSON.stringify(options))
    .digest('hex')

  if (BROWSER && BROWSER_LAUNCH_HASH === launchHash) {
    return Promise.resolve(BROWSER)
  }

  try {
    return puppeteer.launch(options).then((browser) => {
      BROWSER = browser
      BROWSER_LAUNCH_HASH = launchHash
      return browser
    })
  } catch (error) {
    console.error('Error launching browser:', error)
    throw error
  }
}
