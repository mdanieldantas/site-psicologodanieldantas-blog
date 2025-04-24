"use client"

import type { ButtonHTMLAttributes, ReactNode } from "react"

interface TouchFriendlyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
}

export default function TouchFriendlyButton({ children, className = "", ...props }: TouchFriendlyButtonProps) {
  return (
    <button className={`min-h-[44px] min-w-[44px] ${className}`} {...props}>
      {children}
    </button>
  )
}

