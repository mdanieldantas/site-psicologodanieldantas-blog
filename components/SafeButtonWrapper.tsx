'use client'

import React, { ReactNode } from 'react'
import ErrorBoundary from '../app/blogflorescerhumano/components/ErrorBoundary'
import { useErrorHandler } from '../hooks/useErrorHandler'

interface SafeButtonWrapperProps {
  children: ReactNode
  fallbackMessage?: string
  showRetry?: boolean
  onError?: (error: Error) => void
  className?: string
}

/**
 * Wrapper seguro para componentes de botão
 * Automaticamente envolve componentes com ErrorBoundary
 * 
 * @example
 * <SafeButtonWrapper fallbackMessage="Erro no botão de contato">
 *   <ButtonBlog variant="primary" autoShare={{ title: "Blog" }}>
 *     Compartilhar
 *   </ButtonBlog>
 * </SafeButtonWrapper>
 */
const SafeButtonWrapper: React.FC<SafeButtonWrapperProps> = ({
  children,
  fallbackMessage = "Erro no componente do botão",
  showRetry = true,
  onError,
  className
}) => {
  const handleError = useErrorHandler({
    onError,
    reportToService: true
  })

  const customFallback = (
    <div className={`inline-flex ${className || ''}`}>
      <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 text-sm">
        ⚠️ {fallbackMessage}
      </div>
    </div>
  )

  return (
    <ErrorBoundary
      fallback={showRetry ? undefined : customFallback}
      onError={(error, errorInfo) => {
        handleError(error, 'SafeButtonWrapper')
      }}
      message={fallbackMessage}
      className={className}
    >
      {children}
    </ErrorBoundary>
  )
}

export default SafeButtonWrapper
