import type { FuelTypeId } from '~/features/filter-builder/lib/types'

export function deriveFuelType(
  driveTypeId: number,
  electricRangeKm: number,
): FuelTypeId {
  if (driveTypeId === 3) return 'electric'
  if (driveTypeId === 1 && electricRangeKm > 0) return 'hybrid'
  if (driveTypeId === 2) return 'diesel'
  return 'petrol'
}
