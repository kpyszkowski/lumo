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
    </div>
  )
}
