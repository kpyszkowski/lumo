import { IconButton } from '@lumo/ui/components'
import {
  IconCalendarDot,
  IconEngine,
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
    container: 'flex flex-col',
    galleryWrapper:
      'bg-elevated relative mb-4 aspect-video w-full grow rounded-2xl p-2',
    gallery: 'absolute inset-0',
    galleryButtons: 'hidden gap-2', // TODO: Show later
    detailsList: 'mt-3 ml-14 flex flex-wrap gap-1',
    // TODO: Establish semantic color token for border color
    detailItem:
      'flex items-center gap-2 rounded-3xl border border-(--background-color-elevated) px-3 py-2',
    detailIcon: 'text-subtle size-4 stroke-[1.5]',
    detailValue: 'text-sm tracking-tight whitespace-nowrap',
    infoWrapper: 'flex items-start gap-3',
    makeIconWrapper: 'bg-elevated size-12 rounded-2xl',
    makeModelWrapper: 'flex flex-1 grow flex-col',
    makeModel: 'mb-1 font-semibold',
    trim: 'text-muted mb-1 text-sm',
    locationWrapper: 'text-muted flex items-center gap-2',
    locationIcon: 'size-4',
    location: 'text-sm whitespace-nowrap',
    price: 'text-lg font-semibold',
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
    engineCapacity: 2000,
    power: 288,
    fuelType: 'plugin',
    transmission: 'automatic',
  },
}

const detailKeyToIcon = {
  productionYear: IconCalendarDot,
  mileage: IconRoad,
  engineCapacity: IconEngine,
  power: IconGauge,
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
        icon: detailKeyToIcon.engineCapacity,
        value: `${(MOCK.details.engineCapacity / 1000).toFixed(1)} L`,
      },
      {
        icon: detailKeyToIcon.power,
        value: `${MOCK.details.power} KM`,
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
    </div>
  )
}

export default AdTile
