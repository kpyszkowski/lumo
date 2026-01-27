import mustDestructureFirst from './rules/must-destructure-first'
import noDestructureInParams from './rules/no-destructure-in-params'

export default {
  rules: {
    'must-destructure-first': mustDestructureFirst,
    'no-destructure-in-params': noDestructureInParams,
  },
}
