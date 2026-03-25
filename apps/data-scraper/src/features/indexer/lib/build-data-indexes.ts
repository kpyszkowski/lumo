import {
  type Model,
  type Make,
  type OutputTree,
  type Generation,
} from '~/types'

type MakeId = string
type MakeModelId = `${string}:${string}`
type MakeModelGenerationId = `${string}:${string}:${string}`
type IndexedOutput = Record<MakeId, Pick<Make, 'name'>> &
  Record<MakeModelId, Pick<Model, 'name'>> &
  Record<
    MakeModelGenerationId,
    Pick<Generation, 'name' | 'type' | 'production'>
  >

export function getIndex(make: Make, model?: Model, generation?: Generation) {
  return [make.id, model?.id, generation?.id].filter(Boolean).join(':')
}

export function parseIndex(index: string): {
  makeId: string
  modelId?: string
  generationId?: string
} {
  const validityRegex = /^([a-z0-9_-]+)(:([a-z0-9_-]+)(:([a-z0-9_-]+))?)?$/
  if (!validityRegex.test(index)) {
    throw new Error(`Invalid index format: ${index}`)
  }

  const [makeId, modelId, generationId] = index.split(':')
  return { makeId: makeId!, modelId, generationId }
}

export function buildDataIndexes(data: OutputTree[]): IndexedOutput {
  return data.reduce<Record<string, object>>((acc, { make, models }) => {
    // Add the make to the index
    const makeIndex = getIndex(make)
    const accWithMake = {
      ...acc,
      [makeIndex]: { name: make.name },
    }

    // Add models and their generations to the index
    return models.reduce<Record<string, object>>((modelAcc, model) => {
      const makeModelIndex = getIndex(make, model)
      const modelAccWithModel = {
        ...modelAcc,
        [makeModelIndex]: { name: model.name },
      }

      // Add generations to the index
      return model.generations.reduce<Record<string, object>>(
        (genAcc, generation) => {
          const makeModelGenIndex = getIndex(make, model, generation)
          return {
            ...genAcc,
            [makeModelGenIndex]: {
              name: generation.name,
              ...(generation.type !== undefined
                ? { type: generation.type }
                : {}),
              production: generation.production,
            },
          }
        },
        modelAccWithModel,
      )
    }, accWithMake)
  }, {}) as IndexedOutput
}
