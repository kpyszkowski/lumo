'use client'
import { MultiSelect } from '@lumo/ui/components'
import {
  Controller,
  type ControllerProps,
  type FieldValues,
  type Path,
} from 'react-hook-form'

type FormMultiSelectRootProps<TFieldValues extends FieldValues = FieldValues> =
  Omit<ControllerProps<TFieldValues, Path<TFieldValues>>, 'render'> &
    MultiSelect.RootProps

function FormMultiSelectRoot<TFieldValues extends FieldValues>(
  props: FormMultiSelectRootProps<TFieldValues>,
) {
  const { control, name, ...restProps } = props

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <MultiSelect.Root
            {...restProps}
            value={field.value}
            onValueChange={(newValue) => {
              field.onChange(
                Array.isArray(newValue) && newValue.length > 0
                  ? newValue
                  : undefined,
              )
            }}
          />
        )
      }}
    />
  )
}

export { FormMultiSelectRoot, type FormMultiSelectRootProps }
