'use client'
import { createStyles, type StylesProps } from '~/utils'
import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area'

const scrollAreaScrollbarStyles = createStyles({
  slots: {
    container: 'group p-1.5',
  },
})

type ScrollAreaScrollbarProps = ScrollAreaPrimitive.Scrollbar.Props &
  StylesProps<typeof scrollAreaScrollbarStyles> & {
    className?: string
  }

function ScrollAreaScrollbar(props: ScrollAreaScrollbarProps) {
  const { className, ...restProps } = props

  const styles = scrollAreaScrollbarStyles()

  return (
    <ScrollAreaPrimitive.Scrollbar
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export {
  ScrollAreaScrollbar,
  type ScrollAreaScrollbarProps,
  scrollAreaScrollbarStyles,
}
