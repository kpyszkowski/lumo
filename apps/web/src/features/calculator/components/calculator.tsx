'use client'
import { useQueryClient } from '@tanstack/react-query'
import { Save } from '@lumo/ui/icons'
import { createStyles } from '@lumo/ui/utils'
import { useReducer } from 'react'
import { useCalculator } from '~/features/calculator/hooks/use-calculator'
import { useSaveCalculationResult } from '~/features/calculator/hooks/use-save-calculation-result'
import { savedCalculationResultsQueryKey } from '~/features/calculator/hooks/use-saved-calculation-results'
import { formatPrecision } from '~/utils/number'

const calculatorStyles = createStyles({
  slots: {
    container:
      'max-w-64 overflow-hidden rounded-2xl bg-[#1c1c1e] p-3 shadow-lg',
    decoratorWrapper: 'mb-2 flex items-center gap-2',
    decoratorDot: 'size-3 rounded-full',
    display:
      'flex h-20 items-center justify-end overflow-hidden px-2.5 py-5 text-right text-5xl font-light text-ellipsis whitespace-nowrap text-white',
    buttonsWrapper: 'mt-2 grid grid-cols-4 gap-2',
    button:
      'flex size-13 cursor-pointer items-center justify-center rounded-full text-2xl font-normal text-white transition-all',
  },
  variants: {
    buttonVariant: {
      number: {
        button: 'bg-[#333333] hover:bg-[#4D4D4D] active:bg-[#5E5E5E]',
      },
      function: {
        button:
          'row-start-1 bg-[#D4D4D2] text-black hover:bg-[#E5E5E3] active:bg-[#F0F0F0]',
      },
      operation: {
        button:
          'col-start-4 bg-[#ff9f0a] hover:bg-[#FFBD5A] active:bg-[#FFC978]',
      },
    },
  },
})

enum Operation {
  ADD = 'add',
  SUBTRACT = 'subtract',
  MULTIPLY = 'multiply',
  DIVIDE = 'divide',
}

enum CalculatorAction {
  NUMBER = 'NUMBER',
  DECIMAL = 'DECIMAL',
  TOGGLE_SIGN = 'TOGGLE_SIGN',
  PERCENTAGE = 'PERCENTAGE',
  CLEAR = 'CLEAR',
  OPERATION = 'OPERATION',
  SET_RESULT = 'SET_RESULT',
}

type State = {
  display: string
  storedNumber: number | null
  pendingOperation: Operation | null
  waitingForOperand: boolean
  clearAll: boolean
}

type Action =
  | { type: CalculatorAction.NUMBER; payload: number }
  | { type: CalculatorAction.DECIMAL }
  | { type: CalculatorAction.TOGGLE_SIGN }
  | { type: CalculatorAction.PERCENTAGE }
  | { type: CalculatorAction.CLEAR }
  | { type: CalculatorAction.OPERATION; payload: Operation }
  | { type: CalculatorAction.SET_RESULT; payload: number }

const initialState: State = {
  display: '0',
  storedNumber: null,
  pendingOperation: null,
  waitingForOperand: false,
  clearAll: true,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case CalculatorAction.NUMBER: {
      const next = state.waitingForOperand
        ? action.payload
        : state.display === '0'
          ? action.payload
          : state.display + action.payload

      return {
        ...state,
        display: next.toString(),
        waitingForOperand: false,
        clearAll: false,
      }
    }

    case CalculatorAction.DECIMAL:
      if (state.waitingForOperand) {
        return { ...state, display: '0.', waitingForOperand: false }
      }
      if (!state.display.includes('.')) {
        return { ...state, display: `${state.display}.` }
      }
      return state

    case CalculatorAction.TOGGLE_SIGN:
      return { ...state, display: String(parseFloat(state.display) * -1) }

    case CalculatorAction.PERCENTAGE:
      return { ...state, display: String(parseFloat(state.display) / 100) }

    case CalculatorAction.CLEAR:
      if (state.clearAll) return initialState
      return { ...state, display: '0', clearAll: true }

    case CalculatorAction.OPERATION:
      return {
        ...state,
        storedNumber: parseFloat(state.display),
        pendingOperation: action.payload,
        waitingForOperand: true,
      }

    case CalculatorAction.SET_RESULT:
      return {
        ...state,
        display: action.payload.toString(),
      }

    default:
      return state
  }
}

