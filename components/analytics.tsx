"use client"

// import { usePathname, useSearchParams } from "next/navigation" // Não é mais necessário para pageview
// import { useEffect } from "react" // Não é mais necessário para pageview

// A constante GA_TRACKING_ID pode ainda ser útil para outros eventos gtag manuais,
// mas não é mais necessária para o pageview automático via Métricas Otimizadas.
// const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ""

export default function Analytics() {
  // useEffect(() => {
  //   // A lógica de pageview manual foi removida, pois as Métricas Otimizadas do GA4
  //   // com "Alterações na página de acordo com os eventos do histórico de navegação"
  //   // devem cuidar disso automaticamente.

  //   // const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
  //   // if (typeof window !== "undefined" && window.gtag) {
  //   //   window.gtag("event", "page_view", {
  //   //     page_path: url,
  //   //     // send_to: GA_TRACKING_ID, // Opcional
  //   //   })
  //   // } else {
  //   //   // console.warn("window.gtag not available for page_view event. GTM might not be loaded yet or configured to expose gtag.");
  //   // }
  // }, [pathname, searchParams])

  // Este componente agora não precisa fazer nada ativamente para pageviews,
  // pois o GTM carrega o GA4, e as Métricas Otimizadas do GA4 cuidam dos pageviews.
  // Ele ainda pode ser útil se você adicionar outros tipos de rastreamento aqui no futuro.
  return null
}