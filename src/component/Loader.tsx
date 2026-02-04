import React from "react"

interface LoadingProps {
  loading?: boolean
  children: React.ReactNode
}

const Loading: React.FC<LoadingProps> = ({ loading = false, children }) => {
  return loading ? (
    <span className="h-5 w-5 py-2 animate-spin rounded-full border-2 border-white/50 border-t-white" />
  ) : (
    children
  )
}

export default Loading