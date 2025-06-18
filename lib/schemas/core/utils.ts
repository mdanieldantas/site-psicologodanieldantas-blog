/**
 * 🔧 UTILITÁRIOS COMPARTILHADOS DO SISTEMA MODULAR
 * 
 * Funções utilitárias compartilhadas entre todos os geradores de schema.
 * Inclui cálculos, formatação, validação e manipulação de dados.
 * 
 * 📋 FUNCIONALIDADES:
 * - Cálculo de wordCount e tempo de leitura
 * - Formatação de URLs e slugs
 * - Validação de dados
 * - Extração de keywords
 * - Manipulação de metadados
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - Utilitários Base
 */

import type { 
  ArticleSchemaDataExtended, 
  SchemaTypeEnum,
  BaseSchemaFields,
  AuthorSchema,
  PublisherSchema,
  ImageSchema
} from './types';

// ==========================================
// 📊 CÁLCULOS DE CONTEÚDO
// ==========================================

/**
 * Calcula a contagem de palavras do conteúdo
 * Remove HTML tags e conta palavras reais
 */
export function calculateWordCount(content: string): number {
  if (!content) return 0;
  
  // Remove HTML tags
  const textOnly = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
    
  if (!textOnly) return 0;
  
  // Conta palavras (separadas por espaços)
  return textOnly.split(' ').filter(word => word.length > 0).length;
}

/**
 * Calcula o tempo de leitura estimado em minutos
 * Baseado na média de 200 palavras por minuto para português
 */
export function calculateReadingTime(content: string): number {
  const wordCount = calculateWordCount(content);
  const wordsPerMinute = 200; // Média para português
  
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Extrai estatísticas detalhadas do conteúdo
 */
export function getContentStats(content: string) {
  const wordCount = calculateWordCount(content);
  const readingTime = calculateReadingTime(content);
  const charCount = content.replace(/<[^>]*>/g, '').length;
  const hasImages = /<img[^>]*>/gi.test(content);
  const hasVideos = /<video[^>]*>/gi.test(content) || content.includes('youtube') || content.includes('vimeo');
  const hasLinks = /<a[^>]*>/gi.test(content);
  
  return {
    wordCount,
    readingTime,
    charCount,
    hasImages,
    hasVideos,
    hasLinks
  };
}

// ==========================================
// 🔤 FORMATAÇÃO E SLUGS
// ==========================================

/**
 * Converte texto para slug URL-friendly
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-')     // Substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, '');        // Remove hífens do início e fim
}

/**
 * Formata URL completa do site
 */
export function formatSiteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://psicologodanieldantas.com';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Gera URL canônica do artigo
 */
export function getArticleUrl(categoria: string, slug: string): string {
  return formatSiteUrl(`/blogflorescerhumano/${categoria}/${slug}`);
}

/**
 * Gera ID único para Schema.org
 */
export function generateSchemaId(type: string, identifier: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://psicologodanieldantas.com';
  return `${baseUrl}/#${type}-${identifier}`;
}

// ==========================================
// 🏷️ EXTRAÇÃO DE KEYWORDS
// ==========================================

/**
 * Extrai keywords relevantes do conteúdo
 */
export function extractKeywords(
  content: string, 
  categoria?: string, 
  tags?: string[],
  maxKeywords: number = 10
): string[] {
  const keywords = new Set<string>();
  
  // Adicionar categoria
  if (categoria) {
    keywords.add(categoria.toLowerCase());
  }
  
  // Adicionar tags
  if (tags) {
    tags.forEach(tag => keywords.add(tag.toLowerCase()));
  }
  
  // Palavras-chave base da psicologia
  const baseKeywords = [
    'psicologia', 'desenvolvimento pessoal', 'saúde mental',
    'terapia', 'psicólogo', 'bem-estar', 'autoconhecimento'
  ];
  
  baseKeywords.forEach(keyword => keywords.add(keyword));
  
  // Extrair palavras importantes do conteúdo
  const textOnly = content
    .replace(/<[^>]*>/g, ' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
    
  // Palavras-chave comuns em psicologia
  const psychKeywords = [
    'ansiedade', 'depressão', 'estresse', 'relacionamento',
    'autoestima', 'comportamento', 'emoção', 'sentimento',
    'mindfulness', 'meditação', 'focalização', 'terapia',
    'crescimento', 'transformação', 'consciência'
  ];
  
  psychKeywords.forEach(keyword => {
    if (textOnly.includes(keyword)) {
      keywords.add(keyword);
    }
  });
  
  return Array.from(keywords).slice(0, maxKeywords);
}

/**
 * Gera string de keywords formatada para Schema.org
 */
export function formatKeywords(keywords: string[]): string {
  return keywords.join(', ');
}

// ==========================================
// 📅 FORMATAÇÃO DE DATAS
// ==========================================

/**
 * Formata data para ISO 8601 (Schema.org)
 */
export function formatSchemaDate(date: string | Date | null): string {
  if (!date) return new Date().toISOString();
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Verificar se a data é válida
  if (isNaN(dateObj.getTime())) {
    return new Date().toISOString();
  }
  
  return dateObj.toISOString();
}

/**
 * Formata data para exibição legível
 */
export function formatDisplayDate(date: string | Date | null): string {
  if (!date) return 'Data não disponível';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Data inválida';
  }
  
  return dateObj.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ==========================================
// 🖼️ SCHEMAS DE IMAGEM
// ==========================================

/**
 * Gera schema de imagem padrão
 */
export function generateImageSchema(
  imagePath?: string | null, 
  caption?: string
): ImageSchema | undefined {
  if (!imagePath) return undefined;
  
  // URL completa da imagem
  const imageUrl = imagePath.startsWith('http') 
    ? imagePath 
    : formatSiteUrl(`/images/${imagePath}`);
    
  return {
    '@type': 'ImageObject',
    url: imageUrl,
    caption: caption || 'Imagem do artigo'
  };
}

/**
 * Gera múltiplas imagens para schema
 */
export function generateMultipleImageSchemas(imagePaths: string[]): ImageSchema[] {
  return imagePaths
    .filter(path => path && path.trim())
    .map(path => generateImageSchema(path))
    .filter((img): img is ImageSchema => img !== undefined);
}

// ==========================================
// 👤 SCHEMAS DE AUTOR E PUBLISHER
// ==========================================

/**
 * Gera schema de autor baseado nos dados
 */
export function generateAuthorSchema(
  authorName: string,
  authorId?: number
): AuthorSchema {
  const authorSlug = slugify(authorName);
  
  return {
    '@type': 'Person',
    '@id': generateSchemaId('person', authorSlug),
    name: authorName,
    url: formatSiteUrl(`/autor/${authorSlug}`),
    jobTitle: 'Psicólogo',
    worksFor: {
      '@type': 'Organization',
      name: 'Psicólogo Daniel Dantas',
      url: formatSiteUrl('/')
    },
    knowsAbout: [
      'Psicologia',
      'Terapia',
      'Desenvolvimento Pessoal',
      'Saúde Mental',
      'Focalização'
    ]
  };
}

/**
 * Gera schema de publisher (organização)
 */
export function generatePublisherSchema(): PublisherSchema {
  return {
    '@type': 'Organization',
    '@id': generateSchemaId('organization', 'psicologodanieldantas'),
    name: 'Psicólogo Daniel Dantas',
    url: formatSiteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: formatSiteUrl('/images/logo-daniel-dantas.webp'),
      width: 200,
      height: 200
    },
    sameAs: [
      'https://www.instagram.com/psicologodanieldantas',
      'https://www.youtube.com/@psicologodanieldantas'
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        url: formatSiteUrl('/contato')
      }
    ]
  };
}

