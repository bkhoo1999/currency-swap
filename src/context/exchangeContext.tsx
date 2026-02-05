import React, { createContext, useContext, useReducer, useMemo, useEffect, useState, useCallback } from 'react'

import { CurrencyType } from '@/src/type'
import { calculateExchangeAmount } from '@/src/util/calculate'
import { useDebounce } from '@/src/util/debounce'

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

const formatValue = (value: string) => {
  if (value === '.') {
    return '0.'
  }
  return value
}

export const ExchangeFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(exchangeReducer, initialState)

  const [sellInput, setSellInput] = useState<string>(state.sellAmount);
  const [buyInput, setBuyInput] = useState<string>(state.buyAmount);

  const debouncedSell = useDebounce(sellInput, sellInput === '.' ? 0 : 300);
  const debouncedBuy = useDebounce(buyInput, buyInput === '.' ? 0 : 300);

  useEffect(() => {
    if (debouncedSell !== state.sellAmount) {
      dispatch({ type: "SET_SELL_AMOUNT", value: formatValue(debouncedSell) })
    }
    if (debouncedBuy !== state.buyAmount) {
      dispatch({ type: "SET_BUY_AMOUNT", value: formatValue(debouncedBuy) })
    }
  }, [debouncedSell, debouncedBuy])

  useEffect(() => {
    if (sellInput !== state.sellAmount) setSellInput(state.sellAmount);
    if (buyInput !== state.buyAmount) setBuyInput(state.buyAmount);
  }, [state.sellAmount, state.buyAmount])

  const value = useMemo(() => ({
    ...state,
    setBuyAmount: (value: string) => setBuyInput(value),
    setSellAmount: (value: string) => setSellInput(value),
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
