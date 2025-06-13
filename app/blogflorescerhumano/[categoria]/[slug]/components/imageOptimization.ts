/**
 * @fileoverview Utilitário para detectar aspect ratio ideal para imagens
 * @description Helper para otimizar exibição de imagens sem cortes
 * @author Blog Florescer Humano
 * @since 2025-06-13
 */

/**
 * Detecta o melhor aspect ratio para uma imagem
 * @param imageSrc - URL da imagem
 * @returns Promise com aspect ratio recomendado
 */
export async function detectImageAspectRatio(imageSrc: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      
      // ✅ Limitar ratios extremos para manter design consistente
      if (ratio > 3) {
        resolve(3); // Máximo panorâmico
      } else if (ratio < 0.5) {
        resolve(0.5); // Mínimo retrato
      } else {
        resolve(ratio); // Ratio natural da imagem
      }
    };
    
    img.onerror = () => {
      // ✅ Fallback para ratio padrão se imagem não carregar
      resolve(16/9);
    };
    
    img.src = imageSrc;
  });
}

/**
 * Determina se uma imagem deve usar object-fit cover ou contain
 * @param aspectRatio - Aspect ratio da imagem
 * @returns 'cover' ou 'contain'
 */
export function getOptimalObjectFit(aspectRatio: number): 'cover' | 'contain' {
  // ✅ Para ratios próximos do padrão web (16:9), usar cover
  const standardRatio = 16/9;
  const tolerance = 0.3;
  
  if (Math.abs(aspectRatio - standardRatio) < tolerance) {
    return 'cover';
  }
  
  // ✅ Para ratios muito diferentes, usar contain para evitar cortes
  return 'contain';
}

/**
 * Configurações pré-definidas para diferentes tipos de conteúdo
 */
export const IMAGE_DISPLAY_PRESETS = {
  // ✅ Para artigos de blog (atual)
  BLOG_ARTICLE: {
    aspectRatio: 'auto' as const,
    objectFit: 'contain' as const,
    priority: true
  },
  
  // ✅ Para cards de listagem
  CARD_PREVIEW: {
    aspectRatio: 16/9,
    objectFit: 'cover' as const,
    priority: false
  },
  
  // ✅ Para hero images de landing pages
  HERO_BANNER: {
    aspectRatio: 21/9,
    objectFit: 'cover' as const,
    priority: true
  },
  
  // ✅ Para portraits/retratos
  PORTRAIT: {
    aspectRatio: 3/4,
    objectFit: 'cover' as const,
    priority: false
  }
} as const;
