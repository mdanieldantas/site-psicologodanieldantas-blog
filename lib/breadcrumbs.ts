/**
 * Sistema de Breadcrumbs e Navegação Estruturada
 * 
 * Este arquivo gerencia a criação de breadcrumbs para SEO e UX,
 * incluindo Schema.org para rich snippets no Google.
 * 
 * @author GitHub Copilot
 * @date 2025-06-14
 * @version 1.0.0
 */

import { SITE_CONFIG, BLOG_CONFIG } from './metadata-config';

// ==========================================
// TIPOS TYPESCRIPT PARA BREADCRUMBS
// ==========================================

/**
 * Representa um item individual do breadcrumb
 */
export interface BreadcrumbItem {
  /** Nome exibido no breadcrumb */
  readonly name: string;
  /** URL completa do item */
  readonly url: string;
  /** Posição na hierarquia (opcional, calculado automaticamente) */
  readonly position?: number;
}

/**
 * Schema.org estruturado para breadcrumbs
 */
interface BreadcrumbListSchema {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'BreadcrumbList';
  readonly itemListElement: ReadonlyArray<{
    readonly '@type': 'ListItem';
    readonly position: number;
    readonly name: string;
    readonly item: string;
  }>;
}

// ==========================================
// GERAÇÃO DE SCHEMA.ORG PARA BREADCRUMBS
// ==========================================

/**
 * Gera Schema.org BreadcrumbList para rich snippets
 * 
 * Este schema ajuda o Google a entender a estrutura de navegação
 * e pode gerar breadcrumbs visuais nos resultados de busca.
 * 
 * @param items - Lista de itens do breadcrumb
 * @returns Schema.org estruturado para breadcrumbs
 * 
 * @example
 * ```typescript
 * const breadcrumbs = [
 *   { name: "Início", url: "https://site.com" },
 *   { name: "Blog", url: "https://site.com/blog" }
 * ];
 * const schema = generateBreadcrumbSchema(breadcrumbs);
 * ```
 */
export function generateBreadcrumbSchema(items: ReadonlyArray<BreadcrumbItem>): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// ==========================================
// FUNÇÕES DE CONSTRUÇÃO DE BREADCRUMBS
// ==========================================

/**
 * Gera breadcrumbs base para qualquer página do blog
 * 
 * Sempre inclui: Início → Blog
 * 
 * @returns Array base de breadcrumbs para o blog
 */
function getBaseBlogBreadcrumbs(): BreadcrumbItem[] {
  return [
    { 
      name: "Início", 
      url: SITE_CONFIG.url 
    },
    { 
      name: "Blog", 
      url: BLOG_CONFIG.url 
    }
  ];
}

/**
 * Cria breadcrumbs para a página principal do blog
 * 
 * Estrutura: Início → Blog
 * 
 * @returns Array de breadcrumbs para a home do blog
 */
export function getBlogHomeBreadcrumbs(): BreadcrumbItem[] {
  return getBaseBlogBreadcrumbs();
}

/**
 * Cria breadcrumbs para página de categoria
 * 
 * Estrutura: Início → Blog → Categoria
 * 
 * @param categoriaNome - Nome da categoria
 * @param categoriaSlug - Slug da categoria para URL
 * @returns Array de breadcrumbs para página de categoria
 * 
 * @example
 * ```typescript
 * const breadcrumbs = getCategoryBreadcrumbs(
 *   "Psicologia Humanista", 
 *   "psicologia-humanista"
 * );
 * ```
 */
export function getCategoryBreadcrumbs(
  categoriaNome: string, 
  categoriaSlug: string
): BreadcrumbItem[] {
  const baseBreadcrumbs = getBaseBlogBreadcrumbs();
  
  return [
    ...baseBreadcrumbs,
    {
      name: categoriaNome,
      url: `${BLOG_CONFIG.url}/${categoriaSlug}`
    }
  ];
}

/**
 * Cria breadcrumbs para página de artigo individual
 * 
 * Estrutura: Início → Blog → Categoria → Artigo
 * 
 * @param categoriaNome - Nome da categoria
 * @param categoriaSlug - Slug da categoria
 * @param artigoTitulo - Título do artigo (será truncado se muito longo)
 * @param artigoSlug - Slug do artigo
 * @returns Array de breadcrumbs para página de artigo
 * 
 * @example
 * ```typescript
 * const breadcrumbs = getArticleBreadcrumbs(
 *   "Psicologia Humanista",
 *   "psicologia-humanista", 
 *   "O que é a Tendência Atualizante de Rogers?",
 *   "tendencia-atualizante-rogers"
 * );
 * ```
 */
