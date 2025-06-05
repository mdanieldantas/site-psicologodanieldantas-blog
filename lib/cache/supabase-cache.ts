import { unstable_cache } from 'next/cache';
import { 
  getPublishedArtigos as originalGetPublishedArtigos,
  getAllCategorias as originalGetAllCategorias,
  getArtigoBySlug as originalGetArtigoBySlug,
  getCategoriaBySlug as originalGetCategoriaBySlug,
  getArtigosByCategoriaSlug as originalGetArtigosByCategoriaSlug
} from '@/lib/supabase/queries';
import { ISR_CONFIG, SUPABASE_CACHE_CONFIG, logISR } from './isr-config';

// 🎯 CACHE CONFIGURATION FOR NEXT.JS 15 + ISR
const isDevelopment = process.env.NODE_ENV === 'development';

// ⚡ Configurações de cache sincronizadas com ISR
const CACHE_STRATEGY = {
  development: {
    articles: 300,      // 5 min - testes rápidos
    categories: 600,    // 10 min - estrutura estável  
    single_article: 180, // 3 min - edições frequentes
    single_category: 300 // 5 min - mudanças médias
  },
  production: {
    articles: ISR_CONFIG.LISTING_PAGES,     // 15 min - sincronizado com ISR
    categories: ISR_CONFIG.STATIC_PAGES / 24, // 1 hora - categorias são estáveis
    single_article: ISR_CONFIG.ARTICLE_PAGES, // 1 hora - sincronizado com ISR dos artigos
    single_category: ISR_CONFIG.CATEGORY_PAGES // 30 min - páginas de categoria
  }
};

const cache = isDevelopment ? CACHE_STRATEGY.development : CACHE_STRATEGY.production;

// ✅ ARTIGOS CACHE - Sincronizado com ISR das páginas
export const getCachedPublishedArtigos = unstable_cache(
  async () => {
    logISR('Cache', 'Published Articles fetch', { ttl: cache.articles });
    const result = await originalGetPublishedArtigos();
    logISR('Cache', `Loaded ${result.length} articles`);
    return result;
  },
  ['published-artigos-isr-v3'], // Versioning para invalidar caches antigos
  {
    revalidate: cache.articles,
    tags: [SUPABASE_CACHE_CONFIG.CACHE_TAGS.ARTICLES, 'published', 'isr-sync']
  }
);

// ✅ CATEGORIAS CACHE - Otimizado para generateStaticParams
export const getCachedAllCategorias = unstable_cache(
  async () => {
    logCacheOperation('All Categories', isDevelopment ? 'DEV' : 'PROD', cache.categories);
    const result = await originalGetAllCategorias();
    console.log(`   📁 Loaded ${result.length} categories`);
    return result;
  },
  ['all-categorias-v2'],
  {
    revalidate: cache.categories,
    tags: ['categorias', 'isr-sync']
  }
);

// ✅ ARTIGO INDIVIDUAL - Cache alinhado com ISR de páginas específicas
export const getCachedArtigoBySlug = unstable_cache(
  async (slug: string, categoriaSlug: string) => {
    logCacheOperation(`Article: ${categoriaSlug}/${slug}`, isDevelopment ? 'DEV' : 'PROD', cache.single_article);
    const result = await originalGetArtigoBySlug(slug, categoriaSlug);
    return result;
  },
  ['artigo-by-slug-v2'],
  {
    revalidate: cache.single_article,
    tags: ['artigo-individual', 'isr-sync']
  }
);

// ✅ CATEGORIA INDIVIDUAL - Para páginas de listagem
export const getCachedCategoriaBySlug = unstable_cache(
  async (slug: string) => {
    logCacheOperation(`Category: ${slug}`, isDevelopment ? 'DEV' : 'PROD', cache.single_category);
    const result = await originalGetCategoriaBySlug(slug);
    return result;
  },
  ['categoria-by-slug-v2'],
  {
    revalidate: cache.single_category,
    tags: ['categoria-individual', 'isr-sync']
  }
);

// ✅ ARTIGOS POR CATEGORIA - Cache inteligente com paginação
export const getCachedArtigosByCategoriaSlug = unstable_cache(
  async (categoriaSlug: string, page: number = 1, limit: number = 6) => {
    const cacheKey = `${categoriaSlug}-p${page}-l${limit}`;
    logCacheOperation(`Category Articles: ${cacheKey}`, isDevelopment ? 'DEV' : 'PROD', cache.single_category);
    const result = await originalGetArtigosByCategoriaSlug(categoriaSlug, page, limit);
    console.log(`   📄 Loaded ${result.length} articles for category ${categoriaSlug}`);
    return result;
  },
  ['artigos-by-categoria-v2'],
  {
    revalidate: cache.single_category,
    tags: ['artigos-categoria', 'isr-sync']
  }
);

// 🔄 CACHE INVALIDATION UTILITIES para desenvolvimento
export const revalidateCacheByTag = async (tag: string) => {
  if (isDevelopment) {
    console.log(`🔄 [DEV] Manual cache invalidation requested for tag: ${tag}`);
    // Em produção, isso seria feito via revalidateTag() em webhooks
  }
};

// 📊 CACHE STATISTICS para monitoramento
export const getCacheStats = () => {
  const env = isDevelopment ? 'Development' : 'Production';
  return {
    environment: env,
    strategy: cache,
    tags: ['artigos', 'categorias', 'isr-sync'],
    isrCompatible: true,
    nextjsVersion: '15.2.4'
  };
};

console.log('🏗️ Supabase Cache System initialized for Next.js 15 + ISR:', getCacheStats());
