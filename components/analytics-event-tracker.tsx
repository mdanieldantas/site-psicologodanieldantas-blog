"use client"

import type React from "react"

import { useEffect, useCallback } from "react"

interface AnalyticsEventTrackerProps {
  children: React.ReactNode
}

export default function AnalyticsEventTracker({ children }: AnalyticsEventTrackerProps) {
  const trackEvent = useCallback((category: string, action: string, label?: string, value?: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }, [])

  useEffect(() => {
    // Rastrear cliques em botões de contato
    const contactButtons = document.querySelectorAll('a[href="#contato"], button[data-contact]')
    const handleContactClick = () => {
      trackEvent("Engagement", "Contact_Button_Click", "Contact Form")
    }

    contactButtons.forEach((button) => {
      button.addEventListener("click", handleContactClick)
    })

    // Rastrear cliques no botão do WhatsApp
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"], button[data-whatsapp]')
    const handleWhatsAppClick = () => {
      trackEvent("Engagement", "WhatsApp_Button_Click", "WhatsApp Contact")
    }

    whatsappButtons.forEach((button) => {
      button.addEventListener("click", handleWhatsAppClick)
    })

    // Rastrear visualizações de seções
    const sections = document.querySelectorAll("section[id]")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("id")
            trackEvent("Engagement", "Section_View", sectionId)
          }
        })
      },
      { threshold: 0.5 },
    )

    sections.forEach((section) => {
      observer.observe(section)
    })

    return () => {
      contactButtons.forEach((button) => {
        button.removeEventListener("click", handleContactClick)
      })
      whatsappButtons.forEach((button) => {
        button.removeEventListener("click", handleWhatsAppClick)
      })
      sections.forEach((section) => {
        observer.unobserve(section)
      })
    }
  }, [trackEvent])

  return <>{children}</>
}

