'use client'
import { createStyles, type StylesProps } from '~/utils'
import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area'

const scrollAreaViewportStyles = createStyles({
  slots: {
    container: 'h-full',
  },
})

type ScrollAreaViewportProps = ScrollAreaPrimitive.Viewport.Props &
  StylesProps<typeof scrollAreaViewportStyles> & {
    className?: string
  }

function ScrollAreaViewport(props: ScrollAreaViewportProps) {
  const { className, ...restProps } = props

  const styles = scrollAreaViewportStyles()

  return (
    <ScrollAreaPrimitive.Viewport
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export {
  ScrollAreaViewport,
  type ScrollAreaViewportProps,
  scrollAreaViewportStyles,
}
