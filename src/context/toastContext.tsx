import React, { createContext, useContext, useState, useCallback } from "react"
import Toast from "@/src/component/Toast"

interface Toast {
    id: string
    message: string
    type?: "success" | "error" | "info" 
}

interface ToastContextValue {
    addToast: (message: string, type?: Toast["type"]) => void
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error("useToast must be used within a ToastProvider")
    return ctx
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
        const id = crypto.randomUUID()
        setToasts((prev) => [...prev, { id, message, type, visible: true }])

        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
            )
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id))
            }, 300)
        }, 2000)
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
        )
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 300)
    }, [])

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <Toast toasts={toasts} onClose={removeToast} />
        </ToastContext.Provider>
    )
}