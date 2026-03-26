import packageJson from '../../package.json'

export type AppMetadata = Pick<
  typeof packageJson,
  'name' | 'version' | 'description' | 'author' | 'license'
>

/**
 * Retrieves application metadata from `package.json`.
 * @returns An {@link AppMetadata} object containing the app's metadata.
 */
export function getAppMetadata(): AppMetadata {
  const { name, version, description, author, license } = packageJson

  return {
    name,
    version,
    description,
    author,
    license,
  }
}
