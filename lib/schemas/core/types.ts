/**
 * 🎯 TIPOS CENTRAIS DO SISTEMA MODULAR DE SCHEMAS
 * 
 * Define todas as interfaces, tipos e enums necessários para o sistema
 * modular de geração de schemas Schema.org
 * 
 * 📋 CARACTERÍSTICAS:
 * - Interfaces para configuração e contexto
 * - Tipos para resultados de geração
 * - Schemas base e utilitários
 * - Compatibilidade total com Supabase
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - Sistema Modular Inicial
 */

import type { Database } from '@/types/supabase';

// ==========================================
// 🗄️ TIPOS SUPABASE (SINCRONIZADOS)
// ==========================================

/**
 * Tipos de schema suportados (sincronizado com Supabase enum)
 */
export type SchemaTypeEnum = Database['public']['Enums']['schema_type_enum'];

/**
 * Status do artigo (sincronizado com Supabase)
 */
export type ArticleStatusType = Database['public']['Enums']['article_status_type'];

/**
 * Tier de conteúdo (sincronizado com Supabase)
 */
export type ContentTierType = Database['public']['Enums']['content_tier_type'];

/**
 * Fonte de download (sincronizado com Supabase)
 */
export type DownloadSourceType = Database['public']['Enums']['download_source_type'];

/**
 * Dados do artigo da tabela Supabase
 */
export type ArticleRow = Database['public']['Tables']['artigos']['Row'];

// ==========================================
// 🔧 CONFIGURAÇÃO DO SISTEMA
// ==========================================

/**
 * Configuração global do gerador de schemas
 */
export interface SchemaGeneratorConfig {
  /** Habilitar fallback automático em caso de erro */
  enableFallback: boolean;
  
  /** Habilitar extratores automáticos de schema */
  enableExtractors: boolean;
  
  /** Priorizar schema manual definido no banco */
  prioritizeManual: boolean;
  
  /** Habilitar cache de schemas gerados */
  cacheEnabled: boolean;
  
  /** Habilitar validação com Google Rich Results */
  enableValidation: boolean;
  
  /** Ambiente de execução */
  environment: 'development' | 'production' | 'test';
  
  /** Versão da fábrica de SEO */
  version: string;
}

/**
 * Configuração padrão do sistema
 */
export const DEFAULT_SCHEMA_CONFIG: SchemaGeneratorConfig = {
  enableFallback: true,
  enableExtractors: true,
  prioritizeManual: true,
  cacheEnabled: true,
  enableValidation: false, // Desabilitado por padrão para performance
  environment: process.env.NODE_ENV as any || 'development',
  version: '1.0.0'
};

// ==========================================
// 🎯 CONTEXTO DE GERAÇÃO
// ==========================================

/**
 * Contexto completo para geração de schema
 * Contém todos os dados necessários para qualquer tipo de schema
 */
export interface SchemaGenerationContext {
  /** Dados completos do artigo */
  article: ArticleSchemaDataExtended;
  
  /** Tipo de schema manual definido (prioridade máxima) */
  manualSchemaType?: SchemaTypeEnum | null;
  
  /** Dados extraídos automaticamente do conteúdo */
  extractedData?: ExtractedSchemaData;
  
  /** Cadeia de fallback para tentativas */
  fallbackChain: SchemaTypeEnum[];
  
  /** Configuração do sistema */
  config: SchemaGeneratorConfig;
  
  /** Metadados adicionais */
  metadata?: {
    userAgent?: string;
    requestId?: string;
    timestamp?: string;
  };
}

/**
 * Dados extraídos automaticamente do conteúdo
 */
export interface ExtractedSchemaData {
  /** Tipo de schema detectado automaticamente */
  detectedType: SchemaTypeEnum;
  
  /** Nível de confiança da detecção (0-1) */
  confidence: number;
  
  /** Campos específicos extraídos do conteúdo */
  extractedFields: Record<string, any>;
  
  /** Nome do extrator que fez a detecção */
  extractorUsed: string;
  
