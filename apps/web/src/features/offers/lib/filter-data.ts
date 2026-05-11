export type FuelTypeId = 'petrol' | 'diesel' | 'electric' | 'hybrid'
export type TransmissionId = 'manual' | 'automatic'
export type BodyTypeId =
  | 'sedan'
  | 'suv'
  | 'coupe'
  | 'convertible'
  | 'hatchback'
  | 'wagon'
  | 'van'
  | 'pickup'
  | 'other'

export interface FilterOption {
  id: string
  label: string
}

// Static filter options - these are hardcoded as car-api doesn't provide them
export const bodyTypeOptions: FilterOption[] = [
  { id: 'sedan', label: 'Sedan' },
  { id: 'suv', label: 'SUV' },
  { id: 'coupe', label: 'Coupe' },
  { id: 'convertible', label: 'Kabriolet' },
  { id: 'hatchback', label: 'Hatchback' },
  { id: 'wagon', label: 'Kombi' },
  { id: 'van', label: 'Van' },
  { id: 'pickup', label: 'Pickup' },
  { id: 'other', label: 'Inny' },
]

export const fuelTypeOptions: FilterOption[] = [
  { id: 'petrol', label: 'Benzyna' },
  { id: 'diesel', label: 'Diesel' },
  { id: 'electric', label: 'Elektryczny' },
  { id: 'hybrid', label: 'Hybryda' },
]

export const transmissionOptions: FilterOption[] = [
  { id: 'manual', label: 'Manualna' },
  { id: 'automatic', label: 'Automatyczna' },
]
