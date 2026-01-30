import tmp from 'tmp'

const TMP_FILE: tmp.FileResult | null = null

/**
 * Get a temporary file path with the specified postfix.
 * @param postfix - The postfix for the temporary file (default is '.json').
 * @returns The path to the temporary file.
 * @dev The file remains static to ensure consistent paths during execution.
 */
export function getTemporaryFilePath(postfix = '.json'): string {
  if (TMP_FILE) {
    return TMP_FILE.name
  }

  const tmpFile = tmp.fileSync({ postfix })
  return tmpFile.name
}
