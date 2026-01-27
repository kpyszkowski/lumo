type FormatPrecisionOptions = {
  /** Maximum number of decimal places to display */
  max: number
  /** Minimum number of decimal places to display */
  min?: number
}

/**
 * Formats a number to a specified precision, removing unnecessary trailing
 * zeros.
 *
 * Uses `Intl.NumberFormat` internally.
 *
 * @example
 * formatPrecision(2.4);        // "2.4"
 * formatPrecision(2.4000);     // "2.4"
 * formatPrecision(2.123456);   // "2.1235"
 * formatPrecision(5);          // "5"
 *
 * @param value - The number to format. Strings must be numeric.

 * @returns The formatted number string. If input is not numeric, the original value is returned as a string.
 */
export function formatPrecision(
  value: number | string,
  options: FormatPrecisionOptions,
): string {
  const num = Number(value)
  if (Number.isNaN(num)) return String(value)

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: options.min ?? 0,
    maximumFractionDigits: options.max,
  })

  return formatter.format(num)
}
