'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import { useSliderRootContext } from '~/components/slider/slider-root'

const sliderControlStyles = createStyles({
  slots: {
    container:
      'has-disabled:pointer-events-none has-disabled:opacity-50 flex w-full touch-none select-none items-center',
  },
  variants: {
    variant: {
      default: {},
    },
    size: {
      md: {
        container: 'py-3',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

type SliderControlProps = SliderPrimitive.Control.Props &
  StylesProps<typeof sliderControlStyles> & {
    className?: string
  }

function SliderControl(props: SliderControlProps) {
  const {
    className,
    variant: propsVariant,
    size: propsSize,
    ...restProps
  } = props

  const { variant: contextVariant, size: contextSize } =
    useSliderRootContext() ?? {}
  const styles = sliderControlStyles({
    variant: propsVariant ?? contextVariant,
    size: propsSize ?? contextSize,
  })

  return (
    <SliderPrimitive.Control
      className={styles.container({ className })}
      {...restProps}
    />
  )
}

export { SliderControl, type SliderControlProps, sliderControlStyles }
