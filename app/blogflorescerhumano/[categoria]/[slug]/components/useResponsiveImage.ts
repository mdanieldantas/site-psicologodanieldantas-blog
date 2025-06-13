/**
 * @fileoverview Hook customizado para gerenciamento inteligente de imagens
 * @description Gerencia carregamento, fallbacks e estados de imagem de forma reativa
 * @author Blog Florescer Humano
 * @since 2025-06-13
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Props para o hook useResponsiveImage
 */
interface UseResponsiveImageProps {
  /** URL da imagem principal */
  src: string;
  /** Slug da categoria para fallback inteligente */
  fallbackCategory?: string;
  /** Callback executado quando imagem carrega com sucesso */
  onLoad?: () => void;
  /** Callback executado quando ocorre erro no carregamento */
  onError?: (error: Event) => void;
}

/**
 * Return type do hook useResponsiveImage
 */
interface UseResponsiveImageReturn {
  /** URL atual da imagem (pode ser fallback) */
  imageSrc: string;
  /** Estado de carregamento */
  isLoading: boolean;
  /** Estado de erro */
  hasError: boolean;
  /** Função para lidar com erro de carregamento */
  handleImageError: () => void;
  /** Função para resetar estado */
  reset: () => void;
}

/**
 * Hook customizado para gerenciamento inteligente de imagens
 * 
 * Funcionalidades:
 * - Preload automático para LCP otimizado
 * - Sistema de fallback em cascata
 * - Estados reativos de loading/error
 * - Type safety completo
 * 
 * @param props - Configurações do hook
 * @returns Estado e funções para gerenciamento da imagem
 * 
 * @example
 * ```tsx
 * const { imageSrc, isLoading, handleImageError } = useResponsiveImage({
 *   src: '/path/to/image.webp',
 *   fallbackCategory: 'psicologia-humanista'
 * });
 * ```
 */
export function useResponsiveImage({
  src,
  fallbackCategory = 'default',
  onLoad,
  onError
}: UseResponsiveImageProps): UseResponsiveImageReturn {
  
  // ✅ Estados reativos
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [fallbackAttempts, setFallbackAttempts] = useState<number>(0);

  /**
   * Função para lidar com erro de carregamento
   * Implementa sistema de fallback em cascata
   */
  const handleImageError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    
    // ✅ Executa callback de erro se fornecido
    if (onError) {
      onError(new Event('image-error'));
    }

    // ✅ Sistema de fallback em cascata
    if (fallbackAttempts === 0 && imageSrc.includes('/images/')) {
      // 🎯 Primeira tentativa: imagem da categoria
      const categoryImageUrl = `/blogflorescerhumano/category-images/categoria-${fallbackCategory}.webp`;
      setImageSrc(categoryImageUrl);
      setFallbackAttempts(1);
      setHasError(false);
      setIsLoading(true);
      
    } else if (fallbackAttempts === 1 && !imageSrc.includes('default-og-image')) {
      // 🎯 Segunda tentativa: fallback final
      setImageSrc('/blogflorescerhumano/images/default-og-image.jpg');
      setFallbackAttempts(2);
      setHasError(false);
      setIsLoading(true);
      
    } else {
      // 🎯 Todas as tentativas esgotadas
      console.warn(`❌ Falha ao carregar imagem após ${fallbackAttempts + 1} tentativas:`, imageSrc);
    }
  }, [imageSrc, fallbackCategory, fallbackAttempts, onError]);

  /**
   * Função para resetar o estado do hook
   * Útil para recarregar imagem ou trocar source
   */
  const reset = useCallback(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
    setFallbackAttempts(0);
  }, [src]);

  /**
   * Effect para preload da imagem
   * Otimiza LCP e detecta erros antes da renderização
   */
  useEffect(() => {
    // ✅ Reset quando src mudar
    if (imageSrc !== src && fallbackAttempts === 0) {
      reset();
      return;
    }

    // ✅ Preload da imagem para otimização
    const img = new Image();
    
    // ✅ Handler de sucesso
    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
      
      // ✅ Executa callback de sucesso se fornecido
      if (onLoad) {
        onLoad();
      }
    };

    // ✅ Handler de erro
    const handleError = () => {
      handleImageError();
    };

    // ✅ Configurar event listeners
    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    
    // ✅ Iniciar preload
    img.src = imageSrc;

    // ✅ Cleanup function
    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [imageSrc, onLoad, handleImageError, src, fallbackAttempts, reset]);

  return {
    imageSrc,
    isLoading,
    hasError,
    handleImageError,
    reset
  };
}

/**
 * Utility function para verificar se uma imagem é válida
 * @param imagePath - Caminho da imagem para verificar
 * @returns true se a imagem é considerada válida
 */
export function isValidImagePath(imagePath: string | null): boolean {
  return Boolean(
    imagePath && 
    !imagePath.includes('sem-imagem') &&
    !imagePath.includes('placeholder') &&
    imagePath.trim() !== ''
  );
}

/**
 * Utility function para extrair categoria do caminho da imagem
 * @param imagePath - Caminho completo da imagem
 * @returns Slug da categoria extraído ou 'default'
 */
export function extractCategoryFromPath(imagePath: string): string {
  try {
    // ✅ Extrair categoria de paths como '/blogflorescerhumano/categoria/imagem.webp'
    const pathParts = imagePath.split('/');
    const categoryIndex = pathParts.findIndex(part => part === 'blogflorescerhumano') + 1;
    
    return pathParts[categoryIndex] || 'default';
  } catch (error) {
    console.warn('⚠️ Erro ao extrair categoria do path:', imagePath, error);
    return 'default';
  }
}