function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const calculator = useCalculator()
  const { saveCalculationResultAsync } = useSaveCalculationResult()
  const queryClient = useQueryClient()
  const styles = calculatorStyles()

  const handleEquals = async () => {
    if (!state.pendingOperation || state.storedNumber === null) return

    const { calculateAsync } = calculator[state.pendingOperation]

    const result = await calculateAsync({
      a: state.storedNumber,
      b: parseFloat(state.display),
    })

    dispatch({ type: CalculatorAction.SET_RESULT, payload: result })
  }

  const handleNumberInput = (input: number) => {
    dispatch({ type: CalculatorAction.NUMBER, payload: input })
  }

  const handleClear = () => {
    dispatch({ type: CalculatorAction.CLEAR })
  }

  const handleToggleSign = () => {
    dispatch({ type: CalculatorAction.TOGGLE_SIGN })
  }

  const handlePercentage = () => {
    dispatch({ type: CalculatorAction.PERCENTAGE })
  }

  const handleDecimal = () => {
    dispatch({ type: CalculatorAction.DECIMAL })
  }

  const handleOperation = (operation: Operation) => {
    dispatch({ type: CalculatorAction.OPERATION, payload: operation })
  }

  const handleSave = async () => {
    if (!state.pendingOperation) return

    const { variables, data: result } = calculator[state.pendingOperation]
    if (!variables || result === undefined) return
    const { a, b } = variables

    await saveCalculationResultAsync(
      { a, b, operation: state.pendingOperation, result: result.toString() },
      {
        onSuccess: (savedResult) => {
          queryClient.setQueryData(savedCalculationResultsQueryKey(), (old) =>
            old ? [...old, savedResult] : [savedResult],
          )
        },
      },
    )
  }

  const numbers = [[7, 8, 9], [4, 5, 6], [1, 2, 3], [0]].flat()

  return (
    <div className={styles.container()}>
      <div className={styles.decoratorWrapper()}>
        <div className={styles.decoratorDot({ className: 'bg-[#ff605c]' })} />
        <div className={styles.decoratorDot({ className: 'bg-[#ffbd44]' })} />
        <div className={styles.decoratorDot({ className: 'bg-[#00ca4e]' })} />
      </div>

      <div className={styles.display()}>
        {formatPrecision(state.display, { max: 4 })}
      </div>

      <div className={styles.buttonsWrapper()}>
        {numbers.map((number) => (
          <button
            className={styles.button({ buttonVariant: 'number' })}
            key={number}
            onClick={() => handleNumberInput(number)}
            type="button"
          >
            {number}
          </button>
        ))}

        <button
          className={styles.button({
            buttonVariant: 'function',
          })}
          onClick={handleClear}
          type="button"
        >
          {state.clearAll ? 'AC' : 'C'}
        </button>
        <button
          className={styles.button({
            buttonVariant: 'function',
          })}
          onClick={handleToggleSign}
          type="button"
        >
          +/-
        </button>
        <button
          className={styles.button({
            buttonVariant: 'function',
          })}
          onClick={handlePercentage}
          type="button"
        >
          %
        </button>
        <button
          className={styles.button({
            buttonVariant: 'operation',
            className: 'row-start-1',
          })}
          onClick={() => handleOperation(Operation.DIVIDE)}
          type="button"
        >
          &divide;
        </button>

        <button
          className={styles.button({
            buttonVariant: 'operation',
            className: 'row-start-2',
          })}
          onClick={() => handleOperation(Operation.MULTIPLY)}
          type="button"
        >
          &times;
        </button>

        <button
          className={styles.button({
            buttonVariant: 'operation',
            className: 'row-start-3',
          })}
          onClick={() => handleOperation(Operation.SUBTRACT)}
          type="button"
        >
          -
        </button>

        <button
          className={styles.button({
            buttonVariant: 'operation',
            className: 'row-start-4',
          })}
          onClick={() => handleOperation(Operation.ADD)}
          type="button"
        >
          +
        </button>

        <button
          className={styles.button({
            buttonVariant: 'number',
          })}
          onClick={handleDecimal}
          type="button"
        >
          ,
        </button>

        <button
          className={styles.button({
            buttonVariant: 'operation',
            className: 'row-start-5',
          })}
          onClick={handleEquals}
          type="button"
        >
          =
        </button>

        <button
          className={styles.button({
            buttonVariant: 'number',
            className: 'col-start-1 row-start-5',
          })}
          type="button"
          onClick={handleSave}
        >
          <Save />
        </button>
      </div>
    </div>
  )
}

export default Calculator
