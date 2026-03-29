import {
  IconMakes,
  IconModels,
  IconGenerations,
  IconCarBodySuv,
  IconGasStation,
  IconManualGearbox,
  IconCoin,
  IconCalendarDot,
  IconRoad,
} from '@lumo/ui/icons'
import { useMemo } from 'react'
import type { UseFormSetValue } from 'react-hook-form'
import {
  bodyTypes,
  formatGenerationLabel,
  fuelTypes,
  indexes,
  makes,
  transmissions,
} from '~/features/ads/lib/filter-data'
import {
  AD_FILTER_DEFAULTS,
  type AdFilterValues,
} from '~/features/ads/lib/ad-filter-schema'
import type {
  ListFilterPage,
  ListFilterPageItem,
} from '~/features/ads/components/ad-filter-command/ad-filter-command-list-content'
import type { RangeFilterPage } from '~/features/ads/components/ad-filter-command/ad-filter-command-range-content'

export type FilterPage = ListFilterPage | RangeFilterPage

export type FilterPageLabels = {
  generationPresent: string
  makesLabel: string
  makesPlaceholder: string
  modelsLabel: string
  modelsPlaceholder: string
  generationsLabel: string
  generationsPlaceholder: string
  bodyTypesLabel: string
  bodyTypesPlaceholder: string
  priceLabel: string
  pricePlaceholder: string
  yearLabel: string
  yearPlaceholder: string
  fuelTypesLabel: string
  fuelTypesPlaceholder: string
  transmissionsLabel: string
  transmissionsPlaceholder: string
  mileageLabel: string
  mileagePlaceholder: string
  groupAlphabetical: string
}

type UseFilterPagesParams = {
  values: AdFilterValues
  setValue: UseFormSetValue<AdFilterValues>
  setMake: (id: string | null) => void
  setModel: (id: string | null) => void
  onPageChange: (index: number | ((prev: number) => number)) => void
  labels: FilterPageLabels
  adCountByPrice: number[]
  adCountByProductionYear: number[]
  adCountByMileage: number[]
}

export function useFilterPages(params: UseFilterPagesParams): FilterPage[] {
  const {
    values,
    setValue,
    setMake,
    setModel,
    onPageChange,
    labels,
    adCountByPrice,
    adCountByProductionYear,
    adCountByMileage,
  } = params

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

  return useMemo((): FilterPage[] => {
    const modelIds = makeId ? (indexes.makes[makeId]?.modelIds ?? []) : []
    const generationIds =
      makeId && modelId
        ? (indexes.models[`${makeId}:${modelId}`]?.generationIds ?? [])
        : []

    const isPriceRangeActive =
      priceRange[0] !== priceMin || priceRange[1] !== priceMax
    const isYearRangeActive =
      yearRange[0] !== yearMin || yearRange[1] !== yearMax
    const isMileageRangeActive =
      mileageRange[0] !== mileageMin || mileageRange[1] !== mileageMax

    const rawPages: FilterPage[] = [
      {
        type: 'list',
        icon: IconMakes,
        label: labels.makesLabel,
        placeholder: labels.makesPlaceholder,
        active: !!makeId,
        data: [
          {
            label: labels.groupAlphabetical,
            data: makes.map((m) => ({ id: m.id, label: m.name })),
          },
        ],
        onSelect: (item) => setMake(item.id),
      },
      {
        type: 'list',
        icon: IconModels,
        label: labels.modelsLabel,
        placeholder: labels.modelsPlaceholder,
        disabled: !makeId,
        active: !!modelId,
        data: modelIds.length
          ? [
              {
                label: labels.groupAlphabetical,
                data: modelIds.map((id) => ({
                  id,
                  label: indexes.models[`${makeId}:${id}`]?.name ?? id,
                })),
              },
            ]
          : [],
        onSelect: (item) => setModel(item.id),
      },
      {
        type: 'list',
        icon: IconGenerations,
        label: labels.generationsLabel,
        placeholder: labels.generationsPlaceholder,
        disabled: !makeId || !modelId,
        active: !!generationId,
        data: generationIds.length
          ? [
              {
                label: labels.groupAlphabetical,
                data: generationIds.map((genId) => {
                  const gen =
                    indexes.generations[`${makeId}:${modelId}:${genId}`]
                  return {
                    id: genId,
                    label: gen
                      ? formatGenerationLabel(gen, labels.generationPresent)
                      : genId,
                  }
                }),
              },
            ]
          : [],
        onSelect: (item) => setValue('generationId', item.id),
      },
      {
        type: 'list',
        icon: IconCarBodySuv,
        label: labels.bodyTypesLabel,
        placeholder: labels.bodyTypesPlaceholder,
        active: !!bodyTypeId,
        data: [{ label: labels.groupAlphabetical, data: bodyTypes }],
        onSelect: (item) => setValue('bodyTypeId', item.id),
      },
      {
        type: 'range',
        id: 'price',
        icon: IconCoin,
        label: labels.priceLabel,
        placeholder: labels.pricePlaceholder,
        active: isPriceRangeActive,
        min: 0,
        max: 500000,
        step: 1000,
        unit: 'zł',
        histogramData: adCountByPrice,
      },
      {
        type: 'range',
        id: 'year',
        icon: IconCalendarDot,
        label: labels.yearLabel,
        placeholder: labels.yearPlaceholder,
        active: isYearRangeActive,
        min: 1990,
        max: 2026,
        step: 1,
        unit: '',
        histogramData: adCountByProductionYear,
      },
      {
        type: 'list',
        icon: IconGasStation,
        label: labels.fuelTypesLabel,
        placeholder: labels.fuelTypesPlaceholder,
        active: !!fuelTypeId,
        data: [{ label: labels.groupAlphabetical, data: fuelTypes }],
        onSelect: (item) => setValue('fuelTypeId', item.id),
      },
      {
        type: 'list',
        icon: IconManualGearbox,
        label: labels.transmissionsLabel,
        placeholder: labels.transmissionsPlaceholder,
        active: !!transmissionId,
        data: [{ label: labels.groupAlphabetical, data: transmissions }],
        onSelect: (item) => setValue('transmissionId', item.id),
      },
      {
        type: 'range',
        id: 'mileage',
        icon: IconRoad,
        label: labels.mileageLabel,
        placeholder: labels.mileagePlaceholder,
        active: isMileageRangeActive,
        min: 0,
        max: 300000,
        step: 1000,
        unit: 'km',
        histogramData: adCountByMileage,
      },
    ]

    // Wrap each list page's onSelect to auto-advance to the next filter.
    // Make (0) → Model (1) and Model (1) → Generation (2) are hardcoded because
    // those target pages are currently disabled in state at the time of selection
    // (they become enabled only after the state update settles).
    // For all other list pages the next enabled page is computed dynamically.
    return rawPages.map((page, index): FilterPage => {
      if (page.type !== 'list') return page

      const nextIndex =
        index === 0
          ? 1
          : index === 1
            ? 2
            : rawPages.findIndex((p, i) => i > index && !p.disabled)

      if (nextIndex === -1) return page

      const originalOnSelect = page.onSelect
      return {
        ...page,
        onSelect: (item: ListFilterPageItem) => {
          originalOnSelect?.(item)
          onPageChange(nextIndex)
        },
      }
    })
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
    labels,
    setValue,
    setMake,
    setModel,
    onPageChange,
    adCountByPrice,
    adCountByProductionYear,
    adCountByMileage,
  ])
}
