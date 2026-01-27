import { useMutation } from '@tanstack/react-query'
import { rpc } from '~/rpc/client'
import { createRenameMutate } from '~/utils/query'

const renameMutateToCalculate = createRenameMutate('calculate')

/**
 * Hook providing calculation operations.
 * @returns Collection of calculation mutations.
 */
export function useCalculator() {
  const add = useMutation(rpc.calculator.add.mutationOptions())
  const subtract = useMutation(rpc.calculator.subtract.mutationOptions())
  const divide = useMutation(rpc.calculator.divide.mutationOptions())
  const multiply = useMutation(rpc.calculator.multiply.mutationOptions())

  return {
    add: renameMutateToCalculate(add),
    subtract: renameMutateToCalculate(subtract),
    divide: renameMutateToCalculate(divide),
    multiply: renameMutateToCalculate(multiply),
  }
}