  /** Razões da detecção */
  detectionReasons: string[];
  
  /** Tempo gasto na extração (ms) */
  extractionTime: number;
}

// ==========================================
// 📊 RESULTADO DA GERAÇÃO
// ==========================================

/**
 * Resultado completo da geração de schema
 */
export interface SchemaGenerationResult {
  /** Schema Schema.org gerado */
  schema: any;
  
  /** Tipo final do schema usado */
  schemaType: SchemaTypeEnum;
  
  /** Fonte do schema: manual, backup, extrator ou fallback */
  source: 'manual' | 'backup' | 'extractor' | 'fallback';
  
  /** Nível de confiança do resultado (0-1) */
  confidence: number;
  
  /** Avisos e observações */
  warnings: string[];
  
  /** Erros não críticos */
  errors: string[];
  
  /** Métricas de performance */
  performance: SchemaPerformanceMetrics;
  
  /** Dados de debug (apenas desenvolvimento) */
  debug?: SchemaDebugData;
}

/**
 * Métricas de performance da geração
 */
export interface SchemaPerformanceMetrics {
  /** Tempo total de geração (ms) */
  generationTime: number;
  
  /** Tempo de extração (ms) */
  extractionTime?: number;
  
  /** Tempo de validação (ms) */
  validationTime?: number;
  
  /** Tamanho do schema gerado (bytes) */
  schemaSize?: number;
  
  /** Número de campos gerados */
  fieldsCount?: number;
}

/**
 * Dados de debug (apenas desenvolvimento)
 */
export interface SchemaDebugData {
  /** Versão da fábrica */
  factoryVersion: string;
  
  /** Tipo selecionado */
  selectedSchemaType: SchemaTypeEnum;
  
  /** Razão da seleção */
  detectionReason: string;
  
  /** Timestamp da geração */
  timestamp: string;
  
  /** Contagem de palavras */
  wordCount: number;
  
  /** Tempo de leitura estimado */
  readingTime: number;
  
  /** Cadeia de fallback usada */
  fallbackChain: SchemaTypeEnum[];
  
  /** Campos extraídos */
  extractedFields?: Record<string, any>;
}

// ==========================================
// 📋 SCHEMAS BASE
// ==========================================

/**
 * Campos base presentes em todos os schemas
 */
export interface BaseSchemaFields {
  '@context': string;
  '@type': string;
  '@id'?: string;
  name?: string;
  headline: string;
  description?: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: AuthorSchema | AuthorSchema[];
  publisher: PublisherSchema;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  image?: ImageSchema;
  keywords?: string | string[];
  inLanguage?: string;
  isAccessibleForFree?: boolean;
}

/**
 * Schema de autor
 */
export interface AuthorSchema {
  '@type': 'Person';
  '@id'?: string;
  name: string;
  url?: string;
  image?: ImageSchema;
  sameAs?: string[];
  jobTitle?: string;
  worksFor?: OrganizationSchema;
  knowsAbout?: string[];
}

/**
 * Schema de organização/publisher
 */
export interface PublisherSchema {
  '@type': 'Organization';
  '@id'?: string;
  name: string;
  url?: string;
  logo?: ImageSchema;
  sameAs?: string[];
  contactPoint?: ContactPointSchema[];
}

/**
 * Schema de organização
 */
export interface OrganizationSchema {
  '@type': 'Organization';
  '@id'?: string;
  name: string;
  url?: string;
  logo?: ImageSchema;
}

/**
 * Schema de imagem
 */
export interface ImageSchema {
  '@type': 'ImageObject';
  '@id'?: string;
  url: string;
  width?: number;
  height?: number;
  caption?: string;
}

/**
 * Schema de ponto de contato
 */
export interface ContactPointSchema {
  '@type': 'ContactPoint';
  contactType: string;
  url?: string;
  email?: string;
  telephone?: string;
}

// ==========================================
// 🔄 COMPATIBILIDADE COM SISTEMA ANTIGO
// ==========================================

/**
 * Dados estendidos do artigo (compatibilidade + novos campos)
 */
