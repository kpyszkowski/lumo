'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import {
  getMakeIndexes,
  getModelIndexes,
  getGenerationIndexes,
  getTrimIndexes,
  getConditions,
  bodyTypes as bodyTypesOptions,
  transmissions as transmissionsOptions,
  fuelTypes as fuelTypesOptions,
} from '~/features/offers/lib/filter-data'
import { getRangeLabel } from '~/features/offers/utils/get-range-label'
import { useTranslations } from 'next-intl'

const string = z.array(z.string()).optional()
const range = z
  .object({
    min: z.number().optional(),
    max: z.number().optional(),
  })
  .optional()

const offersFilterSchema = z.object({
  make: string,
  model: string,
  generation: string,
  bodyType: string,
  fuelType: string,
  transmission: string,
  condition: string,
  price: range,
  year: range,
  mileage: range,
  power: range,
  engineCapacity: range,
})

type OffersFilterValues = z.infer<typeof offersFilterSchema>

type RangeDataEntry = {
  type: 'range'
  min: number
  max: number
  step: number
  unit?: string
  distribution: number[]
}

type SelectDataEntry = {
  type: 'select'
  options: { id: string; label: string }[]
}

type OffersFilterContextValue =
  | {
      state: {
        model: {
          disabled: boolean
        }
        generation: {
          disabled: boolean
        }
      }
      data: Record<
        | 'make'
        | 'model'
        | 'generation'
        | 'trim'
        | 'bodyType'
        | 'fuelType'
        | 'transmission'
        | 'condition',
        SelectDataEntry
      > &
        Record<
          'price' | 'year' | 'mileage' | 'power' | 'engineCapacity',
          RangeDataEntry
        >
      activeFilters: Record<
        | 'make'
        | 'model'
        | 'generation'
        | 'bodyType'
        | 'fuelType'
        | 'transmission'
        | 'condition',
        { id: string; label: string } | undefined
      > &
        Record<
          'price' | 'year' | 'mileage' | 'power' | 'engineCapacity',
          { min?: number; max?: number; label: string } | undefined
        >
      keys: ReturnType<typeof offersFilterSchema.keyof>['options']
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

type OffersFilterRootProps = {
  children: ReactNode
}

function OffersFilterRoot(props: OffersFilterRootProps) {
  const { children } = props

  const tFilterData = useTranslations('FilterData')

  const modelNameLabels = useMemo(
    () => ({
      series: tFilterData('modelSeries'),
      class: tFilterData('modelClass'),
    }),
    [tFilterData],
  )

  const conditionLabels = useMemo(
    () => ({
      undamaged: tFilterData('conditionUndamaged'),
      damaged: tFilterData('conditionDamaged'),
    }),
    [tFilterData],
  )

  const { setValue, control, ...restFormProps } = useForm<OffersFilterValues>({
    resolver: zodResolver(offersFilterSchema),
    defaultValues: {
      make: undefined,
      model: undefined,
      generation: undefined,
      bodyType: undefined,
      fuelType: undefined,
      transmission: undefined,
      condition: undefined,
      price: undefined,
      year: undefined,
      mileage: undefined,
      power: undefined,
      engineCapacity: undefined,
    },
  })

  const makes: SelectDataEntry = {
    type: 'select',
    options: getMakeIndexes(),
  }

  const models: SelectDataEntry = useWatch({
    control,
    name: 'make',
    compute: (makeIds) => ({
      type: 'select',
      options: getModelIndexes(makeIds?.[0], modelNameLabels) ?? [],
    }),
  })

  const generations: SelectDataEntry = useWatch({
    control,
    name: ['make', 'model'],
    compute: ([makes, models]) => ({
      type: 'select',
      options: getGenerationIndexes(makes?.[0], models?.[0]) ?? [],
    }),
  })

  const trims: SelectDataEntry = useWatch({
    control,
    name: ['make', 'model', 'generation'],
    compute: ([makes, models, generations]) => ({
      type: 'select',
      options: getTrimIndexes(makes?.[0], models?.[0], generations?.[0]) ?? [],
    }),
  })

  const bodyTypes: SelectDataEntry = {
    type: 'select',
    options: bodyTypesOptions,
  }

  const fuelTypes: SelectDataEntry = {
    type: 'select',
    options: fuelTypesOptions,
  }

  const transmissions: SelectDataEntry = {
    type: 'select',
    options: transmissionsOptions,
  }

  const conditions: SelectDataEntry = {
    type: 'select',
    options: getConditions(conditionLabels),
  }

  const price = useMemo<RangeDataEntry>(() => {
    const min = 0
    const max = 500_000 // TODO: fetch from backend
    const unit = 'PLN' // TODO: get from centralized config
    const step = 500
    // TODO: fetch from backend, should be based on current
    // make/model/generation filters
    const distribution = [
      4_000, 8_500, 12_000, 15_000, 20_000, 25_000, 30_000, 35_000, 40_000,
      45_000,
    ]

    return { type: 'range', min, max, unit, step, distribution }
  }, [])

  const year = useMemo<RangeDataEntry>(() => {
    const min = 1980
    const max = new Date().getFullYear() + 1
    const step = 1
    const distribution = [
      500, 1_000, 2_000, 5_000, 10_000, 15_000, 20_000, 25_000, 30_000,
    ]

    return { type: 'range', min, max, step, distribution }
  }, [])

  const mileage = useMemo<RangeDataEntry>(() => {
    const min = 0
    const max = 800_000
    const step = 1_000
    const unit = 'km'
    const distribution = [
      5_000, 10_000, 20_000, 50_000, 100_000, 150_000, 200_000, 250_000,
    ]

    return { type: 'range', min, max, unit, step, distribution }
  }, [])

  const power = useMemo<RangeDataEntry>(() => {
    const min = 0
    const max = 1_000
    const step = 10
    const unit = 'KM'
    const distribution = [50, 100, 150, 200, 250, 300, 400, 500, 600, 800]

    return { type: 'range', min, max, unit, step, distribution }
  }, [])

  const engineCapacity = useMemo<RangeDataEntry>(() => {
    const min = 0
    const max = 8_000
    const step = 100
    const unit = 'cm³'
    const distribution = [500, 1_000, 2_000, 3_000, 4_000, 5_000, 6_000, 7_000]

    return { type: 'range', min, max, unit, step, distribution }
  }, [])

  const activeFilters = useWatch({
    control,
    compute: (values) => ({
      make: values.make?.[0]
        ? makes.options.find((m) => m.id === values.make![0])
        : undefined,
      model:
        values.make?.[0] && values.model?.[0]
          ? models.options.find((m) => m.id === values.model![0])
          : undefined,
      generation:
        values.make?.[0] && values.model?.[0] && values.generation?.[0]
          ? generations.options.find((g) => g.id === values.generation![0])
          : undefined,
      bodyType: values.bodyType?.[0]
        ? bodyTypes.options.find((bt) => bt.id === values.bodyType![0])
        : undefined,
      fuelType: values.fuelType?.[0]
        ? fuelTypes.options.find((ft) => ft.id === values.fuelType![0])
        : undefined,
      transmission: values.transmission?.[0]
        ? transmissions.options.find((t) => t.id === values.transmission![0])
        : undefined,
      condition: values.condition?.[0]
        ? conditions.options.find((c) => c.id === values.condition![0])
        : undefined,
      price: {
        ...values.price,
        label: getRangeLabel({
          from: values.price?.min,
          to: values.price?.max,
          unit: price.unit,
        }),
      },
      year: {
        ...values.year,
        label: getRangeLabel({
          from: values.year?.min,
          to: values.year?.max,
        }),
      },
      mileage: {
        ...values.mileage,
        label: getRangeLabel({
          from: values.mileage?.min,
          to: values.mileage?.max,
          unit: mileage.unit,
        }),
      },
      power: {
        ...values.power,
        label: getRangeLabel({
          from: values.power?.min,
          to: values.power?.max,
          unit: power.unit,
        }),
      },
      engineCapacity: {
        ...values.engineCapacity,
        label: getRangeLabel({
          from: values.engineCapacity?.min,
          to: values.engineCapacity?.max,
          unit: engineCapacity.unit,
        }),
      },
    }),
  })

  const state = useWatch({
    control,
    compute: (values) => ({
      model: {
        disabled: (values.make?.length ?? 0) !== 1,
      },
      generation: {
        disabled: (values.make?.length ?? 0) !== 1 || !values.model?.length,
      },
    }),
  })

  const handleSetValue = useCallback(
    (...args: Parameters<typeof setValue>) => {
      const [name, ...restArgs] = args

      if (name === 'make') {
        setValue('model', undefined, { shouldDirty: true })
        setValue('generation', undefined, { shouldDirty: true })
      }

      if (name === 'model') {
        setValue('generation', undefined, { shouldDirty: true })
      }

      setValue(name, ...restArgs)
    },
    [setValue],
  )

  const keys = useMemo(() => offersFilterSchema.keyof().options, [])

  const contextValue: OffersFilterContextValue = {
    state,
    data: {
      make: makes,
      model: models,
      generation: generations,
      trim: trims,
      bodyType: bodyTypes,
      fuelType: fuelTypes,
      transmission: transmissions,
      condition: conditions,
      price,
      year,
      mileage,
      power,
      engineCapacity,
    },
    activeFilters,
    keys,
  }

  return (
    <OffersFilterContext.Provider value={contextValue}>
      <FormProvider
        setValue={handleSetValue}
        control={control}
        {...restFormProps}
      >
        {children}
      </FormProvider>
    </OffersFilterContext.Provider>
  )
}

export {
  OffersFilterRoot,
  type OffersFilterRootProps,
  useOffersFilterContext,
  type OffersFilterValues,
  offersFilterSchema,
}
