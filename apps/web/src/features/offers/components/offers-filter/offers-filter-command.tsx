'use client'
import { Button, Command, IconButton, ScrollArea } from '@lumo/ui/components'
import {
  type Icon,
  IconCalendarDot,
  IconCarBodyLimousine,
  IconCheck,
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
import { useFormContext, useWatch } from 'react-hook-form'
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

const GENDER: Partial<Record<keyof OffersFilterValues, 'masculine'>> = {
  year: 'masculine',
  mileage: 'masculine',
}

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
  power: IconRoad,
  engineCapacity: IconRoad,
}

type OffersFilterCommandProps = StylesProps<typeof adFilterCommandStyles> & {
  className?: string
}

function OffersFilterCommand(props: OffersFilterCommandProps) {
  const { className, ...restProps } = props

  const styles = adFilterCommandStyles()

  const form = useFormContext<OffersFilterValues>()
  const offersFilter = useOffersFilterContext()

  const offersFilterKeys = Object.keys(
    offersFilter,
  ) as (keyof OffersFilterValues)[]

  const inputRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const [currentFilterKey, setCurrentFilterKey] = useState(
    offersFilterKeys.at(0),
  )
  const [searchValue, setSearchValue] = useState('')

  const t = useTranslations('OffersFilter')

  const selectedMakes = useWatch({ control: form.control, name: 'make' })

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

  const handleMakeRemove = useCallback(
    (makeId: string) => {
      const next = (selectedMakes ?? []).filter((id) => id !== makeId)
      form.setValue('make', next.length > 0 ? next : undefined)
      if (
        next.length !== 1 &&
        (currentFilterKey === 'model' || currentFilterKey === 'generation')
      ) {
        setCurrentFilterKey('make')
      }
    },
    [currentFilterKey, form, selectedMakes],
  )

  const handleOptionSelect = useCallback(
    (option: { id: string; label: string }) => {
      if (!currentFilterKey) return

      if (currentFilterKey === 'make') {
        const current = form.getValues('make') ?? []
        const next = current.includes(option.id)
          ? current.filter((id) => id !== option.id)
          : [...current, option.id]
        form.setValue('make', next.length > 0 ? next : undefined)
        return
      }

      form.setValue(currentFilterKey as keyof OffersFilterValues, [option.id])

      const nextFilterKeyIndex = offersFilterKeys.indexOf(currentFilterKey) + 1
      if (nextFilterKeyIndex >= offersFilterKeys.length) return

      setCurrentFilterKey(offersFilterKeys[nextFilterKeyIndex])
      setSearchValue('')
    },
    [currentFilterKey, form, offersFilterKeys],
  )

  const activeFilters = useMemo(() => {
    const { price, year, mileage, engineCapacity, power, ...selectValues } =
      form.watch()

    const rangeValues = { price, year, mileage, engineCapacity, power }

    const selectActiveFilters = Object.entries(selectValues)
      .filter(([, values]) => values !== undefined)
      .map(([key, values]) => {
        const filter = offersFilter[key as keyof typeof selectValues]

        return values.map((value) => {
          const option = filter.options?.find((option) => option.id === value)
          return {
            label: option ? option.label : value,
            onRemove: () => {
              if (key === 'make') {
                handleMakeRemove(value)
              } else {
                handleCurrentFilterRemove(key)
              }
            },
          }
        })
      })
      .flat()

    const rangeActiveFilters = Object.entries(rangeValues)
      .filter(
        ([, value]) =>
          value !== undefined ||
          Object.values(value ?? {}).some((v) => v !== undefined),
      )
      .map(([key, value]) => {
        const filter = offersFilter[key as keyof typeof rangeValues]

        const label = filter
          ? `${t(`labels.${key as keyof OffersFilterValues}`)}: ${
              value?.min !== undefined
                ? `≥ ${value.min}${filter.unit ?? ''}`
                : ''
            }${value?.max !== undefined ? ` ≤ ${value.max}${filter.unit ?? ''}` : ''}`
          : ''

        return {
          label,
          onRemove: () => handleCurrentFilterRemove(key),
        }
      })

    return [...selectActiveFilters, ...rangeActiveFilters]
  }, [form, handleCurrentFilterRemove, handleMakeRemove, offersFilter, t])

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
        const enabledFilterKeys = offersFilterKeys.filter((filterKey) => {
          if (filterKey === 'model' && !offersFilter.model.options) return false
          if (filterKey === 'generation' && !offersFilter.generation.options)
            return false
          return true
        })
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
      offersFilterKeys,
      offersFilter,
      searchValue,
    ],
  )

  const currentView = useMemo(() => {
    if (!currentFilterKey) return null

    const data = offersFilter[currentFilterKey as keyof OffersFilterValues]
    if (!data) return null

    if (data.type === 'select') {
      return (
        <ScrollArea.Root>
          <ScrollArea.Viewport className={styles.commandScrollAreaViewport()}>
            <Command.List className={styles.commandList()}>
              <Command.Group heading={t(`labels.alphabetical`)}>
                {data.options?.map((option) => {
                  const checked =
                    currentFilterKey === 'make' &&
                    (selectedMakes ?? []).includes(option.id)

                  return (
                    <Button
                      className={styles.commandPageButton()}
                      key={option.id}
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
                          value={option.id}
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
          fromLabel={t('labels.from', {
            noun: t(`labels.${currentFilterKey}`),
          })}
          toLabel={t('labels.to', { noun: t(`labels.${currentFilterKey}`) })}
          sliderMinLabel={t('labels.minimum', {
            noun: t(`labels.${currentFilterKey}`).toLowerCase(),
            gender: GENDER[currentFilterKey] ?? 'other',
          })}
          sliderMaxLabel={t('labels.maximum', {
            noun: t(`labels.${currentFilterKey}`).toLowerCase(),
            gender: GENDER[currentFilterKey] ?? 'other',
          })}
        />
      </FormRangeSelect.Root>
    )
  }, [
    currentFilterKey,
    form.control,
    handleOptionSelect,
    offersFilter,
    selectedMakes,
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
            {offersFilterKeys.map((filterKey) => {
              const disabled =
                (filterKey === 'model' && !offersFilter.model.options) ||
                (filterKey === 'generation' && !offersFilter.generation.options)
              return (
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
                  disabled={disabled}
                  onClick={() => setCurrentFilterKey(filterKey)}
                >
                  {t(`labels.${filterKey}`)}
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