export interface ArticleSchemaDataExtended {
  // Campos principais
  id: number;
  titulo: string;
  slug: string;
  conteudo: string;
  resumo?: string | null;
  meta_titulo?: string | null;
  meta_descricao?: string | null;
  
  // Organização
  status: ArticleStatusType;
  categoria_id: number;
  autor_id: number;
  subcategoria_id?: number | null;
  
  // SEO e Schema
  schema_type?: SchemaTypeEnum | null;
  content_tier?: ContentTierType | null;
  schema_type_backup?: string | null;
  faq_data?: any; // JSON FAQ estruturado
  
  // Multimídia
  url_video?: string | null;
  url_podcast?: string | null;
  download_url?: string | null;
  download_title?: string | null;
  download_description?: string | null;
  download_format?: string | null;
  download_size_mb?: number | null;
  download_source?: DownloadSourceType | null;
  
  // Metadados
  imagem_capa_arquivo?: string | null;
  data_publicacao?: string | null;
  data_criacao: string;
  data_atualizacao: string;
  
  // Dados relacionados (populated)
  categoria_principal: string;
  subcategoria_nome?: string | null;
  autor_principal: string;
  tags?: string[];
  
  // Campos calculados
  wordCount?: number;
  readingTime?: number;
}

/**
 * Dados básicos do artigo (sistema antigo)
 * @deprecated Use ArticleSchemaDataExtended para novos desenvolvimentos
 */
export interface ArticleSchemaData {
  id: number;
  titulo: string;
  slug: string;
  conteudo: string;
  resumo?: string;
  data_publicacao?: string;
  data_atualizacao: string;
  imagem_capa_arquivo?: string;
  categoria: {
    id: number;
    nome: string;
    slug: string;
  };
  subcategoria?: {
    id: number;
    nome: string;
    slug: string;
  } | null;
  autor: {
    id: number;
    nome: string;
    slug: string;
    bio?: string;
  };
  tags?: Array<{
    id: number;
    nome: string;
    slug: string;
  }>;
}

// ==========================================
// 🔧 UTILITÁRIOS DE TIPO
// ==========================================

/**
 * Verifica se um valor é um SchemaTypeEnum válido
 */
export function isValidSchemaType(value: any): value is SchemaTypeEnum {
  const validTypes: SchemaTypeEnum[] = [
    'BlogPosting', 'Article', 'CreativeWork', 'EducationalContent',
    'Course', 'Tutorial', 'Guide', 'FAQPage', 'QAPage',
    'VideoObject', 'AudioObject', 'PodcastEpisode', 'HowTo', 'Recipe',
    'Review', 'CriticReview', 'MedicalWebPage', 'HealthTopicContent',
    'TherapyGuide', 'Event', 'Workshop', 'WebinarEvent',
    'ScholarlyArticle', 'ResearchArticle', 'CaseStudy'
  ];
  
  return typeof value === 'string' && validTypes.includes(value as SchemaTypeEnum);
}

/**
 * Converte dados antigos para o formato estendido
 */
export function convertToExtendedData(oldData: ArticleSchemaData): ArticleSchemaDataExtended {
  return {
    ...oldData,
    status: 'publicado' as ArticleStatusType,
    categoria_id: oldData.categoria.id,
    autor_id: oldData.autor.id,
    subcategoria_id: oldData.subcategoria?.id || null,
    categoria_principal: oldData.categoria.nome,
    subcategoria_nome: oldData.subcategoria?.nome || null,
    autor_principal: oldData.autor.nome,
    tags: oldData.tags?.map(tag => tag.nome) || [],
    content_tier: 'free' as ContentTierType,
    schema_type: null,
    schema_type_backup: null,
    faq_data: null,
    url_video: null,
    url_podcast: null,
    download_url: null,
    download_title: null,
    download_description: null,
    download_format: null,
    download_size_mb: null,
    download_source: 'None' as DownloadSourceType,
    data_criacao: oldData.data_atualizacao // Usar data_atualizacao como fallback
  };
}
