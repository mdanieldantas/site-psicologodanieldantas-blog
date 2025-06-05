import { unstable_cache } from 'next/cache';
import { 
  getPublishedArtigos as originalGetPublishedArtigos,
  getAllCategorias as originalGetAllCategorias,
  getArtigoBySlug as originalGetArtigoBySlug,
  getCategoriaBySlug as originalGetCategoriaBySlug,
  getArtigosByCategoriaSlug as originalGetArtigosByCategoriaSlug
} from '@/lib/supabase/queries';

// 🎯 Configuração inteligente de cache baseada no ambiente
const isDevelopment = process.env.NODE_ENV === 'development';

// Cache mais curto em desenvolvimento para facilitar testes
const CACHE_TIMES = {
  development: {
    short: 60,    // 1 minuto
    medium: 300,  // 5 minutos  
    long: 600     // 10 minutos
  },
  production: {
    short: 1800,  // 30 minutos
    medium: 3600, // 1 hora
    long: 7200    // 2 horas
  }
};

const cache = isDevelopment ? CACHE_TIMES.development : CACHE_TIMES.production;

// 🔧 Utilitário para logs de cache
const logCache = (operation: string, key: string) => {
  const env = isDevelopment ? '🚧 DEV' : '🚀 PROD';
  console.log(`🔄 ${env} Cache MISS: ${operation} (${key})`);
};

// ✅ Cache para artigos publicados (adaptativo por ambiente)
export const getCachedPublishedArtigos = unstable_cache(
  async () => {
    logCache('getPublishedArtigos', 'published-artigos');
    const result = await originalGetPublishedArtigos();
    console.log(`✅ Artigos carregados: ${result.length} (Cache: ${cache.short}s)`);
    return result;
  },
  ['published-artigos'],
  {
    revalidate: cache.short,
    tags: ['artigos', 'published']
  }
);

// ✅ Cache para todas as categorias (adaptativo por ambiente)
export const getCachedCategorias = unstable_cache(
  async () => {
    logCache('getAllCategorias', 'all-categorias');
    const result = await originalGetAllCategorias();
    console.log(`✅ Categorias carregadas: ${result.length} (Cache: ${cache.long}s)`);
    return result;
  },
  ['all-categorias'],
  {
    revalidate: cache.long,
    tags: ['categorias']
  }
);

// ✅ Cache para artigo específico por slug (adaptativo por ambiente)
export const getCachedArtigoBySlug = unstable_cache(
  async (slug: string) => {
    logCache('getArtigoBySlug', `artigo-${slug}`);
    const result = await originalGetArtigoBySlug(slug);
    console.log(`✅ Artigo "${slug}": ${result ? 'encontrado' : 'não encontrado'} (Cache: ${cache.medium}s)`);
    return result;
  },
  ['artigo-by-slug'],
  {
    revalidate: cache.medium,
    tags: ['artigos', 'individual']
  }
);

// ✅ Cache para categoria específica por slug (adaptativo por ambiente)
export const getCachedCategoriaBySlug = unstable_cache(
  async (slug: string) => {
    logCache('getCategoriaBySlug', `categoria-${slug}`);
    const result = await originalGetCategoriaBySlug(slug);
    console.log(`✅ Categoria "${slug}": ${result ? 'encontrada' : 'não encontrada'} (Cache: ${cache.long}s)`);
    return result;
  },
  ['categoria-by-slug'],
  {
    revalidate: cache.long,
    tags: ['categorias', 'individual']
  }
);

// ✅ Cache para artigos de uma categoria específica (adaptativo por ambiente)
export const getCachedArtigosByCategoriaSlug = unstable_cache(
  async (categorySlug: string) => {
    logCache('getArtigosByCategoriaSlug', `artigos-categoria-${categorySlug}`);
    const result = await originalGetArtigosByCategoriaSlug(categorySlug);
    console.log(`✅ Artigos da categoria "${categorySlug}": ${result.length} (Cache: ${cache.short}s)`);
    return result;
  },
  ['artigos-by-categoria'],
  {
    revalidate: cache.short,
    tags: ['artigos', 'categorias', 'filtered']
  }
);

// 🛠️ Utilitários de debug e controle
export const cacheUtils = {
  // 📊 Status atual do cache
  getStatus: () => ({
    environment: isDevelopment ? 'development' : 'production',
    cacheTimes: cache,
    isDevelopment,
  }),

  // 🔍 Debug info
  logSettings: () => {
    console.log('🔧 Cache Settings:', {
      environment: isDevelopment ? 'DEV' : 'PROD',
      shortCache: `${cache.short}s`,
      mediumCache: `${cache.medium}s`, 
      longCache: `${cache.long}s`
    });
  },

  // 🗑️ Utilitário para invalidar cache manualmente (futuro)
  invalidate: {
    artigos: () => console.log('🗑️ Cache de artigos invalidado'),
    categorias: () => console.log('🗑️ Cache de categorias invalidado'),
    all: () => console.log('🗑️ Todo cache invalidado')
  }
};
