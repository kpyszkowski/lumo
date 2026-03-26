import { dirname, resolve } from 'path'
import { mkdir, writeFile } from 'fs/promises'

interface SaveToFileOptions {
  path: string
  content: string
}

/**
 * Saves content to a specified file path, creating directories as needed.
 * @param options An {@link SaveToFileOptions} object containing the file path and content to save.
 * @returns A promise that resolves to the absolute path of the saved file.
 */
export async function saveToFile(options: SaveToFileOptions): Promise<string> {
  const outputDir = dirname(options.path)
  await mkdir(outputDir, { recursive: true })
  await writeFile(options.path, options.content, 'utf8')
  return resolve(options.path)
}
