import { createStyles } from '@lumo/ui/utils'
import { OfferTile } from '~/features/offers/components/offer-tile'

const pageStyles = createStyles({
  slots: {
    container: 'flex flex-col px-6',
  },
})

export default async function OffersPage() {
  const styles = pageStyles()

  return (
    <div className={styles.container()}>
      <div className="grid grid-cols-3 gap-x-6 gap-y-8 py-3">
        <OfferTile />
        <OfferTile />
        <OfferTile />
        <OfferTile />
      </div>
    </div>
  )
}
