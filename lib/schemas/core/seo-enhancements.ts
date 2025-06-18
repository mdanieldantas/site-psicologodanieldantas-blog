/**
 * 🚀 TIPOS PARA MELHORIAS SEO 2025
 * 
 * Tipos específicos para as melhorias identificadas pelo relatório SEO,
 * implementando padrões Google 2025 sem quebrar o sistema existente.
 * 
 * 📋 CARACTERÍSTICAS:
 * - E-A-T (Expertise, Authoritativeness, Trustworthiness)
 * - Rich Results otimizados
 * - Fallbacks inteligentes
 * - Extração automática de dados
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - SEO Enhancements
 */

import type { SchemaTypeEnum } from './types';

// ==========================================
// 🏥 E-A-T (EXPERTISE, AUTHORITATIVENESS, TRUSTWORTHINESS)
// ==========================================

/**
 * Dados de autoridade médica/psicológica (E-A-T)
 */
export interface MedicalAuthorityData {
  /** Credenciais profissionais */
  credentials: MedicalCredential[];
  
  /** Especialidade médica principal */
  primarySpecialty: string;
  
  /** Áreas de expertise */
  expertiseAreas: string[];
  
  /** Organização profissional */
  professionalAffiliation?: OrganizationData;
  
  /** Licenças e certificações */
  licenses: string[];
  
  /** Anos de experiência */
  yearsOfExperience?: number;
  
  /** URL de verificação profissional */
  verificationUrl?: string;
}

/**
 * Credencial médica individual
 */
export interface MedicalCredential {
  /** Tipo de credencial */
  credentialCategory: string;
  
  /** Nome da credencial */
  name: string;
  
  /** Organização que reconhece */
  recognizedBy: OrganizationData;
  
  /** Data de obtenção */
  dateObtained?: string;
  
  /** Data de expiração */
  expiryDate?: string;
  
  /** URL de verificação */
  verificationUrl?: string;
}

/**
 * Dados de organização
 */
export interface OrganizationData {
  /** Nome da organização */
  name: string;
  
  /** URL oficial */
  url?: string;
  
  /** Tipo de organização */
  type?: string;
  
  /** País/região */
  location?: string;
}

/**
 * Dados de revisão médica
 */
export interface MedicalReviewData {
  /** Data da última revisão */
  lastReviewed: string;
  
  /** Revisor responsável */
  reviewedBy: ReviewerData;
  
  /** Processo de revisão */
  reviewProcess?: string;
  
  /** Próxima revisão agendada */
  nextReviewDate?: string;
  
  /** Versão do conteúdo */
  contentVersion?: string;
}

/**
 * Dados do revisor
 */
export interface ReviewerData {
  /** Nome do revisor */
  name: string;
  
  /** Credenciais */
  credentials: string[];
  
  /** Organização */
  affiliation?: string;
  
  /** URL de perfil */
  profileUrl?: string;
}

// ==========================================
// 📋 RICH RESULTS ESTRUTURADOS
// ==========================================

/**
 * Dados para HowTo Rich Results
 */
export interface HowToData {
  /** Nome do procedimento */
  name: string;
  
  /** Descrição do procedimento */
  description: string;
  
  /** Tempo total estimado */
  totalTime: string; // ISO 8601 duration (PT15M)
  
  /** Custo estimado */
  estimatedCost?: MonetaryAmount;
  
  /** Passos estruturados */
  steps: HowToStep[];
  
  /** Ferramentas necessárias */
  tools?: HowToTool[];
  
  /** Materiais necessários */
  supplies?: HowToSupply[];
  
  /** Confiança na extração */
  extractionConfidence: number;
}

/**
 * Passo individual do HowTo
 */
export interface HowToStep {
  /** Tipo Schema.org */
  '@type': 'HowToStep';
  
  /** Nome do passo */
  name: string;
  
  /** Texto explicativo */
  text: string;
  
  /** Posição na sequência */
  position: number;
  
  /** URL da imagem (opcional) */
  image?: string;
  
  /** URL do vídeo (opcional) */
  video?: string;
  
  /** Tempo estimado para este passo */
  timeRequired?: string;
  
  /** Dicas adicionais */
  tip?: string;
}

/**
 * Ferramenta necessária para HowTo
 */
export interface HowToTool {
  /** Tipo Schema.org */
  '@type': 'HowToTool';
  
  /** Nome da ferramenta */
  name: string;
  
  /** Descrição */
  description?: string;
}

/**
 * Material necessário para HowTo
 */
export interface HowToSupply {
  /** Tipo Schema.org */
  '@type': 'HowToSupply';
  
  /** Nome do material */
  name: string;
  
  /** Descrição */
  description?: string;
  
  /** Quantidade */
  quantity?: string;
}

