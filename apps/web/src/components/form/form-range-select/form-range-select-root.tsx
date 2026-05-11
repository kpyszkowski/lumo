'use client'
import { RangeSelect } from '@lumo/ui/components'
import { useEffect, useState, type ReactNode } from 'react'
import {
  Controller,
  useWatch,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'

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

  const fieldValue = useWatch({
    control,
    name,
  })

  const [value, setValue] = useState<[number, number]>([min, max])

  useEffect(() => {
    if (fieldValue === undefined) {
      setValue([min, max])
    } else if (fieldValue && typeof fieldValue === 'object') {
      const rangeValue = fieldValue as { min?: number; max?: number }
      setValue([rangeValue.min ?? min, rangeValue.max ?? max])
    }
  }, [fieldValue, min, max])

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <RangeSelect.Root
            value={value}
            onValueChange={setValue}
            onValueCommitted={([newMin, newMax]) => {
              field.onChange({
                min: newMin !== min ? newMin : undefined,
                max: newMax !== max ? newMax : undefined,
              })
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
