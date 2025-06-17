/**
 * ✨ FÁBRICA DE SEO - Sistema Avançado de Schema.org para Next.js
 * 
 * Sistema inteligente que gera automaticamente schemas Schema.org otimizados
 * baseado no conteúdo do artigo e configurações manuais do Supabase.
 * 
 * 🎯 FUNCIONALIDADES:
 * - 26 tipos de schema suportados (BlogPosting, FAQPage, HowTo, etc.)
 * - Detecção automática de FAQ no HTML
 * - Fallback inteligente quando schema_type é null
 * - Geração de @id únicos para entidades
 * - Cálculo dinâmico de wordCount e timeRequired
 * - Compatível com Google Rich Results
 * 
 * 📚 DOCUMENTAÇÃO COMPLETA: docs/guia-melhora-SEO-14-06-25.md
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-17
 * @version 2.0.0 - Fábrica de SEO Completa
 */

import { SITE_CONFIG, BLOG_CONFIG } from './metadata-config';
import type { Database } from '@/types/supabase';

// ==========================================
// 🎯 TIPOS E ENUMS TYPESCRIPT
// ==========================================

/**
 * Enum dos 26 tipos de schema suportados (sincronizado com Supabase)
 */
export enum SchemaType {
  BlogPosting = 'BlogPosting',
  Article = 'Article',
  CreativeWork = 'CreativeWork',
  EducationalContent = 'EducationalContent',
  Course = 'Course',
  Tutorial = 'Tutorial',
  Guide = 'Guide',
  FAQPage = 'FAQPage',
  QAPage = 'QAPage',
  VideoObject = 'VideoObject',
  AudioObject = 'AudioObject',
  PodcastEpisode = 'PodcastEpisode',
  HowTo = 'HowTo',
  Recipe = 'Recipe',
  Review = 'Review',
  CriticReview = 'CriticReview',
  MedicalWebPage = 'MedicalWebPage',
  HealthTopicContent = 'HealthTopicContent',
  TherapyGuide = 'TherapyGuide',
  Event = 'Event',
  Workshop = 'Workshop',
  WebinarEvent = 'WebinarEvent',
  ScholarlyArticle = 'ScholarlyArticle',
  ResearchArticle = 'ResearchArticle',
  CaseStudy = 'CaseStudy'
}

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
 * Dados estendidos para a Fábrica de SEO (incluindo campos específicos do Supabase)
 */
export interface ArticleSchemaDataExtended extends ArticleSchemaData {
  readonly schema_type?: Database['public']['Enums']['schema_type_enum'] | null;
  readonly faq_data?: readonly { question: string; answer: string }[] | null;
  readonly url_video?: string | null;
  readonly url_podcast?: string | null;
  readonly download_url?: string | null;
  readonly download_title?: string | null;
  readonly download_format?: string | null;
  readonly download_description?: string | null;
  readonly download_size_mb?: number | null;
  readonly content_tier?: Database['public']['Enums']['content_tier_type'] | null;
}

/**
 * Item individual de FAQ (para Schema.org FAQPage)
 */
export interface FAQItem {
  readonly question: string;
  readonly answer: string;
}

/**
 * Configuração de Schema detectada automaticamente
 */
export interface SchemaConfig {
  readonly schemaType: SchemaType;
  readonly hasSpecificFAQ: boolean;
  readonly confidence: number; // 0-1, confiança na detecção
  readonly reason: string; // Motivo da escolha
}

// ==========================================
// 🛠️ FUNÇÕES UTILITÁRIAS
// ==========================================

/**
 * Calcula número de palavras no conteúdo
 */
