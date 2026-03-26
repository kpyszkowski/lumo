import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import type { OutputTree } from '~/types'
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

type BuildFilterDataOptions = {
  catalogPath: string
  techSheetsDir: string
}

type Stats = {
  techSheetsProcessed: number
  techSheetsSkipped: number
  warnings: number
  errors: number
}

export async function buildFilterData(
  options: BuildFilterDataOptions,
): Promise<BuildFilterDataResult> {
  const { catalogPath, techSheetsDir } = options
  const stats: Stats = {
    techSheetsProcessed: 0,
    techSheetsSkipped: 0,
    warnings: 0,
    errors: 0,
  }

  // Load and index catalog
  const catalogRaw = await readFile(catalogPath, 'utf8')
  const catalog: OutputTree[] = JSON.parse(catalogRaw)

  type CatalogMakeEntry = { name: string; modelIds: string[] }
  type CatalogModelEntry = { name: string; generationIds: string[] }
  type CatalogGenerationEntry = {
    name: string
    production: { start: number; end: number | null }
  }

  const catalogMakes = new Map<string, CatalogMakeEntry>()
  const catalogModels = new Map<string, CatalogModelEntry>()
  const catalogGenerations = new Map<string, CatalogGenerationEntry>()
  const generationSourceIdToKey = new Map<string, string>()

  for (const { make, models } of catalog) {
    const makeModelIds: string[] = []
    for (const model of models) {
      makeModelIds.push(model.id)
      const makeModelKey = `${make.id}:${model.id}`
      const generationIds: string[] = []

      for (const generation of model.generations) {
        generationIds.push(generation.id)
        const generationKey = `${makeModelKey}:${generation.id}`
        catalogGenerations.set(generationKey, {
          name: generation.type ?? generation.name,
          production: generation.production,
        })
        const sourceIdKey = `${makeModelKey}:${generation.sourceId}`
        generationSourceIdToKey.set(sourceIdKey, generationKey)
      }
      catalogModels.set(makeModelKey, { name: model.name, generationIds })
    }
    catalogMakes.set(make.id, { name: make.name, modelIds: makeModelIds })
  }

  const engineTrimsByGeneration = new Map<string, Map<string, EngineTrim>>()
  const bodyTypesMap = new Map<string, { id: string; label: string }>()
  const transmissionsSet = new Set<TransmissionId>()

  const files = (await readdir(techSheetsDir)).filter((f) =>
    f.endsWith('.json'),
  )

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

    const { data, metadata } = sheet
    const {
      make: makeId,
      model: modelId,
      generation: generationSourceId,
    } = metadata.sourceIds
    const sourceIdKey = `${makeId}:${modelId}:${generationSourceId}`
    const generationKey = generationSourceIdToKey.get(sourceIdKey)

    if (!generationKey) {
      console.warn(`[WARN] No catalog entry for ${sourceIdKey}: ${file}`)
      stats.warnings++
      stats.techSheetsSkipped++
      continue
    }

    const trimName = data['Modell_Name'] as string | undefined
    const capacity = (data['Hubraum'] as number | undefined) ?? 0
    const power = (data['Ps'] as number | undefined) ?? 0
    const driveTypeId = (data['Antriebstyp_ID'] as number | undefined) ?? 1
    const electricRangeKm =
      (data['ReichweiteReinElektrisch'] as number | undefined) ?? 0
    const bodyTypeRaw = data['Karobauart'] as string | undefined
    const getriebeRaw = (data['Getriebe'] as string | undefined)?.toLowerCase()

    if (!trimName) {
      console.warn(`[WARN] Missing Modell_Name in ${file}`)
      stats.warnings++
      stats.techSheetsSkipped++
      continue
    }

    const fuelType: FuelTypeId = deriveFuelType(driveTypeId, electricRangeKm)

    if (!engineTrimsByGeneration.has(generationKey)) {
      engineTrimsByGeneration.set(generationKey, new Map())
    }
    const trimMap = engineTrimsByGeneration.get(generationKey)!
    if (!trimMap.has(trimName)) {
      trimMap.set(trimName, { name: trimName, capacity, power, fuelType })
    }

    if (bodyTypeRaw) {
      const translated = BODY_TYPE_TRANSLATIONS[bodyTypeRaw]
      if (translated) {
        bodyTypesMap.set(translated.id, translated)
      } else {
        console.warn(`[WARN] Unknown body type: "${bodyTypeRaw}" in ${file}`)
        stats.warnings++
      }
    }

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

  // Build indexes
  const makesIndex: FilterDataGenerated['indexes']['makes'] = {}
  const modelsIndex: FilterDataGenerated['indexes']['models'] = {}
  const generationsIndex: FilterDataGenerated['indexes']['generations'] = {}

  for (const [makeId, make] of catalogMakes) {
    makesIndex[makeId] = { name: make.name, modelIds: make.modelIds }
  }
  for (const [makeModelKey, model] of catalogModels) {
    modelsIndex[makeModelKey] = {
      name: model.name,
      generationIds: model.generationIds,
    }
  }
  for (const [generationKey, generation] of catalogGenerations) {
    const trimMap = engineTrimsByGeneration.get(generationKey)
    generationsIndex[generationKey] = {
      name: generation.name,
      production: generation.production,
      engineTrims: trimMap ? Array.from(trimMap.values()) : [],
    }
  }

  const makes = Array.from(catalogMakes.entries())
    .map(([id, { name }]) => ({ id, name }))
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

  const data: FilterDataGenerated = {
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

  return { data, locale: { id: LOCALE, translations: localeTranslations } }
}
