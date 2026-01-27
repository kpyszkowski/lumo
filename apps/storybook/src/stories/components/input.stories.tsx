import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite'
import { Input, type InputProps, inputStyles } from '@lumo/ui/components'
import { Eye, EyeClosed } from '@lumo/ui/icons'
import { createStyles } from '@lumo/ui/utils'
import { useState } from 'react'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
  },
}

export default meta

type Story = StoryObj<typeof Input> | StoryFn<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Type something...',
  },
}

const createButtonStyles = createStyles({
  extend: inputStyles,
  slots: {
    container: 'focus-visible:bg-secondary rounded-l-none border-l-0',
    icon: 'text-primary',
  },
  variants: {
    size: {
      sm: {
        icon: 'h-4 w-4',
      },
      md: {
        icon: 'h-5 w-5',
      },
      lg: {
        icon: 'h-6 w-6',
      },
    },
  },
})

export const Composed = (props: InputProps) => {
  const { size, ...restProps } = props

  const buttonStyles = createButtonStyles({ size })

  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () =>
    setIsVisible((prevState: boolean) => !prevState)

  const EyeIcon = isVisible ? EyeClosed : Eye

  return (
    <div className="ring-tertiary-inv flex w-full max-w-xs rounded-lg ring-offset-2 focus-within:ring-2">
      <Input
        className="flex-1 rounded-r-none border-r-0 pr-0"
        placeholder="Type your password..."
        size={size}
        type={isVisible ? 'text' : 'password'}
        {...restProps}
      />
      <button
        className={buttonStyles.container()}
        onClick={toggleVisibility}
        type="button"
      >
        <EyeIcon className={buttonStyles.icon()} />
      </button>
    </div>
  )
}
