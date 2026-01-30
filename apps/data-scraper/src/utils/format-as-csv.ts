/**
 * Formats an array of objects as a CSV string.
 * @param data - Array of objects to format
 * @returns CSV formatted string
 */
export function formatAsCSV<TRow extends object>(data: TRow[]): string {
  if (data.length === 0) {
    return ''
  }

  const headers = Object.keys(data[0] as unknown as string)

  const rows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => JSON.stringify(row[header as keyof TRow] ?? ''))
        .join(','),
    ),
  ]

  return rows.join('\n')
}
