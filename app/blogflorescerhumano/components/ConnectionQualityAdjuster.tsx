'use client';

import { useState, useEffect } from 'react';

type ConnectionType = 'slow' | 'medium' | 'fast' | 'unknown';

// Função para classificar a velocidade da conexão
const getConnectionSpeed = (): ConnectionType => {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
  
  if (!connection) return 'unknown';
  
  // Detecta conexão por tipo
  if (connection.type === 'cellular' && connection.downlink < 1) {
    return 'slow';
  } else if ((connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
    return 'slow';
  } else if (connection.effectiveType === '3g') {
    return 'medium';
  } else if (connection.effectiveType === '4g' || connection.downlink > 5) {
    return 'fast';
  }
  
  return 'medium';
};

// Função para ajustar qualidade com base na velocidade
const adjustQualityBasedOnSpeed = (speed: ConnectionType) => {
  // Aplica ajustes baseados na velocidade da conexão
  if (speed === 'slow') {
    // Reduz qualidade das imagens
    document.documentElement.style.setProperty('--image-quality', 'low');
    document.documentElement.classList.add('reduce-animations');
    document.documentElement.classList.add('reduce-effects');
    
    // Desabilita animações pesadas
    const heavyAnimations = document.querySelectorAll('.heavy-animation, [class*="animate-[sway"], [class*="animate-[breathe"], [class*="animate-[grow"]');
    heavyAnimations.forEach((element) => {
      (element as HTMLElement).style.animation = 'none';
    });
  } else if (speed === 'medium') {
    document.documentElement.style.setProperty('--image-quality', 'medium');
    document.documentElement.classList.add('reduce-effects');
  } else {
    document.documentElement.style.setProperty('--image-quality', 'high');
  }
};

// Hook para monitorar e responder à velocidade da conexão
export function useConnectionQuality() {
  const [connectionSpeed, setConnectionSpeed] = useState<ConnectionType>('unknown');
  
  useEffect(() => {
    // Define a velocidade inicial
    const initialSpeed = getConnectionSpeed();
    setConnectionSpeed(initialSpeed);
    adjustQualityBasedOnSpeed(initialSpeed);
    
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
                      
    // Monitora mudanças na conexão
    if (connection) {
      const updateConnectionStatus = () => {
        const newSpeed = getConnectionSpeed();
        setConnectionSpeed(newSpeed);
        adjustQualityBasedOnSpeed(newSpeed);
      };
      
      connection.addEventListener('change', updateConnectionStatus);
      return () => connection.removeEventListener('change', updateConnectionStatus);
    }
  }, []);
  
  return { connectionSpeed };
}

// Componente para uso em qualquer parte da aplicação
export function ConnectionQualityAdjuster() {
  const { connectionSpeed } = useConnectionQuality();
  
  // Componente invisível que apenas aplica os ajustes
  return null;
}
