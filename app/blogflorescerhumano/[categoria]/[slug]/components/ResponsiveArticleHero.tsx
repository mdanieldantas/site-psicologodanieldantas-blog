/**
 * @fileoverview Componente responsivo para imagem hero de artigos
 * @description Componente otimizado sem molduras, focado em performance e responsividade
 * @author Blog Florescer Humano
 * @since 2025-06-13
 */

'use client';

import Image from 'next/image';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { cn } from '@/lib/utils';
import { 
  imageVariants, 
  type ImageVariantsProps,
  FRAME_STYLES,
  HOVER_STYLES 
} from './ArticleImageVariants';
import { 
  useResponsiveImage, 
  isValidImagePath, 
  extractCategoryFromPath 
} from './useResponsiveImage';

/**
 * Props para o componente ResponsiveArticleHero
 */
interface ResponsiveArticleHeroProps extends Omit<ImageVariantsProps, 'loading'> {
  /** URL da imagem principal */
  src: string;
  /** Texto alternativo para acessibilidade */
  alt: string;
  /** Se a imagem deve ter carregamento prioritário (importante para LCP) */
  priority?: boolean;
  /** Classes CSS adicionais */
  className?: string;
  /** Slug da categoria para fallback inteligente */
  categorySlug?: string;
  /** Configuração de sizes responsivos para Next.js Image */
  sizes?: string;
  /** Callback executado quando imagem carrega */
  onLoad?: () => void;
  /** Callback executado quando ocorre erro */
  onError?: (error: Event) => void;
  /** Se deve mostrar skeleton durante carregamento */
  showLoadingSkeleton?: boolean;
  /** Aspect ratio da imagem (padrão: auto para se adaptar à imagem) */
  aspectRatio?: number | 'auto';
  /** Como a imagem deve se ajustar (cover = pode cortar, contain = imagem completa) */
  objectFit?: 'cover' | 'contain';
}

/**
 * Componente ResponsiveArticleHero
 * 
 * Características principais:
 * - Sem molduras por padrão (frameStyle='none')
 * - 100% responsivo usando AspectRatio do Radix UI
 * - Sistema robusto de fallbacks
 * - Otimizado para Core Web Vitals
 * - Loading skeleton suave
 * - Type safety completo
 * 
 * @param props - Configurações do componente
 * @returns JSX.Element do componente de imagem hero
 * 
 * @example
 * ```tsx
 * <ResponsiveArticleHero
 *   src="/path/to/image.webp"
 *   alt="Descrição da imagem"
 *   priority
 *   categorySlug="psicologia-humanista"
 *   className="mb-8"
 * />
 * ```
 */
