'use client'
import { IconGauge } from '@lumo/ui/icons'
import { Button, type ButtonProps } from '@lumo/ui/components'

type HelloButtonProps = Omit<ButtonProps, 'children' | 'icon'>

function HelloButton(props: HelloButtonProps) {
  const { onClick, ...restProps } = props

  const handleAlert: typeof onClick = (event) => {
    alert('Hello!')
    if (onClick) {
      onClick(event)
    }
  }

  return (
    <Button
      icon={IconGauge}
      onClick={handleAlert}
      {...restProps}
    >
      Say hello!
    </Button>
  )
}

export default HelloButton
