'use client';

import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface ScreenInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  orientation: 'portrait' | 'landscape';
}

/**
 * Hook para detectar tipo de dispositivo e orientação da tela
 * Útil para otimizações de elementos baseadas no tamanho da tela
 */
export function useScreenInfo(): ScreenInfo {
  // Valores padrão que serão substituídos após a montagem no cliente
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    deviceType: 'desktop',
    orientation: 'landscape',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    function determineDeviceType(width: number): DeviceType {
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    }

    function determineOrientation(width: number, height: number) {
      return width < height ? 'portrait' : 'landscape';
    }

    function updateScreenInfo() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const deviceType = determineDeviceType(width);
      
      setScreenInfo({
        width,
        height,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
        deviceType,
        orientation: determineOrientation(width, height),
      });
    }

    // Atualiza na montagem do componente
    updateScreenInfo();

    // Atualiza quando a janela for redimensionada
    window.addEventListener('resize', updateScreenInfo);
    
    // Adiciona evento de mudança de orientação para dispositivos móveis
    window.addEventListener('orientationchange', updateScreenInfo);

    return () => {
      window.removeEventListener('resize', updateScreenInfo);
      window.removeEventListener('orientationchange', updateScreenInfo);
    };
  }, []);

  return screenInfo;
}

// Componente para aplicar classes CSS baseadas no tamanho da tela
interface ResponsiveWrapperProps {
  children: React.ReactNode;
  mobileClasses?: string;
  tabletClasses?: string;
  desktopClasses?: string;
  className?: string;
}

export function ResponsiveWrapper({ 
  children, 
  mobileClasses = '', 
  tabletClasses = '', 
  desktopClasses = '',
  className = ''
}: ResponsiveWrapperProps) {
  const { deviceType } = useScreenInfo();
  
  let responsiveClasses = className + ' ';
  
  if (deviceType === 'mobile') responsiveClasses += mobileClasses;
  else if (deviceType === 'tablet') responsiveClasses += tabletClasses;
  else responsiveClasses += desktopClasses;
  
  return (
    <div className={responsiveClasses.trim()}>
      {children}
    </div>
  );
}
