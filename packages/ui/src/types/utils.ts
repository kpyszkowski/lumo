import type { DOMAttributes } from 'react'

export type EventHandlerProps<T extends Element> = Pick<
  DOMAttributes<T>,
  Extract<keyof DOMAttributes<T>, `on${string}`>
>
