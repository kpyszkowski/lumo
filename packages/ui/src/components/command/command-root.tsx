'use client'
import { createStyles, type StylesProps } from '~/utils'
import { Command as CommandPrimitive } from 'cmdk-base'
import { createContext, useContext, type ComponentProps } from 'react'

const commandRootStyles = createStyles({
  slots: {
    container: 'flex w-2xl flex-col',
  },
  variants: {
    variant: {
      inverted: {
        container: 'bg-main-inv/94 text-main-inv rounded-3xl',
      },
    },
  },
  defaultVariants: {
    variant: 'inverted',
  },
})

type CommandRootProps = ComponentProps<typeof CommandPrimitive> &
  StylesProps<typeof commandRootStyles> & {
    className?: string
  }

const CommandRootContext = createContext<{
  variant: CommandRootProps['variant']
} | null>(null)

/**
 * Hook to access the ToggleGroup context
 * @returns The ToggleGroup context
 */
const useCommandRootContext = () => useContext(CommandRootContext)

function CommandRoot(props: CommandRootProps) {
  const { className, variant, ...restProps } = props

  const styles = commandRootStyles({ variant })

  return (
    <CommandRootContext.Provider value={{ variant }}>
      <CommandPrimitive
        className={styles.container({ className })}
        {...restProps}
      />
    </CommandRootContext.Provider>
  )
}

export {
  CommandRoot,
  type CommandRootProps,
  commandRootStyles,
  useCommandRootContext,
  CommandRootContext,
}
