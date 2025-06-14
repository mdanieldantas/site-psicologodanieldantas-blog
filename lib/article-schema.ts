/**
 * Sistema de Schema.org Inteligente para Artigos
 * 
 * Este arquivo gerencia a geração de Schema.org condicional baseado no conteúdo:
 * - BlogPosting + FAQPage para artigos com FAQ
 * - CreativeWork para artigos sem FAQ
 * 
 * @author GitHub Copilot
 * @date 2025-06-14
 * @version 1.0.0
 */

import { SITE_CONFIG, BLOG_CONFIG } from './metadata-config';

// ==========================================
// TIPOS TYPESCRIPT PARA SCHEMA.ORG
// ==========================================

/**
 * Dados básicos do artigo para Schema.org
 */
export interface ArticleSchemaData {
  readonly titulo: string;
  readonly meta_titulo?: string | null;
  readonly resumo?: string | null;
  readonly conteudo: string;
  readonly data_publicacao?: string | null;
  readonly data_atualizacao?: string;
  readonly imagem_capa_arquivo?: string | null;
  readonly categoria: {
    readonly nome: string;
    readonly slug: string;
    readonly descricao?: string | null;
  };
  readonly autor: {
    readonly nome: string;
    readonly biografia?: string | null;
    readonly perfil_academico_url?: string | null;
  };
  readonly slug: string;
  readonly categoriaSlug: string;
}

/**
 * Item individual de FAQ extraído do HTML
 */
export interface FAQItem {
  readonly question: string;
  readonly answer: string;
}

/**
 * Schema.org base para artigos
 */
interface BaseArticleSchema {
  readonly '@context': 'https://schema.org';
  readonly '@type': string;
  readonly headline: string;
  readonly description: string;
  readonly url: string;
  readonly author: {
    readonly '@type': 'Person';
    readonly '@id': string;
    readonly name: string;
    readonly description?: string;
    readonly url?: string;
  };
  readonly publisher: {
    readonly '@type': 'Organization';
    readonly '@id': string;
    readonly name: string;
    readonly url: string;
  };
  readonly datePublished?: string;
  readonly dateModified?: string;
  readonly about?: {
    readonly '@type': 'Thing';
    readonly name: string;
    readonly description?: string;
  };
  readonly image?: {
    readonly '@type': 'ImageObject';
    readonly url: string;
    readonly width: number;
    readonly height: number;
  };
}

// ==========================================
// FUNÇÕES DE DETECÇÃO E EXTRAÇÃO DE FAQ
// ==========================================

/**
 * Detecta se um artigo contém FAQ baseado no padrão HTML específico
 * 
 * Procura pela estrutura exata que você usa nos artigos:
 * - class="faq-accessible"
 * - elementos <details>
 * - class="faq-question"
 * 
 * @param conteudo - HTML do conteúdo do artigo
 * @returns true se contém FAQ
 * 
 * @example
 * ```typescript
 * const hasFAQ = detectFAQInArticle(artigo.conteudo);
 * if (hasFAQ) {
 *   // Gerar BlogPosting + FAQPage
 * } else {
 *   // Gerar CreativeWork
 * }
 * ```
 */
export function detectFAQInArticle(conteudo: string): boolean {
  if (!conteudo || typeof conteudo !== 'string') {
    return false;
  }

  // Verifica se contém todos os elementos necessários do padrão FAQ
  const hasFAQClass = conteudo.includes('class="faq-accessible"');
  const hasDetailsElements = conteudo.includes('<details>');
  const hasFAQQuestions = conteudo.includes('class="faq-question"');
  
  // Só considera FAQ se tiver TODOS os elementos
  return hasFAQClass && hasDetailsElements && hasFAQQuestions;
}

/**
 * Extrai perguntas e respostas do HTML do FAQ
 * 
 * Parseia o HTML para extrair as perguntas e respostas estruturadas
 * que serão usadas no Schema.org FAQPage
 * 
 * @param conteudo - HTML do conteúdo do artigo
 * @returns Array de FAQItems
 * 
 * @example
 * ```typescript
 * const faqItems = extractFAQFromHTML(artigo.conteudo);
 * // [{ question: "O que é...?", answer: "É um conceito..." }]
 * ```
 */
export function extractFAQFromHTML(conteudo: string): FAQItem[] {
  if (!detectFAQInArticle(conteudo)) {
    return [];
  }

  const faqItems: FAQItem[] = [];
  
  try {
    // Regex para extrair perguntas (dentro de span.faq-question)
    const questionRegex = /<span class="faq-question">(.*?)<\/span>/g;
    
    // Regex para extrair respostas (dentro de div.faq-answer)
    const answerRegex = /<div class="faq-answer">\s*<p>(.*?)<\/p>\s*<\/div>/g;
    
    const questions: string[] = [];
    const answers: string[] = [];
    
    // Extrair todas as perguntas
    let questionMatch;
    while ((questionMatch = questionRegex.exec(conteudo)) !== null) {
      questions.push(cleanHTMLText(questionMatch[1]));
    }
    
    // Extrair todas as respostas
    let answerMatch;
    while ((answerMatch = answerRegex.exec(conteudo)) !== null) {
      answers.push(cleanHTMLText(answerMatch[1]));
    }
    
    // Combinar perguntas e respostas
    const minLength = Math.min(questions.length, answers.length);
    for (let i = 0; i < minLength; i++) {
      faqItems.push({
        question: questions[i],
        answer: answers[i]
      });
    }
    
  } catch (error) {
    console.warn('Erro ao extrair FAQ do HTML:', error);
  }
  
  return faqItems;
}

