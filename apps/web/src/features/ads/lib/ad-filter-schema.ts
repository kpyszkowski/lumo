'use client'
import { z } from 'zod'

export const AD_FILTER_DEFAULTS = {
  priceMin: 0,
  priceMax: 500_000,
  yearMin: 1990,
  yearMax: 2026,
  mileageMin: 0,
  mileageMax: 300_000,
} as const

export const adFilterSchema = z.object({
  makeId: z.string().nullable(),
  modelId: z.string().nullable(),
  generationId: z.string().nullable(),
  bodyTypeId: z.string().nullable(),
  fuelTypeId: z.string().nullable(),
  transmissionId: z.string().nullable(),
  priceRange: z.tuple([z.number(), z.number()]),
  yearRange: z.tuple([z.number(), z.number()]),
  mileageRange: z.tuple([z.number(), z.number()]),
})

export type AdFilterValues = z.infer<typeof adFilterSchema>

export const AD_FILTER_DEFAULT_VALUES: AdFilterValues = {
  makeId: null,
  modelId: null,
  generationId: null,
  bodyTypeId: null,
  fuelTypeId: null,
  transmissionId: null,
  priceRange: [AD_FILTER_DEFAULTS.priceMin, AD_FILTER_DEFAULTS.priceMax],
  yearRange: [AD_FILTER_DEFAULTS.yearMin, AD_FILTER_DEFAULTS.yearMax],
  mileageRange: [AD_FILTER_DEFAULTS.mileageMin, AD_FILTER_DEFAULTS.mileageMax],
}
