import { NumericFormat } from "react-number-format"

import { EXCHANGE_RATES } from "@/src/data"
import { CurrencyType } from "@/src/type"
import { cn } from "@/src/util/cn"

interface ExchangeInputProps {
    title: string
    amountValue: string
    currencyValue: CurrencyType
    onAmountChange: (value: string) => void
    onCurrencySelect: (value: CurrencyType) => void
}

const ExchangeInput: React.FC<ExchangeInputProps> =
    ({ title, onCurrencySelect, onAmountChange, amountValue, currencyValue }) => {
        return (
            <div
                id="exchange-input"
                className={cn(
                    'border border-transparent bg-background-secondary rounded-xl transition-all',
                    'py-3 px-4 flex flex-col gap-y-2',
                    'group rounded-xl focus-within:border-primary',
                )}
            >
                <div className="flex justify-between items-center text-xs text-primary">
                    {title}
                </div>
                <div className="flex">
                    <div>
                        <select
                            value={currencyValue}
                            onChange={(e) => onCurrencySelect(e.target.value as CurrencyType)} className="w-20 h-10 text-white font-semibold bg-transparent cursor-pointer rounded-lg text-lg">
                            {Object.keys(EXCHANGE_RATES).map((key) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col items-end w-full">
                        <NumericFormat
                            value={amountValue}
                            allowNegative={false}
                            valueIsNumericString
                            inputMode='decimal'
                            onChange={(e) => onAmountChange(e.target.value)}
                            placeholder='0.00'
                            className={cn(
                                'w-full h-10 bg-transparent text-white text-right font-semibold text-2xl placeholder:text-primary-text/50',
                            )}
                        />
                    </div>
                </div>
            </div>
        )
    }

export default ExchangeInput