import type {
  FilterDataGenerated,
  FilterLocaleData,
} from '@lumo/scraper/filter-types'
import { filterData as _filterData } from '@lumo/scraper/filter-data'
import { filterLocale as _filterLocale } from '@lumo/scraper/locales/pl'

const filterData: FilterDataGenerated = _filterData
// TODO: Refactor - it should live in translations registies
const filterLocale: FilterLocaleData = _filterLocale

function translateModelName(
  name: string,
  labels: { series: string; class: string },
): string {
  // "5er" → "{series} 5", "3er-Reihe" → "{series} 3", "2er Tourer" → "{series} 2 Tourer"
  const erMatch = name.match(/^(\d+)er(?:-Reihe)?(?:\s+(.+))?$/)
  if (erMatch)
    return `${labels.series} ${erMatch[1]}${erMatch[2] ? ` ${erMatch[2]}` : ''}`

  // "E-Klasse" → "{class} E"
  const klasseMatch = name.match(/^([A-Z])-Klasse$/)
  if (klasseMatch) return `${labels.class} ${klasseMatch[1]}`

  return name
}

export function formatGenerationLabel(
  gen: { name: string; production: { start: number; end: number | null } },
  presentLabel: string,
): string {
  const end = gen.production.end ?? presentLabel
  return `${gen.name} (${gen.production.start}–${end})`
}

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

export const indexes = filterData.indexes

export const makes = Object.entries(indexes.makes).map(([makeId, make]) => ({
  id: makeId,
  label: make.name,
}))

export const getModels = (
  make?: string,
  labels?: { series: string; class: string },
) => {
  return make
    ? indexes.makes[make]?.modelIds.map((modelId) => {
        const raw = indexes.models[`${make}:${modelId}`]?.name ?? modelId
        return {
          id: modelId,
          label: labels ? translateModelName(raw, labels) : raw,
        }
      })
    : []
}

export const getGenerations = (make?: string, model?: string) => {
  return make && model
    ? indexes.models[`${make}:${model}`]?.generationIds.map((generationId) => ({
        id: generationId,
        label:
          indexes.generations[`${make}:${model}:${generationId}`]?.name ??
          generationId,
      }))
    : []
}

export const getTrims = (
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
