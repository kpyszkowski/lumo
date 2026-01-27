/** biome-ignore-all lint/style/noNonNullAssertion: Some undefined data is required for tests */
import { call } from '@orpc/server'
import { describe, expect, it } from 'vitest'
import { calculatorRouter } from '~/features/calculator/rpc/router'

describe('Calculator RPC procedures', () => {
  let mockRecordId: number

  describe('add', () => {
    it('1 + 2 equals 3', async () => {
      await expect(call(calculatorRouter.add, { a: 1, b: 2 })).resolves.toEqual(
        3,
      )
    })
  })

  describe('substract', () => {
    it('4 - 3 equals 1', async () => {
      await expect(
        call(calculatorRouter.subtract, { a: 4, b: 3 }),
      ).resolves.toEqual(1)
    })
  })

  describe('divide', () => {
    it('10 / 2 equals 5', async () => {
      await expect(
        call(calculatorRouter.divide, { a: 10, b: 2 }),
      ).resolves.toEqual(5)
    })
  })

  describe('multiply', () => {
    it('3 * 4 equals 12', async () => {
      await expect(
        call(calculatorRouter.multiply, { a: 3, b: 4 }),
      ).resolves.toEqual(12)
    })
  })

  describe('saveResult', () => {
    it('saves calculator result to database', async () => {
      const result = await call(calculatorRouter.saveResult, {
        a: 5,
        b: 3,
        operation: 'add',
        result: '8',
      })

      expect(result).toMatchObject({
        result: '8',
        formula: '5 + 3 = 8',
      })

      expect(result!.id).toBeDefined()

      mockRecordId = result!.id
    })
  })

  describe('getSavedResults', () => {
    it('returns all calculator results', async () => {
      const results = await call(calculatorRouter.getSavedResults, {})

      expect(Array.isArray(results)).toBe(true)

      const savedResult = results.find(
        (result) => result.formula === '5 + 3 = 8',
      )

      expect(savedResult).toBeDefined()
      expect(savedResult?.result).toBe('8')
    })
  })

  describe('getSavedResult', () => {
    it('returns selected calculator result', async () => {
      await expect(
        call(calculatorRouter.getSavedResult, {
          id: mockRecordId!,
        }),
      ).resolves.toMatchObject({
        id: mockRecordId,
        result: '8',
        formula: '5 + 3 = 8',
      })
    })

    it('throws error if record is not found', async () => {
      await expect(
        call(calculatorRouter.getSavedResult, { id: 99999 }),
      ).rejects.toThrow('No saved result found with id: 99999')
    })
  })
})
