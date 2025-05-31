'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
  title?: string
  message?: string
  retryLabel?: string
  className?: string
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  retryCount: number
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { 
      hasError: false, 
      retryCount: 0 
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Atualiza o state para mostrar a UI de erro
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Salva informações do erro
    this.setState({ errorInfo })
    
    // Chama callback personalizado se fornecido
    this.props.onError?.(error, errorInfo)
    
    // Log detalhado do erro
    console.group('🚨 ErrorBoundary capturou um erro:')
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
    console.error('Component Stack:', errorInfo.componentStack)
    console.groupEnd()
    
    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: Sentry.captureException(error, { extra: errorInfo })
      this.reportError(error, errorInfo)
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Implementação futura para envio de erros para serviços como Sentry
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount
    }
    
    // TODO: Enviar para serviço de monitoramento
    console.log('📊 Error Report:', errorReport)
  }

  private handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }))
  }

  private handleReload = () => {
    window.location.reload()
  }
  render() {
    if (this.state.hasError) {
      // UI de fallback customizada
      if (this.props.fallback) {
        return this.props.fallback
      }

      const {
        title = "Ops! Algo deu errado",
        message = "Ocorreu um erro inesperado. Por favor, tente novamente.",
        retryLabel = "Tentar Novamente",
        showDetails = process.env.NODE_ENV === 'development',
        className = ""
      } = this.props

      return (
        <div className={`flex flex-col items-center justify-center p-6 bg-red-50 border-2 border-red-200 rounded-lg shadow-lg max-w-md mx-auto ${className}`}>
          {/* Ícone de erro */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Título */}
          <div className="text-red-800 text-xl font-bold mb-2 text-center">
            {title}
          </div>

          {/* Mensagem */}
          <div className="text-red-600 text-sm text-center mb-4 leading-relaxed">
            {message}
          </div>

          {/* Contador de tentativas */}
          {this.state.retryCount > 0 && (
            <div className="text-red-500 text-xs mb-3 bg-red-100 px-2 py-1 rounded">
              Tentativa #{this.state.retryCount + 1}
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              {retryLabel}
            </button>
            
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Recarregar Página
            </button>
          </div>

          {/* Detalhes do erro (apenas em desenvolvimento) */}
          {showDetails && this.state.error && (
            <details className="w-full mt-4 bg-red-100 rounded-lg p-3">
              <summary className="cursor-pointer text-red-700 font-medium text-sm mb-2">
                🔍 Detalhes do Erro (Dev Mode)
              </summary>
              <div className="text-xs text-red-600 font-mono bg-white p-2 rounded border overflow-auto max-h-32">
                <div className="mb-2">
                  <strong>Erro:</strong> {this.state.error.message}
                </div>
                {this.state.error.stack && (
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap text-xs mt-1">{this.state.error.stack}</pre>
                  </div>
                )}
                {this.state.errorInfo?.componentStack && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="whitespace-pre-wrap text-xs mt-1">{this.state.errorInfo.componentStack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Informações de suporte */}
          <div className="text-xs text-red-400 text-center mt-3 opacity-75">
            Se o problema persistir, entre em contato com o suporte
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
