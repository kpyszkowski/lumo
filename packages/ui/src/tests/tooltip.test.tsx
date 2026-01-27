import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Tooltip } from '~/components'

// Mock motion
vi.mock('motion/react', () => ({
  AnimatePresence: vi.fn(({ children }) => children),
  motion: {
    div: vi.fn(({ children, ...props }) => (
      <div
        data-testid="motion-div"
        data-props={JSON.stringify(props)}
      >
        {children}
      </div>
    )),
  },
}))

describe('Tooltip', () => {
  const defaultProps = {
    children: <button type="button">Hover me</button>,
    content: 'Tooltip content',
  }

  describe('Rendering tooltip', () => {
    it('renders trigger element', () => {
      render(<Tooltip {...defaultProps} />)

      const trigger = screen.getByRole('button', { name: /hover me/i })
      expect(trigger).toBeInTheDocument()
    })

    it('throws error when children is a Fragment', () => {
      // Suppress console error for this test
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      expect(() =>
        // biome-ignore lint/correctness/noChildrenProp: Required for testing
        // biome-ignore lint/complexity/noUselessFragments: Required for testing
        render(
          <Tooltip {...defaultProps}>
            <></>
          </Tooltip>,
        ),
      ).toThrow('Tooltip children cannot be a Fragment.')

      consoleError.mockRestore()
    })

    it('renders tooltip content when open', async () => {
      render(
        <Tooltip
          {...defaultProps}
          open={true}
        />,
      )

      await waitFor(() => {
        expect(screen.getByText('Tooltip content')).toBeInTheDocument()
      })
    })

    it('does not render tooltip content when closed by default', () => {
      render(<Tooltip {...defaultProps} />)

      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()
    })

    it('renders with default open state', () => {
      render(
        <Tooltip
          {...defaultProps}
          defaultOpen={true}
        />,
      )

      expect(screen.getByText('Tooltip content')).toBeInTheDocument()
    })
  })

  describe('Renders with different styling', () => {
    it('applies base content styles', () => {
      render(
        <Tooltip
          {...defaultProps}
          open={true}
        />,
      )

      const content = screen.getByText('Tooltip content')
      expect(content).toHaveClass(
        'max-w-xs',
        'bg-tertiary-inv',
        'text-primary-inv',
        'dark:bg-tertiary',
        'dark:text-primary',
      )
    })

    it('applies small size styles', () => {
      render(
        <Tooltip
          {...defaultProps}
          open={true}
          size="sm"
        />,
      )

      const content = screen.getByText('Tooltip content')
      expect(content).toHaveClass('rounded-md', 'px-3', 'py-1.5', 'text-sm')
    })
  })

  describe('Positioning and arrow', () => {
    it('renders arrow with correct classes for top position', () => {
      render(
        <Tooltip
          {...defaultProps}
          open={true}
          side="top"
        />,
      )

      const arrow = screen.getByLabelText('Tooltip arrow')
      expect(arrow).toHaveClass('top-full', 'rotate-180')
    })

    it('renders arrow with correct classes for left position', () => {
      render(
        <Tooltip
          {...defaultProps}
          open={true}
          side="left"
        />,
      )

      const arrow = screen.getByLabelText('Tooltip arrow')
      expect(arrow).toHaveClass('left-full', 'rotate-90')
    })

    it('renders arrow SVG with correct path', () => {
      render(
        <Tooltip
          {...defaultProps}
          open={true}
        />,
      )

      const arrow = screen.getByLabelText('Tooltip arrow')
      const path = arrow.querySelector('path')

      expect(path).toHaveAttribute('d', 'M0 8L8 8L4 4')
    })
  })

  describe('Styling', () => {
    it('applies base arrow styles', () => {
      render(
        <Tooltip
          {...defaultProps}
          open={true}
        />,
      )

      const arrow = screen.getByLabelText('Tooltip arrow')
      expect(arrow).toHaveClass(
        'fill-(--background-color-tertiary-inv)',
        'dark:fill-(--background-color-tertiary)',
      )
    })

    it('merges custom content className', () => {
      render(
        <Tooltip
          {...defaultProps}
          open={true}
          contentClassName="custom-content"
        />,
      )

      const content = screen.getByText('Tooltip content')
      expect(content).toHaveClass('custom-content')
      expect(content).toHaveClass('rounded-lg') // default size class
    })

    it('applies custom className to trigger', () => {
      render(
        <Tooltip
          {...defaultProps}
          className="trigger-class"
        />,
      )

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveClass('trigger-class')
    })
  })

  describe('Animation and transitions', () => {
    it('renders motion component with correct variants', () => {
      render(
        <Tooltip
          {...defaultProps}
          open={true}
        />,
      )

      const motionDiv = screen.getByTestId('motion-div')
      const props = JSON.parse(motionDiv.getAttribute('data-props') || '{}')

      expect(props.variants).toEqual({
        hidden: { opacity: 0, scale: 0.85 },
        visible: { opacity: 1, scale: 1 },
      })
    })

    it('applies spring transition', () => {
      render(
        <Tooltip
          {...defaultProps}
          open={true}
        />,
      )

      const motionDiv = screen.getByTestId('motion-div')
      const props = JSON.parse(motionDiv.getAttribute('data-props') || '{}')

      expect(props.transition).toEqual({
        type: 'spring',
        stiffness: 240,
        damping: 20,
      })
    })
  })

  describe('Controlled vs uncontrolled', () => {
    it('handles controlled open state', () => {
      const onOpenChange = vi.fn()
      render(
        <Tooltip
          {...defaultProps}
          open={true}
          onOpenChange={onOpenChange}
        />,
      )

      expect(screen.getByText('Tooltip content')).toBeInTheDocument()
    })

    it('handles uncontrolled open state with defaultOpen', () => {
      render(
        <Tooltip
          {...defaultProps}
          defaultOpen={true}
        />,
      )

      expect(screen.getByText('Tooltip content')).toBeInTheDocument()
    })
  })
})