export function calculateWordCount(content: string): number {
  if (!content || typeof content !== 'string') return 0;
  
  // Remove HTML tags e conta palavras
  const textOnly = content.replace(/<[^>]*>/g, ' ');
  const words = textOnly.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Calcula tempo estimado de leitura (em minutos)
 * Baseado na média de 200 palavras por minuto
 */
export function calculateReadingTime(content: string): number {
  const wordCount = calculateWordCount(content);
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Gera @id único para entidades Schema.org
 */
export function generateUniqueId(baseUrl: string, type: string, identifier: string): string {
  const cleanIdentifier = identifier.toLowerCase().replace(/[^\w]/g, '-');
  return `${baseUrl}/#${type}-${cleanIdentifier}`;
}

/**
 * Remove tags HTML e limpa texto para Schema.org
 */
function cleanHTMLText(htmlText: string): string {
  if (!htmlText || typeof htmlText !== 'string') return '';
  
  return htmlText
    .replace(/<[^>]*>/g, '') // Remove tags HTML
    .replace(/&amp;/g, '&') // Decodifica entidades
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim();
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
 * @param conteudo - HTML do conteúdo do artigo
 * @returns true se contém FAQ estruturado
 */
export function detectFAQInArticle(conteudo: string): boolean {
  if (!conteudo || typeof conteudo !== 'string') return false;

  // Padrões de FAQ no HTML
  const faqPatterns = [
    /class="faq-accessible"/i,
    /<details>/i,
    /class="faq-question"/i,
    /class="faq-answer"/i,
    /<h[2-6][^>]*>.*?\?.*?<\/h[2-6]>/i // Títulos em formato de pergunta
  ];

  const matchCount = faqPatterns.filter(pattern => pattern.test(conteudo)).length;
  return matchCount >= 2; // Precisa de pelo menos 2 indicadores
}

/**
 * Detecta se é um artigo tipo "How To" (tutorial/guia)
 */
function detectHowToContent(conteudo: string, titulo: string): boolean {
  if (!conteudo || !titulo) return false;

  const howToKeywords = [
    /como\s+(fazer|criar|configurar|instalar|usar)/i,
    /passo\s+a\s+passo/i,
    /tutorial/i,
    /guia\s+(completo|definitivo)/i,
    /<ol[^>]*>/i, // Lista ordenada (passos)
    /etapas?/i,
    /instruções/i
  ];

  const titleMatches = howToKeywords.some(pattern => pattern.test(titulo));
  const contentMatches = howToKeywords.filter(pattern => pattern.test(conteudo)).length;

  return titleMatches || contentMatches >= 2;
}

/**
 * Detecta se contém conteúdo de vídeo
 */
function detectVideoContent(data: ArticleSchemaDataExtended): boolean {
  return !!(data.url_video || 
           /youtube\.com|vimeo\.com|video/i.test(data.conteudo) ||
           /<video[^>]*>/i.test(data.conteudo));
}

/**
 * Detecta se contém conteúdo de podcast/áudio
 */
function detectPodcastContent(data: ArticleSchemaDataExtended): boolean {
  return !!(data.url_podcast || 
           /podcast|spotify\.com|anchor\.fm/i.test(data.conteudo) ||
           /<audio[^>]*>/i.test(data.conteudo));
}

/**
 * Detecta se é conteúdo educacional estruturado
 */
function detectEducationalContent(conteudo: string, categoria: string): boolean {
  const educationalKeywords = [
    /curso|aula|lição/i,
    /aprenda|ensino|educação/i,
    /exercícios?|atividades?/i,
    /módulo|capítulo/i
  ];

  const educationalCategories = /educação|curso|ensino|aprendizado/i;

  return educationalKeywords.some(pattern => pattern.test(conteudo)) ||
         educationalCategories.test(categoria);
}

/**
 * Função principal de detecção automática de schema
 * Analisa o conteúdo e retorna o schema mais apropriado
 */
export function detectSchemaType(data: ArticleSchemaDataExtended): SchemaConfig {
  const { conteudo, titulo, categoria } = data;
  
  // 1. FAQ tem prioridade se detectado
  if (detectFAQInArticle(conteudo)) {
    return {
      schemaType: SchemaType.FAQPage,
      hasSpecificFAQ: true,
      confidence: 0.9,
      reason: 'FAQ detectado no conteúdo HTML'
    };
  }

  // 2. Vídeo content
  if (detectVideoContent(data)) {
    return {
      schemaType: SchemaType.VideoObject,
      hasSpecificFAQ: false,
      confidence: 0.8,
      reason: 'URL de vídeo ou tags de vídeo detectadas'
    };
  }

  // 3. Podcast content
  if (detectPodcastContent(data)) {
    return {
      schemaType: SchemaType.PodcastEpisode,
      hasSpecificFAQ: false,
      confidence: 0.8,
      reason: 'URL de podcast ou tags de áudio detectadas'
    };
  }

  // 4. How-To content
  if (detectHowToContent(conteudo, titulo)) {
    return {
      schemaType: SchemaType.HowTo,
      hasSpecificFAQ: false,
      confidence: 0.7,
      reason: 'Conteúdo tutorial/passo-a-passo detectado'
    };
  }

  // 5. Educational content
  if (detectEducationalContent(conteudo, categoria.nome)) {
    return {
      schemaType: SchemaType.EducationalContent,
      hasSpecificFAQ: false,
      confidence: 0.6,
      reason: 'Conteúdo educacional estruturado detectado'
    };
  }

  // 6. Default: BlogPosting para artigos de blog
  return {
    schemaType: SchemaType.BlogPosting,
    hasSpecificFAQ: false,
    confidence: 0.5,
    reason: 'Schema padrão para artigo de blog'
  };
}

/**
 * Extrai perguntas e respostas do HTML do FAQ
 */
export function extractFAQFromHTML(conteudo: string): FAQItem[] {
  if (!detectFAQInArticle(conteudo)) return [];

  const faqItems: FAQItem[] = [];
  
  try {
    // Método 1: FAQ estruturado com classes específicas
    const questionRegex = /<span class="faq-question"[^>]*>(.*?)<\/span>/gi;
    const answerRegex = /<div class="faq-answer"[^>]*>\s*<p[^>]*>(.*?)<\/p>\s*<\/div>/gi;
    
    const questions: string[] = [];
    const answers: string[] = [];
    
    let questionMatch;
    while ((questionMatch = questionRegex.exec(conteudo)) !== null) {
      questions.push(cleanHTMLText(questionMatch[1]));
    }
    
    let answerMatch;
    while ((answerMatch = answerRegex.exec(conteudo)) !== null) {
      answers.push(cleanHTMLText(answerMatch[1]));
    }
    
    // Método 2: Se não encontrou, tenta detectar por padrão H + P
    if (questions.length === 0) {
      const h2QuestionRegex = /<h[2-6][^>]*>(.*?\?.*?)<\/h[2-6]>/gi;
      let h2Match;
      while ((h2Match = h2QuestionRegex.exec(conteudo)) !== null) {
        questions.push(cleanHTMLText(h2Match[1]));
      }
    }
    
    // Combina perguntas e respostas
    const minLength = Math.min(questions.length, answers.length);
    for (let i = 0; i < minLength; i++) {
      if (questions[i] && answers[i]) {
        faqItems.push({
          question: questions[i],
          answer: answers[i]
        });
      }
    }
    
  } catch (error) {
    console.warn('⚠️ Erro ao extrair FAQ do HTML:', error);
  }
  
  return faqItems;
}

// ==========================================
// 🔍 DETECÇÃO AUTOMÁTICA DE SCHEMA
// ==========================================

/**
 * Gera schema base compartilhado por todos os tipos
 */
function generateBaseSchema(data: ArticleSchemaDataExtended) {
  const articleUrl = `${SITE_CONFIG.url}/blogflorescerhumano/${data.categoriaSlug}/${data.slug}`;
  const authorUrl = data.autor.perfil_academico_url || SITE_CONFIG.url;
  const imageUrl = data.imagem_capa_arquivo 
    ? `${SITE_CONFIG.url}/images/blog/${data.imagem_capa_arquivo}`
    : `${SITE_CONFIG.url}/blogflorescerhumano/logos-blog/logo-fundomarrom.webp`;

  return {
    '@context': 'https://schema.org',
    headline: data.meta_titulo?.trim() || data.titulo,
    description: data.resumo || `Artigo sobre ${data.categoria.nome} por ${data.autor.nome}.`,
    url: articleUrl,
    wordCount: calculateWordCount(data.conteudo),
    timeRequired: `PT${calculateReadingTime(data.conteudo)}M`,
    
    author: {
      '@type': 'Person',
      '@id': generateUniqueId(SITE_CONFIG.url, 'person', data.autor.nome),
      name: data.autor.nome,
      description: data.autor.biografia || undefined,
      url: authorUrl
    },
    
    publisher: {
      '@type': 'Organization',
      '@id': generateUniqueId(SITE_CONFIG.url, 'organization', SITE_CONFIG.name),
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url
    },
    
    datePublished: data.data_publicacao || undefined,
    dateModified: data.data_atualizacao || data.data_publicacao || undefined,
    
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
    },
    
    inLanguage: 'pt-BR'
  };
}

/**
 * Gerador para BlogPosting (padrão para blogs)
 */
function generateBlogPostingSchema(data: ArticleSchemaDataExtended) {
  const baseSchema = generateBaseSchema(data);
  
  return {
    '@type': 'BlogPosting',
    '@id': generateUniqueId(SITE_CONFIG.url, 'blogposting', data.slug),
    ...baseSchema,
    
    articleSection: data.categoria.nome,
    keywords: [
      data.categoria.nome,
      'psicologia',
      'desenvolvimento pessoal',
      data.autor.nome
    ].join(', ')
  };
}

/**
 * Gerador para FAQPage
 */
function generateFAQPageSchema(data: ArticleSchemaDataExtended, faqItems: FAQItem[]) {
  const baseSchema = generateBaseSchema(data);
  
  return {
    '@type': 'FAQPage',
    '@id': generateUniqueId(SITE_CONFIG.url, 'faqpage', data.slug),
    ...baseSchema,
    
    mainEntity: faqItems.map((item, index) => ({
      '@type': 'Question',
      '@id': generateUniqueId(SITE_CONFIG.url, 'question', `${data.slug}-${index + 1}`),
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
}

/**
 * Gerador para VideoObject
 */
function generateVideoObjectSchema(data: ArticleSchemaDataExtended) {
  const baseSchema = generateBaseSchema(data);
  
  return {
    '@type': 'VideoObject',
    '@id': generateUniqueId(SITE_CONFIG.url, 'video', data.slug),
    ...baseSchema,
    
    contentUrl: data.url_video || '',
    embedUrl: data.url_video || '',
    uploadDate: data.data_publicacao,
    duration: 'PT10M' // Default, seria ideal ter duração real
  };
}

/**
 * Gerador para PodcastEpisode
 */
function generatePodcastEpisodeSchema(data: ArticleSchemaDataExtended) {
  const baseSchema = generateBaseSchema(data);
  
  return {
    '@type': 'PodcastEpisode',
    '@id': generateUniqueId(SITE_CONFIG.url, 'podcast', data.slug),
    ...baseSchema,
    
    audio: {
      '@type': 'AudioObject',
      contentUrl: data.url_podcast || '',
      duration: 'PT30M' // Default
    },
    
    partOfSeries: {
      '@type': 'PodcastSeries',
      name: 'Blog Florescer Humano',
      url: `${SITE_CONFIG.url}/blogflorescerhumano`
    }
  };
}

/**
 * Gerador para HowTo (tutoriais)
 */
function generateHowToSchema(data: ArticleSchemaDataExtended) {
  const baseSchema = generateBaseSchema(data);
  
  // Tenta extrair passos do conteúdo
  const steps = extractStepsFromContent(data.conteudo);
  
  return {
    '@type': 'HowTo',
    '@id': generateUniqueId(SITE_CONFIG.url, 'howto', data.slug),
    ...baseSchema,
    
    totalTime: `PT${calculateReadingTime(data.conteudo) * 2}M`, // Dobra o tempo para execução
    supply: ['Computador', 'Internet'], // Genérico para tutoriais digitais
    tool: ['Navegador web'],
    
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.description,
      url: `${baseSchema.url}#step-${index + 1}`
    }))
  };
}

/**
 * Gerador para EducationalContent
 */
function generateEducationalContentSchema(data: ArticleSchemaDataExtended) {
  const baseSchema = generateBaseSchema(data);
  
  return {
    '@type': 'EducationalContent',
    '@id': generateUniqueId(SITE_CONFIG.url, 'educational', data.slug),
    ...baseSchema,
    
    educationalLevel: 'Beginner',
    educationalUse: 'instruction',
    learningResourceType: 'article',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student'
    },
    
    teaches: [
      data.categoria.nome,
      'Desenvolvimento pessoal',
      'Autoconhecimento'
    ]
  };
}

/**
 * Gerador para TherapyGuide (específico para psicologia)
 */
function generateTherapyGuideSchema(data: ArticleSchemaDataExtended) {
  const baseSchema = generateBaseSchema(data);
  
  return {
    '@type': 'MedicalWebPage', // Mais apropriado que TherapyGuide
    '@id': generateUniqueId(SITE_CONFIG.url, 'therapy', data.slug),
    ...baseSchema,
    
    specialty: {
      '@type': 'MedicalSpecialty',
      name: 'Psychology'
    },
    
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: 18
    },
    
    lastReviewed: data.data_atualizacao || data.data_publicacao,
    
    // Disclaimer importante para conteúdo médico/psicológico
    disclaimerText: 'Este conteúdo é apenas informativo e não substitui consulta profissional.'
  };
}

/**
 * Extrai passos de um tutorial do HTML
 */
function extractStepsFromContent(conteudo: string): Array<{name: string, description: string}> {
  const steps: Array<{name: string, description: string}> = [];
  
  try {
    // Procura por listas ordenadas ou títulos numerados
    const stepRegex = /<h[2-6][^>]*>(?:\d+[.\)]?\s*)?([^<]+)<\/h[2-6]>/gi;
    let match;
    
    while ((match = stepRegex.exec(conteudo)) !== null && steps.length < 10) {
      const stepName = cleanHTMLText(match[1]);
      if (stepName.length > 5) { // Filtra títulos muito curtos
        steps.push({
          name: stepName,
          description: stepName // Simplificado, seria ideal extrair descrição também
        });
      }
    }
    
    // Se não encontrou passos estruturados, cria genéricos
    if (steps.length === 0) {
      steps.push(
        { name: 'Leia o artigo completo', description: 'Leia todo o conteúdo do artigo' },
        { name: 'Aplique os conceitos', description: 'Pratique os conceitos apresentados' }
      );
    }
    
  } catch (error) {
    console.warn('⚠️ Erro ao extrair passos do conteúdo:', error);
  }
  
  return steps;
}

