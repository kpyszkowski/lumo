'use client'
import { StaggeredList } from '@lumo/ui/components'
import { createStyles, type StylesProps } from '@lumo/ui/utils'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const recommendedSearchQueriesStyles = createStyles({
  slots: {
    container: 'grid auto-cols-fr grid-flow-col gap-6',
    section: 'flex flex-col',
    heading: 'text-subtle mb-2 text-sm font-bold uppercase',
    itemWrapper: 'overflow-hidden',
    item: 'text-main w-fit text-3xl/snug font-bold',
  },
})

type RecommendedSearchQueriesProps = StylesProps<
  typeof recommendedSearchQueriesStyles
> & {
  className?: string
}

export default function RecommendedSearchQueries(
  props: RecommendedSearchQueriesProps,
) {
  const { className, ...restProps } = props

  const styles = recommendedSearchQueriesStyles()
  const t = useTranslations('RecommendedSearchQueries')

  const sections = [
    {
      heading: t('popularBrandsHeading'),
      items: [
        { label: 'BMW', href: '/search?query=bmw' },
        { label: 'Mercedes-Benz', href: '/search?query=mercedes' },
        { label: 'Toyota', href: '/search?query=toyota' },
        { label: 'Ford', href: '/search?query=ford' },
      ],
    },
    {
      heading: t('popularSearchesHeading'),
      items: [
        { label: t('searchCoupe'), href: '/search?query=c' },
        { label: t('searchHybridSuv'), href: '/search?query=h' },
        { label: t('searchCityElectric'), href: '/search?query=m' },
        { label: t('searchLimousine'), href: '/search?query=l' },
      ],
    },
    {
      heading: t('bodyTypesHeading'),
      items: [
        { label: t('bodySuv'), href: '/search?query=s' },
        { label: t('bodyLimousine'), href: '/search?query=l' },
        { label: t('bodyEstate'), href: '/search?query=k' },
        { label: t('bodyCoupe'), href: '/search?query=c' },
      ],
    },
    {
      heading: t('fuelTypesHeading'),
      items: [
        { label: t('fuelElectric'), href: '/search?query=e' },
        { label: t('fuelPetrol'), href: '/search?query=b' },
        { label: t('fuelDiesel'), href: '/search?query=d' },
        { label: t('fuelHybrid'), href: '/search?query=h' },
      ],
    },
  ]

  return (
    <div
      className={styles.container({ className })}
      {...restProps}
    >
      {sections.map((section) => (
        <div
          key={section.heading}
          className={styles.section()}
        >
          <h2 className={styles.heading()}>{section.heading}</h2>

          <StaggeredList.Root
            delay={0.12}
            delayOptions={{
              from: 'last',
            }}
          >
            {section.items.map((item) => (
              <StaggeredList.Item
                key={item.label}
                className={styles.item()}
                hidden={{
                  clipPath: 'ellipse(0% 0% at 100% 0%)',
                  x: 16,
                }}
                visible={{
                  clipPath: 'ellipse(150% 150% at 100% 0%)',
                  x: 0,
                }}
                transition={{
                  type: 'tween',
                  duration: 0.88,
                  ease: 'easeOut',
                }}
              >
                <Link href={item.href}>{item.label}</Link>
              </StaggeredList.Item>
            ))}
          </StaggeredList.Root>
        </div>
      ))}
    </div>
  )
}
