import { Button, Radio, Toggle } from '@lumo/ui/components'
import {
  IconAdjustmentsHorizontal,
  IconCarBodyCoupe,
  IconCarBodyEstate,
  IconCarBodyLimousine,
  IconCarBodySuv,
} from '@lumo/ui/icons'
import { createStyles } from '@lumo/ui/utils'
import AdTile from '~/features/ads/components/ad-tile'
import RecommendedSearchQueries from '~/features/recommendations/components/recommended-search-queries'
import { getTranslations } from 'next-intl/server'

const pageStyles = createStyles({
  slots: {
    container: 'flex flex-col px-6',
    searchQueriesContainer: 'my-12',
  },
})

export default async function Homepage() {
  const styles = pageStyles()
  const t = await getTranslations('HomePage')

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
            {t('advertTypeLabel')}
          </div>

          <Radio.Button value="advert:promoted">{t('promoted')}</Radio.Button>
          <Radio.Button value="advert:newest">{t('newest')}</Radio.Button>
          <Radio.Button value="advert:popular">{t('mostPopular')}</Radio.Button>
        </Radio.Group>

        <Button
          className="ml-auto"
          variant="ghost"
          icon={IconAdjustmentsHorizontal}
        >
          {t('filter')}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-8 py-3">
        <AdTile />
        <AdTile />
        <AdTile />
        <AdTile />
      </div>
    </div>
  )
}
