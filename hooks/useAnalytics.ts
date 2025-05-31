'use client'

import { useCallback } from 'react'

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
}

interface AnalyticsUserProperties {
  userId?: string
  email?: string
  name?: string
  [key: string]: any
}

/**
 * Hook personalizado para analytics e tracking
 * Integra com Google Analytics, Mixpanel, Amplitude, etc.
 * 
 * @example
 * const { trackEvent, identifyUser, trackPageView } = useAnalytics()
 * 
 * // Tracking de eventos
 * trackEvent('button_click', { 
 *   buttonId: 'newsletter',
 *   location: 'header'
 * })
 * 
 * // Identificar usuário
 * identifyUser({ userId: '123', email: 'user@example.com' })
 */
export const useAnalytics = () => {
  const trackEvent = useCallback((event: string, properties?: Record<string, any>) => {
    try {
      // Log para desenvolvimento
      console.group(`📊 Analytics Event: ${event}`)
      if (properties) {
        console.table(properties)
      }
      console.groupEnd()

      // Google Analytics 4 (gtag)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event, {
          custom_parameters: properties,
          ...properties
        })
      }

      // Google Tag Manager
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: event,
          ...properties
        })
      }

      // Facebook Pixel
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('trackCustom', event, properties)
      }

      // Mixpanel
      if (typeof window !== 'undefined' && (window as any).mixpanel) {
        (window as any).mixpanel.track(event, properties)
      }

      // Amplitude
      if (typeof window !== 'undefined' && (window as any).amplitude) {
        (window as any).amplitude.track(event, properties)
      }

      // Hotjar
      if (typeof window !== 'undefined' && (window as any).hj) {
        (window as any).hj('event', event)
      }

    } catch (error) {
      console.error('Erro ao enviar evento de analytics:', error)
    }
  }, [])

  const trackPageView = useCallback((page: string, title?: string) => {
    try {
      console.log(`📄 Page View: ${page}`)

      // Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
          page_title: title,
          page_location: window.location.href,
          page_path: page
        })
      }

      // Google Tag Manager
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'page_view',
          page_path: page,
          page_title: title
        })
      }

    } catch (error) {
      console.error('Erro ao enviar page view:', error)
    }
  }, [])

  const identifyUser = useCallback((userProperties: AnalyticsUserProperties) => {
    try {
      console.group('👤 User Identified')
      console.table(userProperties)
      console.groupEnd()

      // Google Analytics 4 - User ID
      if (userProperties.userId && typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
          user_id: userProperties.userId
        })
      }

      // Mixpanel
      if (typeof window !== 'undefined' && (window as any).mixpanel) {
        if (userProperties.userId) {
          (window as any).mixpanel.identify(userProperties.userId)
        }
        (window as any).mixpanel.people.set(userProperties)
      }

      // Amplitude
      if (typeof window !== 'undefined' && (window as any).amplitude) {
        if (userProperties.userId) {
          (window as any).amplitude.setUserId(userProperties.userId)
        }
        (window as any).amplitude.setUserProperties(userProperties)
      }

      // Hotjar
      if (typeof window !== 'undefined' && (window as any).hj) {
        (window as any).hj('identify', userProperties.userId, userProperties)
      }

    } catch (error) {
      console.error('Erro ao identificar usuário:', error)
    }
  }, [])

  const trackConversion = useCallback((conversionEvent: string, value?: number, currency = 'BRL') => {
    try {
      console.log(`💰 Conversion: ${conversionEvent}`, { value, currency })

      // Google Analytics 4 - Enhanced Ecommerce
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          send_to: process.env.NEXT_PUBLIC_GA_CONVERSION_ID,
          value: value,
          currency: currency,
          transaction_id: Date.now().toString()
        })
      }

      // Facebook Pixel - Conversion
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Purchase', {
          value: value,
          currency: currency
        })
      }

      // Track como evento normal também
      trackEvent(conversionEvent, { value, currency })

    } catch (error) {
      console.error('Erro ao rastrear conversão:', error)
    }
  }, [trackEvent])

  const trackError = useCallback((error: Error, context?: string) => {
    try {
      const errorData = {
        error_message: error.message,
        error_stack: error.stack,
        context: context,
        url: typeof window !== 'undefined' ? window.location.href : '',
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : '',
        timestamp: new Date().toISOString()
      }

      console.group('🚨 Error Tracked')
      console.table(errorData)
      console.groupEnd()

      // Track como evento
      trackEvent('error_occurred', errorData)

      // Google Analytics 4 - Exception
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: error.message,
          fatal: false
        })
      }

    } catch (trackingError) {
      console.error('Erro ao rastrear erro:', trackingError)
    }
  }, [trackEvent])

  return {
    trackEvent,
    trackPageView,
    identifyUser,
    trackConversion,
    trackError
  }
}
