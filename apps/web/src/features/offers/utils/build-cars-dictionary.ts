import {
  type Generation,
  type Make,
} from '~/features/offers/lib/data/car/source'

/**
 * A generation is the leaf of the hierarchy, so it stays as the bare source
 * shape — there is nothing below it to index.
 */
type GenerationEntry = Generation

/**
 * A model node carries only its own display name plus a lowercased-name → child
 * index. It does not hold the raw `Generation[]`; that data lives one level down.
 */
type ModelEntry = {
  name: string
  generations: Map<string, GenerationEntry>
}

/**
 * A make node carries only its own display name plus a lowercased-name → child
 * index. It does not hold the raw `Model[]`; that data lives one level down.
 */
type MakeEntry = {
  name: string
  models: Map<string, ModelEntry>
}

type CarsDictionary = Map<string, MakeEntry>

/**
 * Flattens the nested source into a dictionary keyed by lowercased name at each
 * level. Runs once in O(n) over every node so make/model/generation lookups are
 * all O(1). Each level stores the bare minimum — its own name and a map to its
 * children — instead of duplicating the whole subtree.
 */
function buildCarsDictionary(source: readonly Make[]): CarsDictionary {
  const dictionary: CarsDictionary = new Map()

  for (const make of source) {
    const models = new Map<string, ModelEntry>()

    for (const model of make.models) {
      const generations = new Map<string, GenerationEntry>()

      for (const generation of model.generations) {
        generations.set(generation.name.toLowerCase(), generation)
      }

      models.set(model.name.toLowerCase(), { name: model.name, generations })
    }

    dictionary.set(make.make.toLowerCase(), { name: make.make, models })
  }

  return dictionary
}

export {
  buildCarsDictionary,
  type CarsDictionary,
  type MakeEntry,
  type ModelEntry,
  type GenerationEntry,
}
