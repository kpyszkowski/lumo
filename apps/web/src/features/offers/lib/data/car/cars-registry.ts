import {
  type Generation,
  source as sourceData,
} from '~/features/offers/lib/data/car/source'
import {
  buildCarsDictionary,
  type CarsDictionary,
  type ModelEntry,
} from '~/features/offers/utils/build-cars-dictionary'

class CarsRegistry {
  readonly #dictionary: CarsDictionary

  constructor(source = sourceData) {
    this.#dictionary = buildCarsDictionary(source)
  }

  public getMakes(): string[] {
    return Array.from(this.#dictionary.values(), (entry) => entry.name)
  }

  public getModels(makeName: string): string[] {
    const make = this.#dictionary.get(makeName.toLowerCase())

    return make ? Array.from(make.models.values(), (model) => model.name) : []
  }

  public getGenerations(makeName: string, modelName: string): Generation[] {
    const model = this.#getModel(makeName, modelName)

    return model ? Array.from(model.generations.values()) : []
  }

  public getGeneration(
    makeName: string,
    modelName: string,
    generationName: string,
  ): Generation | undefined {
    return this.#getModel(makeName, modelName)?.generations.get(
      generationName.toLowerCase(),
    )
  }

  public hasMake(makeName: string): boolean {
    return this.#dictionary.has(makeName.toLowerCase())
  }

  public hasModel(makeName: string, modelName: string): boolean {
    return this.#getModel(makeName, modelName) !== undefined
  }

  #getModel(makeName: string, modelName: string): ModelEntry | undefined {
    return this.#dictionary
      .get(makeName.toLowerCase())
      ?.models.get(modelName.toLowerCase())
  }
}

const singleton = new CarsRegistry()

export { CarsRegistry, singleton as carsRegistry }