export default function ResponsiveArticleHero({
  src,
  alt,
  frame = FRAME_STYLES.NONE,           // 🎯 Padrão sem moldura
  hover = HOVER_STYLES.SUBTLE,         // Hover sutil por padrão
  priority = true,                     // Priority por padrão para hero images
  className,
  categorySlug = 'default',
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw",
  onLoad,
  onError,
  showLoadingSkeleton = true,
  aspectRatio = 'auto',                // 🎯 Auto para se adaptar à imagem
  objectFit = 'contain',               // 🎯 Contain para mostrar imagem completa
  ...props
}: ResponsiveArticleHeroProps) {
  
  // ✅ Hook para gerenciamento inteligente da imagem
  const { 
    imageSrc, 
    isLoading, 
    hasError, 
    handleImageError 
  } = useResponsiveImage({
    src,
    fallbackCategory: categorySlug,
    onLoad,
    onError
  });

  // ✅ Determinar se deve mostrar skeleton
  const shouldShowSkeleton = showLoadingSkeleton && isLoading && !hasError;

  // ✅ Classes do container principal usando CVA
  const containerClasses = cn(
    imageVariants({ 
      frame, 
      hover,
      loading: shouldShowSkeleton ? 'skeleton' : 'normal'
    }),
    className
  );  // ✅ Classes da imagem com condicionais
  const imageClasses = cn(
    `object-${objectFit} transition-opacity duration-300`, // ✅ Object fit dinâmico
    // ✅ Controle de opacidade baseado no estado
    isLoading ? 'opacity-0' : 'opacity-100',
    // ✅ Border radius condicional
    frame === FRAME_STYLES.NONE ? 'rounded-none' : 'rounded-inherit'
  );

  // ✅ Determinar se usar AspectRatio ou container flexível
  const useFlexibleHeight = aspectRatio === 'auto';
  const numericRatio = typeof aspectRatio === 'number' ? aspectRatio : 16/9;

  /**
   * Handler para erro da imagem Next.js
   * Integra com o sistema de fallback do hook
   */
  const handleNextImageError = () => {
    handleImageError();
  };

  /**
   * Handler para carregamento bem-sucedido da imagem Next.js
   */
  const handleNextImageLoad = () => {
    // Estado de loading será atualizado pelo hook useResponsiveImage
    if (onLoad) {
      onLoad();
    }
  };

  return (    <div className={cn('w-full', className)}>      {/* ✅ Container com AspectRatio para layout estável - Ajustado para evitar cortes */}      <AspectRatio 
        ratio={typeof aspectRatio === 'number' ? aspectRatio : 16/9} 
        className={containerClasses}
        {...props}
      >
        {/* ✅ Skeleton de carregamento */}
        {shouldShowSkeleton && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-inherit" />
        )}
        
        {/* ✅ Imagem principal otimizada */}
        <Image
          src={imageSrc}
          alt={alt}
          fill                                    // ✅ Preenche todo o AspectRatio
          priority={priority}                     // ✅ Carregamento prioritário para LCP
          sizes={sizes}                          // ✅ Responsividade inteligente
          className={imageClasses}
          onError={handleNextImageError}
          onLoad={handleNextImageLoad}
          style={{
            // ✅ Garantias inline para casos extremos
            width: '100%',
            height: '100%',
          }}
          // ✅ Atributos de performance
          quality={90}                          // Qualidade otimizada
          placeholder="blur"                    // Blur placeholder nativo
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        
        {/* ✅ Overlay apenas para estilo 'elegant' */}
        {frame === 'elegant' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-lg pointer-events-none z-10" />
        )}
        
        {/* ✅ Indicador de erro (apenas para desenvolvimento) */}
        {hasError && process.env.NODE_ENV === 'development' && (
          <div className="absolute inset-0 bg-red-100 border border-red-300 rounded flex items-center justify-center">
            <p className="text-red-600 text-sm font-medium">
              ⚠️ Erro ao carregar imagem
            </p>
          </div>
        )}
      </AspectRatio>

      {/* ✅ Informações adicionais para debugging (apenas desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          <details>
            <summary className="cursor-pointer">Debug Info</summary>
            <div className="mt-1 space-y-1">
              <p>Src original: {src}</p>
              <p>Src atual: {imageSrc}</p>
              <p>Loading: {isLoading ? 'true' : 'false'}</p>
              <p>Error: {hasError ? 'true' : 'false'}</p>
              <p>Frame: {frame}</p>
              <p>Category: {categorySlug}</p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

/**
 * Componente de conveniência para artigos com validação automática
 * Abstrai a lógica de validação de imagem e extração de categoria
 */
interface SmartArticleHeroProps extends Omit<ResponsiveArticleHeroProps, 'categorySlug'> {
  /** Título do artigo para alt text inteligente */
  articleTitle?: string;
  /** Campo imagem_capa_arquivo do Supabase */
  imageCapaArquivo?: string | null;
  /** Slug da categoria extraído da URL */
  categoriaSlug?: string;
}

/**
 * Versão inteligente do ResponsiveArticleHero
 * Automatiza validações e fallbacks baseado nos dados do artigo
 */
export function SmartArticleHero({
  src,
  alt,
  articleTitle,
  imageCapaArquivo,
  categoriaSlug,
  ...props
}: SmartArticleHeroProps) {
  
  // ✅ Determinar categoria automaticamente se não fornecida
  const determinedCategory = categoriaSlug || extractCategoryFromPath(src) || 'default';
    // ✅ Gerar alt text inteligente
  const smartAlt = alt || (
    isValidImagePath(imageCapaArquivo ?? null) && articleTitle
      ? `Imagem de capa para ${articleTitle}`
      : 'Blog Florescer Humano - Artigo'
  );

  return (
    <ResponsiveArticleHero
      src={src}
      alt={smartAlt}
      categorySlug={determinedCategory}
      {...props}
    />
  );
}
