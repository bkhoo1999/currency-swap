import { useMemo } from "react"

import { CurrencyType } from "@/src/type"
import { calculateExchangeRate } from "@/src/util/calculate"

interface RateInfoProps {
    toCurrency: CurrencyType
    fromCurrency: CurrencyType
}

const RateInfo:React.FC<RateInfoProps> = ({
    toCurrency, fromCurrency
}) => {
    const exchangeRate = useMemo(() => calculateExchangeRate(toCurrency, fromCurrency), [toCurrency, fromCurrency])
    return (
        <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-primary">
                Current Rate
            </span>
            <span className="text-sm font-extralight text-white/60">
                1 {toCurrency} = {`${exchangeRate} ${fromCurrency}`}
            </span>
        </div>
    )
}

export default RateInfo
