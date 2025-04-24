"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simula um pequeno atraso para evitar flash de conteúdo
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`relative ${className || ""}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
        priority={priority}
        fill={fill}
        loading={priority ? "eager" : "lazy"}
        sizes={fill ? "(max-width: 768px) 100vw, 50vw" : undefined}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}

