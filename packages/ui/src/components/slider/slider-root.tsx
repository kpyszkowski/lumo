'use client'
import { createContext, useContext } from 'react'
import { createStyles, type StylesProps } from '~/utils'
import { Slider as SliderPrimitive } from '@base-ui/react/slider'

const sliderRootStyles = createStyles({
  slots: {
    container: 'flex w-full flex-col',
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

type SliderRootContextValue = StylesProps<typeof sliderRootStyles>

const SliderRootContext = createContext<SliderRootContextValue | null>(null)

const useSliderRootContext = () => useContext(SliderRootContext)

type SliderRootProps = SliderPrimitive.Root.Props &
  StylesProps<typeof sliderRootStyles> & {
    className?: string
    /** Visual style. */
    variant?: 'default'
    /** Size of the track and thumb. */
    size?: 'md'
  }

/**
 * Root of the `Slider` compound component. Provides `variant` and `size` context
 * to all child parts (`Control`, `Track`, `Indicator`, `Thumb`).
 *
 * @example
 * ```tsx
 * // Single value
 * <Slider.Root defaultValue={50} min={0} max={100}>
 *   <Slider.Control>
 *     <Slider.Track>
 *       <Slider.Indicator />
 *       <Slider.Thumb aria-label="Value" />
 *     </Slider.Track>
 *   </Slider.Control>
 * </Slider.Root>
 *
 * // Range
 * <Slider.Root defaultValue={[25, 75]}>
 *   <Slider.Control>
 *     <Slider.Track>
 *       <Slider.Indicator />
 *       <Slider.Thumb index={0} aria-label="Minimum" />
 *       <Slider.Thumb index={1} aria-label="Maximum" />
 *     </Slider.Track>
 *   </Slider.Control>
 * </Slider.Root>
 * ```
 */
function SliderRoot(props: SliderRootProps) {
  const { className, variant, size, ...restProps } = props

  const styles = sliderRootStyles({ variant, size })

  return (
    <SliderRootContext.Provider value={{ variant, size }}>
      <SliderPrimitive.Root
        className={styles.container({ className })}
        {...restProps}
      />
    </SliderRootContext.Provider>
  )
}

export {
  SliderRoot,
  type SliderRootProps,
  sliderRootStyles,
  useSliderRootContext,
  type SliderRootContextValue,
}
