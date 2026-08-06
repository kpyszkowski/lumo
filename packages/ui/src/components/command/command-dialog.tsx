'use client'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import {
  CommandRoot,
  type CommandRootProps,
  commandRootStyles,
} from '~/components/command/command-root'
import { createStyles } from '~/utils'

const commandDialogStyles = createStyles({
  slots: {
    popup:
      'pointer-events-none fixed bottom-10 left-1/2 top-10 flex w-fit lg:bottom-20 lg:top-20',
    container: 'w-2xl pointer-events-auto z-50',
    backdrop: 'fixed inset-0',
  },
  variants: {
    variant: {
      inverted: {
        backdrop: 'bg-main/12 dark:bg-main/36',
      },
    },
  },
  defaultVariants: commandRootStyles.defaultVariants,
})

const MotionDialogPopup = motion.create(DialogPrimitive.Popup)
const MotionDialogBackdrop = motion.create(DialogPrimitive.Backdrop)

type CommandDialogProps = CommandRootProps &
  Pick<DialogPrimitive.Root.Props, 'defaultOpen' | 'open' | 'onOpenChange'>

function CommandDialog(props: CommandDialogProps) {
  const {
    className,
    variant,
    open,
    onOpenChange,
    defaultOpen = false,
    ...restProps
  } = props

  const [_open, _onOpenChange] = useState(defaultOpen)

  const styles = commandDialogStyles({ variant })

  return (
    <DialogPrimitive.Root
      open={open ?? _open}
      onOpenChange={onOpenChange ?? _onOpenChange}
      defaultOpen={defaultOpen}
    >
      <DialogPrimitive.Portal>
        <AnimatePresence>
          {(open ?? _open) && (
            <MotionDialogBackdrop
              className={styles.backdrop()}
              initial={{ backdropFilter: 'blur(0px)', opacity: 0 }}
              animate={{ backdropFilter: 'blur(8px)', opacity: 1 }}
              exit={{ backdropFilter: 'blur(0px)', opacity: 0 }}
              transition={{
                type: 'tween',
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          )}
        </AnimatePresence>

        <DialogPrimitive.Viewport>
          <AnimatePresence>
            {(open ?? _open) && (
              <MotionDialogPopup
                className={styles.popup({ className })}
                initial={{
                  opacity: 0,
                  scale: 0.96,
                  x: '-50%',
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: '-50%',
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  x: '-50%',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 16,
                  mass: 0.8,
                }}
              >
                <CommandRoot
                  className={styles.container({ variant })}
                  {...restProps}
                />
              </MotionDialogPopup>
            )}
          </AnimatePresence>
        </DialogPrimitive.Viewport>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { CommandDialog, type CommandDialogProps }
