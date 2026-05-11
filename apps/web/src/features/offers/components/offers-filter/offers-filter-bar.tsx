'use client'
import { createStyles, type StylesProps } from '@lumo/ui/utils'
import { useTranslations } from 'next-intl'
import { useFormContext, useWatch } from 'react-hook-form'
import {
  type OffersFilterValues,
  useOffersFilterContext,
} from '~/features/offers/components/offers-filter'
import * as FormRangeSelect from '~/components/form/form-range-select'
import * as FormMultiSelect from '~/components/form/form-multi-select'
import { Button, Chip } from '@lumo/ui/components'
import { motion, LayoutGroup, AnimatePresence } from '@lumo/ui/motion'
import { IconArrowsSort, IconChevronDown } from '@lumo/ui/icons'
import { useResizeObserver } from '@lumo/ui/hooks'
import { useMemo, useRef, useState } from 'react'

const MotionIconChevronDown = motion.create(IconChevronDown)

const GENDER: Partial<Record<keyof OffersFilterValues, 'masculine'>> = {
  year: 'masculine',
  mileage: 'masculine',
  power: 'masculine',
  engineCapacity: 'masculine',
}

export const offersFilterBarStyles = createStyles({
  slots: {
    container: 'flex flex-col py-6',
    wrapper: 'flex items-start',
    innerWrapper: 'text-main-inv relative min-w-0 flex-1',
    list: 'flex w-full gap-x-3 gap-y-4 overflow-hidden',
    activeFilters: 'flex flex-wrap gap-2 pt-6',
    triggerWrapper: 'flex items-center gap-2',
    triggerButton: 'data-active:border-accent',
    triggerIcon: '-mr-1 size-4',
    buttonsWrapper: 'border-subtle-inv ml-5 flex border-l pl-5',
    listOverlay:
      'pointer-events-none absolute inset-y-0 right-0 w-36 bg-current mask-l-from-25%',
  },
})

type OffersFilterBarProps = StylesProps<typeof offersFilterBarStyles> & {
  className?: string
}