export function getArticleBreadcrumbs(
  categoriaNome: string,
  categoriaSlug: string,
  artigoTitulo: string,
  artigoSlug: string
): BreadcrumbItem[] {
  const categoryBreadcrumbs = getCategoryBreadcrumbs(categoriaNome, categoriaSlug);
  
  // Truncar título do artigo se muito longo para breadcrumbs
  const truncatedTitle = truncateBreadcrumbTitle(artigoTitulo);
  
  return [
    ...categoryBreadcrumbs,
    {
      name: truncatedTitle,
      url: `${BLOG_CONFIG.url}/${categoriaSlug}/${artigoSlug}`
    }
  ];
}

/**
 * Cria breadcrumbs para páginas de busca/filtros
 * 
 * Estrutura: Início → Blog → "Resultados da Busca"
 * 
 * @param searchTerm - Termo de busca (opcional)
 * @returns Array de breadcrumbs para página de busca
 */
export function getSearchBreadcrumbs(searchTerm?: string): BreadcrumbItem[] {
  const baseBreadcrumbs = getBaseBlogBreadcrumbs();
  
  const searchLabel = searchTerm 
    ? `Busca: "${truncateBreadcrumbTitle(searchTerm)}"`
    : "Resultados da Busca";
  
  return [
    ...baseBreadcrumbs,
    {
      name: searchLabel,
      url: `${BLOG_CONFIG.url}/buscar${searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ''}`
    }
  ];
}

/**
 * Cria breadcrumbs para páginas de tag
 * 
 * Estrutura: Início → Blog → "Tag: NomeTag"
 * 
 * @param tagNome - Nome da tag
 * @param tagSlug - Slug da tag
 * @returns Array de breadcrumbs para página de tag
 */
export function getTagBreadcrumbs(tagNome: string, tagSlug: string): BreadcrumbItem[] {
  const baseBreadcrumbs = getBaseBlogBreadcrumbs();
  
  return [
    ...baseBreadcrumbs,
    {
      name: `Tag: ${tagNome}`,
      url: `${BLOG_CONFIG.url}/tag/${tagSlug}`
    }
  ];
}

// ==========================================
// FUNÇÕES UTILITÁRIAS
// ==========================================

/**
 * Trunca títulos longos para breadcrumbs mantendo legibilidade
 * 
 * @param title - Título original
 * @param maxLength - Comprimento máximo (padrão: 50)
 * @returns Título truncado
 */
function truncateBreadcrumbTitle(title: string, maxLength: number = 50): string {
  if (title.length <= maxLength) return title;
  
  const truncated = title.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? `${truncated.slice(0, lastSpace)}...` : `${truncated}...`;
}

/**
 * Valida se uma lista de breadcrumbs está bem formada
 * 
 * @param breadcrumbs - Lista de breadcrumbs para validar
 * @returns true se válida, false caso contrário
 */
export function validateBreadcrumbs(breadcrumbs: BreadcrumbItem[]): boolean {
  if (!Array.isArray(breadcrumbs) || breadcrumbs.length === 0) {
    return false;
  }
  
  return breadcrumbs.every(item => 
    item.name?.trim() && 
    item.url?.trim() && 
    isValidUrl(item.url)
  );
}

/**
 * Valida se uma URL é válida
 * 
 * @param url - URL para validar
 * @returns true se válida
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gera script JSON-LD para inserir no HTML
 * 
 * Esta função facilita a inserção do schema no componente React
 * 
 * @param breadcrumbs - Lista de breadcrumbs
 * @returns Objeto pronto para dangerouslySetInnerHTML
 * 
 * @example
 * ```jsx
 * const breadcrumbs = getArticleBreadcrumbs(...);
 * const jsonLd = generateBreadcrumbJsonLd(breadcrumbs);
 * 
 * return (
 *   <script 
 *     type="application/ld+json"
 *     dangerouslySetInnerHTML={jsonLd}
 *   />
 * );
 * ```
 */
export function generateBreadcrumbJsonLd(breadcrumbs: BreadcrumbItem[]): { __html: string } {
  if (!validateBreadcrumbs(breadcrumbs)) {
    console.warn('Breadcrumbs inválidos fornecidos para generateBreadcrumbJsonLd');
    return { __html: '{}' };
  }
  
  const schema = generateBreadcrumbSchema(breadcrumbs);
  return { __html: JSON.stringify(schema, null, 0) };
}
