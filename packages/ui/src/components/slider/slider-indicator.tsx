'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import { useSliderRootContext } from '~/components/slider/slider-root'

const sliderIndicatorStyles = createStyles({
  slots: {
    container: 'bg-accent rounded-full',
  },
  variants: {
    variant: {
      default: {},
    },
    size: {
      md: {},
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

type SliderIndicatorProps = SliderPrimitive.Indicator.Props &
  StylesProps<typeof sliderIndicatorStyles> & {
    className?: string
  }

function SliderIndicator(props: SliderIndicatorProps) {
  const {
    className,
    variant: propsVariant,
    size: propsSize,
    ...restProps
  } = props

  const { variant: contextVariant, size: contextSize } =
    useSliderRootContext() ?? {}
  const styles = sliderIndicatorStyles({
    variant: propsVariant ?? contextVariant,
    size: propsSize ?? contextSize,
  })

  return (
    <SliderPrimitive.Indicator
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { SliderIndicator, type SliderIndicatorProps, sliderIndicatorStyles }
