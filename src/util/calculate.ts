import { EXCHANGE_RATES } from "@/src/data"
import { ConversionDirection, CurrencyType } from "@/src/type"

const FEE_RATE = 0.01

export const calculateExchangeAmount = (
    amount: string,
    from: CurrencyType,
    to: CurrencyType,
    direction: ConversionDirection
): string => {
    if (!amount) return ''

    const numericAmount = Number(amount)
    if (isNaN(numericAmount)) return ''
    if (numericAmount === 0) return ''

    const rateFrom = EXCHANGE_RATES[from]
    const rateTo = EXCHANGE_RATES[to]

    let result: number

    if (direction === 'FORWARD') {
        const effectiveSell = numericAmount * (1 - FEE_RATE)
        result = (effectiveSell / rateFrom) * rateTo
    } else {
        const sellAmountBeforeFee = (numericAmount / rateTo) * rateFrom
        result = sellAmountBeforeFee / (1 - FEE_RATE)
    }

    return formatNumber(result, 6)
}

export const calculateExchangeRate = (
    from: CurrencyType,
    to: CurrencyType,
): string => {
    const fromRate = EXCHANGE_RATES[from]
    const toRate = EXCHANGE_RATES[to]
    return formatNumber((toRate / fromRate), 6)
}

const formatNumber = (value: number, decimalPlace: number) => {
    return value.toFixed(decimalPlace).replace(/\.?0+$/, '')
}