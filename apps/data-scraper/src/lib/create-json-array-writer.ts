import { createWriteStream } from 'node:fs'

export interface JsonArrayWriter {
  /**
   * Writes an object to the JSON array.
   * @param obj The object to write to the JSON array.
   */
  write(obj: unknown): void
  /**
   * Closes the JSON array and the underlying file stream.
   */
  close(): void
}

/**
 * Creates a writer that writes JSON objects to a file as a JSON array.
 * @param output The output file path.
 * @returns A {@link JsonArrayWriter} instance.
 */
export function createJsonArrayWriter(output: string) {
  const stream = createWriteStream(output)
  let first = true

  stream.write('[\n')

  return {
    write(obj: unknown) {
      if (!first) stream.write(',\n')
      first = false
      stream.write(JSON.stringify(obj, null, 2))
    },
    close() {
      stream.write('\n]\n')
      stream.end()
    },
  }
}