/**
 * Valor monetário
 */
export interface MonetaryAmount {
  /** Tipo Schema.org */
  '@type': 'MonetaryAmount';
  
  /** Valor */
  value: number;
  
  /** Moeda */
  currency: string;
}

/**
 * Dados para FAQ Rich Results aprimorado
 */
export interface EnhancedFAQData {
  /** Perguntas estruturadas */
  questions: EnhancedFAQQuestion[];
  
  /** Categoria das perguntas */
  category?: string;
  
  /** Audiência-alvo */
  audience?: string;
  
  /** Data da última atualização */
  lastUpdated?: string;
  
  /** Confiança na estruturação */
  structuringConfidence: number;
}

/**
 * Pergunta FAQ aprimorada
 */
export interface EnhancedFAQQuestion {
  /** Texto da pergunta */
  question: string;
  
  /** Resposta completa */
  answer: string;
  
  /** Autor da resposta */
  author?: string;
  
  /** Categoria da pergunta */
  category?: string;
  
  /** Palavras-chave relacionadas */
  keywords?: string[];
  
  /** Data da resposta */
  dateAnswered?: string;
  
  /** Confiança na resposta */
  answerConfidence?: number;
}

/**
 * Dados para VideoObject aprimorado
 */
export interface EnhancedVideoData {
  /** Nome do vídeo */
  name: string;
  
  /** Descrição */
  description: string;
  
  /** URL do conteúdo */
  contentUrl: string;
  
  /** URL para embed */
  embedUrl?: string;
  
  /** Duração (ISO 8601) */
  duration?: string;
  
  /** Data de upload */
  uploadDate?: string;
  
  /** URL da thumbnail */
  thumbnailUrl?: string;
  
  /** Transcrição */
  transcript?: string;
  
  /** Idioma */
  inLanguage?: string;
  
  /** Visualizações */
  interactionCount?: number;
}

/**
 * Dados para PodcastEpisode aprimorado
 */
export interface EnhancedPodcastData {
  /** Nome do episódio */
  name: string;
  
  /** Descrição */
  description: string;
  
  /** URL do áudio */
  contentUrl: string;
  
  /** Duração (ISO 8601) */
  duration?: string;
  
  /** Data de publicação */
  datePublished?: string;
  
  /** Número do episódio */
  episodeNumber?: number;
  
  /** Temporada */
  partOfSeason?: number;
  
  /** Série/Podcast pai */
  partOfSeries?: PodcastSeriesData;
  
  /** Transcrição */
  transcript?: string;
  
  /** Tópicos abordados */
  about?: string[];
}

/**
 * Dados da série de podcast
 */
export interface PodcastSeriesData {
  /** Tipo Schema.org */
  '@type': 'PodcastSeries';
  
  /** Nome da série */
  name: string;
  
  /** Descrição */
  description?: string;
  
  /** URL da série */
  url?: string;
}

// ==========================================
// 🔍 EXTRAÇÃO AUTOMÁTICA
// ==========================================

/**
 * Resultado da extração automática de dados
 */
export interface AutoExtractionResult<T> {
  /** Dados extraídos */
  data: T;
  
  /** Confiança na extração (0-1) */
  confidence: number;
  
  /** Método usado para extração */
  extractionMethod: ExtractionMethod;
  
  /** Warnings durante extração */
  warnings: string[];
  
  /** Tempo de extração em ms */
  extractionTime: number;
}

/**
 * Métodos de extração automática
 */
export type ExtractionMethod = 
  | 'content-analysis'    // Análise do conteúdo HTML
  | 'heading-structure'   // Estrutura de cabeçalhos
  | 'list-detection'      // Detecção de listas
  | 'pattern-matching'    // Padrões no texto
  | 'ai-inference'        // Inferência por IA
  | 'fallback-generation' // Geração de fallback
  | 'manual-override';    // Override manual

/**
 * Configuração para extração automática
 */
export interface ExtractionConfig {
  /** Habilitar extração automática */
  enableAutoExtraction: boolean;
  
  /** Confiança mínima para usar extração */
  minimumConfidence: number;
  
  /** Timeout para extração em ms */
  extractionTimeout: number;
  
  /** Métodos habilitados */
  enabledMethods: ExtractionMethod[];
  
  /** Usar fallbacks se extração falhar */
  useFallbacks: boolean;
}

// ==========================================
// 🎯 SCHEMA 2025 ENHANCEMENTS
// ==========================================

/**
 * Extensões para Article/BlogPosting 2025
 */
export interface Article2025Extensions {
  /** Conteúdo falado (voice search) */
  speakable?: SpeakableSpecification;
  
  /** História por trás do artigo */
  backstory?: string;
  
  /** Correções editoriais */
  correction?: CorrectionData[];
  
