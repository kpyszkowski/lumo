import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Input } from '~/components'

describe('Input', () => {
  const defaultProps = {
    placeholder: 'Enter text',
  }

  describe('Rendering as default input', () => {
    it('renders an input element', () => {
      render(<Input {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toBeInTheDocument()
      expect(input.tagName).toBe('INPUT')
    })

    it('supports different input types', () => {
      const { rerender } = render(
        <Input
          {...defaultProps}
          type="password"
        />,
      )

      let input = screen.getByPlaceholderText('Enter text')
      expect(input).toHaveAttribute('type', 'password')

      rerender(
        <Input
          {...defaultProps}
          type="number"
        />,
      )
      input = screen.getByPlaceholderText('Enter text')
      expect(input).toHaveAttribute('type', 'number')

      rerender(
        <Input
          {...defaultProps}
          type="search"
        />,
      )
      input = screen.getByPlaceholderText('Enter text')
      expect(input).toHaveAttribute('type', 'search')
    })

    it('forwards ref to input element', () => {
      const ref = vi.fn()
      render(
        <Input
          {...defaultProps}
          ref={ref}
        />,
      )

      const input = screen.getByPlaceholderText('Enter text')
      expect(ref).toHaveBeenCalledWith(input)
    })

    it('passes through additional props to input', () => {
      render(
        <Input
          {...defaultProps}
          type="email"
          disabled
          data-testid="custom-input"
        />,
      )

      const input = screen.getByTestId('custom-input')
      expect(input).toHaveAttribute('type', 'email')
      expect(input).toBeDisabled()
    })
  })

  describe('Rendering with diffrent styling', () => {
    it('applies base container styles', () => {
      render(<Input {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toHaveClass(
        'rounded-lg',
        'border',
        'border-secondary-inv',
        'bg-tertiary',
        'outline-none',
        'transition-all',
      )
    })

    it('applies default size variant', () => {
      render(<Input {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toHaveClass('px-5', 'py-4', 'text-sm')
    })

    it('applies selected size variants', () => {
      render(
        <Input
          {...defaultProps}
          size="sm"
        />,
      )

      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toHaveClass('px-4', 'py-3', 'text-xs')
    })

    it('handles function className prop with state', () => {
      const classNameFn = vi.fn((state: { focused: boolean }) =>
        state.focused ? 'focused-class' : 'not-focused-class',
      )

      render(
        <Input
          {...defaultProps}
          className={classNameFn}
        />,
      )

      expect(classNameFn).toHaveBeenCalledWith(
        expect.objectContaining({
          focused: expect.any(Boolean),
          disabled: expect.any(Boolean),
        }),
      )
    })

    it('applies focus styles', () => {
      render(<Input {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toHaveClass('focus-visible:ring-a11y')
    })

    it('applies placeholder styles', () => {
      render(<Input {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toHaveClass('placeholder:text-tertiary')
    })
  })

  describe('Events handling', () => {
    it('handles change events', () => {
      const handleChange = vi.fn()
      render(
        <Input
          {...defaultProps}
          onChange={handleChange}
        />,
      )

      const input = screen.getByPlaceholderText('Enter text')
      fireEvent.change(input, { target: { value: 'test value' } })

      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('handles focus events', () => {
      const handleFocus = vi.fn()
      render(
        <Input
          {...defaultProps}
          onFocus={handleFocus}
        />,
      )

      const input = screen.getByPlaceholderText('Enter text')
      fireEvent.focus(input)

      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('handles blur events', () => {
      const handleBlur = vi.fn()
      render(
        <Input
          {...defaultProps}
          onBlur={handleBlur}
        />,
      )

      const input = screen.getByPlaceholderText('Enter text')
      fireEvent.blur(input)

      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('handles key events', () => {
      const handleKeyDown = vi.fn()
      render(
        <Input
          {...defaultProps}
          onKeyDown={handleKeyDown}
        />,
      )

      const input = screen.getByPlaceholderText('Enter text')
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(handleKeyDown).toHaveBeenCalledTimes(1)
    })
  })
})
