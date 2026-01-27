import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { calculatorResults } from '~/features/calculator/db/schema'
import { calculatorContract } from '~/features/calculator/rpc/contract'
import { implementContract } from '~/rpc/contract'
import { RPCError } from '~/rpc/error'

const contract = implementContract(calculatorContract)

const add = contract.add.handler(({ input }) => {
  const { a, b } = input
  return a + b
})

const subtract = contract.subtract.handler(({ input }) => {
  const { a, b } = input
  return a - b
})

const divide = contract.divide.handler(({ input }) => {
  const { a, b } = input
  return a / b
})

const multiply = contract.multiply.handler(({ input }) => {
  const { a, b } = input
  return a * b
})

const saveResult = contract.saveResult.handler(async ({ input }) => {
  const { a, operation, b, result } = input
  const operationSymbols = new Map<typeof operation, string>([
    ['add', '+'],
    ['subtract', '-'],
    ['divide', '/'],
    ['multiply', '*'],
  ])

  const formula = `${a} ${operationSymbols.get(operation)} ${b} = ${result}`

  const [savedRecord] = await db()
    .insert(calculatorResults)
    .values({
      result,
      formula,
      calculated_at: new Date(),
    })
    .returning()

  if (!savedRecord) {
    throw new RPCError('BAD_REQUEST', {
      message: 'Failed to save the calculation result.',
    })
  }

  return savedRecord
})

const getSavedResults = contract.getSavedResults.handler(async () => {
  return await db().select().from(calculatorResults)
})

const getSavedResult = contract.getSavedResult.handler(async ({ input }) => {
  const { id } = input

  const [foundRecord] = await db()
    .select()
    .from(calculatorResults)
    .where(eq(calculatorResults.id, id))

  if (!foundRecord) {
    throw new RPCError('NOT_FOUND', {
      message: `No saved result found with id: ${id}`,
    })
  }

  return foundRecord
})

export const calculatorRouter = contract.router({
  add,
  subtract,
  divide,
  multiply,
  saveResult,
  getSavedResults,
  getSavedResult,
})
