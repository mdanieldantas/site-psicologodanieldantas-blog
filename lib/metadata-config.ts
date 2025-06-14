/**
 * Sistema Unificado de Metadados - Site Psicólogo Daniel Dantas
 * 
 * Este arquivo centraliza toda a geração de metadados para SEO,
 * garantindo consistência entre landing page e blog.
 * 
 * @author GitHub Copilot
 * @date 2025-06-14
 * @version 1.0.0
 */

import { Metadata } from 'next';

// ==========================================
// TIPOS TYPESCRIPT PARA SEGURANÇA
// ==========================================

/**
 * Configuração principal do site
 */
interface SiteConfig {
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly author: {
    readonly name: string;
    readonly email: string;
    readonly phone: string;
  };
  readonly social: {
    readonly twitter: string;
    readonly instagram: string;
  };
}

/**
 * Configuração específica do blog
 */
interface BlogConfig {
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly path: string;
}

/**
 * Opções para geração de metadados
 */
interface MetadataOptions {
  /** Título da página - pode ser string simples ou objeto com template */
  title?: string | { default: string; template: string };
  /** Descrição meta para SEO */
  description?: string;
  /** Caminho relativo da página (ex: /blogflorescerhumano/categoria/artigo) */
  path?: string;
  /** URLs das imagens para Open Graph */
  images?: string[];
  /** Tipo de conteúdo para Open Graph */
  type?: 'website' | 'article';
  /** Data de publicação (formato ISO) */
  publishedTime?: string;
  /** Data de última modificação (formato ISO) */
  modifiedTime?: string;
  /** Seção/categoria do conteúdo */
  section?: string;
  /** Tags/palavras-chave do conteúdo */
  tags?: string[];
  /** Lista de autores */
  authors?: string[];
  /** Controle de indexação pelos buscadores */
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
}

// ==========================================
// CONFIGURAÇÕES PRINCIPAIS DO SITE
// ==========================================

/**
 * Configurações globais do site principal
 * Centralizadas para facilitar manutenção
 */
export const SITE_CONFIG: SiteConfig = {
  name: "Psicólogo Daniel Dantas",
  description: "Terapia online humanista c/ Psicólogo Daniel Dantas p/ ansiedade, estresse, autoconhecimento. Espaço sensível a questões étnico-raciais e LGBTQIA+. BR/Mundo",
  url: "https://psicologodanieldantas.com.br",
  author: {
    name: "Daniel Dantas",
    email: "contatomarcosdgomes@gmail.com",
    phone: "+55-85-986013431"
  },
  social: {
    twitter: "@psidanieldantas",
    instagram: "@psicologodanieldantas"
  }
} as const;

/**
 * Configurações específicas do blog
 */
export const BLOG_CONFIG: BlogConfig = {
  name: "Blog Florescer Humano",
  description: "Blog de psicologia com artigos sobre desenvolvimento pessoal, saúde mental e terapia humanista por Daniel Dantas",
  url: `${SITE_CONFIG.url}/blogflorescerhumano`,
  path: "/blogflorescerhumano"
} as const;

// ==========================================
// FUNÇÃO PRINCIPAL DE GERAÇÃO DE METADADOS
// ==========================================

/**
 * Cria metadados padronizados para qualquer página do site
 * 
 * Esta função garante que todas as páginas sigam o mesmo padrão de SEO,
 * incluindo Open Graph, Twitter Cards, e configurações de robôs.
 * 
 * @param options - Opções de configuração dos metadados
 * @returns Objeto Metadata compatível com Next.js 15
 * 
 * @example
 * ```typescript
 * // Para uma página de artigo:
 * const metadata = createMetadata({
 *   title: "Como lidar com ansiedade",
 *   description: "Técnicas práticas para reduzir a ansiedade...",
 *   path: "/blogflorescerhumano/ansiedade/como-lidar",
 *   type: "article",
 *   authors: ["Daniel Dantas"]
 * });
 * ```
 */
