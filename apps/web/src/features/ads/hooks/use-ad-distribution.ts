export type FilterSelection = {
  makeId: string | null
  modelId: string | null
  generationId: string | null
  bodyTypeId: string | null
  fuelTypeId: string | null
  transmissionId: string | null
}

export type DistributionDimension = 'price' | 'productionYear' | 'mileage'

const PLACEHOLDERS: Record<DistributionDimension, number[]> = {
  price: [
    2, 5, 9, 16, 28, 42, 58, 70, 65, 55, 44, 35, 25, 17, 11, 7, 4, 2, 1, 1,
  ],
  productionYear: [
    1, 1, 2, 2, 3, 4, 5, 6, 7, 9, 11, 13, 16, 18, 21, 24, 28, 32, 36, 40,
  ],
  mileage: [40, 36, 30, 24, 19, 15, 12, 9, 7, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1],
}

// Swap the return for an API/query call once data is available.
// e.g. useSWR(['/api/ads/distribution', dimension, selection], fetcher).data ?? PLACEHOLDERS[dimension]
export function useAdDistribution(
  dimension: DistributionDimension,
  _selection: FilterSelection,
): number[] {
  return PLACEHOLDERS[dimension]
}
