import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Slider } from '~/components'

function renderSlider(props: React.ComponentProps<typeof Slider.Root> = {}) {
  return render(
    <Slider.Root
      defaultValue={50}
      {...props}
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
          <Slider.Thumb aria-label="Value" />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>,
  )
}

function renderRangeSlider(
  props: React.ComponentProps<typeof Slider.Root> = {},
) {
  return render(
    <Slider.Root
      defaultValue={[25, 75]}
      {...props}
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
          <Slider.Thumb
            index={0}
            aria-label="Minimum value"
          />
          <Slider.Thumb
            index={1}
            aria-label="Maximum value"
          />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>,
  )
}

describe('Slider', () => {
  describe('Single thumb', () => {
    it('renders a slider with one thumb', () => {
      renderSlider()

      const thumbs = screen.getAllByRole('slider')
      expect(thumbs).toHaveLength(1)
    })

    it('renders with correct default value', () => {
      renderSlider({ defaultValue: 40 })

      const thumb = screen.getByRole('slider')
      expect(thumb).toHaveAttribute('aria-valuenow', '40')
    })

    it('renders with correct step', () => {
      renderSlider({ step: 5, defaultValue: 50 })

      const thumb = screen.getByRole('slider')
      expect(thumb).toBeInTheDocument()
    })

    it('is disabled when disabled prop is passed', () => {
      renderSlider({ disabled: true })

      const thumb = screen.getByRole('slider')
      expect(thumb).toBeDisabled()
    })

    it('applies custom className to root', () => {
      render(
        <Slider.Root
          defaultValue={50}
          className="custom-root"
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb aria-label="Value" />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>,
      )

      const root = screen.getByRole('group')
      expect(root).toHaveClass('custom-root')
    })
  })

  describe('Range (dual thumb)', () => {
    it('renders two thumbs for range mode', () => {
      renderRangeSlider()

      const thumbs = screen.getAllByRole('slider')
      expect(thumbs).toHaveLength(2)
    })

    it('renders thumbs with correct default range values', () => {
      renderRangeSlider({ defaultValue: [20, 80] })

      const thumbs = screen.getAllByRole('slider')
      expect(thumbs[0]).toHaveAttribute('aria-valuenow', '20')
      expect(thumbs[1]).toHaveAttribute('aria-valuenow', '80')
    })

    it('applies aria-labels to thumbs', () => {
      renderRangeSlider()

      expect(
        screen.getByRole('slider', { name: 'Minimum value' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('slider', { name: 'Maximum value' }),
      ).toBeInTheDocument()
    })

    it('is disabled when disabled prop is passed', () => {
      renderRangeSlider({ disabled: true })

      const thumbs = screen.getAllByRole('slider')
      thumbs.forEach((thumb) => expect(thumb).toBeDisabled())
    })
  })

  describe('Styling', () => {
    it('applies custom className to control', () => {
      render(
        <Slider.Root defaultValue={50}>
          <Slider.Control className="custom-control">
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb aria-label="Value" />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>,
      )

      const control = screen.getByRole('group').firstChild
      expect(control).toHaveClass('custom-control')
    })

    it('applies custom className to track', () => {
      render(
        <Slider.Root defaultValue={50}>
          <Slider.Control>
            <Slider.Track
              className="custom-track"
              data-testid="slider-track"
            >
              <Slider.Indicator />
              <Slider.Thumb aria-label="Value" />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>,
      )

      expect(screen.getByTestId('slider-track')).toHaveClass('custom-track')
    })
  })
})
