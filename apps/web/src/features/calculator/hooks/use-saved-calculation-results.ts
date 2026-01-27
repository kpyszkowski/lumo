import { useQuery } from '@tanstack/react-query'
import { rpc } from '~/rpc/client'

type Options = Parameters<typeof rpc.calculator.getSavedResults.queryOptions>

/**
 * Hook providing calculation result saving operation.
 * @returns Mutation for saving calculation results.
 */
export function useSavedCalculationResults(options: Options = []) {
  return useQuery(rpc.calculator.getSavedResults.queryOptions(...options))
}

export const savedCalculationResultsQueryKey =
  rpc.calculator.getSavedResults.queryKey
