/**
 * Removes trailing slashes from a URL string.
 * @param url The URL string to process.
 * @returns A new URL string without trailing slashes.
 */
export function removeURLTrailingSlash(url: string): string
/**
 * Removes trailing slashes from a URL.
 * @param url The URL to process.
 * @returns A new URL instance without trailing slashes.
 */
export function removeURLTrailingSlash(url: URL): URL
export function removeURLTrailingSlash(url: string | URL): string | URL {
  if (typeof url === 'string') {
    const validatedURL = new URL(url)
    return removeURLTrailingSlash(validatedURL).toString()
  }
  return new URL(url.href.replace(/\/+$/, ''))
}
