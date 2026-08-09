'use client'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import {
  createParser,
  parseAsString,
  parseAsArrayOf,
  useQueryState,
  useQueryStates,
  type UrlKeys,
  type Values,
  type SetValues,
} from 'nuqs'
import { carsRegistry } from '~/features/offers/lib/data/car/cars-registry'
import { useTranslations } from 'next-intl'
import { transmissions } from '~/features/offers/lib/data/transmission'
import { bodyTypes } from '~/features/offers/lib/data/body-type'
import { fuelTypes } from '~/features/offers/lib/data/fuel-type'
import { conditions } from '~/features/offers/lib/data/condition'

const parseAsRange = createParser({
  parse: (value) => {
    // Positional `min:max`; an empty slot means that bound is unset. Parsing
    // positionally (rather than filtering out nulls) keeps a max-only range
    // from being read back as a min-only one.
    const [rawMin = '', rawMax = ''] = value.split(':')
    return {
      min: rawMin === '' ? null : parseInt(rawMin, 10),
      max: rawMax === '' ? null : parseInt(rawMax, 10),
    }
  },
  serialize: (value) => {
    const { min, max } = value
    return `${min ?? ''}:${max ?? ''}`
  },
})

const parseAsArrayOfStrings = parseAsArrayOf(parseAsString)

const DEFAULT_STATE = {
  make: parseAsArrayOfStrings,
  model: parseAsArrayOfStrings,
  generation: parseAsArrayOfStrings,
  bodyType: parseAsArrayOfStrings,
  fuelType: parseAsArrayOfStrings,
  transmission: parseAsArrayOfStrings,
  condition: parseAsArrayOfStrings,
  price: parseAsRange,
  year: parseAsRange,
  mileage: parseAsRange,
  power: parseAsRange,
  engineCapacity: parseAsRange,
}

/** Select-type filter keys, in display order. */
const SELECT_KEYS = [
  'make',
  'model',
  'generation',
  'bodyType',
  'fuelType',
  'transmission',
  'condition',
] as const

/** Range-type filter keys, in display order. */
const RANGE_KEYS = [
  'price',
  'year',
  'mileage',
  'power',
  'engineCapacity',
] as const

/** All filter keys, selects first then ranges, in display order. */
const FILTER_KEYS = [...SELECT_KEYS, ...RANGE_KEYS] as const

/**
 * Sort orders, in display order. These are the canonical values used in the
 * codebase and, once the listing is backed by the API, passed through to it —
 * the URL carries the localized spelling from `OffersFilter.urlValues.sort`, and
 * display labels come from `sortLabels` on the context.
 *
 * Sorting deliberately lives outside `DEFAULT_STATE` — it is not a filter, so it
 * must not produce a chip or feed the model/generation reset logic.
 */
const SORT_VALUES = [
  'latest',
  'price-asc',
  'price-desc',
  'mileage-asc',
  'mileage-desc',
  'year-asc',
  'year-desc',
  'power-asc',
  'power-desc',
] as const

const DEFAULT_SORT = 'latest'

/**
 * Select keys whose option values are enum tokens and therefore need to be
 * translated for display — unlike make/model/generation, whose values already
 * are their display names.
 */
const ENUM_SELECT_KEYS = [
  'bodyType',
  'fuelType',
  'transmission',
  'condition',
] as const

type OffersFilterValues = Values<typeof DEFAULT_STATE>
type OffersFilterFieldKey = keyof typeof DEFAULT_STATE
type OffersFilterSelectKey = (typeof SELECT_KEYS)[number]
type OffersFilterRangeKey = (typeof RANGE_KEYS)[number]

type OffersFilterSortValue = (typeof SORT_VALUES)[number]

type OffersFilterSelectOption = { value: string; label: string }
type RangeConfig = { min: number; max: number; step: number; unit?: string }

/**
 * Static range bounds. Kept in the root so it stays the single source of truth
 * for filter data; these are expected to become dynamic (narrowed from the
 * selected make/model via the backend) in the future.
 */
const RANGES = {
  price: { min: 0, max: 1_000_000, step: 1_000, unit: 'PLN' },
  year: { min: 1900, max: new Date().getFullYear() + 1, step: 1 },
  mileage: { min: 0, max: 500_000, step: 5_000, unit: 'km' },
  power: { min: 0, max: 1_000, step: 10, unit: 'KM' },
  engineCapacity: { min: 0, max: 10_000, step: 100, unit: 'cm³' },
} as const satisfies Record<OffersFilterRangeKey, RangeConfig>

