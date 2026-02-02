import { Button, Radio, Toggle } from '@lumo/ui/components'
import {
  IconAdjustmentsHorizontal,
  IconCarBodyCoupe,
  IconCarBodyEstate,
  IconCarBodyLimousine,
  IconCarBodySuv,
  IconHeart,
} from '@lumo/ui/icons'
import { createStyles } from '@lumo/ui/utils'
import RecommendedSearchQueries from '~/features/homepage/components/recommended-search-queries'

const pageStyles = createStyles({
  slots: {
    container: 'flex flex-col px-6',
    searchQueriesContainer: 'my-12',
  },
})

export default async function Homepage() {
  const styles = pageStyles()

  return (
    <div className={styles.container()}>
      <RecommendedSearchQueries className={styles.searchQueriesContainer()} />

      <div className="flex items-center gap-12 py-3">
        <Toggle.Group
          variant="elevated"
          defaultValue={['body-type:limousine']}
        >
          <Toggle.Button
            value="body-type:limousine"
            icon={IconCarBodyLimousine}
          />
          <Toggle.Button
            value="body-type:suv"
            icon={IconCarBodySuv}
          />
          <Toggle.Button
            value="body-type:estate"
            icon={IconCarBodyEstate}
          />
          <Toggle.Button
            value="body-type:coupe"
            icon={IconCarBodyCoupe}
          />
        </Toggle.Group>

        <Radio.Group
          aria-labelledby="radiogroup-label"
          defaultValue="advert:promoted"
        >
          <div
            id="radiogroup-label"
            className="sr-only"
          >
            Rodzaj ogłoszenia
          </div>

          <Radio.Button value="advert:promoted">Promowane</Radio.Button>
          <Radio.Button value="advert:newest">Najnowsze</Radio.Button>
          <Radio.Button value="advert:popular">Najpopularniejsze</Radio.Button>
        </Radio.Group>

        <Button
          className="ml-auto"
          variant="ghost"
          icon={IconAdjustmentsHorizontal}
        >
          Filtrowanie
        </Button>
      </div>
    </div>
  )
}
