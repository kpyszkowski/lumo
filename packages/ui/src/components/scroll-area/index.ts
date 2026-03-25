import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area'

export const Content = ScrollAreaPrimitive.Content
export const Corner = ScrollAreaPrimitive.Corner

export {
  ScrollAreaRoot as Root,
  type ScrollAreaRootProps as RootProps,
} from '~/components/scroll-area/scroll-area-root'

export {
  ScrollAreaViewport as Viewport,
  type ScrollAreaViewportProps as ViewportProps,
} from '~/components/scroll-area/scroll-area-viewport'

export {
  ScrollAreaScrollbar as Scrollbar,
  type ScrollAreaScrollbarProps as ScrollbarProps,
} from '~/components/scroll-area/scroll-area-scrollbar'

export {
  ScrollAreaThumb as Thumb,
  type ScrollAreaThumbProps as ThumbProps,
} from '~/components/scroll-area/scroll-area-thumb'

export {
  type ScrollAreaContentProps as ContentProps,
  type ScrollAreaCornerProps as CornerProps,
} from '@base-ui/react/scroll-area'
