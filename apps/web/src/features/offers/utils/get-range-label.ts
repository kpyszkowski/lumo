type GetRangeLabelOptions = {
  /** The unit of measurement for the range */
  unit?: string
  /** The minimum value of the range */
  from?: number
  /** The maximum value of the range */
  to?: number
}
/**
 * Generates a label for a range based on the provided options.
 * @param options - An object containing the unit of measurement, minimum value, and maximum value for the range.
 * @returns A string representing the range label, formatted based on the presence of the minimum and maximum values.
 * - If only the minimum value is provided, the label will be in the format "> {from}".
 * - If both minimum and maximum values are provided, the label will be in the format "{from} - {to}".
 * - If only the maximum value is provided, the label will be in the format "< {to}".
 * - If a unit is provided, it will be appended to the range label.
 * - If neither minimum nor maximum values are provided, the label will be an empty string.
 * @example
 * getRangeLabel({ from: 10, to: 20, unit: 'km' }) // returns "10 - 20 km"
 * getRangeLabel({ from: 10, unit: 'km' }) // returns "> 10 km"
 * getRangeLabel({ to: 20, unit: 'km' }) // returns "< 20 km"
 * getRangeLabel({}) // returns ""
 */
export function getRangeLabel(options: GetRangeLabelOptions) {
  const { unit, from, to } = options

  if (!from && !to) return ''

  let range = ''

  // TODO: Refactor to use translations - From/To etc.

  if (from && !to) range = `> ${from}`
  if (from && to) range = `${from} - ${to}`
  if (!from && to) range = `< ${to}`

  return unit ? `${range} ${unit}` : range
}
