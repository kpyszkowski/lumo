import { filterData } from '@lumo/scraper/filter-data'
import { filterLocale } from '@lumo/scraper/locales/pl'

export { filterData, filterLocale }

export const { makes, bodyTypes, fuelTypes, transmissions, indexes } =
  filterData
