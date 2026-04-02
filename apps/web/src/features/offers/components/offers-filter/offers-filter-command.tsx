'use client'
import { Button, Command, IconButton, ScrollArea } from '@lumo/ui/components'
import {
  type Icon,
  IconCalendarDot,
  IconCarBodyLimousine,
  IconCoin,
  IconGasStation,
  IconGenerations,
  IconMakes,
  IconManualGearbox,
  IconModels,
  IconRoad,
  IconSearch,
} from '@lumo/ui/icons'
import { createStyles, type StylesProps } from '@lumo/ui/utils'
import {
  type KeyboardEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'
import {
  type OffersFilterValues,
  useOffersFilterContext,
} from '~/features/offers/components/offers-filter'
import * as FormRangeSelect from '~/components/form/form-range-select'

export const adFilterCommandStyles = createStyles({
  slots: {
    commandDialog: 'lg:-ml-14',
    submitButton: 'absolute top-0 right-0 -mr-14',
    triggerButton:
      'text-muted current:[&>div]:text-muted bg-elevated hover:bg-highlighted focus-visible:bg-highlighted mx-auto w-full max-w-lg [&>div]:justify-end',
    commandWrapper: 'flex overflow-hidden',
    commandPageButtons: 'mb-6 flex w-64 flex-col gap-1 px-4',
    commandPageButton:
      'data-[selected=true]:bg-elevated-inv data-[active=true]:[&_svg]:text-accent',
    commandItem: 'data-[selected=true]:bg-elevated-inv transition-none',
    commandList: 'w-full px-4',
    commandScrollAreaViewport: 'pb-6',
    commandScrollAreaScrollbar: 'pb-6',
    rangeContent: 'mx-auto min-w-96',
  },
})

const ICONS: Record<keyof OffersFilterValues, Icon> = {
  make: IconMakes,
  model: IconModels,
  generation: IconGenerations,
  bodyType: IconCarBodyLimousine,
  fuelType: IconGasStation,
  transmission: IconManualGearbox,
  price: IconCoin,
  mileage: IconRoad,
  year: IconCalendarDot,
}

type OffersFilterCommandProps = StylesProps<typeof adFilterCommandStyles> & {
  className?: string
}

function OffersFilterCommand(props: OffersFilterCommandProps) {
  const { className, ...restProps } = props

  const styles = adFilterCommandStyles()

  const form = useFormContext<OffersFilterValues>()
  const offersFilter = useOffersFilterContext()

  const inputRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const [currentFilterKey, setCurrentFilterKey] = useState(
    offersFilter.keys.at(0),
  )
  const [searchValue, setSearchValue] = useState('')

  const t = useTranslations('OffersFilter')

  const handleCurrentFilterRemove = useCallback(
    (filterKey: string) => {
      form.setValue(filterKey as keyof OffersFilterValues, undefined)

      const isHierarchicalFilter = ['make', 'model', 'generation'].includes(
        filterKey,
      )

      if (isHierarchicalFilter) {
        setCurrentFilterKey(filterKey as keyof OffersFilterValues)
      }
    },
    [form],
  )

  const handleOptionSelect = useCallback(
    (option: { id: string; label: string }) => {
      if (!currentFilterKey) return

      form.setValue(currentFilterKey as keyof OffersFilterValues, option.id)

      const nextFilterKeyIndex = offersFilter.keys.indexOf(currentFilterKey) + 1
      if (nextFilterKeyIndex >= offersFilter.keys.length) return

      setCurrentFilterKey(offersFilter.keys[nextFilterKeyIndex])
      setSearchValue('')
    },
    [currentFilterKey, form, offersFilter.keys],
  )

  const activeFilters = useMemo(() => {
    return Object.entries(offersFilter.activeFilters)
      .map(([key, value]) => ({
        key,
        label: value?.label || '',
        onRemove: () => handleCurrentFilterRemove(key),
      }))
      .filter(({ label }) => !!label)
  }, [handleCurrentFilterRemove, offersFilter.activeFilters])

  const handleDialogKeyDown = useCallback<KeyboardEventHandler>(
    (event) => {
      if ((event.target as HTMLElement).tagName !== 'INPUT') {
        inputRef.current?.focus()
      }
      if (
        event.key === 'Backspace' &&
        searchValue === '' &&
        activeFilters.length > 0
      ) {
        activeFilters[activeFilters.length - 1]!.onRemove()
      }
      if (event.key === 'Tab') {
        event.preventDefault()
        const enabledFilterKeys = offersFilter.keys.filter(
          (filterKey) =>
            offersFilter.state[filterKey as 'model' | 'generation']
              ?.disabled !== true,
        )
        const currentIndex = enabledFilterKeys.indexOf(currentFilterKey!)
        const nextIndex = event.shiftKey
          ? (currentIndex - 1 + enabledFilterKeys.length) %
            enabledFilterKeys.length
          : (currentIndex + 1) % enabledFilterKeys.length
        setCurrentFilterKey(enabledFilterKeys[nextIndex])
      }
    },
    [
      activeFilters,
      currentFilterKey,
      offersFilter.keys,
      offersFilter.state,
      searchValue,
    ],
  )

  const currentView = useMemo(() => {
    if (!currentFilterKey) return null

    const data = offersFilter.data[currentFilterKey]
    if (!data) return null

    if (data.type === 'select') {
      return (
        <ScrollArea.Root>
          <ScrollArea.Viewport className={styles.commandScrollAreaViewport()}>
            <Command.List className={styles.commandList()}>
              <Command.Group heading={t(`labels.alphabetical`)}>
                {data.options.map((option) => (
                  <Button
                    className={styles.commandPageButton()}
                    key={option.id}
                    variant="ghost"
                    inverted
                    contentAlignment="start"
                    shape="rounded"
                    render={
                      <Command.Item
                        className={styles.commandItem()}
                        value={option.id}
                        onSelect={() => handleOptionSelect(option)}
                      />
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </Command.Group>
            </Command.List>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar className={styles.commandScrollAreaScrollbar()}>
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      )
    }

    // Keyboard navigation is interrupted by onKeyDown handler.
    // TODO: Find a way to make it work.
    return (
      <FormRangeSelect.Root
        key={currentFilterKey}
        name={currentFilterKey}
        control={form.control}
        min={data.min}
        max={data.max}
        step={data.step}
        standalone
      >
        <FormRangeSelect.Content
          className={styles.rangeContent()}
          histogramData={data.distribution}
          unit={data.unit}
          variant="inverted"
        />
      </FormRangeSelect.Root>
    )
  }, [
    currentFilterKey,
    form.control,
    handleOptionSelect,
    offersFilter.data,
    styles,
    t,
  ])

  return (
    <>
      <Button
        variant="solid"
        onClick={() => setOpen(true)}
        icon={IconSearch}
        className={styles.triggerButton({ className })}
      >
        {t('placeholders.default')}
      </Button>

      <Command.Dialog
        className={styles.commandDialog()}
        open={open}
        onOpenChange={setOpen}
        loop
        onKeyDown={handleDialogKeyDown}
        {...restProps}
      >
        <IconButton
          variant="accent"
          className={styles.submitButton()}
          icon={IconSearch}
          label={t('labels.submit')}
          onClick={() => form.handleSubmit(() => setOpen(false))()}
        />
        <Command.Input
          placeholder={t(
            `placeholders.${currentFilterKey ? currentFilterKey : 'default'}`,
          )}
          value={searchValue}
          onValueChange={setSearchValue}
          ref={inputRef}
          chips={activeFilters.map(({ label, onRemove }) => ({
            label,
            onRemove,
          }))}
        />
        <div className={styles.commandWrapper()}>
          <div className={styles.commandPageButtons()}>
            {offersFilter.keys.map((filterKey) => (
              <Button
                className={styles.commandPageButton()}
                data-selected={currentFilterKey === filterKey}
                data-active={!!form.getValues(filterKey)}
                icon={ICONS[filterKey]}
                variant="ghost"
                inverted
                shape="rounded"
                contentAlignment="start"
                key={filterKey}
                disabled={
                  (filterKey === 'model' &&
                    offersFilter.state.model.disabled) ||
                  (filterKey === 'generation' &&
                    offersFilter.state.generation.disabled)
                }
                onClick={() => setCurrentFilterKey(filterKey)}
              >
                {t(`labels.${filterKey}`)}
              </Button>
            ))}
          </div>

          {currentView}
        </div>
      </Command.Dialog>
    </>
  )
}

export { OffersFilterCommand, type OffersFilterCommandProps }
