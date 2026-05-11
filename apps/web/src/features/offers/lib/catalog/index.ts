import {
  brands,
  type Brand,
  type Model,
  type Generation,
} from '~/features/offers/lib/catalog/brands'

export type { Brand, Model, Generation }

export function getBrands(): string[] {
  return brands.map((entry) => entry.brand)
}

export function getBrand(brandName: string): Brand | null {
  const brand = brands.find(
    (entry) => entry.brand.toLowerCase() === brandName.toLowerCase(),
  )

  return brand ?? null
}

export function getGenerations(
  brandName: string,
  modelName: string,
): readonly Generation[] {
  const brand = getBrand(brandName)

  if (!brand) {
    return []
  }

  const model = brand.models.find(
    (entry) => entry.name.toLowerCase() === modelName.toLowerCase(),
  )

  return model?.generations ?? []
}

export function getModelsByBrand(brandName: string): readonly Model[] {
  return getBrand(brandName)?.models ?? []
}
