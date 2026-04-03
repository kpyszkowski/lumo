import { MultiSelect } from '@lumo/ui/components'
import {
  FormMultiSelectRoot,
  type FormMultiSelectRootProps,
} from '~/components/form/form-multi-select/form-multi-select-root'

const FormMultiSelectTrigger = MultiSelect.Trigger
const FormMultiSelectPopup = MultiSelect.Popup

type FormMultiSelectTriggerProps = MultiSelect.TriggerProps
type FormMultiSelectPopupProps = MultiSelect.PopupProps

export {
  FormMultiSelectRoot as Root,
  FormMultiSelectTrigger as Trigger,
  FormMultiSelectPopup as Popup,
  type FormMultiSelectRootProps as RootProps,
  type FormMultiSelectTriggerProps as TriggerProps,
  type FormMultiSelectPopupProps as PopupProps,
}
