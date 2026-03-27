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

export function formatGenerationLabel(gen: {
  name: string
  production: { start: number; end: number | null }
}): string {
  const end = gen.production.end ?? 'obecnie'
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