type OffersFilterData = Record<
  OffersFilterSelectKey,
  OffersFilterSelectOption[] | null
> &
  Record<OffersFilterRangeKey, RangeConfig>

const toOption = (value: string): OffersFilterSelectOption => ({
  value,
  label: value,
})

const hasSingleValue = (array: string[] | null): array is [string] =>
  array !== null && array.length === 1 && array[0] !== ''

type OffersFilterContextValue =
  | {
      get: OffersFilterValues
      set: SetValues<typeof DEFAULT_STATE>
      data: OffersFilterData
      labels: Record<OffersFilterFieldKey, string>
      placeholders: Record<OffersFilterFieldKey, string>
      /** Currently applied sort order. */
      sort: OffersFilterSortValue
      /** Applies a sort order; `latest` is the default and clears the param. */
      setSort: (sort: OffersFilterSortValue) => void
      /** Translated label per sort order. */
      sortLabels: Record<OffersFilterSortValue, string>
      /**
       * Open state of the command dialog. Lives here rather than in
       * `OffersFilterCommand` so triggers can sit in any subtree under the root
       * — the header renders the dialog, the offers list triggers it.
       */
      commandOpen: boolean
      setCommandOpen: Dispatch<SetStateAction<boolean>>
    }
  | undefined

const OffersFilterContext = createContext<OffersFilterContextValue>(undefined)

function useOffersFilterContext(): NonNullable<OffersFilterContextValue> {
  const ctx = useContext(OffersFilterContext)
  if (ctx === undefined)
    throw new Error(
      'useOffersFilterContext must be used within OffersFilterRoot',
    )
  return ctx
}

interface OffersFilterRootProps {
  children: ReactNode
}

