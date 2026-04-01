import { RangeSelect } from '@lumo/ui/components'
import {
  FormRangeSelectRoot,
  type FormRangeSelectRootProps,
} from '~/components/form/form-range-select/form-range-select-root'

const FormRangeSelectTrigger = RangeSelect.Trigger
const FormRangeSelectContent = RangeSelect.Content

type FormRangeSelectTriggerProps = RangeSelect.TriggerProps
type FormRangeSelectContentProps = RangeSelect.ContentProps

export {
  FormRangeSelectRoot as Root,
  FormRangeSelectTrigger as Trigger,
  FormRangeSelectContent as Content,
  type FormRangeSelectRootProps as RootProps,
  type FormRangeSelectTriggerProps as TriggerProps,
  type FormRangeSelectContentProps as ContentProps,
}
