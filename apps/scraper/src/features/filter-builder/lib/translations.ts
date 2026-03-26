import type {
  FuelTypeId,
  TransmissionId,
} from '~/features/filter-builder/lib/types'

export const LOCALE = 'pl' as const
export type SupportedLocale = typeof LOCALE

export const BODY_TYPE_TRANSLATIONS: Record<
  string,
  { id: string; label: string }
> = {
  Limousine: { id: 'sedan', label: 'Sedan' },
  Kombi: { id: 'kombi', label: 'Kombi' },
  Coupe: { id: 'coupe', label: 'Coupe' },
  Cabriolet: { id: 'kabriolet', label: 'Kabriolet' },
  Cabrio: { id: 'kabriolet', label: 'Kabriolet' },
  SUV: { id: 'suv', label: 'SUV' },
  Geländewagen: { id: 'suv', label: 'SUV' },
  Van: { id: 'van', label: 'Van' },
  Pickup: { id: 'pickup', label: 'Pickup' },
  Hatchback: { id: 'hatchback', label: 'Hatchback' },
  'Kombi-Limousine': { id: 'kombi', label: 'Kombi' },
  Coupé: { id: 'coupe', label: 'Coupe' },
}

export const FUEL_TYPE_LABELS: Record<FuelTypeId, string> = {
  petrol: 'Benzyna',
  diesel: 'Diesel',
  electric: 'Elektryczny',
  hybrid: 'Hybryda',
}

export const TRANSMISSION_LABELS: Record<TransmissionId, string> = {
  manual: 'Manualna',
  automatic: 'Automatyczna',
}
