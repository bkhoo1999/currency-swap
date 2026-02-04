import { useState } from "react"
import { cn } from "@/src/util/cn"

interface SwapButtonProps {
  onClick: () => void
}

const SwapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    width="24"
    height="24"
    fill="#FFFFFF"
    className="rotate-90"
  >
    <path d="M847.9 592H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h605.2L612.9 851c-4.1 5.2-.4 13 6.3 13h72.5c4.9 0 9.5-2.2 12.6-6.1l168.8-214.1c16.5-21 1.6-51.8-25.2-51.8M872 356H266.8l144.3-183c4.1-5.2.4-13-6.3-13h-72.5c-4.9 0-9.5 2.2-12.6 6.1L150.9 380.2c-16.5 21-1.6 51.8 25.1 51.8h696c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8" />
  </svg>
)

const SwapButton: React.FC<SwapButtonProps> = ({ onClick }) => {
  const [isSpinning, setIsSpinning] = useState(false)

  const handleClick = () => {
    if (isSpinning) return // prevent double-spin
    setIsSpinning(true)
    onClick()
  }

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={handleClick}
        onTransitionEnd={() => setIsSpinning(false)}
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center",
          "bg-background border-[3.5px] border-background",
          "cursor-pointer select-none",
          "transition-transform duration-300 ease-in-out",
          "hover:scale-110 hover:shadow-lg",
          isSpinning && "rotate-180"
        )}
      >
        <SwapIcon />
      </button>
    </div>
  )
}

export default SwapButton
