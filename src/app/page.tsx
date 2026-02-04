"use client"

import dynamic from "next/dynamic"
import { ExchangeFormProvider } from "@/src/context/exchangeContext"
import { ToastProvider } from "@/src/context/toastContext"

const ExchangeForm = dynamic(
  () => import("@/src/component/ExchangeForm"),
  {
    ssr: false,
    loading: () => (
      <div className="mt-6 text-primary text-sm animate-pulse">
        Loading exchange form…
      </div>
    ),
  }
)

export default function Home() {
  return (
    <ToastProvider>
      <ExchangeFormProvider>
        <div className="bg-background h-screen w-screen max-w-screen overflow-x-hidden flex flex-col justify-center items-center">
          <div className="h-full flex flex-col items-center justify-center p-3">
            <h1 className="font-bold text-3xl text-primary">Currency Exchange</h1>
            <h3 className="font-extralight text-sm text-primary">Swap with 1% Fees.</h3>
            <ExchangeForm />
          </div>
        </div>
      </ExchangeFormProvider>
    </ToastProvider>
  )
}
