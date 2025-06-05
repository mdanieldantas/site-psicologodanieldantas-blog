"use client"

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface UniversalOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export default function UniversalOptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  style,
  onLoad,
  onError,
  loading = 'lazy',
  fetchPriority = 'auto',
  ...props
}: UniversalOptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Se priority=true, carrega imediatamente
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para lazy loading otimizado
  useEffect(() => {
    if (priority || isInView) return; // Não aplicar se já está carregando

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px', // Carregar quando estiver 100px antes de aparecer
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority, isInView]);

  // Gerar placeholder blur automático
  const generateBlurDataURL = (w: number = 10, h: number = 10) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Criar um gradient simples como placeholder
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(1, '#e5e7eb');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }
    
    return canvas.toDataURL();
  };

  // Determinar sizes responsivo automático se não fornecido
  const responsiveSizes = sizes || `
    (max-width: 640px) 100vw,
    (max-width: 768px) 50vw,
    (max-width: 1024px) 33vw,
    25vw
  `;

  // Handler para carregamento
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handler para erro
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Otimizações de formato de imagem
  const getOptimizedSrc = (originalSrc: string) => {
    // Se for uma URL externa, retornar como está
    if (originalSrc.startsWith('http')) {
      return originalSrc;
    }
    
    // Para imagens locais, garantir que use WebP quando possível
    if (!originalSrc.includes('.webp') && !originalSrc.includes('.svg')) {
      const extension = originalSrc.split('.').pop();
      if (extension && ['jpg', 'jpeg', 'png'].includes(extension.toLowerCase())) {
        return originalSrc.replace(`.${extension}`, '.webp');
      }
    }
    
    return originalSrc;
  };

  // Estilo do container
  const containerStyle: React.CSSProperties = {
    position: fill ? 'relative' : undefined,
    overflow: 'hidden',
    ...style,
  };

  // Classes CSS para transições e estados
  const imageClasses = `
    ${className}
    ${isLoaded ? 'opacity-100' : 'opacity-0'}
    transition-opacity duration-300 ease-in-out
    ${hasError ? 'bg-gray-200' : ''}
  `.trim();

  // Placeholder enquanto não carrega
  if (!isInView && !priority) {
    return (
      <div
        ref={imgRef}
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          ...containerStyle,
        }}
        aria-label={`Loading ${alt}`}
      />
    );
  }

  // Imagem com erro
  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          ...containerStyle,
        }}
      >
        <span className="text-gray-500 text-xs">
          Erro ao carregar imagem
        </span>
      </div>
    );
  }

  // Configurações da imagem Next.js otimizada
  const imageProps = {
    src: getOptimizedSrc(src),
    alt,
    className: imageClasses,
    priority,
    quality,
    onLoad: handleLoad,
    onError: handleError,
    sizes: fill ? responsiveSizes : undefined,
    placeholder: placeholder as 'blur' | 'empty',
    blurDataURL: blurDataURL || (placeholder === 'blur' ? generateBlurDataURL() : undefined),
    ...props,
  };

  return (
    <div ref={imgRef} style={containerStyle}>
      {fill ? (
        <Image
          {...imageProps}
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      ) : (
        width && height && (
          <Image
            {...imageProps}
            width={width}
            height={height}
          />
        )
      )}
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{
            width: fill ? '100%' : width,
            height: fill ? '100%' : height,
          }}
        >
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// Componente para imagens de hero/banner otimizadas
export function HeroOptimizedImage({ 
  src, 
  alt, 
  className = '',
  ...props 
}: Omit<UniversalOptimizedImageProps, 'priority' | 'loading' | 'fetchPriority'>) {
  return (
    <UniversalOptimizedImage
      src={src}
      alt={alt}
      className={className}
      priority={true}
      loading="eager"
      fetchPriority="high"
      quality={90}
      placeholder="blur"
      {...props}
    />
  );
}

// Componente para imagens de conteúdo otimizadas
export function ContentOptimizedImage({ 
  src, 
  alt, 
  className = '',
  ...props 
}: Omit<UniversalOptimizedImageProps, 'loading'>) {
  return (
    <UniversalOptimizedImage
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      quality={85}
      placeholder="blur"
      {...props}
    />
  );
}
