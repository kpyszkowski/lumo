'use client'
import { Button, Chip, Command, IconButton } from '@lumo/ui/components'
import { IconSearch } from '@lumo/ui/icons'
import { createStyles, type StylesProps } from '@lumo/ui/utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAdDistribution } from '~/features/ads/hooks/use-ad-distribution'
import { useActiveFilters } from '~/features/ads/hooks/use-active-filters'
import { useAdFilterForm } from '~/features/ads/hooks/use-ad-filter-form'
import { ListFilterContent } from '~/features/ads/components/ad-filter-command/ad-filter-command-list-content'
import { RangeFilterContent } from '~/features/ads/components/ad-filter-command/ad-filter-command-range-content'
import { useFilterPages } from '~/features/ads/hooks/use-filter-pages'

export const adFilterCommandStyles = createStyles({
  slots: {
    commandDialog: 'lg:-ml-14',
    submitButton: 'absolute top-0 right-0 -mr-14',
    triggerButton:
      'text-muted active:[&>div]:text-muted bg-elevated hover:bg-highlighted focus-visible:bg-highlighted mx-auto w-full max-w-lg [&>div]:justify-end',
    commandWrapper: 'flex overflow-hidden',
    commandPageButtons: 'mb-6 flex w-64 flex-col gap-1 px-4',
    commandPageButton:
      'data-[page-active=true]:bg-elevated-inv data-[filter-active=true]:[&_svg]:text-accent',
    commandItem: 'data-[selected=true]:bg-elevated-inv transition-none',
    commandList: 'flex w-full gap-6 px-4',
    commandScrollAreaViewport: 'pb-6',
    commandScrollAreaScrollbar: 'pb-6',
    rangeContent: 'flex min-w-0 flex-1 flex-col gap-4 px-11 pt-2 pb-6',
    rangeInputRow: 'flex gap-3',
    rangeInputLabel: 'flex flex-1 flex-col gap-1',
    rangeInputLabelText: 'text-subtle text-xs font-medium',
    rangeInput:
      'bg-elevated border-subtle-inv text-main placeholder:text-muted focus:border-accent focus:ring-accent/20 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2',
  },
})

type AdFilterCommandProps = StylesProps<typeof adFilterCommandStyles> & {
  className?: string
}

