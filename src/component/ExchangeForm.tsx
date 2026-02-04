import { useState } from 'react'

import { cn } from '@/src/util/cn'
import { useToast } from '@/src/context/toastContext'
import { useExchangeForm } from '@/src/context/exchangeContext'

import SwapButton from "./SwapButton"
import RateInfo from "./RateInfo"
import ExchangeInput from './ExchangeInput'
import SubmitButton from './SubmitButton'

const ExchangeForm = () => {
    const {
        buyAmount,
        sellAmount,
        buyCurrency,
        sellCurrency,
        setBuyAmount,
        setSellAmount,
        setBuyCurrency,
        setSellCurrency,
        swapCurrencies,
        submitForm
    } = useExchangeForm()

    const { addToast } = useToast()

    const shouldDisableSubmit = !buyAmount || !sellAmount
    const [loading, setLoading] = useState<boolean>(false)

    const onSubmit = async () => {
        setLoading(true)
        const message =
            `Success! ${sellAmount} ${sellCurrency} to ${buyAmount} ${buyCurrency}`
        try {
            await new Promise((resolve) => setTimeout(resolve, 3000))
            addToast(message, "success")
        } catch (err) {
            addToast("Failed!", "error")
        } finally {
            setLoading(false)
            submitForm()
        }
    }

    return (
        <div className="w-full mt-6 rounded-xl flex flex-col px-2">
            <div className={cn(
                "flex-col",
                loading && 'disabled'
            )}>
                <ExchangeInput
                    title='Sell'
                    onAmountChange={setSellAmount}
                    onCurrencySelect={setSellCurrency}
                    amountValue={sellAmount}
                    currencyValue={sellCurrency}
                />

                <div className="relative z-10 -my-3.5 flex justify-center">
                    <SwapButton onClick={swapCurrencies} />
                </div>

                <ExchangeInput
                    title='Buy'
                    onAmountChange={setBuyAmount}
                    onCurrencySelect={setBuyCurrency}
                    amountValue={buyAmount}
                    currencyValue={buyCurrency}
                />
            </div>

            <div className="flex flex-row items-center gap-3 justify-between mt-7">
                <RateInfo toCurrency={sellCurrency} fromCurrency={buyCurrency} />
                <SubmitButton disabled={shouldDisableSubmit} loading={loading} onClick={onSubmit} />
            </div>
        </div>
    )
}

export default ExchangeForm