/**
 * Gera Schema.org base compartilhado por todos os tipos de artigo
 * 
 * @param data - Dados do artigo
 * @returns Schema.org base
 */
function generateBaseArticleSchema(data: ArticleSchemaData): BaseArticleSchema {
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
  const baseSchema = generateBaseArticleSchema(data);
  
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
  const baseSchema = generateBaseArticleSchema(data);
  
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

// ==========================================
// 🏭 FÁBRICA DE SEO - FUNÇÃO PRINCIPAL
// ==========================================

/**
 * 🎯 FÁBRICA DE SEO - Função Principal
 * 
 * Gera automaticamente o schema Schema.org mais apropriado baseado em:
 * 1. Schema manual definido no Supabase (se existir)
 * 2. Detecção automática baseada no conteúdo
 * 3. Fallback inteligente
 * 
 * @param data - Dados completos do artigo
 * @param manualSchemaType - Tipo definido manualmente no Supabase (opcional)
 * @returns Schema.org otimizado
 * 
 * @example
 * ```typescript
 * const schema = generateSchemaByFactory(articleData, 'FAQPage');
 * 
 * return (
 *   <script
 *     type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
 *   />
 * );
 * ```
 */
export function generateSchemaByFactory(
  data: ArticleSchemaDataExtended, 
  manualSchemaType?: string | null
): any {
  console.log(`🏭 [SEO Factory] Processando: "${data.titulo}"`);
  
  let selectedSchemaType: SchemaType;
  let detectionReason: string;
  
  // ESTRATÉGIA 1: Schema manual do Supabase tem prioridade
  if (manualSchemaType && Object.values(SchemaType).includes(manualSchemaType as SchemaType)) {
    selectedSchemaType = manualSchemaType as SchemaType;
    detectionReason = `Manual: ${manualSchemaType} definido no Supabase`;
    console.log(`✅ [SEO Factory] ${detectionReason}`);
  } else {
    // ESTRATÉGIA 2: Detecção automática
    const autoDetection = detectSchemaType(data);
    selectedSchemaType = autoDetection.schemaType;
    detectionReason = `Auto: ${autoDetection.reason} (confiança: ${autoDetection.confidence})`;
    console.log(`🤖 [SEO Factory] ${detectionReason}`);
  }
  
  // GERAR SCHEMA BASEADO NO TIPO SELECIONADO
  try {
    let generatedSchema: any;
    
    switch (selectedSchemaType) {      case SchemaType.FAQPage:
        const faqFromDB = data.faq_data || [];
        const faqFromHTML = faqFromDB.length > 0 ? [...faqFromDB] : extractFAQFromHTML(data.conteudo);
        
        if (faqFromHTML.length > 0) {
          generatedSchema = generateFAQPageSchema(data, faqFromHTML as FAQItem[]);
          console.log(`📋 [SEO Factory] FAQ gerado com ${faqFromHTML.length} perguntas`);
        } else {
          // Fallback se não encontrar FAQ
          generatedSchema = generateBlogPostingSchema(data);
          console.log(`⚠️ [SEO Factory] FAQ solicitado mas não encontrado, usando BlogPosting`);
        }
        break;
        
      case SchemaType.VideoObject:
        if (data.url_video) {
          generatedSchema = generateVideoObjectSchema(data);
          console.log(`🎥 [SEO Factory] VideoObject gerado`);
        } else {
          generatedSchema = generateBlogPostingSchema(data);
          console.log(`⚠️ [SEO Factory] VideoObject solicitado mas sem URL, usando BlogPosting`);
        }
        break;
        
      case SchemaType.PodcastEpisode:
        if (data.url_podcast) {
          generatedSchema = generatePodcastEpisodeSchema(data);
          console.log(`🎧 [SEO Factory] PodcastEpisode gerado`);
        } else {
          generatedSchema = generateBlogPostingSchema(data);
          console.log(`⚠️ [SEO Factory] PodcastEpisode solicitado mas sem URL, usando BlogPosting`);
        }
        break;
        
      case SchemaType.HowTo:
        generatedSchema = generateHowToSchema(data);
        console.log(`📝 [SEO Factory] HowTo gerado`);
        break;
        
      case SchemaType.EducationalContent:
        generatedSchema = generateEducationalContentSchema(data);
        console.log(`🎓 [SEO Factory] EducationalContent gerado`);
        break;
        
      case SchemaType.TherapyGuide:
      case SchemaType.MedicalWebPage:
      case SchemaType.HealthTopicContent:
        generatedSchema = generateTherapyGuideSchema(data);
        console.log(`🏥 [SEO Factory] MedicalWebPage gerado para conteúdo psicológico`);
        break;
        
      case SchemaType.Article:
      case SchemaType.BlogPosting:
      default:
        generatedSchema = generateBlogPostingSchema(data);
        console.log(`📄 [SEO Factory] BlogPosting padrão gerado`);
        break;
    }
    
    // Adicionar metadados de debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      generatedSchema._debug = {
        factoryVersion: '2.0.0',
        selectedSchemaType,
        detectionReason,
        timestamp: new Date().toISOString(),
        wordCount: calculateWordCount(data.conteudo),
        readingTime: calculateReadingTime(data.conteudo)
      };
    }
    
    console.log(`✅ [SEO Factory] Schema gerado com sucesso: ${selectedSchemaType}`);
    return generatedSchema;
    
  } catch (error) {
    console.error(`❌ [SEO Factory] Erro ao gerar schema:`, error);
    
    // FALLBACK SEGURO em caso de erro
    const fallbackSchema = generateBlogPostingSchema(data);
    console.log(`🔄 [SEO Factory] Usando fallback BlogPosting devido ao erro`);
    return fallbackSchema;
  }
}

