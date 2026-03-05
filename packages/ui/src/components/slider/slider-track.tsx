'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import { useSliderRootContext } from '~/components/slider/slider-root'

const sliderTrackStyles = createStyles({
  slots: {
    container: 'bg-highlighted relative w-full rounded-full',
  },
  variants: {
    variant: {
      default: {},
    },
    size: {
      md: {
        container: 'h-1.5',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

type SliderTrackProps = SliderPrimitive.Track.Props &
  StylesProps<typeof sliderTrackStyles> & {
    className?: string
  }

function SliderTrack(props: SliderTrackProps) {
  const {
    className,
    variant: propsVariant,
    size: propsSize,
    ...restProps
  } = props

  const { variant: contextVariant, size: contextSize } =
    useSliderRootContext() ?? {}
  const styles = sliderTrackStyles({
    variant: propsVariant ?? contextVariant,
    size: propsSize ?? contextSize,
  })

  return (
    <SliderPrimitive.Track
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { SliderTrack, type SliderTrackProps, sliderTrackStyles }
