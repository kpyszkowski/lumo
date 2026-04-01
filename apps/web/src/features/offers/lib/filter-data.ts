import type {
  FilterDataGenerated,
  FilterLocaleData,
} from '@lumo/scraper/filter-types'
import { filterData as _filterData } from '@lumo/scraper/filter-data'
import { filterLocale as _filterLocale } from '@lumo/scraper/locales/pl'

const filterData: FilterDataGenerated = _filterData
const filterLocale: FilterLocaleData = _filterLocale

function translateModelName(name: string): string {
  // "5er" → "Seria 5", "3er-Reihe" → "Seria 3", "2er Tourer" → "Seria 2 Tourer"
  const erMatch = name.match(/^(\d+)er(?:-Reihe)?(?:\s+(.+))?$/)
  if (erMatch) return `Seria ${erMatch[1]}${erMatch[2] ? ` ${erMatch[2]}` : ''}`

  // "E-Klasse" → "Klasa E"
  const klasseMatch = name.match(/^([A-Z])-Klasse$/)
  if (klasseMatch) return `Klasa ${klasseMatch[1]}`

  return name
}

export function formatGenerationLabel(
  gen: { name: string; production: { start: number; end: number | null } },
  presentLabel: string,
): string {
  const end = gen.production.end ?? presentLabel
  return `${gen.name} (${gen.production.start}–${end})`
}

export const makes = filterData.makes

export const bodyTypes = filterData.bodyTypes.map((id) => ({
  id,
  label: filterLocale.bodyTypes[id] ?? id,
}))

export const fuelTypes = filterData.fuelTypes.map((id) => ({
  id,
  label: filterLocale.fuelTypes[id] ?? id,
}))

export const transmissions = filterData.transmissions.map((id) => ({
  id,
  label: filterLocale.transmissions[id] ?? id,
}))

export const indexes = {
  ...filterData.indexes,
  models: Object.fromEntries(
    Object.entries(filterData.indexes.models).map(([key, model]) => [
      key,
      { ...model, name: translateModelName(model.name) },
    ]),
  ),
}

export const getMakeIndexes = () => {
  return Object.entries(indexes.makes).map(([makeId, make]) => ({
    id: makeId,
    label: make.name,
  }))
}

export const getModelIndexes = (make?: string) => {
  return make
    ? indexes.makes[make]?.modelIds.map((modelId) => ({
        id: modelId,
        label: indexes.models[`${make}:${modelId}`]?.name ?? modelId,
      }))
    : []
}

export const getGenerationIndexes = (make?: string, model?: string) => {
  return make && model
    ? indexes.models[`${make}:${model}`]?.generationIds.map((generationId) => ({
        id: generationId,
        label:
          indexes.generations[`${make}:${model}:${generationId}`]?.name ??
          generationId,
      }))
    : []
}

export const getTrimIndexes = (
  make?: string,
  model?: string,
  generation?: string,
) => {
  return make && model && generation
    ? (indexes.generations[`${make}:${model}:${generation}`]?.engineTrims.map(
        (trim, index) => ({
          id: `${make}:${model}:${generation}:${index}`,
          label: trim.name,
        }),
      ) ?? [])
    : []
}
