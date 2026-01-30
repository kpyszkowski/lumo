/**
 * Represents a generic entity with common properties.
 * Used as a base interface for makes, models, generations etc.
 */
type Entity = {
  /**
   * The unique identifier for the entity. It's slugified version of the name.
   * @dev It's a prefferred way to reference data in consumer applications.
   */
  id: string
  /**
   * The source identifier for the entity.
   * @dev Used to link to the original data source - eg. in URLs or selectors.
   */
  sourceId: string
  /**
   * The human-readable name of the entity.
   */
  name: string
}

export type Make = Entity
export type Model = Entity
export type Generation = Entity & {
  productionYears: number[]
}

/**
 * Represents the structure of the page context data used in scraping.
 */
export interface PageContext {
  irContent: {
    brandPage: {
      models: {
        url: string
        mdbAssignment: {
          brands: [
            {
              models: [
                {
                  name: string
                },
              ]
            },
          ]
        }
      }[]
    }

    brandsAZ: {
      brands: {
        name: string
        url: string
      }[]
    }

    modelGeneration: {
      generations: {
        url: string
        buildingPeriod: {
          fromYear: number
          tillYear: number | null
        }
        mdbAssignment: {
          brands: [
            {
              models: [
                {
                  generations: [
                    {
                      name: string
                    },
                  ]
                },
              ]
            },
          ]
        }
      }[]
    }
  }
}

export type OutputTree = {
  make: Make
  models: Array<
    Model & {
      generations: Generation[]
    }
  >
}
