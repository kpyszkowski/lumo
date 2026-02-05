import { IconButton } from '@lumo/ui/components'
import {
  IconCalendarDot,
  IconGasStation,
  IconGauge,
  IconHeart,
  IconManualGearbox,
  IconMapPin,
  IconMessageCircle,
  IconRoad,
} from '@lumo/ui/icons'
import { createStyles } from '@lumo/ui/utils'
import React, { useMemo } from 'react'

const adTileStyles = createStyles({
  slots: {
    container: 'flex flex-col gap-3',
    galleryWrapper:
      'bg-elevated relative aspect-video w-full grow rounded-2xl p-2',
    gallery: 'absolute inset-0',
    galleryButtons: 'hidden gap-2', // TODO: Show later
    detailsList: 'flex gap-3',
    detailItem:
      'bg-elevated flex grow basis-1/5 flex-col gap-1 overflow-hidden rounded-2xl px-2 py-3',
    detailIcon: 'text-muted size-4',
    detailValue: 'mask-r-from-88% text-sm tracking-tighter whitespace-nowrap',
    infoWrapper: 'flex items-start gap-3',
    makeIconWrapper: 'bg-elevated size-12 rounded-2xl',
    makeModelWrapper: 'flex flex-1 grow flex-col gap-1',
    makeModel: 'font-bold',
    trim: 'text-muted text-sm',
    locationWrapper: 'text-muted flex items-center gap-2',
    locationIcon: 'size-4',
    location: 'text-sm tracking-tighter whitespace-nowrap',
    price: 'text-lg font-bold',
  },
})

type AdTileProps = {
  className?: string
}

const MOCK = {
  make: 'BMW',
  model: 'Seria 5',
  trim: '530e iPerformance M Sport',
  city: 'Poznań',
  voivodeship: 'wielkopolskie',
  price: 189900,
  details: {
    productionYear: 2020,
    mileage: 15000,
    engine: [2000, 288] as const,
    fuelType: 'plugin',
    transmission: 'automatic',
  },
}

const detailKeyToIcon = {
  productionYear: IconCalendarDot,
  mileage: IconRoad,
  engine: IconGauge,
  fuelType: IconGasStation,
  transmission: IconManualGearbox,
}

const fuelTypeKeyToLabel = {
  plugin: 'Hybryda plug-in',
  petrol: 'Benzyna',
  diesel: 'Diesel',
  electric: 'Elektryczny',
}

const transmissionKeyToLabel = {
  automatic: 'Automatyczna',
  manual: 'Manualna',
}

function AdTile(props: AdTileProps) {
  const { className } = props

  const styles = adTileStyles()

  const details = useMemo(
    () => [
      {
        icon: detailKeyToIcon.productionYear,
        value: MOCK.details.productionYear,
      },
      {
        icon: detailKeyToIcon.mileage,
        value: `${MOCK.details.mileage} km`,
      },
      {
        icon: detailKeyToIcon.engine,
        value: `${(MOCK.details.engine[0] / 1000).toFixed(1)} L ${MOCK.details.engine[1]} KM`,
      },
      {
        icon: detailKeyToIcon.fuelType,
        value:
          fuelTypeKeyToLabel[
            MOCK.details.fuelType as keyof typeof fuelTypeKeyToLabel
          ],
      },
      {
        icon: detailKeyToIcon.transmission,
        value:
          transmissionKeyToLabel[
            MOCK.details.transmission as keyof typeof transmissionKeyToLabel
          ],
      },
    ],
    [],
  )

  const makeModelLabel = `${MOCK.make} ${MOCK.model}`
  const locationLabel = `${MOCK.city}, ${MOCK.voivodeship}`
  const priceLabel = MOCK.price.toLocaleString('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    currencyDisplay: 'code',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <div className={styles.container({ className })}>
      <div className={styles.galleryWrapper()}>
        <picture className={styles.gallery()} />

        <ul className={styles.galleryButtons()}>
          <li>
            <IconButton
              label="Dodaj do obserwowanych"
              icon={IconHeart}
            />
          </li>

          <li>
            <IconButton
              label="Dyskusja"
              icon={IconMessageCircle}
            />
          </li>
        </ul>
      </div>

      <dl className={styles.detailsList()}>
        {details.map((detail) => (
          <div
            className={styles.detailItem()}
            key={detail.value}
          >
            <dt>
              <detail.icon className={styles.detailIcon()} />
            </dt>

            <dd className={styles.detailValue()}>{detail.value}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.infoWrapper()}>
        <div className={styles.makeIconWrapper()} />

        <div className={styles.makeModelWrapper()}>
          <span className={styles.makeModel()}>{makeModelLabel}</span>

          <span className={styles.trim()}>{MOCK.trim}</span>

          <div className={styles.locationWrapper()}>
            <IconMapPin className={styles.locationIcon()} />

            <span className={styles.location()}>{locationLabel}</span>
          </div>
        </div>

        <span className={styles.price()}>{priceLabel}</span>
      </div>
    </div>
  )
}

export default AdTile
