import { cn } from "@/src/util/cn"
import Loading from "./Loader"

interface SubmitButtonProps {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-10 w-40 rounded-xl font-bold flex items-center justify-center transition-colors cursor-pointer',
        'bg-primary text-white',
        'hover:bg-primary-hover',
        isDisabled && 'disabled'
      )}
    >
      <Loading loading={loading}>Exchange</Loading>
    </button>
  )
}

export default SubmitButton