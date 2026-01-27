import { z } from 'zod'
import { contract } from '~/rpc/contract'

const savedResult = z.object({
  id: z.number(),
  result: z.string(),
  formula: z.string(),
  calculated_at: z.date(),
})

const add = contract
  .input(
    z.object({
      a: z.number(),
      b: z.number(),
    }),
  )
  .output(z.number())

const subtract = contract
  .input(
    z.object({
      a: z.number(),
      b: z.number(),
    }),
  )
  .output(z.number())

const divide = contract
  .input(
    z.object({
      a: z.number(),
      b: z.number().refine((b) => b !== 0, {
        message: 'Division by zero is not allowed',
      }),
    }),
  )
  .output(z.number())

const multiply = contract
  .input(
    z.object({
      a: z.number(),
      b: z.number(),
    }),
  )
  .output(z.number())

const saveResult = contract
  .input(
    z.object({
      result: z.string(),
      a: z.number(),
      b: z.number(),
      operation: z.enum([
        'add',
        'subtract',
        'divide',
        'multiply',
        'power',
        'root',
      ]),
    }),
  )
  .output(savedResult)

const getSavedResults = contract.output(z.array(savedResult))

const getSavedResult = contract
  .input(
    z.object({
      id: z.number(),
    }),
  )
  .output(savedResult)

export const calculatorContract = {
  add,
  subtract,
  divide,
  multiply,
  saveResult,
  getSavedResults,
  getSavedResult,
}

export type CalculatorContract = typeof calculatorContract
