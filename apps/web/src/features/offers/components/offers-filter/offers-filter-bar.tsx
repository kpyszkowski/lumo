'use client'
import { createStyles, type StylesProps } from '@lumo/ui/utils'
import { useTranslations } from 'next-intl'
import {
  FILTER_KEYS,
  RANGE_KEYS,
  SORT_VALUES,
  useOffersFilterContext,
  type OffersFilterFieldKey,
  type OffersFilterRangeKey,
} from '~/features/offers/components/offers-filter'
import {
  Button,
  Chip,
  Menu,
  MultiSelect,
  RangeSelect,
} from '@lumo/ui/components'
import { motion, LayoutGroup, AnimatePresence } from '@lumo/ui/motion'
import { IconArrowsSort, IconChevronDown } from '@lumo/ui/icons'
import { useResizeObserver } from '@lumo/ui/hooks'
import { useMemo, useRef, useState } from 'react'

const MotionIconChevronDown = motion.create(IconChevronDown)

const GENDER: Partial<Record<OffersFilterFieldKey, 'masculine'>> = {
  year: 'masculine',
  mileage: 'masculine',
  power: 'masculine',
  engineCapacity: 'masculine',
}

const isRangeKey = (key: OffersFilterFieldKey): key is OffersFilterRangeKey =>
  (RANGE_KEYS as readonly string[]).includes(key)

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
    buttonsWrapper: 'border-subtle-inv relative ml-5 flex border-l pl-5',
    listOverlay:
      'bg-main pointer-events-none absolute inset-y-0 -left-px w-36 -translate-x-full mask-l-from-25%',
  },
})

type OffersFilterBarProps = StylesProps<typeof offersFilterBarStyles> & {
  className?: string
}

function OffersFilterBar(props: OffersFilterBarProps) {
  const { className, ...restProps } = props

  const [expanded, setExpanded] = useState(false)

  // In-progress slider values, so dragging doesn't write the URL on every
  // frame. Cleared once a chip is removed, which snaps the slider back to the
  // committed (URL) range.
  const [rangeDrafts, setRangeDrafts] = useState<
    Partial<Record<OffersFilterRangeKey, [number, number]>>
  >({})

  const styles = offersFilterBarStyles()

  const { get, set, data, labels, sort, setSort, sortLabels } =
    useOffersFilterContext()

  const t = useTranslations('OffersFilter')

  const containerRef = useRef(null as unknown as HTMLUListElement)
  const containerSize = useResizeObserver({
    ref: containerRef,
  })

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
              setRangeDrafts((prev) => ({ ...prev, [key]: undefined }))
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
              setRangeDrafts((prev) => ({ ...prev, [key]: undefined }))
            },
          })
        }

        return chips
      }),
    [get, data, labels, set, t],
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
              {FILTER_KEYS.map((key) => {
                const isActive = get[key] ? true : undefined

                const triggerContent = (open: boolean) => (
                  <Button
                    className={styles.triggerButton()}
                    data-active={isActive}
                  >
                    <div className={styles.triggerWrapper()}>
                      <motion.span layout>{labels[key]}</motion.span>

                      <MotionIconChevronDown
                        className={styles.triggerIcon()}
                        animate={{
                          rotate: open ? 180 : 0,
                        }}
                      />
                    </div>
                  </Button>
                )

                if (!isRangeKey(key)) {
                  const isDisabled =
                    (key === 'model' && !data.model) ||
                    (key === 'generation' && !data.generation)

                  return (
                    <motion.li
                      layout
                      key={key}
                      transition={{
                        type: 'tween',
                        ease: 'easeOut',
                      }}
                    >
                      <MultiSelect.Root
                        items={data[key] ?? []}
                        value={get[key] ?? []}
                        onValueChange={(next) => {
                          const current = get[key] ?? []
                          const resolved =
                            typeof next === 'function' ? next(current) : next
                          void set((prev) => ({
                            ...prev,
                            [key]: resolved.length > 0 ? resolved : null,
                          }))
                        }}
                      >
                        <MultiSelect.Trigger
                          disabled={isDisabled}
                          render={(_, { open }) => triggerContent(open)}
                        />

                        <MultiSelect.Popup
                          searchPlaceholder={labels[key]}
                          selectedLabel={t('labels.selected')}
                          itemsLabel={t('labels.alphabetical')}
                        />
                      </MultiSelect.Root>
                    </motion.li>
                  )
                }

                const config = data[key]
                const rangeValue = get[key]

                // Controlled by the committed (URL) range unless a drag is in
                // progress, so clearing a chip reverts the slider to the full
                // range instead of leaving it stuck on the removed value.
                const value: [number, number] = rangeDrafts[key] ?? [
                  rangeValue?.min ?? config.min,
                  rangeValue?.max ?? config.max,
                ]

                return (
                  <motion.li
                    layout
                    key={key}
                  >
                    <RangeSelect.Root
                      min={config.min}
                      max={config.max}
                      step={config.step}
                      value={value}
                      onValueChange={(nextValue) =>
                        setRangeDrafts((prev) => ({
                          ...prev,
                          [key]: nextValue,
                        }))
                      }
                      onValueCommitted={([newMin, newMax]) => {
                        const nextMin = newMin !== config.min ? newMin : null
                        const nextMax = newMax !== config.max ? newMax : null

                        void set((prev) => ({
                          ...prev,
                          [key]:
                            nextMin === null && nextMax === null
                              ? null
                              : { min: nextMin, max: nextMax },
                        }))
                      }}
                    >
                      <RangeSelect.Trigger
                        render={(_, { open }) => triggerContent(open)}
                      />

                      <RangeSelect.Content
                        unit={config.unit}
                        fromLabel={t('labels.from', { noun: labels[key] })}
                        toLabel={t('labels.to', { noun: labels[key] })}
                        sliderMinLabel={t('labels.minimum', {
                          noun: labels[key].toLowerCase(),
                          gender: GENDER[key] ?? 'other',
                        })}
                        sliderMaxLabel={t('labels.maximum', {
                          noun: labels[key].toLowerCase(),
                          gender: GENDER[key] ?? 'other',
                        })}
                      />
                    </RangeSelect.Root>
                  </motion.li>
                )
              })}
            </motion.ul>
          </motion.div>

          <motion.div
            layout
            className={styles.buttonsWrapper()}
          >
            <motion.div
              className={styles.listOverlay()}
              initial={false}
              animate={{ opacity: expanded ? 0 : 1 }}
            />

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
              {t('labels.allFilters')}
            </Button>

            <Menu.Root>
              <Menu.Trigger
                variant="ghost"
                icon={IconArrowsSort}
              >
                {sortLabels[sort]}
              </Menu.Trigger>

              <Menu.Content align="end">
                <Menu.RadioGroup
                  value={sort}
                  onValueChange={(nextSort) => {
                    const value = SORT_VALUES.find((item) => item === nextSort)
                    if (value) setSort(value)
                  }}
                >
                  <Menu.GroupLabel>{t('labels.sorting')}</Menu.GroupLabel>

                  {SORT_VALUES.map((value) => (
                    <Menu.RadioItem
                      key={value}
                      value={value}
                    >
                      {sortLabels[value]}
                    </Menu.RadioItem>
                  ))}
                </Menu.RadioGroup>
              </Menu.Content>
            </Menu.Root>
          </motion.div>
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
