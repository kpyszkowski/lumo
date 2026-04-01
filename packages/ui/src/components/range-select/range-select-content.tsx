'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Histogram, Input, Slider } from '~/components'
import { Popover } from '~/components'
import type { PopoverContentProps } from '~/components/popover/popover-content'
import { useRangeSelectRootContext } from '~/components/range-select/range-select-root'

const rangeSelectContentStyles = createStyles({
  slots: {
    container: 'min-w-72',
    wrapper: 'flex flex-col gap-4 p-4',
    inputRow: 'flex gap-3',
    inputLabel: 'flex flex-1 flex-col gap-2',
    inputLabelText: 'text-main-inv dark:text-main text-xs font-medium',
  },
})

type RangeSelectContentProps = StylesProps<typeof rangeSelectContentStyles> &
  Omit<PopoverContentProps, 'keepMounted' | 'children'> & {
    className?: string
    /** Array of numeric values forming the distribution histogram. */
    histogramData?: number[]
    /** Unit suffix appended to the From/To input labels (e.g. `'zł'`, `'km'`). */
    unit?: string
    /** Label for the minimum-value input. @default 'From' */
    fromLabel?: string
    /** Label for the maximum-value input. @default 'To' */
    toLabel?: string
    /** Accessible label for the min slider thumb. @default 'Minimum value' */
    sliderMinLabel?: string
    /** Accessible label for the max slider thumb. @default 'Maximum value' */
    sliderMaxLabel?: string
    /** Variant prop being aggregated over Input and Histogram components. Useful in standalone mode when not rendered within a Popover. */
    variant?: 'default' | 'inverted'
  }

/**
 * Popup content for `RangeSelect`. Renders a histogram, dual-thumb slider, and
 * two numeric inputs for precise min/max entry. Reads range state from `RangeSelectRoot` context.
 *
 * @example
 * ```tsx
 * <RangeSelect.Content
 *   histogramData={[3, 8, 22, 45, 71, 65, 42, 18, 7, 2]}
 *   unit="zł"
 *   fromLabel="Od"
 *   toLabel="Do"
 * />
 *
 * <RangeSelect.Content histogramData={data} side="bottom" align="start" />
 * ```
 */
function RangeSelectContent(props: RangeSelectContentProps) {
  const {
    className,
    histogramData = [],
    unit,
    fromLabel = 'From',
    toLabel = 'To',
    sliderMinLabel = 'Minimum value',
    sliderMaxLabel = 'Maximum value',
    variant = 'inverted',
    ...restProps
  } = props

  const { value, onValueChange, min, max, step, standalone } =
    useRangeSelectRootContext()

  const styles = rangeSelectContentStyles()

  const unitLabel = unit ? ` (${unit})` : ''

  const Container = standalone ? 'div' : Popover.Content

  return (
    <Container
      className={styles.container({ className })}
      {...restProps}
    >
      <div className={styles.wrapper()}>
        {histogramData.length > 0 && (
          <Histogram
            data={histogramData}
            min={min}
            max={max}
            range={value}
            size="md"
            variant={variant}
          />
        )}
        <Slider.Root
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={(v) => onValueChange(v as [number, number])}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator className="opacity-75" />
              <Slider.Thumb
                index={0}
                aria-label={sliderMinLabel}
              />
              <Slider.Thumb
                index={1}
                aria-label={sliderMaxLabel}
              />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
        <div className={styles.inputRow()}>
          <label className={styles.inputLabel()}>
            <span className={styles.inputLabelText()}>
              {fromLabel}
              {unitLabel}
            </span>
            <Input
              type="number"
              variant={variant}
              size="sm"
              min={min}
              max={value[1]}
              step={step}
              value={value[0]}
              onChange={(e) =>
                onValueChange([Number(e.target.value), value[1]])
              }
            />
          </label>
          <label className={styles.inputLabel()}>
            <span className={styles.inputLabelText()}>
              {toLabel}
              {unitLabel}
            </span>
            <Input
              type="number"
              variant={variant}
              size="sm"
              min={value[0]}
              max={max}
              step={step}
              value={value[1]}
              onChange={(e) =>
                onValueChange([value[0], Number(e.target.value)])
              }
            />
          </label>
        </div>
      </div>
    </Container>
  )
}

export {
  RangeSelectContent,
  type RangeSelectContentProps,
  rangeSelectContentStyles,
}
