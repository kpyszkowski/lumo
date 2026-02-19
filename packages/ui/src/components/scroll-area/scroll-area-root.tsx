'use client'
import { createStyles, type StylesProps } from '~/utils'
import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area'

const scrollAreaRootStyles = createStyles({
  slots: {
    container: 'grow overflow-hidden',
  },
})

type ScrollAreaRootProps = ScrollAreaPrimitive.Root.Props &
  StylesProps<typeof scrollAreaRootStyles> & {
    className?: string
  }

function ScrollAreaRoot(props: ScrollAreaRootProps) {
  const { className, ...restProps } = props

  const styles = scrollAreaRootStyles()

  return (
    <ScrollAreaPrimitive.Root
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { ScrollAreaRoot, type ScrollAreaRootProps, scrollAreaRootStyles }
