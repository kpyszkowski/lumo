import { Histogram, Input, Slider } from '@lumo/ui/components'
import type { Icon } from '@lumo/ui/icons'

type RangeFilterPage = {
  type: 'range'
  icon: Icon
  label: string
  placeholder: string
  min: number
  max: number
  step: number
  unit: string
  histogramData: number[]
  disabled?: boolean
  active?: boolean
}

type RangeStyles = {
  rangeContent: () => string
  rangeInputRow: () => string
  rangeInputLabel: () => string
  rangeInputLabelText: () => string
}

type RangeFilterContentProps = {
  page: RangeFilterPage
  value: [number, number]
  onChange: (v: [number, number]) => void
  styles: RangeStyles
}

function RangeFilterContent(props: RangeFilterContentProps) {
  const { page, value, onChange, styles } = props

  return (
    <div className={styles.rangeContent()}>
      <Histogram
        data={page.histogramData}
        min={page.min}
        max={page.max}
        range={value}
        size="md"
        variant="inverted"
      />
      <Slider.Root
        min={page.min}
        max={page.max}
        step={page.step}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator className="opacity-75" />
            <Slider.Thumb
              index={0}
              aria-label="Wartość minimalna"
            />
            <Slider.Thumb
              index={1}
              aria-label="Wartość maksymalna"
            />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
      <div className={styles.rangeInputRow()}>
        <label className={styles.rangeInputLabel()}>
          <span className={styles.rangeInputLabelText()}>
            Od{page.unit ? ` (${page.unit})` : ''}
          </span>
          <Input
            type="number"
            variant="inverted"
            size="sm"
            min={page.min}
            max={value[1]}
            step={page.step}
            value={value[0]}
            onChange={(e) => onChange([Number(e.target.value), value[1]])}
          />
        </label>
        <label className={styles.rangeInputLabel()}>
          <span className={styles.rangeInputLabelText()}>
            Do{page.unit ? ` (${page.unit})` : ''}
          </span>
          <Input
            type="number"
            variant="inverted"
            size="sm"
            min={value[0]}
            max={page.max}
            step={page.step}
            value={value[1]}
            onChange={(e) => onChange([value[0], Number(e.target.value)])}
          />
        </label>
      </div>
    </div>
  )
}

export {
  RangeFilterContent,
  type RangeFilterContentProps,
  type RangeFilterPage,
}
