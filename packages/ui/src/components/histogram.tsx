import { useId } from 'react'
import { createStyles, type StylesProps } from '~/utils'

const histogramStyles = createStyles({
  slots: {
    container: 'w-full overflow-visible',
  },
  variants: {
    variant: {
      default: {},
    },
    size: {
      sm: { container: 'h-12' },
      md: { container: 'h-16' },
      lg: { container: 'h-24' },
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
})

export type HistogramProps = {
  /** Array of numeric values forming the distribution curve. */
  data: number[]
  /** Domain minimum used for range mapping (default `0`). */
  min?: number
  /** Domain maximum used for range mapping (default `data.length - 1`). */
  max?: number
  /**
   * Active selection `[min, max]` within the domain.
   * The curve segment within this range is rendered in accent colour; the rest is muted.
   */
  range?: [number, number]
  className?: string
  /** Height of the SVG container. @default 'md' */
  size?: 'sm' | 'md' | 'lg'
} & StylesProps<typeof histogramStyles>

const TOP_PADDING = 8
const CHART_HEIGHT = 100 - TOP_PADDING

/**
 * A smoothed area chart that visualises a data distribution, with optional range highlighting.
 *
 * @example
 * ```tsx
 * const data = [3, 6, 14, 22, 51, 72, 65, 45, 20, 7]
 *
 * <Histogram data={data} min={0} max={100} />
 * <Histogram data={data} min={0} max={100} range={[20, 80]} size="lg" />
 * ```
 */
export function Histogram(props: HistogramProps) {
  const {
    data,
    min = 0,
    max = data.length - 1,
    range,
    size,
    variant,
    className,
  } = props
  const id = useId()
  const inactiveGradId = `${id}-grad-inactive`
  const activeGradId = `${id}-grad-active`
  const clipId = `${id}-clip`

  const maxVal = Math.max(...data)

  const points = data.map((val, i) => ({
    x: data.length > 1 ? (i / (data.length - 1)) * 100 : 50,
    y: TOP_PADDING + (1 - val / maxVal) * CHART_HEIGHT,
  }))

  const tension = 0.3
  const linePathD = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x},${p.y}`
      const prev = points[i - 1]!
      const prevPrev = points[i - 2] ?? prev
      const next = points[i + 1] ?? p
      const cp1x = prev.x + (p.x - prevPrev.x) * tension
      const cp1y = prev.y + (p.y - prevPrev.y) * tension
      const cp2x = p.x - (next.x - prev.x) * tension
      const cp2y = p.y - (next.y - prev.y) * tension
      return `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p.x},${p.y}`
    })
    .join(' ')

  const fillPathD = `${linePathD} L 100,100 L 0,100 Z`

  const domainRange = max - min
  const dataRange = data.length - 1

  const toPercent = (value: number) => {
    const domainT = (value - min) / domainRange
    const index = domainT * dataRange
    return (index / dataRange) * 100
  }

  const xMin = range ? toPercent(range[0]) : 0
  const xMax = range ? toPercent(range[1]) : 100
  const clipWidth = Math.max(0, xMax - xMin)

  const styles = histogramStyles({ variant, size })

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={styles.container({ className })}
    >
      <defs>
        <linearGradient
          id={inactiveGradId}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="var(--color-muted)"
            stopOpacity={0.2}
          />
          <stop
            offset="100%"
            stopColor="var(--color-muted)"
            stopOpacity={0}
          />
        </linearGradient>
        <linearGradient
          id={activeGradId}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="var(--color-accent)"
            stopOpacity={0.35}
          />
          <stop
            offset="100%"
            stopColor="var(--color-accent)"
            stopOpacity={0}
          />
        </linearGradient>
        <clipPath id={clipId}>
          <rect
            x={xMin}
            y={0}
            width={clipWidth}
            height={100}
          />
        </clipPath>
      </defs>

      {/* Inactive layer — full width, muted */}
      <path
        d={fillPathD}
        fill={`url(#${inactiveGradId})`}
      />
      <path
        d={linePathD}
        fill="none"
        stroke="var(--color-muted)"
        strokeWidth={1.5}
        strokeOpacity={0.4}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Active layer — clipped to range, accent */}
      <path
        d={fillPathD}
        fill={`url(#${activeGradId})`}
        clipPath={`url(#${clipId})`}
      />
      <path
        d={linePathD}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        clipPath={`url(#${clipId})`}
      />
    </svg>
  )
}
