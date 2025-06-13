/**
 * @fileoverview Componente de imagem simples que replica o comportamento HTML do Supabase
 * @description Implementação limpa baseada no HTML que funciona perfeitamente
 * @author Blog Florescer Humano
 * @since 2025-06-13
 */

'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

/**
 * Props para o componente SimpleResponsiveImage
 */
interface SimpleResponsiveImageProps {
  /** URL da imagem principal */
  src: string;
  /** Texto alternativo para acessibilidade */
  alt: string;
  /** Se a imagem deve ter carregamento prioritário */
  priority?: boolean;
  /** Classes CSS adicionais */
  className?: string;
  /** Slug da categoria para fallback */
  categorySlug?: string;  /** Sizes para responsividade */
  sizes?: string;
  /** Border radius (padrão: 8px igual ao HTML do Supabase) */
  borderRadius?: string;
}

/**
 * Componente que replica EXATAMENTE o comportamento do HTML do Supabase
 * 
 * Baseado em:
 * <img src="..." style="width: 100%; height: auto; border-radius: 8px;">
 * 
 * ✅ Sem AspectRatio forçado
 * ✅ Altura automática baseada na imagem
 * ✅ Não corta a imagem
 */
export default function SimpleResponsiveImage({
  src,
  alt,
  priority = true,
  className = '',
  categorySlug = 'default',
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw",
  borderRadius = '8px'              // 🎯 Padrão com bordas arredondadas como no HTML do Supabase
}: SimpleResponsiveImageProps) {
  
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // ✅ Fallback simples
  const handleError = () => {
    if (imageSrc.includes('/images/') && !imageSrc.includes('categoria-')) {
      setImageSrc(`/blogflorescerhumano/category-images/categoria-${categorySlug}.webp`);
    } else if (!imageSrc.includes('default-og-image')) {
      setImageSrc('/blogflorescerhumano/images/default-og-image.jpg');
    }
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <div className={cn('w-full', className)}>
      {/* ✅ Container simples - SEM AspectRatio forçado */}
      <div className="relative w-full">
        
        {/* ✅ Loading skeleton simples */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse min-h-[200px] w-full" 
               style={{ borderRadius }} />
        )}
        
        {/* ✅ Imagem EXATAMENTE como no HTML do Supabase */}
        <Image
          src={imageSrc}
          alt={alt}
          width={1200}                      // ✅ Largura base para cálculo
          height={0}                        // ✅ Altura 0 = deixa automático
          priority={priority}
          sizes={sizes}
          className={cn(
            'w-full h-auto',                // ✅ IGUAL ao HTML: width: 100%, height: auto
            isLoading ? 'opacity-0' : 'opacity-100',
            'transition-opacity duration-300'
          )}
          onError={handleError}
          onLoad={handleLoad}
          style={{
            // ✅ REPLICANDO exatamente o CSS do Supabase
            width: '100%',
            height: 'auto',                 // ✅ A CHAVE! Igual ao HTML
            borderRadius,                   // ✅ Configurável
            display: 'block'
          }}
          quality={90}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        
        {/* ✅ Erro para debug (desenvolvimento) */}
        {hasError && process.env.NODE_ENV === 'development' && (
          <div className="mt-2 text-xs text-red-600">
            ⚠️ Fallback aplicado
          </div>
        )}
      </div>
    </div>
  );
}