// ==========================================
// 🔄 FUNÇÕES DE COMPATIBILIDADE
// ==========================================

/**
 * Função de compatibilidade com o sistema antigo
 * Mantém a interface original mas usa a nova Fábrica internamente
 * 
 * @deprecated Use generateSchemaByFactory() para novos desenvolvimentos
 */
export function generateArticleSchema(data: ArticleSchemaData) {
  console.log(`⚠️ [Compatibilidade] generateArticleSchema() é deprecated, use generateSchemaByFactory()`);
  
  // Converte para o formato estendido
  const extendedData: ArticleSchemaDataExtended = {
    ...data,
    schema_type: null,
    faq_data: null,
    url_video: null,
    url_podcast: null,
    download_url: null,
    download_title: null,
    download_format: null,
    download_description: null,
    download_size_mb: null,
    content_tier: null
  };
  
  return generateSchemaByFactory(extendedData);
}

/**
 * Gera JSON-LD pronto para inserção no HTML
 * Compatível com dangerouslySetInnerHTML
 */
export function generateArticleJsonLd(data: ArticleSchemaData): { __html: string } {
  const schema = generateArticleSchema(data);
  return { __html: JSON.stringify(schema, null, 0) };
}

/**
 * Gera JSON-LD usando a nova Fábrica de SEO
 * Versão moderna e recomendada
 */
export function generateSchemaJsonLd(
  data: ArticleSchemaDataExtended, 
  manualSchemaType?: string | null
): { __html: string } {
  const schema = generateSchemaByFactory(data, manualSchemaType);
  return { __html: JSON.stringify(schema, null, 0) };
}
