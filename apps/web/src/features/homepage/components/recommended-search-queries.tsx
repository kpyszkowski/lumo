import { StaggeredList } from '@lumo/ui/components'
import { createStyles, type StylesProps } from '@lumo/ui/utils'
import Link from 'next/link'

const recommendedSearchQueriesStyles = createStyles({
  slots: {
    container: 'grid auto-cols-fr grid-flow-col gap-6',
    heading: 'text-subtle mb-2 text-sm font-bold uppercase',
    itemWrapper: 'overflow-hidden',
    item: 'text-main text-3xl/snug font-bold',
  },
})

const MOCK = [
  {
    heading: 'Popularne marki',
    items: [
      { label: 'BMW', href: '/search?query=bmw' },
      { label: 'Mercedes-Benz', href: '/search?query=mercedes' },
      { label: 'Toyota', href: '/search?query=toyota' },
      { label: 'Ford', href: '/search?query=ford' },
    ],
  },
  {
    heading: 'Popularne wyszukiwania',
    items: [
      { label: 'Coupe do 20k PLN', href: '/search?query=c' },
      { label: 'Hybrydowy SUV', href: '/search?query=h' },
      { label: 'Miejski elektryk', href: '/search?query=m' },
      { label: 'Limuzyna od 250 koni', href: '/search?query=l' },
    ],
  },
  {
    heading: 'Rodzaje nadwozia',
    items: [
      { label: 'SUV', href: '/search?query=s' },
      { label: 'Limuzyna', href: '/search?query=l' },
      { label: 'Kombi', href: '/search?query=k' },
      { label: 'Coupe', href: '/search?query=c' },
    ],
  },
  {
    heading: 'Rodzaje paliwa',
    items: [
      { label: 'Elektryczny', href: '/search?query=e' },
      { label: 'Benzyna', href: '/search?query=b' },
      { label: 'Diesel', href: '/search?query=d' },
      { label: 'Hybryda', href: '/search?query=h' },
    ],
  },
]

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

  return (
    <div
      className={styles.container({ className })}
      {...restProps}
    >
      {MOCK.map((section, sectionIndex) => (
        <StaggeredList.Root
          key={section.heading}
          delay={0.02 + sectionIndex * 0.04}
        >
          <h2 className={styles.heading()}>{section.heading}</h2>

          {section.items.map((item) => (
            <StaggeredList.Item
              key={item.label}
              className={styles.item()}
              hidden={{
                clipPath: 'ellipse(0% 0% at 100% 0%)',
                x: 16,
              }}
              visible={{
                clipPath: 'ellipse(135% 135% at 100% 0%)',
                x: 0,
              }}
              transition={{
                type: 'tween',
                duration: 1,
                ease: 'easeOut',
              }}
            >
              <Link href={item.href}>{item.label}</Link>
            </StaggeredList.Item>
          ))}
        </StaggeredList.Root>
      ))}
    </div>
  )
}
