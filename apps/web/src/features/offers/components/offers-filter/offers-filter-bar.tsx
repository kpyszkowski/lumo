'use client'
import { createStyles, type StylesProps } from '@lumo/ui/utils'
import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'
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
import { getRangeLabel } from '~/features/offers/utils/get-range-label'
import { type RefObject, useMemo, useRef, useState } from 'react'

const MotionIconChevronDown = motion.create(IconChevronDown)

const GENDER: Partial<Record<keyof OffersFilterValues, 'masculine'>> = {
  year: 'masculine',
  mileage: 'masculine',
  power: 'masculine',
  engineCapacity: 'masculine',
}

export const offersFilterBarStyles = createStyles({
  slots: {
    container: 'flex items-start py-6',
    wrapper: 'text-main-inv relative min-w-0 flex-1',
    list: 'flex w-full gap-x-3 gap-y-4 overflow-hidden',
    triggerWrapper: 'flex items-center gap-2',
    triggerIcon: '-mr-1 size-4',
    buttonsWrapper: 'border-subtle-inv ml-5 flex border-l pl-5',
    listOverlay: 'absolute inset-y-0 right-0 w-36 bg-current mask-l-from-25%',
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

  const containerRef = useRef<HTMLUListElement>(null)
  const containerSize = useResizeObserver<HTMLUListElement>({
    ref: containerRef as RefObject<HTMLUListElement>,
  })

  const offersFilterData = useMemo(
    () =>
      Object.entries(offersFilter.data).map(([key, value]) => ({
        name: key as keyof OffersFilterValues,
        label: t(`labels.${key as keyof OffersFilterValues}`),
        ...value,
      })),
    [offersFilter.data, t],
  )

  return (
    <LayoutGroup>
      <div
        className={styles.container({ className })}
        {...restProps}
      >
        <motion.div
          className={styles.wrapper()}
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
              if (filter.type === 'select') {
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
                      items={filter.options.map(({ id, label }) => ({
                        value: id,
                        label,
                      }))}
                    >
                      <FormMultiSelect.Trigger
                        disabled={
                          (filter.name === 'model' &&
                            offersFilter.state.model.disabled) ||
                          (filter.name === 'generation' &&
                            offersFilter.state.generation.disabled) ||
                          filter.options.length === 0
                        }
                        render={({ value, items }, { open }) => {
                          const singleItem =
                            value.length === 1
                              ? items.find((item) => item.value === value[0])
                              : null

                          return (
                            <Button>
                              <div className={styles.triggerWrapper()}>
                                <motion.span layout>{filter.label}</motion.span>

                                <AnimatePresence
                                  mode="popLayout"
                                  key={filter.name}
                                >
                                  {value.length > 0 && (
                                    <Chip
                                      label={
                                        value.length > 1
                                          ? `${value.length}`
                                          : (singleItem?.label ?? '')
                                      }
                                    />
                                  )}
                                </AnimatePresence>

                                <MotionIconChevronDown
                                  className={styles.triggerIcon()}
                                  animate={{
                                    rotate: open ? 180 : 0,
                                  }}
                                />
                              </div>
                            </Button>
                          )
                        }}
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
                      render={({ value: [from, to] }, { open }) => {
                        return (
                          <Button>
                            <div className={styles.triggerWrapper()}>
                              <span>{filter.label}</span>

                              {(from !== filter.min || to !== filter.max) && (
                                <Chip
                                  label={getRangeLabel({
                                    from,
                                    to,
                                    unit: filter.unit,
                                  })}
                                />
                              )}

                              <MotionIconChevronDown
                                className={styles.triggerIcon()}
                                animate={{
                                  rotate: open ? 180 : 0,
                                }}
                              />
                            </div>
                          </Button>
                        )
                      }}
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
    </LayoutGroup>
  )
}

export { OffersFilterBar, type OffersFilterBarProps }