// ==========================================
// 🔍 VALIDAÇÃO
// ==========================================

/**
 * Valida se os campos obrigatórios estão presentes
 */
export function validateRequiredFields(
  schema: any, 
  requiredFields: string[]
): string[] {
  const warnings: string[] = [];
  
  for (const field of requiredFields) {
    if (!hasField(schema, field)) {
      warnings.push(`Campo obrigatório faltando: ${field}`);
    }
  }
  
  return warnings;
}

/**
 * Verifica se um campo existe no objeto (suporta notação de ponto)
 */
export function hasField(obj: any, path: string): boolean {
  return path.split('.').reduce((current, key) => current?.[key], obj) !== undefined;
}

/**
 * Valida URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ==========================================
// 🎯 DETECÇÃO DE CONTEÚDO
// ==========================================

/**
 * Detecta se o conteúdo é um tutorial
 */
export function isTutorialContent(content: string): boolean {
  const tutorialIndicators = [
    'passo a passo', 'como fazer', 'tutorial', 'guia',
    'primeiro passo', 'segundo passo', 'etapa', 'instrução'
  ];
  
  const lowerContent = content.toLowerCase();
  return tutorialIndicators.some(indicator => lowerContent.includes(indicator));
}

/**
 * Detecta se o conteúdo é um guia
 */
export function isGuideContent(content: string): boolean {
  const guideIndicators = [
    'guia completo', 'guia', 'orientação', 'diretrizes',
    'recomendações', 'dicas', 'estratégias'
  ];
  
  const lowerContent = content.toLowerCase();
  return guideIndicators.some(indicator => lowerContent.includes(indicator));
}

/**
 * Detecta se o conteúdo é acadêmico/científico
 */
export function isScholarlyContent(content: string): boolean {
  const scholarlyIndicators = [
    'pesquisa', 'estudo', 'investigação', 'análise',
    'metodologia', 'resultado', 'conclusão', 'referência',
    'bibliografia', 'evidência', 'dados'
  ];
  
  const lowerContent = content.toLowerCase();
  const indicatorCount = scholarlyIndicators.filter(indicator => 
    lowerContent.includes(indicator)
  ).length;
  
  return indicatorCount >= 3; // Pelo menos 3 indicadores acadêmicos
}

/**
 * Detecta FAQ no conteúdo HTML
 */
export function detectFAQInContent(content: string): Array<{question: string, answer: string}> {
  const faqs: Array<{question: string, answer: string}> = [];
  
  // Padrões para detectar FAQs
  const patterns = [
    /<h[3-6][^>]*>(.*?pergunta.*?|.*?\?.*?)<\/h[3-6]>\s*<p[^>]*>(.*?)<\/p>/gi,
    /<strong[^>]*>(.*?\?.*?)<\/strong>\s*<p[^>]*>(.*?)<\/p>/gi,
    /<dt[^>]*>(.*?)<\/dt>\s*<dd[^>]*>(.*?)<\/dd>/gi
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const question = match[1].replace(/<[^>]*>/g, '').trim();
      const answer = match[2].replace(/<[^>]*>/g, '').trim();
      
      if (question && answer && question.length > 10 && answer.length > 20) {
        faqs.push({ question, answer });
      }
    }
  });
  
  return faqs;
}

// ==========================================
// 🛠️ UTILITÁRIOS GERAIS
// ==========================================

/**
 * Limpa texto removendo HTML e normalizando espaços
 */
export function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Trunca texto preservando palavras
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
}

/**
 * Gera timestamp único para IDs
 */
export function generateTimestamp(): string {
  return Date.now().toString(36);
}

/**
 * Merge deep de objetos
 */
export function deepMerge(target: any, source: any): any {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}
