'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import { useSliderRootContext } from '~/components/slider/slider-root'

const sliderThumbStyles = createStyles({
  slots: {
    container:
      'bg-main border-subtle-inv hover:border-muted-inv has-focus-visible:border-accent has-focus-visible:ring-accent/30 has-focus-visible:ring-2 data-disabled:cursor-not-allowed cursor-grab rounded-full border-2 active:cursor-grabbing',
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
  }

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