export function createMetadata(options: MetadataOptions = {}): Metadata {
  // Construir URL canônica completa
  const canonicalUrl = `${SITE_CONFIG.url}${options.path || ''}`;
  
  // Determinar título final (string ou objeto com template)
  const finalTitle = options.title || SITE_CONFIG.name;
  
  // Usar descrição fornecida ou fallback para descrição padrão
  const finalDescription = options.description || SITE_CONFIG.description;
  
  // Configurar imagens com fallbacks seguros
  const defaultImage = `${SITE_CONFIG.url}/foto-psicologo-daniel-dantas.webp`;
  const images = options.images?.map(img => ({
    url: img.startsWith('http') ? img : `${SITE_CONFIG.url}${img}`,
    width: 1200,
    height: 630,
    alt: typeof finalTitle === 'string' ? finalTitle : finalTitle.default || SITE_CONFIG.name,
  })) || [{
    url: defaultImage,
    width: 1200,
    height: 630,
    alt: SITE_CONFIG.name,
  }];

  // Configurar autores com fallback
  const authors = options.authors?.map(name => ({ name })) || [{ name: SITE_CONFIG.author.name }];
  // Configurações de robôs com padrões seguros e tipos corretos
  const robotsConfig = {
    index: options.robots?.index ?? true,
    follow: options.robots?.follow ?? true,
    googleBot: {
      index: options.robots?.index ?? true,
      follow: options.robots?.follow ?? true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  };

  return {
    // Metadados básicos
    title: finalTitle,
    description: finalDescription,
    authors,
    creator: SITE_CONFIG.author.name,
    publisher: SITE_CONFIG.author.name,
    
    // URL canônica para SEO
    alternates: {
      canonical: canonicalUrl,
    },
    
    // Open Graph para redes sociais
    openGraph: {
      type: options.type || 'website',
      locale: 'pt_BR',
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      title: typeof finalTitle === 'string' ? finalTitle : finalTitle.default,
      description: finalDescription,
      images,
      
      // Metadados específicos para artigos
      ...(options.type === 'article' && {
        publishedTime: options.publishedTime,
        modifiedTime: options.modifiedTime,
        section: options.section,
        authors: options.authors,
        tags: options.tags,
      })
    },
    
    // Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title: typeof finalTitle === 'string' ? finalTitle : finalTitle.default,
      description: finalDescription,
      creator: SITE_CONFIG.social.twitter,
      images: options.images?.map(img => 
        img.startsWith('http') ? img : `${SITE_CONFIG.url}${img}`
      ) || [defaultImage],
    },
    
    // Configurações de robôs para SEO
    robots: robotsConfig,
    
    // Metadados adicionais para artigos
    ...(options.type === 'article' && {
      keywords: options.tags?.join(', '),
    }),
  };
}

// ==========================================
// FUNÇÕES UTILITÁRIAS
// ==========================================

/**
 * Valida se uma URL de imagem é válida
 * 
 * @param imageUrl - URL da imagem para validar
 * @returns true se a URL é válida
 */
export function isValidImageUrl(imageUrl: string): boolean {
  try {
    const url = new URL(imageUrl.startsWith('http') ? imageUrl : `${SITE_CONFIG.url}${imageUrl}`);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Trunca texto para limites de SEO mantendo palavras completas
 * 
 * @param text - Texto para truncar
 * @param maxLength - Comprimento máximo
 * @returns Texto truncado
 */
export function truncateForSEO(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? `${truncated.slice(0, lastSpace)}...` : `${truncated}...`;
}

/**
 * Gera título otimizado para SEO
 * Prioriza meta_titulo se disponível, senão otimiza o título regular
 * 
 * @param metaTitle - Título específico para SEO
 * @param regularTitle - Título regular do conteúdo
 * @param maxLength - Comprimento máximo (padrão: 60)
 * @returns Título otimizado
 */
export function optimizeTitle(metaTitle: string | null, regularTitle: string, maxLength: number = 60): string {
  const title = metaTitle?.trim() || regularTitle;
  return truncateForSEO(title, maxLength);
}

/**
 * Gera descrição otimizada para SEO
 * Prioriza resumo se disponível, senão cria descrição baseada no conteúdo
 * 
 * @param resumo - Resumo específico para SEO
 * @param fallbackText - Texto alternativo
 * @param maxLength - Comprimento máximo (padrão: 155)
 * @returns Descrição otimizada
 */
export function optimizeDescription(resumo: string | null, fallbackText: string, maxLength: number = 155): string {
  const description = resumo?.trim() || fallbackText;
  return truncateForSEO(description, maxLength);
}
