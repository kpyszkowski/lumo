export type FuelTypeId = 'petrol' | 'diesel' | 'electric' | 'hybrid'
export type TransmissionId = 'manual' | 'automatic'

export type EngineTrim = {
  name: string
  capacity: number
  power: number
  fuelType: FuelTypeId
}

export type FilterDataGenerated = {
  makes: Array<{ id: string; name: string }>
  bodyTypes: string[]
  fuelTypes: string[]
  transmissions: string[]
  indexes: {
    makes: Record<string, { name: string; modelIds: string[] }>
    models: Record<string, { name: string; generationIds: string[] }>
    generations: Record<
      string,
      {
        name: string
        production: { start: number; end: number | null }
        engineTrims: EngineTrim[]
      }
    >
  }
}

export type FilterLocaleData = {
  bodyTypes: Record<string, string>
  fuelTypes: Record<string, string>
  transmissions: Record<string, string>
}

export type BuildFilterDataResult = {
  data: FilterDataGenerated
  locale: {
    id: string
    translations: FilterLocaleData
  }
}