  /** Informações de financiamento */
  funding?: string;
  
  /** Tempo de referência do conteúdo */
  contentReferenceTime?: string;
  
  /** Cobertura temporal */
  temporalCoverage?: string;
}

/**
 * Especificação para conteúdo falado
 */
export interface SpeakableSpecification {
  /** Tipo Schema.org */
  '@type': 'SpeakableSpecification';
  
  /** Seletores CSS para conteúdo falado */
  cssSelector?: string[];
  
  /** XPath para conteúdo falado */
  xpath?: string[];
}

/**
 * Dados de correção editorial
 */
export interface CorrectionData {
  /** Tipo Schema.org */
  '@type': 'CorrectionNotice';
  
  /** URL da versão original */
  url?: string;
  
  /** Data da correção */
  datePublished: string;
  
  /** Texto da correção */
  text: string;
}

/**
 * Dados para conteúdo médico especializado
 */
export interface MedicalContentData {
  /** Audiência médica específica */
  medicalAudience?: MedicalAudienceType[];
  
  /** Condições médicas abordadas */
  about?: MedicalConditionData[];
  
  /** Especialidade médica */
  specialty?: string;
  
  /** Nível de evidência */
  evidenceLevel?: EvidenceLevel;
  
  /** Conteúdo principal da página */
  mainContentOfPage?: string[];
}

/**
 * Tipos de audiência médica
 */
export type MedicalAudienceType = 
  | 'Patient'
  | 'MedicalProfessional'
  | 'Caregiver'
  | 'Student'
  | 'Researcher';

/**
 * Dados de condição médica
 */
export interface MedicalConditionData {
  /** Tipo Schema.org */
  '@type': 'MedicalCondition';
  
  /** Nome da condição */
  name: string;
  
  /** Nomes alternativos */
  alternateName?: string[];
  
  /** Código médico */
  code?: MedicalCodeData;
  
  /** Sinais e sintomas */
  signOrSymptom?: string[];
}

/**
 * Código médico
 */
export interface MedicalCodeData {
  /** Tipo Schema.org */
  '@type': 'MedicalCode';
  
  /** Valor do código */
  codeValue: string;
  
  /** Sistema de codificação */
  codingSystem: string;
  
  /** URL de referência */
  url?: string;
}

/**
 * Níveis de evidência médica
 */
export type EvidenceLevel = 
  | 'EvidenceLevelA'
  | 'EvidenceLevelB' 
  | 'EvidenceLevelC'
  | 'EvidenceLevelD'
  | 'ExpertOpinion';

// ==========================================
// 🛠️ UTILIDADES DE DESENVOLVIMENTO
// ==========================================

/**
 * Resultado de validação SEO
 */
export interface SEOValidationResult {
  /** Schema é válido */
  isValid: boolean;
  
  /** Pontuação SEO (0-100) */
  seoScore: number;
  
  /** Avisos de otimização */
  optimizationWarnings: string[];
  
  /** Sugestões de melhoria */
  improvements: string[];
  
  /** Compatibilidade com Rich Results */
  richResultsCompatibility: RichResultType[];
  
  /** Campos faltantes para otimização */
  missingFields: string[];
}

/**
 * Tipos de Rich Results suportados
 */
export type RichResultType = 
  | 'Article'
  | 'BlogPosting'
  | 'FAQ'
  | 'HowTo'
  | 'Video'
  | 'Podcast'
  | 'Event'
  | 'Review'
  | 'Course'
  | 'Medical'
  | 'Recipe'
  | 'BreadcrumbList';

/**
 * Métricas de performance do schema
 */
export interface SchemaPerformanceMetrics {
  /** Tempo de geração em ms */
  generationTime: number;
  
  /** Tamanho do schema em bytes */
  schemaSize: number;
  
  /** Número de campos */
  fieldCount: number;
  
  /** Memória utilizada em MB */
  memoryUsage: number;
  
  /** Cache hit ratio */
  cacheHitRatio?: number;
}

/**
 * Configuração avançada de geração
 */
export interface AdvancedGenerationConfig {
  /** Habilitar cache */
  enableCaching: boolean;
  
  /** TTL do cache em minutos */
  cacheTTL: number;
  
  /** Habilitar compressão */
  enableCompression: boolean;
  
  /** Nível de verbosidade dos logs */
  logLevel: 'silent' | 'error' | 'warn' | 'info' | 'debug';
  
  /** Validar schema contra Schema.org */
  validateAgainstSchemaOrg: boolean;
  
  /** Incluir metadados de debug */
  includeDebugMetadata: boolean;
}

// ==========================================
// 🚀 EXPORTAÇÕES PRINCIPAIS
// ==========================================
// Tipos já são exportados via declaração das interfaces acima
