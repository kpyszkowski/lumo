'use client'
import { useCallback } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FilterSelection } from '~/features/ads/hooks/use-ad-distribution'
import {
  adFilterSchema,
  AD_FILTER_DEFAULT_VALUES,
  AD_FILTER_DEFAULTS,
  type AdFilterValues,
} from '~/features/ads/lib/ad-filter-schema'

export type UseAdFilterFormReturn = {
  form: UseFormReturn<AdFilterValues>
  values: AdFilterValues
  setMake: (id: string | null) => void
  setModel: (id: string | null) => void
  isPriceRangeActive: boolean
  isYearRangeActive: boolean
  isMileageRangeActive: boolean
  filterSelection: FilterSelection
}

export function useAdFilterForm(): UseAdFilterFormReturn {
  const form = useForm<AdFilterValues>({
    resolver: zodResolver(adFilterSchema),
    defaultValues: AD_FILTER_DEFAULT_VALUES,
  })

  const { setValue, watch } = form
  const values = watch()

  const setMake = useCallback(
    (id: string | null) => {
      setValue('makeId', id)
      setValue('modelId', null)
      setValue('generationId', null)
    },
    [setValue],
  )

  const setModel = useCallback(
    (id: string | null) => {
      setValue('modelId', id)
      setValue('generationId', null)
    },
    [setValue],
  )

  const { priceMin, priceMax, yearMin, yearMax, mileageMin, mileageMax } =
    AD_FILTER_DEFAULTS

  const isPriceRangeActive =
    values.priceRange[0] !== priceMin || values.priceRange[1] !== priceMax
  const isYearRangeActive =
    values.yearRange[0] !== yearMin || values.yearRange[1] !== yearMax
  const isMileageRangeActive =
    values.mileageRange[0] !== mileageMin ||
    values.mileageRange[1] !== mileageMax

  const filterSelection: FilterSelection = {
    makeId: values.makeId,
    modelId: values.modelId,
    generationId: values.generationId,
    bodyTypeId: values.bodyTypeId,
    fuelTypeId: values.fuelTypeId,
    transmissionId: values.transmissionId,
  }

  return {
    form,
    values,
    setMake,
    setModel,
    isPriceRangeActive,
    isYearRangeActive,
    isMileageRangeActive,
    filterSelection,
  }
}
