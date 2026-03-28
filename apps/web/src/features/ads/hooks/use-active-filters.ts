'use client'
import { useMemo } from 'react'
import type { UseFormSetValue } from 'react-hook-form'
import {
  bodyTypes,
  fuelTypes,
  formatGenerationLabel,
  indexes,
  makes,
  transmissions,
} from '~/features/ads/lib/filter-data'
import {
  AD_FILTER_DEFAULTS,
  type AdFilterValues,
} from '~/features/ads/lib/ad-filter-schema'

export type ActiveFilter = {
  id: string
  label: string
  onRemove: () => void
}

type UseActiveFiltersParams = {
  values: AdFilterValues
  setValue: UseFormSetValue<AdFilterValues>
  setMake: (id: string | null) => void
  setModel: (id: string | null) => void
}

export function useActiveFilters(
  params: UseActiveFiltersParams,
): ActiveFilter[] {
  const { values, setValue, setMake, setModel } = params
  const {
    makeId,
    modelId,
    generationId,
    bodyTypeId,
    fuelTypeId,
    transmissionId,
    priceRange,
    yearRange,
    mileageRange,
  } = values

  const { priceMin, priceMax, yearMin, yearMax, mileageMin, mileageMax } =
    AD_FILTER_DEFAULTS

  return useMemo((): ActiveFilter[] => {
    const filters: ActiveFilter[] = []

    if (makeId) {
      const make = makes.find((m) => m.id === makeId)
      filters.push({
        id: 'make',
        label: make?.name ?? makeId,
        onRemove: () => setMake(null),
      })
    }

    if (makeId && modelId) {
      const model = indexes.models[`${makeId}:${modelId}`]
      filters.push({
        id: 'model',
        label: model?.name ?? modelId,
        onRemove: () => setModel(null),
      })
    }

    if (makeId && modelId && generationId) {
      const gen = indexes.generations[`${makeId}:${modelId}:${generationId}`]
      filters.push({
        id: 'generation',
        label: gen ? formatGenerationLabel(gen) : generationId,
        onRemove: () => setValue('generationId', null),
      })
    }

    if (bodyTypeId) {
      const bodyType = bodyTypes.find((b) => b.id === bodyTypeId)
      filters.push({
        id: 'bodyType',
        label: bodyType?.label ?? bodyTypeId,
        onRemove: () => setValue('bodyTypeId', null),
      })
    }

    if (priceRange[0] !== priceMin || priceRange[1] !== priceMax) {
      filters.push({
        id: 'price',
        label: `${priceRange[0].toLocaleString('pl')}–${priceRange[1].toLocaleString('pl')} zł`,
        onRemove: () => setValue('priceRange', [priceMin, priceMax]),
      })
    }

    if (yearRange[0] !== yearMin || yearRange[1] !== yearMax) {
      filters.push({
        id: 'year',
        label: `${yearRange[0]}–${yearRange[1]}`,
        onRemove: () => setValue('yearRange', [yearMin, yearMax]),
      })
    }

    if (fuelTypeId) {
      const fuelType = fuelTypes.find((f) => f.id === fuelTypeId)
      filters.push({
        id: 'fuelType',
        label: fuelType?.label ?? fuelTypeId,
        onRemove: () => setValue('fuelTypeId', null),
      })
    }

    if (transmissionId) {
      const transmission = transmissions.find((t) => t.id === transmissionId)
      filters.push({
        id: 'transmission',
        label: transmission?.label ?? transmissionId,
        onRemove: () => setValue('transmissionId', null),
      })
    }

    if (mileageRange[0] !== mileageMin || mileageRange[1] !== mileageMax) {
      filters.push({
        id: 'mileage',
        label: `${mileageRange[0].toLocaleString('pl')}–${mileageRange[1].toLocaleString('pl')} km`,
        onRemove: () => setValue('mileageRange', [mileageMin, mileageMax]),
      })
    }

    return filters
  }, [
    makeId,
    modelId,
    generationId,
    bodyTypeId,
    fuelTypeId,
    transmissionId,
    priceRange,
    yearRange,
    mileageRange,
    priceMin,
    priceMax,
    yearMin,
    yearMax,
    mileageMin,
    mileageMax,
    setValue,
    setMake,
    setModel,
  ])
}