function OffersFilterBar(props: OffersFilterBarProps) {
  const { className, ...restProps } = props

  const [expanded, setExpanded] = useState(false)

  const styles = offersFilterBarStyles()

  const form = useFormContext<OffersFilterValues>()
  const offersFilter = useOffersFilterContext()

  const t = useTranslations('OffersFilter')

  const containerRef = useRef(null as unknown as HTMLUListElement)
  const containerSize = useResizeObserver({
    ref: containerRef,
  })

  const offersFilterData = useMemo(
    () =>
      Object.entries(offersFilter).map(([key, value]) => ({
        name: key as keyof OffersFilterValues,
        label: t(`labels.${key as keyof OffersFilterValues}`),
        ...value,
      })),
    [offersFilter, t],
  )

  const filterValues = useWatch({ control: form.control })

  const activeFilters = useMemo(
    () =>
      offersFilterData.flatMap((filter) => {
        const value = filterValues[filter.name]

        if (filter.type === 'select') {
          const selectedValues = value as string[] | undefined

          if (!selectedValues || selectedValues.length === 0) return []

          return selectedValues.map((optionId: string) => {
            const option = filter.options?.find(({ id }) => id === optionId)

            return {
              label: option?.label ?? optionId,
              onRemove: () => {
                const next = selectedValues.filter(
                  (id: string) => id !== optionId,
                )
                form.setValue(filter.name, next.length > 0 ? next : undefined, {
                  shouldDirty: true,
                  shouldValidate: true,
                  shouldTouch: true,
                })
              },
            }
          })
        }

        const rangeValue = value as { min?: number; max?: number } | undefined

        if (!rangeValue) return []

        const from = rangeValue.min
        const to = rangeValue.max
        const hasFrom = from !== undefined && from !== filter.min
        const hasTo = to !== undefined && to !== filter.max

        if (!hasFrom && !hasTo) return []

        const chips = []

        if (hasFrom) {
          chips.push({
            key: `${filter.name}-from`,
            label: `${t('labels.from', {
              noun: t(`labels.${filter.name}`),
            })} ${from}${filter.unit ? ` ${filter.unit}` : ''}`,
            onRemove: () => {
              const newValue = { ...rangeValue, min: filter.min }
              form.setValue(
                filter.name,
                newValue.max === filter.max && newValue.min === filter.min
                  ? undefined
                  : newValue,
                { shouldDirty: true, shouldValidate: true, shouldTouch: true },
              )
            },
          })
        }

        if (hasTo) {
          chips.push({
            key: `${filter.name}-to`,
            label: `${t('labels.to', {
              noun: t(`labels.${filter.name}`),
            })} ${to}${filter.unit ? ` ${filter.unit}` : ''}`,
            onRemove: () => {
              const newValue = { ...rangeValue, max: filter.max }
              form.setValue(
                filter.name,
                newValue.max === filter.max && newValue.min === filter.min
                  ? undefined
                  : newValue,
                { shouldDirty: true, shouldValidate: true, shouldTouch: true },
              )
            },
          })
        }

        return chips
      }),
    [offersFilterData, filterValues, form, t],
  )

  return (
    <LayoutGroup>
      <motion.div
        className={styles.container({ className })}
        {...restProps}
      >
        <div className={styles.wrapper()}>
          <motion.div
            className={styles.innerWrapper()}
            animate={{ height: containerSize.height }}
            transition={{
              type: 'tween',
              ease: 'easeOut',
            }}
          >
            <motion.ul
              layout
              ref={containerRef}
              layoutDependency={expanded}
              style={{
                flexWrap: expanded ? 'wrap' : 'nowrap',
              }}
              className={styles.list()}
            >
              {offersFilterData.map((filter) => {
                const isActive = filterValues[filter.name] ? true : undefined

                const triggerContent = (open: boolean) => (
                  <Button
                    className={styles.triggerButton()}
                    data-active={isActive}
                  >
                    <div className={styles.triggerWrapper()}>
                      <motion.span layout>{filter.label}</motion.span>

                      <MotionIconChevronDown
                        className={styles.triggerIcon()}
                        animate={{
                          rotate: open ? 180 : 0,
                        }}
                      />
                    </div>
                  </Button>
                )

                if (filter.type === 'select') {
                  const isDisabled =
                    (filter.name === 'model' && !offersFilter.model.options) ||
                    (filter.name === 'generation' &&
                      !offersFilter.generation.options)

                  return (
                    <motion.li
                      layout
                      key={filter.name}
                      transition={{
                        type: 'tween',
                        ease: 'easeOut',
                      }}
                    >
                      <FormMultiSelect.Root
                        control={form.control}
                        name={filter.name}
                        items={
                          filter.options
                            ? filter.options.map(({ id, label }) => ({
                                value: id,
                                label,
                              }))
                            : []
                        }
                      >
                        <FormMultiSelect.Trigger
                          disabled={isDisabled}
                          render={(_, { open }) => triggerContent(open)}
                        />

                        <FormMultiSelect.Popup
                          searchPlaceholder={t(`labels.${filter.name}`)}
                          selectedLabel={t('labels.selected')}
                          itemsLabel={t('labels.alphabetical')}
                        />
                      </FormMultiSelect.Root>
                    </motion.li>
                  )
                }

                return (
                  <motion.li
                    layout
                    key={filter.name}
                  >
                    <FormRangeSelect.Root
                      control={form.control}
                      name={filter.name}
                      min={filter.min}
                      max={filter.max}
                      step={filter.step}
                    >
                      <FormRangeSelect.Trigger
                        render={(_, { open }) => triggerContent(open)}
                      />

                      <FormRangeSelect.Content
                        unit={filter.unit}
                        fromLabel={t('labels.from', {
                          noun: t(`labels.${filter.name}`),
                        })}
                        toLabel={t('labels.to', {
                          noun: t(`labels.${filter.name}`),
                        })}
                        sliderMinLabel={t('labels.minimum', {
                          noun: t(`labels.${filter.name}`).toLowerCase(),
                          gender: GENDER[filter.name] ?? 'other',
                        })}
                        sliderMaxLabel={t('labels.maximum', {
                          noun: t(`labels.${filter.name}`).toLowerCase(),
                          gender: GENDER[filter.name] ?? 'other',
                        })}
                      />
                    </FormRangeSelect.Root>
                  </motion.li>
                )
              })}
            </motion.ul>
            <motion.div
              className={styles.listOverlay()}
              initial={false}
              animate={{ opacity: expanded ? 0 : 1 }}
            />
          </motion.div>

          <div className={styles.buttonsWrapper()}>
            <Button
              variant="ghost"
              onClick={() => setExpanded((prev) => !prev)}
              icon={
                <MotionIconChevronDown
                  initial={false}
                  animate={{ rotate: expanded ? 180 : 90 }}
                />
              }
            >
              Wszystkie filtry
            </Button>

            {/* TODO: Implement sorting functionality */}
            <Button
              variant="ghost"
              icon={IconArrowsSort}
            >
              Sortowanie
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              layout
              layoutRoot
              animate={{ height: 'auto', y: 0 }}
              initial={{ height: 0, y: 32 }}
              exit={{
                height: 0,
                y: 32,
              }}
            >
              <div className={styles.activeFilters()}>
                <AnimatePresence mode="popLayout">
                  {activeFilters.map((activeFilter) => (
                    <Chip
                      key={activeFilter.label}
                      label={activeFilter.label}
                      onRemove={activeFilter.onRemove}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  )
}

export { OffersFilterBar, type OffersFilterBarProps }
