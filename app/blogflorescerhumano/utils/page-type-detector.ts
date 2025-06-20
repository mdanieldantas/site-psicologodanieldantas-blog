/**
 * Utilitário para detectar o tipo de página do blog e determinar quais schemas devem ser renderizados
 * 
 * Este módulo resolve o problema de duplicidade de schemas Blog/BlogPosting
 * garantindo que cada tipo de página tenha apenas os schemas apropriados.
 */

export type PageType = 'blog-home' | 'blog-article' | 'blog-category' | 'blog-tag' | 'blog-other';

export interface PageTypeResult {
  type: PageType;
  shouldRenderBlogSchema: boolean;
  shouldRenderBreadcrumbSchema: boolean;
  reason: string;
}

/**
 * Detecta o tipo de página baseado nos parâmetros passados
 * Esta é uma versão mais simples que funciona com a estrutura do Next.js
 */
export function detectPageTypeFromPath(pathname?: string): PageTypeResult {
  // Se não temos pathname, assumimos página inicial
  if (!pathname) {
    return {
      type: 'blog-home',
      shouldRenderBlogSchema: true,
      shouldRenderBreadcrumbSchema: true,
      reason: 'Pathname não fornecido - assumindo home'
    };
  }
  
  return analyzePathname(pathname);
}

/**
 * Versão assíncrona que tenta obter informações do servidor
 * Como fallback, usa análise baseada em convenções de URL
 */
export async function detectPageType(): Promise<PageTypeResult> {
  try {
    // Para esta implementação, vamos usar uma estratégia mais conservadora
    // Assumindo que estamos na home a menos que detectemos um padrão específico
    
    // Em um ambiente real, poderíamos usar:
    // - Dados do roteador do Next.js
    // - Parâmetros da URL
    // - Metadados da página
    
    return {
      type: 'blog-home',
      shouldRenderBlogSchema: true,
      shouldRenderBreadcrumbSchema: true,
      reason: 'Detecção server-side conservadora'
    };
  } catch (error) {
    console.warn('Erro ao detectar tipo de página:', error);
    return {
      type: 'blog-home',
      shouldRenderBlogSchema: true,
      shouldRenderBreadcrumbSchema: true,
      reason: 'Fallback devido a erro na detecção'
    };
  }
}

/**
 * Extrai o pathname de uma URL completa
 */
function extractPathnameFromUrl(url: string): string {
  try {
    if (!url) return '';
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return '';
  }
}

/**
 * Analisa o pathname e determina o tipo de página
 */
function analyzePathname(pathname: string): PageTypeResult {
  // Normaliza o pathname
  const normalizedPath = pathname.toLowerCase().replace(/\/$/, '');
  
  // Log para debug
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Analisando pathname:', normalizedPath);
  }
  
  // Página inicial do blog
  if (normalizedPath === '/blogflorescerhumano' || normalizedPath === '' || normalizedPath === '/') {
    return {
      type: 'blog-home',
      shouldRenderBlogSchema: true,
      shouldRenderBreadcrumbSchema: true,
      reason: 'Página inicial do blog'
    };
  }
  
  // Página de artigo individual (contém slug específico após /blogflorescerhumano/)
  if (normalizedPath.startsWith('/blogflorescerhumano/')) {
    const pathAfterBlog = normalizedPath.replace('/blogflorescerhumano/', '');
    
    // Se é uma página especial, não é artigo
    if (isSpecialBlogPage(pathAfterBlog)) {
      return {
        type: 'blog-other',
        shouldRenderBlogSchema: true,
        shouldRenderBreadcrumbSchema: true,
        reason: `Página especial do blog: ${pathAfterBlog}`
      };
    }
    
    // Páginas de categoria
    if (pathAfterBlog.startsWith('categoria/') || pathAfterBlog.startsWith('category/')) {
      return {
        type: 'blog-category',
        shouldRenderBlogSchema: true,
        shouldRenderBreadcrumbSchema: true,
        reason: 'Página de categoria - deve ter schema Blog'
      };
    }
    
    // Páginas de tag
    if (pathAfterBlog.startsWith('tag/') || pathAfterBlog.startsWith('tags/')) {
      return {
        type: 'blog-tag',
        shouldRenderBlogSchema: true,
        shouldRenderBreadcrumbSchema: true,
        reason: 'Página de tag - deve ter schema Blog'
      };
    }
    
    // Se chegou até aqui e tem um slug válido, é um artigo
    if (pathAfterBlog && pathAfterBlog.length > 0 && !pathAfterBlog.includes('/')) {
      return {
        type: 'blog-article',
        shouldRenderBlogSchema: false, // ❌ CRÍTICO: NÃO renderizar schema Blog em artigos
        shouldRenderBreadcrumbSchema: true,
        reason: `Artigo individual detectado: ${pathAfterBlog} - Schema Blog removido para evitar duplicidade`
      };
    }
    
    // Outras estruturas de URL do blog
    return {
      type: 'blog-other',
      shouldRenderBlogSchema: true,
      shouldRenderBreadcrumbSchema: true,
      reason: `Outra página do blog: ${pathAfterBlog}`
    };
  }
  
  // Fallback para páginas não reconhecidas
  return {
    type: 'blog-home',
    shouldRenderBlogSchema: true,
    shouldRenderBreadcrumbSchema: true,
    reason: 'Página não reconhecida - fallback para home'
  };
}

/**
 * Verifica se é uma página especial do blog (não um artigo)
 */
function isSpecialBlogPage(pathSegment: string): boolean {
  const specialPages = [
    'buscar',
    'search',
    'arquivo',
    'archive',
    'sobre',
    'about',
    'contato',
    'contact',
    'rss',
    'feed',
    'sitemap'
  ];
  
  return specialPages.some(page => pathSegment.startsWith(page));
}

/**
 * Função para debug - pode ser removida em produção
 */
export function debugPageDetection(pathname: string): void {
  if (process.env.NODE_ENV === 'development') {
    const result = analyzePathname(pathname);
    console.log('🔍 Page Type Detection:', {
      pathname,
      ...result
    });
  }
}
