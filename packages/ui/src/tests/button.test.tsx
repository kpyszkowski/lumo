import { fireEvent, render, screen } from '@testing-library/react'
import { IconArrowRight } from '@tabler/icons-react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '~/components'

vi.mock('@tabler/icons-react', () => ({
  IconArrowRight: vi.fn(({ className }) => (
    <svg
      data-testid="mock-icon"
      className={className}
    >
      <title>Arrow Right</title>
      <path d="mock-path" />
    </svg>
  )),
}))

describe('Button', () => {
  const defaultProps = {
    children: 'Click me',
  }

  describe('Rendering as default button', () => {
    it('renders as a button by default', () => {
      render(<Button {...defaultProps} />)

      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('type', 'button')
    })

    it('renders as a submit button when type="submit"', () => {
      render(
        <Button
          {...defaultProps}
          type="submit"
        />,
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('handles click events', () => {
      const handleClick = vi.fn()
      render(
        <Button
          {...defaultProps}
          onClick={handleClick}
        />,
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('forwards ref to button element', () => {
      const ref = vi.fn()
      render(
        <Button
          {...defaultProps}
          ref={ref}
        />,
      )

      const button = screen.getByRole('button')
      expect(ref).toHaveBeenCalledWith(button)
    })

    it('passes through additional props to button', () => {
      render(
        <Button
          {...defaultProps}
          data-testid="custom-button"
          disabled
        />,
      )

      const button = screen.getByTestId('custom-button')
      expect(button).toBeDisabled()
    })
  })

  describe('Rendering with icon', () => {
    it('renders with an icon on the left by default', () => {
      render(
        <Button
          {...defaultProps}
          icon={IconArrowRight}
        />,
      )

      const icon = screen.getByTestId('mock-icon')
      const wrapper = icon.closest('div')

      expect(icon).toBeInTheDocument()
      expect(wrapper).toHaveClass('flex-row-reverse')
    })

    it('renders with icon on the right when iconPosition="right"', () => {
      render(
        <Button
          {...defaultProps}
          icon={IconArrowRight}
          iconPosition="right"
        />,
      )

      const wrapper = screen.getByTestId('mock-icon').closest('div')
      expect(wrapper).toHaveClass('flex-row')
    })
  })

  describe('Rendering with different styling', () => {
    it('applies correct variant styles', () => {
      const { rerender } = render(
        <Button
          {...defaultProps}
          variant="solid"
        />,
      )

      let container = screen.getByRole('button')
      expect(container).toHaveClass('bg-accent-primary')

      rerender(
        <Button
          {...defaultProps}
          variant="outline"
        />,
      )
      container = screen.getByRole('button')
      expect(container).toHaveClass('border-2', 'border-accent-primary')
    })

    it('applies correct size styles', () => {
      const { rerender } = render(
        <Button
          {...defaultProps}
          size="sm"
        />,
      )

      let container = screen.getByRole('button')
      expect(container).toHaveClass('rounded-lg', 'px-3', 'py-1')

      rerender(
        <Button
          {...defaultProps}
          size="lg"
        />,
      )
      container = screen.getByRole('button')
      expect(container).toHaveClass('rounded-2xl', 'px-5', 'py-4')
    })

    it('applies custom className', () => {
      render(
        <Button
          {...defaultProps}
          className="custom-class"
        />,
      )

      const container = screen.getByRole('button')
      expect(container).toHaveClass('custom-class')
    })
  })
})
