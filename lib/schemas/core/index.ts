/**
 * 🎯 EXPORTAÇÕES CENTRAIS DO SISTEMA MODULAR
 * 
 * Arquivo índice que centraliza todas as exportações do módulo core
 * e facilita a importação em outros arquivos do sistema.
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - Exports Centrais
 */

// ==========================================
// 🏗️ TIPOS E INTERFACES
// ==========================================

export type {
  // Tipos básicos
  SchemaTypeEnum,
  ArticleStatusType,
  ContentTierType,
  DownloadSourceType,
  ArticleRow,
  
  // Configuração
  SchemaGeneratorConfig,
  
  // Contexto e dados
  SchemaGenerationContext,
  ExtractedSchemaData,
  ArticleSchemaDataExtended,
  ArticleSchemaData,
  
  // Resultados
  SchemaGenerationResult,
  SchemaPerformanceMetrics,
  SchemaDebugData,
  
  // Schemas base
  BaseSchemaFields,
  AuthorSchema,
  PublisherSchema,
  OrganizationSchema,
  ImageSchema,
  ContactPointSchema
} from './types';

export {
  // Configuração padrão
  DEFAULT_SCHEMA_CONFIG,
  
  // Utilitários de tipo
  isValidSchemaType,
  convertToExtendedData
} from './types';

// ==========================================
// 🔧 UTILITÁRIOS
// ==========================================

export {
  // Cálculos de conteúdo
  calculateWordCount,
  calculateReadingTime,
  getContentStats,
  
  // Formatação e URLs
  slugify,
  formatSiteUrl,
  getArticleUrl,
  generateSchemaId,
  
  // Keywords e conteúdo
  extractKeywords,
  formatKeywords,
  
  // Datas
  formatSchemaDate,
  formatDisplayDate,
  
  // Imagens
  generateImageSchema,
  generateMultipleImageSchemas,
  
  // Autor e Publisher
  generateAuthorSchema,
  generatePublisherSchema,
  
  // Validação
  validateRequiredFields,
  hasField,
  isValidUrl,
  isValidEmail,
  
  // Detecção de conteúdo
  isTutorialContent,
  isGuideContent,
  isScholarlyContent,
  detectFAQInContent,
  
  // Utilitários gerais
  cleanText,
  truncateText,
  generateTimestamp,
  deepMerge
} from './utils';

// ==========================================
// 🏗️ CLASSE BASE E FACTORY
// ==========================================

export {
  BaseSchemaGenerator,
  type GeneratorOptions,
  DEFAULT_GENERATOR_OPTIONS
} from './base-schema';

export {
  SchemaGeneratorFactory,
  generateSchemaByFactory,
  generateArticleSchema // Função de compatibilidade (deprecated)
} from './factory';

// ==========================================
// 📝 INFORMAÇÕES DO MÓDULO
// ==========================================

export const SCHEMA_SYSTEM_INFO = {
  name: 'Sistema Modular de Schemas',
  version: '1.0.0',
  description: 'Sistema modular para geração de schemas Schema.org otimizados',
  author: 'GitHub Copilot & Daniel Dantas',
  date: '2025-06-18',
  
  features: [
    'Factory Pattern para geração',
    'Fallback inteligente',
    'Cache automático',
    'Validação Rich Results',
    'Suporte a 26 tipos de schema',
    'Detecção automática de conteúdo',
    'Métricas de performance',
    'Sistema de debugging'
  ],
  
  supportedSchemas: [
    'BlogPosting', 'Article', 'CreativeWork', 'EducationalContent',
    'Course', 'Tutorial', 'Guide', 'FAQPage', 'QAPage',
    'VideoObject', 'AudioObject', 'PodcastEpisode', 'HowTo', 'Recipe',
    'Review', 'CriticReview', 'MedicalWebPage', 'HealthTopicContent',
    'TherapyGuide', 'Event', 'Workshop', 'WebinarEvent',
    'ScholarlyArticle', 'ResearchArticle', 'CaseStudy'
  ],
  
  priority1Schemas: [
    'Tutorial', 'Guide', 'Course', 'QAPage', 'Review', 'ScholarlyArticle'
  ],
  
  implementedGenerators: [
    'BlogPosting', 'Article', 'Tutorial'
  ]
};
