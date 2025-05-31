'use client'

import { useCallback } from 'react'

interface ErrorHandlerOptions {
  onError?: (error: Error) => void
  reportToService?: boolean
}

/**
 * Hook personalizado para tratamento de erros
 * 
 * @example
 * const handleError = useErrorHandler({
 *   onError: (error) => console.log('Custom handler:', error),
 *   reportToService: true
 * })
 * 
 * // Uso em componentes
 * try {
 *   await riskyOperation()
 * } catch (error) {
 *   handleError(error)
 * }
 */
export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const { onError, reportToService = false } = options

  const handleError = useCallback((error: Error, context?: string) => {
    // Log local do erro
    console.group(`🚨 Erro capturado ${context ? `em ${context}` : ''}`)
    console.error('Error:', error)
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)
    console.groupEnd()

    // Callback personalizado
    onError?.(error)

    // Reportar para serviço se habilitado
    if (reportToService && process.env.NODE_ENV === 'production') {
      reportError(error, context)
    }
  }, [onError, reportToService])

  return handleError
}

/**
 * Função para reportar erros para serviços de monitoramento
 */
const reportError = async (error: Error, context?: string) => {
  try {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      context: context || 'unknown',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: getUserId(), // Implementar conforme necessário
    }

    // TODO: Implementar integração com serviços como:
    // - Sentry
    // - LogRocket
    // - Bugsnag
    // - Custom API endpoint
    
    console.log('📊 Erro reportado:', errorReport)
    
    // Exemplo de envio para API personalizada:
    // await fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport)
    // })
    
  } catch (reportingError) {
    console.error('Falha ao reportar erro:', reportingError)
  }
}

/**
 * Função para obter ID do usuário (implementar conforme necessário)
 */
const getUserId = (): string | null => {
  // TODO: Implementar lógica de identificação do usuário
  // Pode ser localStorage, cookies, contexto de autenticação, etc.
  return localStorage.getItem('userId') || null
}

/**
 * Hook para capturar erros assíncronos globais
 */
export const useGlobalErrorHandler = () => {
  const handleError = useErrorHandler({ reportToService: true })

  // Captura erros não tratados
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      handleError(new Error(event.message), 'Global Error')
    })

    window.addEventListener('unhandledrejection', (event) => {
      handleError(new Error(event.reason), 'Unhandled Promise')
    })
  }

  return handleError
}
