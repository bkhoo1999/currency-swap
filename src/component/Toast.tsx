import { cn } from "@/src/util/cn"

interface ToastItem {
    id: string
    message: string
    type?: "success" | "error" | "info"
    visible?: boolean
}

interface ToastsProps {
    toasts: ToastItem[]
    onClose: (id: string) => void
}

const typeColors = {
    success: "bg-success text-white",
    error: "bg-error text-white",
    info: "bg-info text-white",
}

const Toast: React.FC<ToastsProps> = ({ toasts, onClose }) => {
    return (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 w-[90%] sm:w-auto">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "flex justify-between items-center px-4 py-2 rounded-lg shadow-lg min-w-62.5 sm:min-w-75",
                        typeColors[toast.type || "info"],
                        toast.visible ? "toast-fade-in" : "toast-fade-out"
                    )}
                >
                    <span className="text-sm sm:text-base">{toast.message}</span>
                    <button
                        className="ml-4 font-bold text-lg opacity-80 hover:opacity-100"
                        onClick={() => onClose(toast.id)}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Toast