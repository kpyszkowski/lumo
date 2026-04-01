'use client'
import { RangeSelect } from '@lumo/ui/components'
import type { ReactNode } from 'react'
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'

type RangeFieldValue = { min?: number; max?: number }

type FormRangeSelectRootProps<TFieldValues extends FieldValues = FieldValues> =
  {
    /** Minimum value of the range. */
    min: number
    /** Maximum value of the range. */
    max: number
    /** Step increment for the slider and inputs. */
    step: number
    /** If `true`, the component renders without a popover wrapper. */
    standalone?: boolean
    name: Path<TFieldValues>
    control: Control<TFieldValues>
    children: ReactNode
  }

function FormRangeSelectRoot<TFieldValues extends FieldValues>(
  props: FormRangeSelectRootProps<TFieldValues>,
) {
  const { control, name, min, max, step, standalone, children } = props

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const { min: formMin, max: formMax } =
          (field.value as RangeFieldValue | undefined) ?? {}
        const sliderValue: [number, number] = [formMin ?? min, formMax ?? max]

        return (
          <RangeSelect.Root
            value={sliderValue}
            onValueChange={([newMin, newMax]) => {
              const nextValue: RangeFieldValue = {}
              if (newMin !== min) nextValue.min = newMin
              if (newMax !== max) nextValue.max = newMax
              field.onChange(
                Object.keys(nextValue).length > 0 ? nextValue : undefined,
              )
            }}
            min={min}
            max={max}
            step={step}
            standalone={standalone}
          >
            {children}
          </RangeSelect.Root>
        )
      }}
    />
  )
}

export { FormRangeSelectRoot, type FormRangeSelectRootProps }
