import { type ScrapeEvent } from '~/features/scraper/lib/scrape-stream'
import { type OutputTree } from '~/types'

export function createOutputAggregator() {
  let current: OutputTree | null = null

  return {
    push(event: ScrapeEvent): OutputTree | null {
      if (event.type === 'make') {
        const finished = current
        current = {
          make: event.make,
          models: [],
        }
        return finished
      }

      if (event.type === 'model') {
        current!.models.push({
          ...event.model,
          generations: [],
        })
        return null
      }

      if (event.type === 'generation') {
        const model = current!.models[current!.models.length - 1]
        model?.generations.push(event.generation)
        return null
      }

      return null
    },

    flush(): OutputTree | null {
      return current
    },
  }
}
