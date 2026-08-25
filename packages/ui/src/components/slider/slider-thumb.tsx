'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import { useSliderRootContext } from '~/components/slider/slider-root'

const sliderThumbStyles = createStyles({
  slots: {
    container:
      'bg-main border-subtle-inv hover:border-muted-inv has-focus-visible:border-accent has-focus-visible:ring-accent/30 cursor-grab rounded-full border-2 active:cursor-grabbing has-focus-visible:ring-2 data-disabled:cursor-not-allowed',
  },
  variants: {
    variant: {
      default: {},
    },
    size: {
      md: {
        container: 'size-5',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

type SliderThumbProps = SliderPrimitive.Thumb.Props &
  StylesProps<typeof sliderThumbStyles> & {
    className?: string
    /**
     * Zero-based thumb index.
     * Required when the slider has multiple thumbs (range slider).
     */
    index?: number
  }

/**
 * Draggable thumb handle for the slider.
 * Inherits `variant` and `size` from `Slider.Root` context.
 *
 * @example
 * ```tsx
 * // Single thumb
 * <Slider.Thumb aria-label="Value" />
 *
 * // Range thumbs
 * <Slider.Thumb index={0} aria-label="Minimum" />
 * <Slider.Thumb index={1} aria-label="Maximum" />
 * ```
 */
function SliderThumb(props: SliderThumbProps) {
  const {
    className,
    variant: propsVariant,
    size: propsSize,
    ...restProps
  } = props

  const { variant: contextVariant, size: contextSize } =
    useSliderRootContext() ?? {}
  const styles = sliderThumbStyles({
    variant: propsVariant ?? contextVariant,
    size: propsSize ?? contextSize,
  })

  return (
    <SliderPrimitive.Thumb
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { SliderThumb, type SliderThumbProps, sliderThumbStyles }
