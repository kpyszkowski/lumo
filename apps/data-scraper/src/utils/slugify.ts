/**
 * Converts a string into a URL-friendly slug (handles diacritics).
 * @param value The string to be slugified.
 * @returns The slugified string.
 */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
