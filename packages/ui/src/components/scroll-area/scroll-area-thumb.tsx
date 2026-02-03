'use client'
import { createStyles, type StylesProps } from '~/utils'
import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area'

const scrollAreaThumbStyles = createStyles({
  slots: {
    container: 'size-1 rounded-lg',
  },
})

type ScrollAreaThumbProps = Omit<ScrollAreaPrimitive.Thumb.Props, 'render'> &
  StylesProps<typeof scrollAreaThumbStyles> & {
    className?: string
  }

function ScrollAreaThumb(props: ScrollAreaThumbProps) {
  const { className, ...restProps } = props

  const styles = scrollAreaThumbStyles()

  return (
    <ScrollAreaPrimitive.Thumb
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { ScrollAreaThumb, type ScrollAreaThumbProps, scrollAreaThumbStyles }
