'use client'
import {
  Button,
  Command,
  IconButton,
  RangeSelect,
  ScrollArea,
} from '@lumo/ui/components'
import {
  type Icon,
  IconCalendarDot,
  IconCarBodyLimousine,
  IconCheck,
  IconCoin,
  IconGasStation,
  IconGauge,
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
import {
  FILTER_KEYS,
  RANGE_KEYS,
  useOffersFilterContext,
  type OffersFilterFieldKey,
  type OffersFilterRangeKey,
  type OffersFilterSelectOption,
} from '~/features/offers/components/offers-filter'
import { OffersFilterCommandTrigger } from '~/features/offers/components/offers-filter/offers-filter-command-trigger'

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

const GENDER: Partial<Record<OffersFilterFieldKey, 'masculine'>> = {
  year: 'masculine',
  mileage: 'masculine',
  power: 'masculine',
  engineCapacity: 'masculine',
}

const ICONS: Record<OffersFilterFieldKey, Icon> = {
  make: IconMakes,
  model: IconModels,
  generation: IconGenerations,
  bodyType: IconCarBodyLimousine,
  fuelType: IconGasStation,
  transmission: IconManualGearbox,
  condition: IconGauge,
  price: IconCoin,
  mileage: IconRoad,
  year: IconCalendarDot,
  power: IconRoad,
  engineCapacity: IconRoad,
}

const isRangeKey = (key: OffersFilterFieldKey): key is OffersFilterRangeKey =>
  (RANGE_KEYS as readonly string[]).includes(key)

type OffersFilterCommandProps = StylesProps<typeof adFilterCommandStyles> & {
  className?: string
}

function OffersFilterCommand(props: OffersFilterCommandProps) {
  const { className, ...restProps } = props

  const styles = adFilterCommandStyles()

  const { get, set, data, labels, placeholders, commandOpen, setCommandOpen } =
    useOffersFilterContext()

  const inputRef = useRef<HTMLInputElement>(null)

  const [currentFilterKey, setCurrentFilterKey] =
    useState<OffersFilterFieldKey>(FILTER_KEYS[0])
  const [searchValue, setSearchValue] = useState('')

  const t = useTranslations('OffersFilter')

  const selectedMakes = useMemo(() => get.make ?? [], [get.make])

  const handleOptionSelect = useCallback(
    (option: OffersFilterSelectOption) => {
      if (currentFilterKey === 'make') {
        const current = get.make ?? []
        const next = current.includes(option.value)
          ? current.filter((id) => id !== option.value)
          : [...current, option.value]
        void set((prev) => ({ ...prev, make: next.length > 0 ? next : null }))
        return
      }

      void set((prev) => ({ ...prev, [currentFilterKey]: [option.value] }))

      const nextFilterKeyIndex = FILTER_KEYS.indexOf(currentFilterKey) + 1
      if (nextFilterKeyIndex >= FILTER_KEYS.length) return

      setCurrentFilterKey(FILTER_KEYS[nextFilterKeyIndex]!)
      setSearchValue('')
    },
    [currentFilterKey, get.make, set],
  )

  const activeFilters = useMemo(
    () =>
      FILTER_KEYS.flatMap((key) => {
        if (!isRangeKey(key)) {
          const selectedValues = get[key]

          if (!selectedValues || selectedValues.length === 0) return []

          const options = data[key] ?? []

          return selectedValues.map((value) => {
            const option = options.find((item) => item.value === value)

            return {
              label: option?.label ?? value,
              onRemove: () => {
                const next = selectedValues.filter((id) => id !== value)
                void set((prev) => ({
                  ...prev,
                  [key]: next.length > 0 ? next : null,
                }))

                if (key === 'model' || key === 'generation') {
                  setCurrentFilterKey(key)
                  return
                }

                // Model and generation options only exist for a single
                // selected make, so fall back to the make page when removing
                // one invalidates them.
                if (
                  key === 'make' &&
                  next.length !== 1 &&
                  (currentFilterKey === 'model' ||
                    currentFilterKey === 'generation')
                ) {
                  setCurrentFilterKey('make')
                }
              },
            }
          })
        }

        const rangeValue = get[key]

        if (!rangeValue) return []

        const config = data[key]
        const from = rangeValue.min
        const to = rangeValue.max
        const hasFrom = from !== null && from !== config.min
        const hasTo = to !== null && to !== config.max

        if (!hasFrom && !hasTo) return []

        const unit = config.unit ? ` ${config.unit}` : ''
        const chips: { label: string; onRemove: () => void }[] = []

        if (hasFrom) {
          chips.push({
            label: `${t('labels.from', { noun: labels[key] })} ${from}${unit}`,
            onRemove: () => {
              const nextMax = rangeValue.max
              void set((prev) => ({
                ...prev,
                [key]:
                  nextMax === null || nextMax === config.max
                    ? null
                    : { min: null, max: nextMax },
              }))
            },
          })
        }

        if (hasTo) {
          chips.push({
            label: `${t('labels.to', { noun: labels[key] })} ${to}${unit}`,
            onRemove: () => {
              const nextMin = rangeValue.min
              void set((prev) => ({
                ...prev,
                [key]:
                  nextMin === null || nextMin === config.min
                    ? null
                    : { min: nextMin, max: null },
              }))
            },
          })
        }

        return chips
      }),
    [get, data, labels, set, t, currentFilterKey],
  )

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
        const enabledFilterKeys = FILTER_KEYS.filter((filterKey) => {
          if (filterKey === 'model' && !data.model) return false
          if (filterKey === 'generation' && !data.generation) return false
          return true
        })
        const currentIndex = enabledFilterKeys.indexOf(currentFilterKey)
        const nextIndex = event.shiftKey
          ? (currentIndex - 1 + enabledFilterKeys.length) %
            enabledFilterKeys.length
          : (currentIndex + 1) % enabledFilterKeys.length
        setCurrentFilterKey(enabledFilterKeys[nextIndex]!)
      }
    },
    [activeFilters, currentFilterKey, data.model, data.generation, searchValue],
  )

  const currentView = useMemo(() => {
    if (isRangeKey(currentFilterKey)) {
      const config = data[currentFilterKey]
      const rangeValue = get[currentFilterKey]

      // Keyboard navigation is interrupted by onKeyDown handler.
      // TODO: Find a way to make it work.
      return (
        <RangeSelect.Root
          // Re-key on the committed value so clearing the range from its chip
          // re-syncs the (uncontrolled) slider. Safe here — standalone, no
          // popover to disrupt.
          key={`${currentFilterKey}:${rangeValue?.min ?? ''}:${rangeValue?.max ?? ''}`}
          min={config.min}
          max={config.max}
          step={config.step}
          defaultValue={[
            rangeValue?.min ?? config.min,
            rangeValue?.max ?? config.max,
          ]}
          onValueCommitted={([newMin, newMax]) => {
            const nextMin = newMin !== config.min ? newMin : null
            const nextMax = newMax !== config.max ? newMax : null

            void set((prev) => ({
              ...prev,
              [currentFilterKey]:
                nextMin === null && nextMax === null
                  ? null
                  : { min: nextMin, max: nextMax },
            }))
          }}
          standalone
        >
          <RangeSelect.Content
            className={styles.rangeContent()}
            unit={config.unit}
            variant="inverted"
            fromLabel={t('labels.from', { noun: labels[currentFilterKey] })}
            toLabel={t('labels.to', { noun: labels[currentFilterKey] })}
            sliderMinLabel={t('labels.minimum', {
              noun: labels[currentFilterKey].toLowerCase(),
              gender: GENDER[currentFilterKey] ?? 'other',
            })}
            sliderMaxLabel={t('labels.maximum', {
              noun: labels[currentFilterKey].toLowerCase(),
              gender: GENDER[currentFilterKey] ?? 'other',
            })}
          />
        </RangeSelect.Root>
      )
    }

    const options = data[currentFilterKey] ?? []

    return (
      <ScrollArea.Root>
        <ScrollArea.Viewport className={styles.commandScrollAreaViewport()}>
          <Command.List className={styles.commandList()}>
            <Command.Group heading={t(`labels.alphabetical`)}>
              {options.map((option) => {
                const checked =
                  currentFilterKey === 'make' &&
                  selectedMakes.includes(option.value)

                return (
                  <Button
                    className={styles.commandPageButton()}
                    key={option.value}
                    variant="ghost"
                    inverted
                    contentAlignment="justify"
                    shape="rounded"
                    iconPosition="right"
                    icon={
                      <IconCheck
                        className={checked ? 'opacity-100' : 'opacity-0'}
                      />
                    }
                    render={
                      <Command.Item
                        className={styles.commandItem()}
                        value={option.value}
                        onSelect={() => handleOptionSelect(option)}
                      />
                    }
                  >
                    {option.label}
                  </Button>
                )
              })}
            </Command.Group>
          </Command.List>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className={styles.commandScrollAreaScrollbar()}>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    )
  }, [
    currentFilterKey,
    data,
    get,
    set,
    handleOptionSelect,
    labels,
    selectedMakes,
    styles,
    t,
  ])

  return (
    <>
      <OffersFilterCommandTrigger
        className={styles.triggerButton({ className })}
        render={
          <Button
            variant="solid"
            icon={IconSearch}
          />
        }
      >
        {t('placeholders.default')}
      </OffersFilterCommandTrigger>

      <Command.Dialog
        className={styles.commandDialog()}
        open={commandOpen}
        onOpenChange={setCommandOpen}
        loop
        onKeyDown={handleDialogKeyDown}
        {...restProps}
      >
        <IconButton
          variant="accent"
          className={styles.submitButton()}
          icon={IconSearch}
          label={t('labels.submit')}
          onClick={() => setCommandOpen(false)}
        />
        <Command.Input
          placeholder={placeholders[currentFilterKey]}
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
            {FILTER_KEYS.map((filterKey) => {
              const disabled =
                (filterKey === 'model' && !data.model) ||
                (filterKey === 'generation' && !data.generation)
              return (
                <Button
                  className={styles.commandPageButton()}
                  data-selected={currentFilterKey === filterKey}
                  data-active={!!get[filterKey]}
                  icon={ICONS[filterKey]}
                  variant="ghost"
                  inverted
                  shape="rounded"
                  contentAlignment="start"
                  key={filterKey}
                  disabled={disabled}
                  onClick={() => setCurrentFilterKey(filterKey)}
                >
                  {labels[filterKey]}
                </Button>
              )
            })}
          </div>

          {currentView}
        </div>
      </Command.Dialog>
    </>
  )
}

export { OffersFilterCommand, type OffersFilterCommandProps }
