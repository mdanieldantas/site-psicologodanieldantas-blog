/**
 * Gerador de Schema específico baseado no tipo de conteúdo
 * Implementa a estratégia de usar CreativeWork para conteúdo sem FAQ
 */

import type { Database } from "@/types/supabase";

type Artigo = Database["public"]["Tables"]["artigos"]["Row"];
type Categoria = Database["public"]["Tables"]["categorias"]["Row"];

// Tipo simplificado para dados do autor
interface AutorSimplificado {
  nome: string;
  biografia?: string | null;
  foto_arquivo?: string | null;
  perfil_academico_url?: string | null;
}

// Tipo simplificado para dados da categoria
interface CategoriaSimplificada {
  id: number;
  nome: string;
  slug: string;
}

export interface SchemaConfig {
  hasSpecificFAQ: boolean;
  schemaType: 'Article' | 'CreativeWork';
}

/**
 * Determina a configuração de schema baseada na presença de FAQ específico
 */
export function determineSchemaConfig(hasExtractedFAQ: boolean): SchemaConfig {
  if (hasExtractedFAQ) {
    return {
      hasSpecificFAQ: true,
      schemaType: 'Article'
    };
  }
  
  return {
    hasSpecificFAQ: false,
    schemaType: 'CreativeWork'
  };
}

/**
 * Gera Schema Article para conteúdo educacional com FAQ
 */
export function generateArticleSchema(
  artigo: Artigo,
  autor: AutorSimplificado | null,
  categoria: CategoriaSimplificada | null,
  articleUrl: string,
  baseUrl: string,
  imagemCompleta: string,
  tags?: Array<{ nome: string }>
){
  const autorNome = autor?.nome || 'Daniel Dantas';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': articleUrl,
    headline: artigo.titulo,
    description: artigo.resumo || `Artigo sobre ${categoria?.nome || 'psicologia'}`,
    author: {
      '@type': 'Person',
      name: autorNome,
      jobTitle: 'Psicólogo Clínico',
      url: autor?.perfil_academico_url || baseUrl,
      image: autor?.foto_arquivo 
        ? `${baseUrl}/images/autores/${autor.foto_arquivo}`
        : `${baseUrl}/images/autores/default-autor.jpg`
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Blog Florescer Humano - Daniel Dantas',
      logo: {
        '@type': 'ImageObject',
        '@id': `${baseUrl}/#logo`,
        url: `${baseUrl}/blogflorescerhumano/logos-blog/logo-fundomarrom.webp`,
        width: 512,
        height: 512
      },
      url: baseUrl
    },
    datePublished: artigo.data_publicacao,
    dateModified: artigo.data_atualizacao || artigo.data_publicacao,
    image: {
      '@type': 'ImageObject',
      '@id': `${articleUrl}#primaryimage`,
      url: imagemCompleta,
      width: 1200,
      height: 630,
      caption: `Imagem do artigo: ${artigo.titulo}`
    },
    url: articleUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    },
    articleSection: categoria?.nome || 'Psicologia',
    keywords: tags?.map(tag => tag.nome).join(', ') || (categoria?.nome || 'psicologia'),
    wordCount: calculateWordCount(artigo.conteudo),
    timeRequired: calculateReadingTime(artigo.conteudo),
    inLanguage: 'pt-BR',
    isPartOf: {
      '@type': 'Blog',
      name: 'Blog Florescer Humano',
      url: `${baseUrl}/blogflorescerhumano`
    },
    // Conecta com FAQ se houver
    mainEntity: {
      '@type': 'FAQPage',
      '@id': `${articleUrl}#faq`
    }
  };
}

/**
 * Gera Schema CreativeWork para conteúdo criativo sem FAQ
 */
export function generateCreativeWorkSchema(
  artigo: Artigo,
  autor: AutorSimplificado | null,
  categoria: CategoriaSimplificada | null,
  articleUrl: string,
  baseUrl: string,
  imagemCompleta: string
){
  const autorNome = autor?.nome || 'Daniel Dantas';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': articleUrl,
    name: artigo.titulo,
    description: artigo.resumo || `Conteúdo criativo sobre ${categoria?.nome || 'desenvolvimento pessoal'}`,
    text: extractTextContent(artigo.conteudo),
    author: {
      '@type': 'Person',
      name: autorNome,
      jobTitle: 'Psicólogo Clínico',
      url: autor?.perfil_academico_url || baseUrl,
      image: autor?.foto_arquivo 
        ? `${baseUrl}/images/autores/${autor.foto_arquivo}`
        : `${baseUrl}/images/autores/default-autor.jpg`
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Blog Florescer Humano - Daniel Dantas',
      logo: {
        '@type': 'ImageObject',
        '@id': `${baseUrl}/#logo`,
        url: `${baseUrl}/blogflorescerhumano/logos-blog/logo-fundomarrom.webp`,
        width: 512,
        height: 512
      },
      url: baseUrl
    },
    dateCreated: artigo.data_publicacao,
    dateModified: artigo.data_atualizacao || artigo.data_publicacao,
    image: {
      '@type': 'ImageObject',
      '@id': `${articleUrl}#primaryimage`,
      url: imagemCompleta,
      width: 1200,
      height: 630,
      caption: `${artigo.titulo} - Blog Florescer Humano`
    },
    url: articleUrl,
    about: {
      '@type': 'Thing',
      name: categoria?.nome || 'Desenvolvimento Pessoal',
      description: `Conteúdo sobre ${categoria?.nome?.toLowerCase() || 'crescimento pessoal'}`
    },
    genre: 'creative writing',
    wordCount: calculateWordCount(artigo.conteudo),
    inLanguage: 'pt-BR',
    isPartOf: {
      '@type': 'Blog',
      name: 'Blog Florescer Humano',
      url: `${baseUrl}/blogflorescerhumano`
    }
  };
}

/**
 * Utilitários de apoio
 */
function calculateWordCount(content: string | null): number {
  if (!content) return 0;
  
  return content
    .replace(/<[^>]*>/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length;
}

function calculateReadingTime(content: string | null): string {
  const wordCount = calculateWordCount(content);
  const wordsPerMinute = 200;
  const minutes = Math.max(3, Math.ceil(wordCount / wordsPerMinute));
  return `PT${minutes}M`;
}

function extractTextContent(content: string | null): string {
  if (!content) return '';
  
  return content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 2000); // Limita para evitar schemas muito grandes
}