function AdFilterCommand(props: AdFilterCommandProps) {
  const { className, ...restProps } = props

  const [open, setOpen] = useState(false)
  const [activePage, setActivePage] = useState(0)
  const [searchValue, setSearchValue] = useState('')

  const t = useTranslations('AdFilterCommand')
  const tPages = useTranslations('FilterPages')
  const tFilterData = useTranslations('FilterData')

  const { form, values, setMake, setModel, filterSelection } = useAdFilterForm()
  const { setValue } = form

  const scrollViewportRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const styles = adFilterCommandStyles()

  const handlePageChange = useCallback(
    (setValue: ((value: number) => number) | number) => {
      setActivePage(setValue)
      setSearchValue('')
      if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTo({ top: 0 })
      }
    },
    [],
  )

  const filterPageLabels = useMemo(
    () => ({
      makesLabel: tPages('makesLabel'),
      makesPlaceholder: tPages('makesPlaceholder'),
      modelsLabel: tPages('modelsLabel'),
      modelsPlaceholder: tPages('modelsPlaceholder'),
      generationsLabel: tPages('generationsLabel'),
      generationsPlaceholder: tPages('generationsPlaceholder'),
      bodyTypesLabel: tPages('bodyTypesLabel'),
      bodyTypesPlaceholder: tPages('bodyTypesPlaceholder'),
      priceLabel: tPages('priceLabel'),
      pricePlaceholder: tPages('pricePlaceholder'),
      yearLabel: tPages('yearLabel'),
      yearPlaceholder: tPages('yearPlaceholder'),
      fuelTypesLabel: tPages('fuelTypesLabel'),
      fuelTypesPlaceholder: tPages('fuelTypesPlaceholder'),
      transmissionsLabel: tPages('transmissionsLabel'),
      transmissionsPlaceholder: tPages('transmissionsPlaceholder'),
      mileageLabel: tPages('mileageLabel'),
      mileagePlaceholder: tPages('mileagePlaceholder'),
      groupAlphabetical: tPages('groupAlphabetical'),
      generationPresent: tFilterData('generationPresent'),
    }),
    [tPages, tFilterData],
  )

  const pages = useFilterPages({
    values,
    setValue,
    setMake,
    setModel,
    onPageChange: handlePageChange,
    labels: filterPageLabels,
    adCountByPrice: useAdDistribution('price', filterSelection),
    adCountByProductionYear: useAdDistribution(
      'productionYear',
      filterSelection,
    ),
    adCountByMileage: useAdDistribution('mileage', filterSelection),
  })

  const activeFilters = useActiveFilters({
    values,
    setValue,
    setMake,
    setModel,
  })

  const rangeStateById = useMemo(
    () => ({
      price: {
        value: values.priceRange,
        onChange: (v: [number, number]) => setValue('priceRange', v),
      },
      year: {
        value: values.yearRange,
        onChange: (v: [number, number]) => setValue('yearRange', v),
      },
      mileage: {
        value: values.mileageRange,
        onChange: (v: [number, number]) => setValue('mileageRange', v),
      },
    }),
    [values.priceRange, values.yearRange, values.mileageRange, setValue],
  )

  const enabledIndexes = useMemo(
    () =>
      pages
        .map((p, i) => (p.disabled ? null : i))
        .filter((i): i is number => i !== null),
    [pages],
  )

  useEffect(() => {
    if (pages[activePage]?.disabled) {
      const prev = [...enabledIndexes].reverse().find((i) => i < activePage)
      setActivePage(prev ?? enabledIndexes[0] ?? 0)
    }
  }, [activePage, pages, enabledIndexes])

  const currentPage = pages[activePage]
  const currentRangeState =
    currentPage?.type === 'range'
      ? rangeStateById[currentPage.id as keyof typeof rangeStateById]
      : null

  return (
    <>
      <Button
        variant="solid"
        onClick={() => setOpen(true)}
        icon={IconSearch}
        className={styles.triggerButton({ className })}
      >
        {t('triggerPlaceholder')}
      </Button>

      <Command.Dialog
        className={styles.commandDialog()}
        open={open}
        onOpenChange={setOpen}
        loop
        onKeyDown={(event) => {
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
            const currentPos = enabledIndexes.indexOf(activePage)
            const nextPos =
              (currentPos + (event.shiftKey ? -1 : 1) + enabledIndexes.length) %
              enabledIndexes.length
            handlePageChange(enabledIndexes[nextPos] ?? 0)
          }
        }}
        {...restProps}
      >
        <IconButton
          variant="accent"
          className={styles.submitButton()}
          icon={IconSearch}
          label={t('searchSubmit')}
        />
        <Command.Input
          placeholder={
            currentPage?.placeholder ?? t('searchFallbackPlaceholder')
          }
          value={searchValue}
          onValueChange={setSearchValue}
          ref={inputRef}
          chips={activeFilters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              onRemove={filter.onRemove}
            />
          ))}
        />
        <div className={styles.commandWrapper()}>
          <div className={styles.commandPageButtons()}>
            {pages.map((tab, index) => (
              <Button
                className={styles.commandPageButton()}
                data-page-active={activePage === index}
                data-filter-active={!!tab.active}
                variant="ghost"
                inverted
                shape="rounded"
                contentAlignment="start"
                key={tab.label}
                icon={tab.icon}
                disabled={tab.disabled}
                onClick={() => handlePageChange(index)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {currentPage?.type === 'range' && currentRangeState && (
            <RangeFilterContent
              page={currentPage}
              value={currentRangeState.value}
              onChange={currentRangeState.onChange}
              styles={styles}
            />
          )}
          {currentPage?.type === 'list' && (
            <ListFilterContent
              page={currentPage}
              scrollViewportRef={scrollViewportRef}
              styles={styles}
            />
          )}
        </div>
      </Command.Dialog>
    </>
  )
}

export { AdFilterCommand, type AdFilterCommandProps }
