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
  bodyTypeOptions,
  transmissionOptions,
  fuelTypeOptions,
} from '~/features/offers/lib/filter-data'
import {
  useCatalogBrands,
  useCatalogGenerations,
  useCatalogModels,
} from '~/features/offers/hooks/use-catalog'

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
      Record<'model' | 'generation', SelectDataEntry> &
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

  const makeOptions = useCatalogBrands()

  // Watch selected make
  const selectedMake = useWatch({
    control,
    name: 'make',
  })

  const selectedMakeName = selectedMake?.[0]
  const modelOptions = useCatalogModels(selectedMakeName)

  // Watch selected model
  const selectedModel = useWatch({
    control,
    name: 'model',
  })

  const selectedModelName = selectedModel?.[0]
  const generationOptions = useCatalogGenerations(
    selectedMakeName,
    selectedModelName,
  )

  const contextValue = useMemo<OffersFilterContextValue>(
    () => ({
      make: {
        type: 'select',
        options: makeOptions,
      },
      model: {
        type: 'select',
        options: modelOptions.length > 0 ? modelOptions : undefined,
      },
      generation: {
        type: 'select',
        options: generationOptions.length > 0 ? generationOptions : undefined,
      },
      bodyType: {
        type: 'select',
        options: bodyTypeOptions,
      },
      fuelType: {
        type: 'select',
        options: fuelTypeOptions,
      },
      transmission: {
        type: 'select',
        options: transmissionOptions,
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
    [makeOptions, modelOptions, generationOptions],
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