function OffersFilterRoot(props: OffersFilterRootProps) {
  const { children } = props

  const t = useTranslations('OffersFilter')
  const tUrlKeys = useTranslations('OffersFilter.urlKeys')
  const tUrlValues = useTranslations('OffersFilter.urlValues')

  // Search param names are localized alongside the pathnames in the routing
  // config — `/oferty?marka=…` in Polish, `/offers?make=…` in English. Only the
  // keys are localized; values stay canonical (`fuelType=petrol`,
  // `sort=price-asc`) since they double as the contract with the backend.
  const urlKeys = useMemo<UrlKeys<typeof DEFAULT_STATE>>(
    () => ({
      make: tUrlKeys('make'),
      model: tUrlKeys('model'),
      generation: tUrlKeys('generation'),
      bodyType: tUrlKeys('bodyType'),
      fuelType: tUrlKeys('fuelType'),
      transmission: tUrlKeys('transmission'),
      condition: tUrlKeys('condition'),
      price: tUrlKeys('price'),
      year: tUrlKeys('year'),
      mileage: tUrlKeys('mileage'),
      power: tUrlKeys('power'),
      engineCapacity: tUrlKeys('engineCapacity'),
    }),
    [tUrlKeys],
  )

  const [filters, setFilters] = useQueryStates(DEFAULT_STATE, { urlKeys })

  // Sort values are localized too (`?sortowanie=przebieg-malejaco`), so the
  // parser translates between the URL spelling and the canonical value the rest
  // of the app — and eventually the API — works with.
  const parseAsSort = useMemo(() => {
    const toUrlValue = Object.fromEntries(
      SORT_VALUES.map((value) => [value, tUrlValues(`sort.${value}`)]),
    ) as Record<OffersFilterSortValue, string>

    const fromUrlValue = new Map(
      SORT_VALUES.map((value) => [toUrlValue[value], value]),
    )

    return createParser({
      parse: (query) => fromUrlValue.get(query) ?? null,
      serialize: (value: OffersFilterSortValue) => toUrlValue[value],
    }).withDefault(DEFAULT_SORT)
  }, [tUrlValues])

  const [sort, setSortQuery] = useQueryState(tUrlKeys('sort'), parseAsSort)

  const [commandOpen, setCommandOpen] = useState(false)

  const handleSetSort = useCallback(
    (nextSort: OffersFilterSortValue) => {
      // `nuqs` clears the param once it equals the default, so the URL stays
      // clean while sorting by `latest`.
      void setSortQuery(nextSort)
    },
    [setSortQuery],
  )

  const handleSetFilters = useCallback<SetValues<typeof DEFAULT_STATE>>(
    async (setter) => {
      const newFilters = typeof setter === 'function' ? setter(filters) : setter
      if (newFilters === null) return new URLSearchParams()

      const shouldClearModel = newFilters.make !== filters.make
      const shouldClearGeneration = newFilters.model !== filters.model

      console.log({ shouldClearModel, shouldClearGeneration })

      return await setFilters({
        ...newFilters,
        model: shouldClearModel ? null : newFilters.model,
        generation: shouldClearGeneration ? null : newFilters.generation,
      })
    },
    [filters, setFilters],
  )

  const data = useMemo<OffersFilterData>(
    () => ({
      make: carsRegistry.getMakes().map(toOption),
      model: hasSingleValue(filters.make)
        ? carsRegistry.getModels(filters.make[0]).map(toOption)
        : null,
      generation:
        hasSingleValue(filters.make) && hasSingleValue(filters.model)
          ? carsRegistry
              .getGenerations(filters.make[0], filters.model[0])
              .map((generation) => toOption(generation.name))
          : null,
      bodyType: bodyTypes.map((value) => ({
        value,
        label: t(`values.bodyType.${value}`),
      })),
      fuelType: fuelTypes.map((value) => ({
        value,
        label: t(`values.fuelType.${value}`),
      })),
      transmission: transmissions.map((value) => ({
        value,
        label: t(`values.transmission.${value}`),
      })),
      condition: conditions.map((value) => ({
        value,
        label: t(`values.condition.${value}`),
      })),
      price: RANGES.price,
      year: RANGES.year,
      mileage: RANGES.mileage,
      power: RANGES.power,
      engineCapacity: RANGES.engineCapacity,
    }),
    [filters.make, filters.model, t],
  )

  const labels = useMemo(
    () => ({
      make: t('labels.make'),
      model: t('labels.model'),
      generation: t('labels.generation'),
      bodyType: t('labels.bodyType'),
      fuelType: t('labels.fuelType'),
      transmission: t('labels.transmission'),
      condition: t('labels.condition'),
      price: t('labels.price'),
      year: t('labels.year'),
      mileage: t('labels.mileage'),
      power: t('labels.power'),
      engineCapacity: t('labels.engineCapacity'),
    }),
    [t],
  )

  const placeholders = useMemo(
    () => ({
      make: t('placeholders.make'),
      model: t('placeholders.model'),
      generation: t('placeholders.generation'),
      bodyType: t('placeholders.bodyType'),
      fuelType: t('placeholders.fuelType'),
      transmission: t('placeholders.transmission'),
      condition: t('placeholders.condition'),
      price: t('placeholders.price'),
      year: t('placeholders.year'),
      mileage: t('placeholders.mileage'),
      power: t('placeholders.power'),
      engineCapacity: t('placeholders.engineCapacity'),
    }),
    [t],
  )

  const sortLabels = useMemo(
    () => ({
      latest: t('labels.latest'),
      'price-asc': t('labels.lowestPrice'),
      'price-desc': t('labels.highestPrice'),
      'mileage-asc': t('labels.lowestMileage'),
      'mileage-desc': t('labels.highestMileage'),
      'year-asc': t('labels.lowestYear'),
      'year-desc': t('labels.highestYear'),
      'power-asc': t('labels.lowestPower'),
      'power-desc': t('labels.highestPower'),
    }),
    [t],
  )

  const contextValue = useMemo<NonNullable<OffersFilterContextValue>>(
    () => ({
      get: filters,
      set: handleSetFilters,
      data,
      labels,
      placeholders,
      sort,
      setSort: handleSetSort,
      sortLabels,
      commandOpen,
      setCommandOpen,
    }),
    [
      filters,
      handleSetFilters,
      data,
      labels,
      placeholders,
      sort,
      handleSetSort,
      sortLabels,
      commandOpen,
    ],
  )

  return (
    <OffersFilterContext.Provider value={contextValue}>
      {children}
    </OffersFilterContext.Provider>
  )
}

export {
  OffersFilterRoot,
  useOffersFilterContext,
  FILTER_KEYS,
  SELECT_KEYS,
  RANGE_KEYS,
  ENUM_SELECT_KEYS,
  SORT_VALUES,
  DEFAULT_SORT,
  type OffersFilterRootProps,
  type OffersFilterValues,
  type OffersFilterFieldKey,
  type OffersFilterSelectKey,
  type OffersFilterRangeKey,
  type OffersFilterSelectOption,
  type OffersFilterSortValue,
  type OffersFilterData,
}
