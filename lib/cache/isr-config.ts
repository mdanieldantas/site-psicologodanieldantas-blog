// lib/cache/isr-config.ts
// ✅ CONFIGURAÇÕES ISR CENTRALIZADAS PARA NEXT.JS 15.2.4

/**
 * Configurações de Revalidação para diferentes tipos de página
 * Baseado na frequência de atualização de cada tipo de conteúdo
 */
export const ISR_CONFIG = {
  // Páginas estáticas (raramente mudam)
  STATIC_PAGES: 86400, // 24 horas
  
  // Página principal do blog (mudanças moderadas)
  BLOG_HOME: 600, // 10 minutos
  
  // Páginas de categoria (mudanças moderadas)
  CATEGORY_PAGES: 1800, // 30 minutos
  
  // Artigos individuais (mudanças raras)
  ARTICLE_PAGES: 3600, // 1 hora
  
  // Páginas de tags (mudanças frequentes)
  TAG_PAGES: 1200, // 20 minutos
  
  // Páginas de listagem geral
  LISTING_PAGES: 900, // 15 minutos
  
  // API routes
  API_ROUTES: 300, // 5 minutos
} as const;

/**
 * Configurações para generateStaticParams
 */
export const STATIC_GENERATION_CONFIG = {
  // Quantos artigos pré-renderizar por categoria
  ARTICLES_PER_CATEGORY: 20,
  
  // Quantas categorias pré-renderizar (todas as ativas)
  PRERENDER_ALL_CATEGORIES: true,
  
  // Quantas tags pré-renderizar (mais populares)
  TOP_TAGS_TO_PRERENDER: 15,
  
  // Permitir geração on-demand para paths não pré-renderizados
  DYNAMIC_PARAMS: true,
} as const;

/**
 * Configurações de Cache para Supabase
 */
export const SUPABASE_CACHE_CONFIG = {
  // Cache para queries de artigos
  ARTICLES_CACHE_TTL: 3600, // 1 hora
  
  // Cache para queries de categorias  
  CATEGORIES_CACHE_TTL: 7200, // 2 horas
  
  // Cache para queries de tags
  TAGS_CACHE_TTL: 1800, // 30 minutos
  
  // Cache para queries de autores
  AUTHORS_CACHE_TTL: 86400, // 24 horas (muda raramente)
  
  // Tags para invalidação de cache
  CACHE_TAGS: {
    ARTICLES: 'articles',
    CATEGORIES: 'categories', 
    TAGS: 'tags',
    AUTHORS: 'authors',
    RELATED_ARTICLES: 'related-articles',
  },
} as const;

/**
 * Utilitário para debug de cache em desenvolvimento
 */
export const DEBUG_CONFIG = {
  // Ativa logs detalhados do cache
  ENABLE_CACHE_LOGS: process.env.NODE_ENV === 'development',
  
  // Ativa debug do ISR
  ENABLE_ISR_DEBUG: process.env.NEXT_PRIVATE_DEBUG_CACHE === '1',
} as const;

/**
 * Helper para log de debug de ISR
 */
export function logISR(context: string, message: string, data?: any) {
  if (DEBUG_CONFIG.ENABLE_ISR_DEBUG || DEBUG_CONFIG.ENABLE_CACHE_LOGS) {
    console.log(`🔄 [ISR ${context}] ${message}`, data ? data : '');
  }
}