/**
 * Remove tags HTML e limpa texto para uso no Schema.org
 * 
 * @param htmlText - Texto com possíveis tags HTML
 * @returns Texto limpo
 */
function cleanHTMLText(htmlText: string): string {
  return htmlText
    .replace(/<[^>]*>/g, '') // Remove tags HTML
    .replace(/&amp;/g, '&') // Decodifica entidades
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// ==========================================
// GERAÇÃO DE SCHEMA.ORG
// ==========================================

/**
 * Gera Schema.org base compartilhado por todos os tipos de artigo
 * 
 * @param data - Dados do artigo
 * @returns Schema.org base
 */
function generateBaseSchema(data: ArticleSchemaData): BaseArticleSchema {
  const articleUrl = `${SITE_CONFIG.url}/blogflorescerhumano/${data.categoriaSlug}/${data.slug}`;
  const authorUrl = data.autor.perfil_academico_url || SITE_CONFIG.url;
  const imageUrl = data.imagem_capa_arquivo 
    ? `${SITE_CONFIG.url}/images/blog/${data.imagem_capa_arquivo}`
    : `${SITE_CONFIG.url}/blogflorescerhumano/logos-blog/logo-fundomarrom.webp`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting', // Será sobrescrito se for CreativeWork
    headline: data.meta_titulo?.trim() || data.titulo,
    description: data.resumo || `Artigo sobre ${data.categoria.nome} por ${data.autor.nome}.`,
    url: articleUrl,
    
    author: {
      '@type': 'Person',
      '@id': `${SITE_CONFIG.url}/#person-${data.autor.nome.replace(/\s+/g, '-').toLowerCase()}`,
      name: data.autor.nome,
      description: data.autor.biografia || undefined,
      url: authorUrl
    },
    
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url
    },
    
    datePublished: data.data_publicacao || undefined,
    dateModified: data.data_atualizacao || undefined,
    
    about: {
      '@type': 'Thing',
      name: data.categoria.nome,
      description: data.categoria.descricao || undefined
    },
    
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630
    }
  };
}

/**
 * Gera Schema.org BlogPosting com FAQPage integrado
 * 
 * Usado para artigos que contêm FAQ
 * 
 * @param data - Dados do artigo
 * @param faqItems - Perguntas e respostas extraídas
 * @returns Schema.org BlogPosting + FAQPage
 */
export function generateBlogPostWithFAQSchema(data: ArticleSchemaData, faqItems: FAQItem[]) {
  const baseSchema = generateBaseSchema(data);
  
  return {
    ...baseSchema,
    '@type': 'BlogPosting',
    
    // Integrar FAQ como mainEntity
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item, index) => ({
        '@type': 'Question',
        '@id': `${baseSchema.url}#faq-${index + 1}`,
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    },
    
    // Adicionar keywords baseadas no FAQ
    keywords: [
      data.categoria.nome,
      'FAQ',
      'perguntas frequentes',
      ...faqItems.slice(0, 3).map(item => 
        item.question.split(' ').slice(0, 3).join(' ')
      )
    ].join(', ')
  };
}

/**
 * Gera Schema.org CreativeWork simples
 * 
 * Usado para artigos que NÃO contêm FAQ
 * 
 * @param data - Dados do artigo
 * @returns Schema.org CreativeWork
 */
export function generateCreativeWorkSchema(data: ArticleSchemaData) {
  const baseSchema = generateBaseSchema(data);
  
  return {
    ...baseSchema,
    '@type': 'CreativeWork',
    
    // CreativeWork tem propriedades específicas
    genre: data.categoria.nome,
    keywords: [
      data.categoria.nome,
      'psicologia',
      'desenvolvimento pessoal',
      data.autor.nome
    ].join(', '),
    
    // Adicionar informações específicas do trabalho criativo
    creativeWorkStatus: 'Published',
    inLanguage: 'pt-BR'
  };
}

/**
 * Função principal que decide qual Schema.org gerar
 * 
 * Analisa o conteúdo e retorna o schema apropriado:
 * - BlogPosting + FAQ se detectar FAQ
 * - CreativeWork se não detectar FAQ
 * 
 * @param data - Dados completos do artigo
 * @returns Schema.org apropriado
 * 
 * @example
 * ```typescript
 * const schema = generateArticleSchema(articleData);
 * 
 * return (
 *   <script
 *     type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
 *   />
 * );
 * ```
 */
export function generateArticleSchema(data: ArticleSchemaData) {
  const hasFAQ = detectFAQInArticle(data.conteudo);
  
  if (hasFAQ) {
    const faqItems = extractFAQFromHTML(data.conteudo);
    console.log(`📊 Artigo "${data.titulo}" - FAQ detectado com ${faqItems.length} perguntas`);
    return generateBlogPostWithFAQSchema(data, faqItems);
  } else {
    console.log(`📄 Artigo "${data.titulo}" - Sem FAQ, usando CreativeWork`);
    return generateCreativeWorkSchema(data);
  }
}

/**
 * Gera JSON-LD pronto para inserção no HTML
 * 
 * @param data - Dados do artigo
 * @returns Objeto para dangerouslySetInnerHTML
 */
export function generateArticleJsonLd(data: ArticleSchemaData): { __html: string } {
  const schema = generateArticleSchema(data);
  return { __html: JSON.stringify(schema, null, 0) };
}
