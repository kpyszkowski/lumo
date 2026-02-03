import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area'

export const Root = ScrollAreaPrimitive.Root
export const Viewport = ScrollAreaPrimitive.Viewport
export const Content = ScrollAreaPrimitive.Content
export const Corner = ScrollAreaPrimitive.Corner
export const Scrollbar = ScrollAreaPrimitive.Scrollbar

export {
  ScrollAreaThumb as Thumb,
  type ScrollAreaThumbProps as ThumbProps,
} from '~/components/scroll-area/scroll-area-thumb'

export {
  type ScrollAreaRootProps as RootProps,
  type ScrollAreaViewportProps as ViewportProps,
  type ScrollAreaContentProps as ContentProps,
  type ScrollAreaCornerProps as CornerProps,
  type ScrollAreaScrollbarProps as ScrollbarProps,
} from '@base-ui/react/scroll-area'
