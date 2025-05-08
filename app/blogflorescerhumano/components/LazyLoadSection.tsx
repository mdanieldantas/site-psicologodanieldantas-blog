'use client';

import { useState, useEffect, useRef } from 'react';
import { useScreenInfo } from '../hooks/use-screen-info';

interface LazyLoadSectionProps {
  children: React.ReactNode;
  threshold?: number;
  mobileOnly?: boolean;
  className?: string;
  placeholder?: React.ReactNode;
  id?: string;
  delay?: number;
}

/**
 * Componente para carregar conteúdo apenas quando estiver próximo da área visível
 * Especialmente útil para seções complexas em dispositivos móveis
 */
export default function LazyLoadSection({
  children,
  threshold = 0.1,
  mobileOnly = true,
  className = '',
  placeholder,
  id,
  delay = 100
}: LazyLoadSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useScreenInfo();

  // Se não for mobile e o componente for apenas para mobile, carregamos imediatamente
  const shouldOptimize = !mobileOnly || (mobileOnly && isMobile);

  useEffect(() => {
    // Se não devemos otimizar, carrega imediatamente
    if (!shouldOptimize) {
      setIsVisible(true);
      setIsLoaded(true);
      return;
    }

    let observerTimeout: ReturnType<typeof setTimeout>;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Pequeno delay para evitar janela de carregamento
          observerTimeout = setTimeout(() => {
            setIsLoaded(true);
            // Desconecta o observer após carregar
            observer.disconnect();
          }, delay);
        }
      },
      {
        root: null, // viewport
        rootMargin: '100px', // carrega um pouco antes de estar visível
        threshold: threshold // percentual de visibilidade para acionar
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (observerTimeout) clearTimeout(observerTimeout);
      observer.disconnect();
    };
  }, [shouldOptimize, threshold, delay]);

  // Altura mínima para o placeholder
  const minHeight = isLoaded ? 'auto' : '100px';

  return (
    <div 
      ref={ref} 
      className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`} 
      style={{ minHeight }}
      id={id}
    >
      {isLoaded ? children : placeholder || <div className="animate-pulse bg-gray-200 h-24 rounded-md w-full" />}
    </div>
  );
}
