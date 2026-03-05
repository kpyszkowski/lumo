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
  }

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
