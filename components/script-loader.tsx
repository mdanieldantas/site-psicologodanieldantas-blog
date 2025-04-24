"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

interface ScriptLoaderProps {
  src: string
  id?: string
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload"
  onLoad?: () => void
}

export default function ScriptLoader({ src, id, strategy = "lazyOnload", onLoad }: ScriptLoaderProps) {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Verifica se o usuário interagiu com a página
    const handleInteraction = () => {
      setShouldLoad(true)
      // Remove os event listeners após a primeira interação
      window.removeEventListener("scroll", handleInteraction)
      window.removeEventListener("mousemove", handleInteraction)
      window.removeEventListener("touchstart", handleInteraction)
    }

    // Adiciona event listeners para detectar interação
    window.addEventListener("scroll", handleInteraction, { passive: true })
    window.addEventListener("mousemove", handleInteraction, { passive: true })
    window.addEventListener("touchstart", handleInteraction, { passive: true })

    // Carrega o script após 3 segundos mesmo sem interação
    const timer = setTimeout(() => {
      setShouldLoad(true)
    }, 3000)

    return () => {
      window.removeEventListener("scroll", handleInteraction)
      window.removeEventListener("mousemove", handleInteraction)
      window.removeEventListener("touchstart", handleInteraction)
      clearTimeout(timer)
    }
  }, [])

  if (!shouldLoad) return null

  return <Script src={src} id={id} strategy={strategy} onLoad={onLoad} />
}

