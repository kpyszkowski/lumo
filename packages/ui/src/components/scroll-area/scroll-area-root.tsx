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

/**
 * Root container for the `ScrollArea` compound component.
 * Clips overflow and establishes the scroll context.
 *
 * @example
 * ```tsx
 * <ScrollArea.Root>
 *   <ScrollArea.Viewport>
 *     <ScrollArea.Content>{/* long content *\/}</ScrollArea.Content>
 *   </ScrollArea.Viewport>
 *   <ScrollArea.Scrollbar orientation="vertical">
 *     <ScrollArea.Thumb />
 *   </ScrollArea.Scrollbar>
 * </ScrollArea.Root>
 * ```
 */
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
