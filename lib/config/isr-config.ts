// lib/config/isr-config.ts
import { unstable_cache } from 'next/cache';

/**
 * 🚀 ISR CONFIGURATION FOR NEXT.JS 15.2.4
 * Configurações centralizadas para Incremental Static Regeneration
 * Compatível com App Router e Supabase SSR
 */

// 🎯 ENVIRONMENT-BASED CONFIGURATION
const isDevelopment = process.env.NODE_ENV === 'development';
const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';

// ⚡ ISR REVALIDATION TIMES (em segundos)
export const ISR_CONFIG = {
  // 🏠 Páginas principais
  pages: {
    blogHome: isDevelopment ? 300 : 900,        // 5min dev / 15min prod
    categoryList: isDevelopment ? 600 : 1800,   // 10min dev / 30min prod  
    articlePage: isDevelopment ? 300 : 3600,    // 5min dev / 1h prod
  },

  // 📂 Cache por tipo de conteúdo
  content: {
    articles: isDevelopment ? 300 : 1800,       // 30min prod - artigos mudam raramente
    categories: isDevelopment ? 600 : 3600,     // 1h prod - categorias são estáveis
    authors: isDevelopment ? 900 : 7200,        // 2h prod - autores são muito estáveis
    tags: isDevelopment ? 600 : 3600,           // 1h prod - tags são moderadamente estáveis
  },

  // 🔄 Estratégias de geração
  generation: {
    // Número de páginas a pré-gerar no build
    staticGeneration: {
      articles: isDevelopment ? 5 : 15,         // 5 em dev, 15 em prod
      categories: 'all',                        // Todas as categorias
    },
    
    // Comportamento para paths não pré-gerados
    fallback: {
      dynamicParams: true,                      // Permite gerar on-demand
      notFoundBehavior: '404',                  // 404 para slugs inválidos
    }
  }
};

// 🏷️ CACHE TAGS para invalidação seletiva
export const CACHE_TAGS = {
  articles: 'artigos',
  categories: 'categorias', 
  authors: 'autores',
  tags: 'tags',
  seo: 'seo-data',
  images: 'images',
  // Tags compostas
  articleWithCategory: (categoria: string) => `artigo-${categoria}`,
  categoryWithArticles: (categoria: string) => `categoria-${categoria}`,
  // Tag global para ISR
  isr: 'isr-sync'
} as const;

// 📊 SUPABASE CACHE CONFIG (adicionado para compatibilidade)
export const SUPABASE_CACHE_CONFIG = {
  CACHE_TAGS: CACHE_TAGS,
  ARTICLES_CACHE_TTL: 3600,
  CATEGORIES_CACHE_TTL: 7200,
  TAGS_CACHE_TTL: 1800,
  AUTHORS_CACHE_TTL: 86400,
};

// 📊 PERFORMANCE MONITORING
export const ISR_METRICS = {
  // Logs de performance em desenvolvimento
  enableLogging: isDevelopment,
  
  // Métricas que queremos acompanhar
  track: {
    cacheHits: true,
    cacheMisses: true,
    generationTime: isDevelopment,
    revalidationEvents: true,
  },
  
  // Alertas de performance
  alerts: {
    slowGeneration: 5000,    // > 5s para gerar uma página
    highMissRate: 0.7,       // > 70% de cache miss
  }
};

// 🔧 UTILITY FUNCTIONS
export const getISRConfig = (pageType: keyof typeof ISR_CONFIG.pages) => {
  return {
    revalidate: ISR_CONFIG.pages[pageType],
    dynamicParams: ISR_CONFIG.generation.fallback.dynamicParams,
    tags: [CACHE_TAGS.isr],
  };
};

export const getContentCacheConfig = (contentType: keyof typeof ISR_CONFIG.content) => {
  return {
    revalidate: ISR_CONFIG.content[contentType],
    tags: [CACHE_TAGS[contentType], CACHE_TAGS.isr],
  };
};

// 🚨 DEVELOPMENT HELPERS
export const logISR = (context: string, message: string, data?: any) => {
  if (ISR_METRICS.enableLogging) {
    const timestamp = new Date().toISOString();
    const env = isDevelopment ? '🚧 DEV' : '🚀 PROD';
    console.log(`${env} [ISR ${context}] ${message}`, data ? data : '');
  }
};

// 🔄 CACHE INVALIDATION UTILITIES
export const invalidationStrategies = {
  // Quando um artigo é publicado/editado
  onArticleChange: [CACHE_TAGS.articles, CACHE_TAGS.isr],
  
  // Quando uma categoria é modificada  
  onCategoryChange: [CACHE_TAGS.categories, CACHE_TAGS.isr],
  
  // Invalidação completa (usar com cuidado)
  full: Object.values(CACHE_TAGS).filter(tag => typeof tag === 'string'),
};

// 📈 NEXT.JS 15 COMPATIBILITY CHECK
export const validateNextJSCompatibility = () => {
  const nextVersion = process.env.NEXT_RUNTIME || 'unknown';
  const isAppRouter = true; // Assumindo App Router
  const hasUnstableCache = typeof unstable_cache !== 'undefined';
    logISR('Compatibility', 'ISR System Check', {
    nextVersion,
    appRouter: isAppRouter,
    unstableCache: hasUnstableCache,
    environment: isDevelopment ? 'development' : 'production',
    preview: isPreview,
  });
  
  return {
    compatible: isAppRouter && hasUnstableCache,
    version: '15.2.4',
    features: ['generateStaticParams', 'revalidate', 'unstable_cache']
  };
};

// 🎯 EXPORT PRINCIPAIS para uso nos componentes
export const ISR_TIMES = ISR_CONFIG.pages;
export const CONTENT_CACHE_TIMES = ISR_CONFIG.content;

// Log inicial do sistema
if (isDevelopment) {
  console.log('🏗️ ISR Configuration loaded for Next.js 15:', {
    environment: isDevelopment ? 'development' : 'production',
    config: ISR_CONFIG,
    compatibility: validateNextJSCompatibility()
  });
}
