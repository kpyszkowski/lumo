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
  makes,
  getModels,
  getGenerations,
  getTrims,
  bodyTypes,
  transmissions,
  fuelTypes,
} from '~/features/offers/lib/filter-data'

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
  trim: string,
  bodyType: string,
  fuelType: string,
  transmission: string,
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
  options: { id: string; label: string }[] | undefined
}

type OffersFilterContextValue =
  | (Record<
      'make' | 'bodyType' | 'fuelType' | 'transmission',
      SelectDataEntry
    > &
      Record<'model' | 'generation' | 'trim', SelectDataEntry> &
      Record<
        'price' | 'year' | 'mileage' | 'power' | 'engineCapacity',
        RangeDataEntry
      >)
  | undefined

const RANGES = {
  price: { min: 0, max: 1_000_000, step: 1_000, unit: 'PLN' },
  year: { min: 1900, max: new Date().getFullYear() + 1, step: 1 },
  mileage: { min: 0, max: 500_000, step: 5_000, unit: 'km' },
  power: { min: 0, max: 1_000, step: 10, unit: 'KM' },
  engineCapacity: { min: 0, max: 10_000, step: 100, unit: 'cm³' },
} as const

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

  const { setValue, control, ...restFormProps } = useForm<OffersFilterValues>({
    resolver: zodResolver(offersFilterSchema),
    defaultValues: Object.fromEntries(
      Object.keys(offersFilterSchema.shape).map((key) => [key, undefined]),
    ),
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

  const models = useWatch({
    control,
    name: 'make',
    compute: (make) => (make?.length === 1 ? getModels(make[0]) : undefined),
  })

  const generations = useWatch({
    control,
    name: ['make', 'model'],
    compute: ([make, model]) =>
      make?.length === 1 && model?.length === 1
        ? getGenerations(make[0], model[0])
        : undefined,
  })

  const trims = useWatch({
    control,
    name: ['make', 'model', 'generation'],
    compute: ([make, model, generation]) =>
      make?.length === 1 && model?.length === 1 && generation?.length === 1
        ? getTrims(make[0], model[0], generation[0])
        : undefined,
  })

  const contextValue = useMemo<OffersFilterContextValue>(
    () => ({
      make: {
        type: 'select',
        options: makes,
      },
      model: {
        type: 'select',
        options: models,
      },
      generation: {
        type: 'select',
        options: generations,
      },
      trim: {
        type: 'select',
        options: trims,
      },
      bodyType: {
        type: 'select',
        options: bodyTypes,
      },
      fuelType: {
        type: 'select',
        options: fuelTypes,
      },
      transmission: {
        type: 'select',
        options: transmissions,
      },
      price: {
        type: 'range',
        ...RANGES.price,
        distribution: [],
      },
      year: {
        type: 'range',
        ...RANGES.year,
        distribution: [],
      },
      mileage: {
        type: 'range',
        ...RANGES.mileage,
        distribution: [],
      },
      power: {
        type: 'range',
        ...RANGES.power,
        distribution: [],
      },
      engineCapacity: {
        type: 'range',
        ...RANGES.engineCapacity,
        distribution: [],
      },
    }),
    [models, generations, trims],
  )

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
