import { useMutation } from '@tanstack/react-query'
import { rpc } from '~/rpc/client'
import { renameMutate } from '~/utils/query'

type Options = Parameters<typeof rpc.calculator.saveResult.mutationOptions>

/**
 * Hook providing calculation result saving operation.
 * @returns Mutation for saving calculation results.
 */
export function useSaveCalculationResult(options: Options = []) {
  return renameMutate(
    useMutation(rpc.calculator.saveResult.mutationOptions(...options)),
    'saveCalculationResult',
  )
}
