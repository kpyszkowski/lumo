/**
 * Get path segments from a URL
 * @param url - The URL to extract path segments from
 * @returns An array of path segments
 */
export function getPathFromURL(url: URL | string): string[] {
  const parsedURL = new URL(url)
  return parsedURL.pathname.split('/').filter(Boolean)
}
