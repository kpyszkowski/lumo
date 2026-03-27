import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { slugify } from '~/utils/slugify'
import { deriveFuelType } from '~/features/filter-builder/lib/derive-fuel-type'
import {
  BODY_TYPE_TRANSLATIONS,
  FUEL_TYPE_LABELS,
  LOCALE,
  TRANSMISSION_LABELS,
} from '~/features/filter-builder/lib/translations'
import type {
  BuildFilterDataResult,
  EngineTrim,
  FilterDataGenerated,
  FuelTypeId,
  TransmissionId,
} from '~/features/filter-builder/lib/types'
import type { OutputTree } from '~/types'

type BuildFilterDataOptions = {
  techSheetsDir: string
  catalogPath: string
}

type CatalogEntry = {
  makeName: string
  makeSourceId: string
  modelName: string
  modelSourceId: string
  genName: string
  genType: string | null
  genSourceId: string
  production: { start: number; end: number | null }
}

type Stats = {
  techSheetsProcessed: number
  techSheetsSkipped: number
  warnings: number
  errors: number
}

function parseJatoYear(value: string | undefined): number | null {
  if (!value) return null
  // Format: "MM/YYYY"
  const match = value.match(/\d{2}\/(\d{4})/)
  if (!match?.[1]) return null
  return parseInt(match[1], 10)
}

function buildCatalogMap(catalog: OutputTree[]): Map<string, CatalogEntry> {
  const map = new Map<string, CatalogEntry>()
  for (const { make, models } of catalog) {
    for (const model of models) {
      for (const gen of model.generations) {
        const key = `${make.sourceId}:${model.sourceId}:${gen.sourceId}`
        map.set(key, {
          makeName: make.name,
          makeSourceId: make.sourceId,
          modelName: model.name,
          modelSourceId: model.sourceId,
          genName: gen.name,
          genType: gen.type ?? null,
          genSourceId: gen.sourceId,
          production: gen.production,
        })
      }
    }
  }
  return map
}

/**
 * Derives a human-readable generation display name.
 *
 * Priority:
 * 1. catalogGen.name when it differs from modelName — VW already stores "Passat B8", "Golf VII"
 * 2. catalogGen.type — BMW "G60, G61", Mercedes "W221, V221"
 * 3. TypBezeichnungGeneration from tech sheet — fallback for non-catalog type
 * 4. "Gen. N" from GenerationNummerJATO
 */
function deriveGenDisplayName(
  catalogEntry: CatalogEntry,
  typBezeichnungGeneration: string | undefined,
  generationNummerJATO: string | undefined,
): string {
  if (catalogEntry.genName !== catalogEntry.modelName) {
    return catalogEntry.genName
  }
  if (catalogEntry.genType) {
    return catalogEntry.genType
  }
  const typClean = typBezeichnungGeneration?.trim()
  if (typClean) return typClean
  const genNum = generationNummerJATO?.trim()
  if (genNum) return `Gen. ${genNum}`
  return catalogEntry.genName
}

