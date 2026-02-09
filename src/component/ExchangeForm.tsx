import { useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/src/util/cn'
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

    const [loading, setLoading] = useState<boolean>(false)

    const shouldDisableSubmit = !buyAmount || !sellAmount

    const onSubmit = async () => {
        setLoading(true)

        const message = `Success! ${sellAmount} ${sellCurrency} to ${buyAmount} ${buyCurrency}`
        const exchangePromise = new Promise((resolve) => setTimeout(resolve, 3000))

        try {
            toast.promise(exchangePromise, {
                loading: 'Processing exchange…',
                success: message,
                error: 'Failed!',
            })

            await exchangePromise
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