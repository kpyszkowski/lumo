/**
 * Wraps XPath string with Puppeteer's custom XPath selector syntax.
 * @param xPathString - The XPath string to be wrapped.
 * @returns The wrapped XPath selector string.
 */
export function getXPathSelector(xPathString: string) {
  return `::-p-xpath(${xPathString})`
}