export async function buildFilterData(
  options: BuildFilterDataOptions,
): Promise<BuildFilterDataResult> {
  const { techSheetsDir, catalogPath } = options
  const stats: Stats = {
    techSheetsProcessed: 0,
    techSheetsSkipped: 0,
    warnings: 0,
    errors: 0,
  }

  // ── Load catalog ──────────────────────────────────────────────────────────
  let catalog: OutputTree[]
  try {
    const raw = await readFile(catalogPath, 'utf8')
    catalog = JSON.parse(raw)
  } catch {
    throw new Error(`Failed to load catalog from ${catalogPath}`)
  }
  const catalogMap = buildCatalogMap(catalog)

  const files = (await readdir(techSheetsDir)).filter((f) =>
    f.endsWith('.json'),
  )

  // ── Pass 1: collect full make names from JATO-populated sheets ────────────
  // HerstellerNameJATO gives "Mercedes-Benz", "Volkswagen" etc. when present.
  // We propagate these to all tech sheets of the same make via catalog sourceId.
  const makeJatoNames = new Map<string, string>() // catalog make sourceId → full brand name

  for (const file of files) {
    try {
      const raw = await readFile(join(techSheetsDir, file), 'utf8')
      const sheet = JSON.parse(raw)
      const jatoName = (
        sheet.data?.['HerstellerNameJATO'] as string | undefined
      )?.trim()
      if (jatoName) {
        const makeSourceId = sheet.metadata?.sourceIds?.make as
          | string
          | undefined
        if (makeSourceId && !makeJatoNames.has(makeSourceId)) {
          makeJatoNames.set(makeSourceId, jatoName)
        }
      }
    } catch {
      // Silently skip parse errors here; Pass 2 will handle error reporting
    }
  }

  // ── Pass 2: full processing ───────────────────────────────────────────────
  const makeNames = new Map<string, string>()
  const modelNames = new Map<string, string>()
  const generationNames = new Map<string, string>()
  const makeModelIds = new Map<string, Set<string>>()
  const modelGenerationIds = new Map<string, Set<string>>()
  const generationStartYears = new Map<string, Set<number>>()
  const generationEndYears = new Map<string, Set<number>>()
  const engineTrimsByGeneration = new Map<string, Map<string, EngineTrim>>()
  const bodyTypesMap = new Map<string, { id: string; label: string }>()
  const transmissionsSet = new Set<TransmissionId>()

  for (const file of files) {
    const filePath = join(techSheetsDir, file)
    let sheet: {
      data: Record<string, unknown>
      metadata: {
        sourceIds: { make: string; model: string; generation: string }
      }
    }

    try {
      const raw = await readFile(filePath, 'utf8')
      sheet = JSON.parse(raw)
    } catch {
      console.error(`[ERROR] Failed to parse ${file}`)
      stats.errors++
      continue
    }

    const data = sheet.data
    const sourceIds = sheet.metadata?.sourceIds

    if (!sourceIds?.make || !sourceIds?.model || !sourceIds?.generation) {
      console.warn(`[WARN] Missing sourceIds in ${file}`)
      stats.techSheetsSkipped++
      continue
    }

    // ── Catalog lookup ──────────────────────────────────────────────────────
    const catalogKey = `${sourceIds.make}:${sourceIds.model}:${sourceIds.generation}`
    const catalogEntry = catalogMap.get(catalogKey)
    if (!catalogEntry) {
      console.warn(`[WARN] No catalog entry for ${catalogKey} (${file})`)
      stats.techSheetsSkipped++
      continue
    }

    // ── Age filter: skip pre-Euro-era cars ──────────────────────────────────
    // Schadstoffklasse (emissions standard) is absent for pre-standardisation
    // vehicles. Its presence is the data-driven signal that a car is modern
    // enough to include.
    const schadstoff = (data['Schadstoffklasse'] as string | undefined)?.trim()
    if (!schadstoff) {
      stats.techSheetsSkipped++
      continue
    }

    // ── Identifiers ─────────────────────────────────────────────────────────
    // Make name from JATO propagation gives full names ("Mercedes-Benz",
    // "Volkswagen"). Model and generation names come from the catalog — it is
    // the single authoritative source for structural names, preventing variants
    // like "5er" vs "5er Reihe" from producing duplicate model entries.
    const makeName =
      (data['HerstellerNameJATO'] as string | undefined)?.trim() ||
      makeJatoNames.get(sourceIds.make) ||
      catalogEntry.makeName

    const modelName = catalogEntry.modelName

    const genDisplayName = deriveGenDisplayName(
      catalogEntry,
      data['TypBezeichnungGeneration'] as string | undefined,
      data['GenerationNummerJATO'] as string | undefined,
    )

    // IDs use canonical sourceId slugs from the catalog — consistent across all
    // tech sheets regardless of what individual data fields contain.
    const makeId = slugify(makeName)
    const modelId = slugify(catalogEntry.modelSourceId)
    const genId = slugify(catalogEntry.genSourceId)
    const makeModelKey = `${makeId}:${modelId}`
    const generationKey = `${makeModelKey}:${genId}`

    // First-seen names
    if (!makeNames.has(makeId)) makeNames.set(makeId, makeName)
    if (!modelNames.has(makeModelKey)) modelNames.set(makeModelKey, modelName)
    if (!generationNames.has(generationKey))
      generationNames.set(generationKey, genDisplayName)

    // Hierarchy IDs
    if (!makeModelIds.has(makeId)) makeModelIds.set(makeId, new Set())
    makeModelIds.get(makeId)!.add(modelId)

    if (!modelGenerationIds.has(makeModelKey))
      modelGenerationIds.set(makeModelKey, new Set())
    modelGenerationIds.get(makeModelKey)!.add(genId)

    // ── Production years ────────────────────────────────────────────────────
    // Use JATO date strings when available; fall back to catalog production data.
    const baujahrRaw = data['BaujahrJATO'] as string | undefined
    const bauendeRaw = data['BauendeJATO'] as string | undefined
    const startYear = parseJatoYear(baujahrRaw) ?? catalogEntry.production.start
    const endYear = parseJatoYear(bauendeRaw) ?? catalogEntry.production.end

    if (!generationStartYears.has(generationKey))
      generationStartYears.set(generationKey, new Set())
    if (!generationEndYears.has(generationKey))
      generationEndYears.set(generationKey, new Set())

    if (startYear) generationStartYears.get(generationKey)!.add(startYear)
    // null endYear means still in production — store 0 as sentinel
    generationEndYears.get(generationKey)!.add(endYear ?? 0)

    // ── Engine trims ────────────────────────────────────────────────────────
    const trimName = data['Modell_Name'] as string | undefined
    if (!trimName) {
      stats.techSheetsSkipped++
      continue
    }

    const capacity = (data['Hubraum'] as number | undefined) ?? 0
    const power = (data['Ps'] as number | undefined) ?? 0
    const driveTypeId = (data['Antriebstyp_ID'] as number | undefined) ?? 1
    const electricRangeKm =
      (data['ReichweiteReinElektrisch'] as number | undefined) ?? 0
    const fuelType: FuelTypeId = deriveFuelType(driveTypeId, electricRangeKm)

    if (!engineTrimsByGeneration.has(generationKey))
      engineTrimsByGeneration.set(generationKey, new Map())
    const trimMap = engineTrimsByGeneration.get(generationKey)!
    if (!trimMap.has(trimName))
      trimMap.set(trimName, { name: trimName, capacity, power, fuelType })

    // ── Body types ──────────────────────────────────────────────────────────
    const bodyTypeRaw = data['Karobauart'] as string | undefined
    if (bodyTypeRaw) {
      const translated = BODY_TYPE_TRANSLATIONS[bodyTypeRaw]
      if (translated) {
        bodyTypesMap.set(translated.id, translated)
      } else {
        console.warn(`[WARN] Unknown body type: "${bodyTypeRaw}" in ${file}`)
        stats.warnings++
      }
    }

    // ── Transmissions ────────────────────────────────────────────────────────
    const getriebeRaw = (data['Getriebe'] as string | undefined)?.toLowerCase()
    if (
      getriebeRaw?.includes('automatisch') ||
      getriebeRaw?.includes('automat')
    ) {
      transmissionsSet.add('automatic')
    } else if (
      getriebeRaw?.includes('manuell') ||
      getriebeRaw?.includes('manual')
    ) {
      transmissionsSet.add('manual')
    }

    stats.techSheetsProcessed++
  }

  if (transmissionsSet.size > 0) {
    transmissionsSet.add('manual')
    transmissionsSet.add('automatic')
  }

  // ── Build indexes ─────────────────────────────────────────────────────────
  const makesIndex: FilterDataGenerated['indexes']['makes'] = {}
  const modelsIndex: FilterDataGenerated['indexes']['models'] = {}
  const generationsIndex: FilterDataGenerated['indexes']['generations'] = {}

  for (const [makeId, name] of makeNames) {
    makesIndex[makeId] = {
      name,
      modelIds: Array.from(makeModelIds.get(makeId) ?? []),
    }
  }

  for (const [makeModelKey, name] of modelNames) {
    modelsIndex[makeModelKey] = {
      name,
      generationIds: Array.from(modelGenerationIds.get(makeModelKey) ?? []),
    }
  }

  for (const [generationKey, name] of generationNames) {
    const startYears = generationStartYears.get(generationKey) ?? new Set()
    const endYears = generationEndYears.get(generationKey) ?? new Set()
    const start = startYears.size > 0 ? Math.min(...startYears) : 0
    // If any trim has no end (stored as 0), generation is still in production
    const hasOpenEnd = endYears.has(0)
    const maxEnd = Math.max(...Array.from(endYears).filter((y) => y > 0))
    const end = hasOpenEnd ? null : maxEnd > 0 ? maxEnd : null

    const trimMap = engineTrimsByGeneration.get(generationKey)
    generationsIndex[generationKey] = {
      name,
      production: { start, end },
      engineTrims: trimMap ? Array.from(trimMap.values()) : [],
    }
  }

  const makes = Array.from(makeNames.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const bodyTypeIds = Array.from(bodyTypesMap.keys()).sort()
  const fuelTypeIds: FuelTypeId[] = ['petrol', 'diesel', 'hybrid', 'electric']
  const transmissionIds: TransmissionId[] = ['manual', 'automatic']

  console.log(
    `\n✓ Tech sheets processed: ${stats.techSheetsProcessed}`,
    `\n  Skipped: ${stats.techSheetsSkipped}`,
    `\n  Warnings: ${stats.warnings}`,
    `\n  Errors: ${stats.errors}`,
    `\n  Makes: ${makes.length}`,
    `\n  Body types: ${bodyTypeIds.length}`,
  )

  const filterData: FilterDataGenerated = {
    makes,
    bodyTypes: bodyTypeIds,
    fuelTypes: fuelTypeIds,
    transmissions: transmissionIds,
    indexes: {
      makes: makesIndex,
      models: modelsIndex,
      generations: generationsIndex,
    },
  }

  const localeTranslations = {
    bodyTypes: Object.fromEntries(
      Array.from(bodyTypesMap.values()).map(({ id, label }) => [id, label]),
    ),
    fuelTypes: Object.fromEntries(
      fuelTypeIds.map((id) => [id, FUEL_TYPE_LABELS[id]]),
    ),
    transmissions: Object.fromEntries(
      transmissionIds.map((id) => [id, TRANSMISSION_LABELS[id]]),
    ),
  }

  return {
    data: filterData,
    locale: { id: LOCALE, translations: localeTranslations },
  }
}
