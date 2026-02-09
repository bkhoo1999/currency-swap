import React, { createContext, useContext, useReducer, useMemo } from 'react'

import { CurrencyType } from '@/src/type'
import { calculateExchangeAmount } from '@/src/util/calculate'
import debounce from 'lodash/debounce'

interface ExchangeState {
  buyAmount: string
  sellAmount: string
  buyCurrency: CurrencyType
  sellCurrency: CurrencyType
}

type ExchangeAction =
  | { type: 'SET_BUY_AMOUNT'; value: string }
  | { type: 'SET_SELL_AMOUNT'; value: string }
  | { type: 'SET_BUY_CURRENCY'; value: CurrencyType }
  | { type: 'SET_SELL_CURRENCY'; value: CurrencyType }
  | { type: 'SWAP_CURRENCIES' }
  | { type: 'SUBMIT_FORM' }

const initialState: ExchangeState = {
  buyAmount: '',
  sellAmount: '',
  buyCurrency: 'MYR',
  sellCurrency: 'USD',
}

const recalculate = (
  sellAmount: string,
  sellCurrency: CurrencyType,
  buyCurrency: CurrencyType
) =>
  sellAmount
    ? calculateExchangeAmount(
      sellAmount,
      sellCurrency,
      buyCurrency,
      'FORWARD'
    )
    : ''

const swapCurrencies = (state: ExchangeState, amount: string): ExchangeState => {
  const sellCurrency = state.buyCurrency
  const buyCurrency = state.sellCurrency
  return {
    ...state,
    sellCurrency,
    buyCurrency,
    sellAmount: amount,
    buyAmount: recalculate(
      amount,
      sellCurrency,
      buyCurrency
    ),
  }
}

const exchangeReducer = (state: ExchangeState, action: ExchangeAction): ExchangeState => {
  switch (action.type) {
    case 'SET_SELL_AMOUNT':
      if (action.value === null) return { ...state, buyAmount: '', sellAmount: '' }
      return {
        ...state,
        sellAmount: action.value,
        buyAmount: recalculate(action.value, state.sellCurrency, state.buyCurrency)
      }

    case 'SET_BUY_AMOUNT':
      if (action.value === null) return { ...state, buyAmount: '', sellAmount: '' }
      return {
        ...state,
        buyAmount: action.value,
        sellAmount: calculateExchangeAmount(
          action.value,
          state.sellCurrency,
          state.buyCurrency,
          'REVERSE'
        ),
      }

    case 'SET_SELL_CURRENCY': {
      if (action.value === state.buyCurrency) {
        return swapCurrencies(state, state.sellAmount)
      }

      const sellCurrency = action.value
      return {
        ...state,
        sellCurrency,
        buyAmount: recalculate(state.sellAmount, sellCurrency, state.buyCurrency)
      }
    }

    case 'SET_BUY_CURRENCY': {
      if (action.value === state.sellCurrency) {
        return swapCurrencies(state, state.sellAmount)
      }

      const buyCurrency = action.value
      return {
        ...state,
        buyCurrency,
        buyAmount: recalculate(state.sellAmount, state.sellCurrency, buyCurrency)
      }
    }

    case 'SWAP_CURRENCIES': {
      return swapCurrencies(state, state.buyAmount)
    }

    case 'SUBMIT_FORM': {
      return initialState
    }

    default:
      return state
  }
}

interface ExchangeFormContextValue extends ExchangeState {
  setBuyAmount: (amount: string) => void
  setSellAmount: (amount: string) => void
  setBuyCurrency: (currency: CurrencyType) => void
  setSellCurrency: (currency: CurrencyType) => void
  swapCurrencies: () => void
  submitForm: () => void
}

const ExchangeFormContext = createContext<ExchangeFormContextValue | null>(null)

export const ExchangeFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(exchangeReducer, initialState)

  const debouncedSetSellAmount = useMemo(
    () =>
      debounce((value: string) => {
        dispatch({ type: 'SET_SELL_AMOUNT', value })
      }, 300),
    [dispatch]
  )

  const debouncedSetBuyAmount = useMemo(
    () =>
      debounce((value: string) => {
        dispatch({ type: 'SET_BUY_AMOUNT', value })
      }, 300),
    [dispatch]
  )

  const value = useMemo(() => ({
    ...state,
    setSellAmount: (value: string) => {
      if (value === '.') {
        dispatch({ type: 'SET_SELL_AMOUNT', value: '0.' })
        return
      }
      debouncedSetSellAmount(value)
    },
    setBuyAmount: (value: string) => {
      if (value === '.') {
        dispatch({ type: 'SET_BUY_AMOUNT', value: '0.' })
        return
      }
      debouncedSetBuyAmount(value)
    },
    setBuyCurrency: (value: CurrencyType) => dispatch({ type: 'SET_BUY_CURRENCY', value }),
    setSellCurrency: (value: CurrencyType) => dispatch({ type: 'SET_SELL_CURRENCY', value }),
    swapCurrencies: () => dispatch({ type: 'SWAP_CURRENCIES' }),
    submitForm: () => dispatch({ type: 'SUBMIT_FORM' }),
  }), [state])

  return <ExchangeFormContext.Provider value={value}>{children}</ExchangeFormContext.Provider>
}

export const useExchangeForm = () => {
  const ctx = useContext(ExchangeFormContext)
  if (!ctx) throw new Error('useExchangeForm must be used within ExchangeFormProvider')
  return ctx
}
