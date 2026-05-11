'use client'

import { useMemo } from 'react'
import {
  getBrand,
  getBrands,
  getGenerations,
  type Generation,
  type Model,
} from '~/features/offers/lib/catalog'

type SelectOption = {
  id: string
  label: string
}

function toModelOption(model: Model): SelectOption {
  return {
    id: model.name,
    label: model.name,
  }
}

function toGenerationOption(generation: Generation): SelectOption {
  return {
    id: generation.name,
    label: generation.name,
  }
}

export function useCatalogBrands(): SelectOption[] {
  return useMemo(
    () => getBrands().map((brand) => ({ id: brand, label: brand })),
    [],
  )
}

export function useCatalogModels(
  brandName: string | undefined,
): SelectOption[] {
  return useMemo(() => {
    if (!brandName) {
      return []
    }

    const brand = getBrand(brandName)

    return (brand?.models ?? []).map(toModelOption)
  }, [brandName])
}

export function useCatalogGenerations(
  brandName: string | undefined,
  modelName: string | undefined,
): SelectOption[] {
  return useMemo(() => {
    if (!brandName || !modelName) {
      return []
    }

    return getGenerations(brandName, modelName).map(toGenerationOption)
  }, [brandName, modelName])
}
