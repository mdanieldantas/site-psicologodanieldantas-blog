/**
 * 🏗️ CLASSE BASE PARA GERADORES DE SCHEMA
 * 
 * Classe abstrata que define a interface e funcionalidades compartilhadas
 * entre todos os geradores de schema específicos.
 * 
 * 📋 FUNCIONALIDADES:
 * - Interface padrão para geração
 * - Campos base compartilhados
 * - Validação automática
 * - Sistema de warnings e erros
 * - Métricas de performance
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - Base Generator
 */

import type {
  SchemaGenerationContext,
  SchemaGenerationResult,
  BaseSchemaFields,
  SchemaTypeEnum,
  SchemaPerformanceMetrics,
  SchemaDebugData
} from './types';

import {
  generateAuthorSchema,
  generatePublisherSchema,
  generateImageSchema,
  formatSchemaDate,
  formatKeywords,
  extractKeywords,
  getArticleUrl,
  generateSchemaId,
  validateRequiredFields,
  getContentStats
} from './utils';

// ==========================================
// 🏗️ CLASSE BASE ABSTRATA
// ==========================================

/**
 * Classe base abstrata para todos os geradores de schema
 * Define a interface comum e implementa funcionalidades compartilhadas
 */
export abstract class BaseSchemaGenerator {
  /** Tipo de schema que este gerador produz */
  protected abstract readonly schemaType: SchemaTypeEnum;
  
  /** Campos obrigatórios para este tipo de schema */
  protected abstract readonly requiredFields: string[];
  
  /** Versão do gerador */
  protected readonly version: string = '1.0.0';
  
  /**
   * Método principal para geração de schema (deve ser implementado pelas subclasses)
   */
  public abstract generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult>;
  
  /**
   * Gera campos base presentes em todos os schemas
   */
  protected generateBaseFields(context: SchemaGenerationContext): BaseSchemaFields {
    const { article } = context;
    
    const articleUrl = getArticleUrl(article.categoria_principal, article.slug);
    
    return {
      '@context': 'https://schema.org',
      '@type': this.schemaType,
      '@id': generateSchemaId(this.schemaType.toLowerCase(), article.slug),
      headline: this.truncateHeadline(article.titulo),
      description: this.generateDescription(article),
      url: articleUrl,      datePublished: formatSchemaDate(article.data_publicacao || null),
      dateModified: formatSchemaDate(article.data_atualizacao || null),
      author: generateAuthorSchema(article.autor_principal, article.autor_id),
      publisher: generatePublisherSchema(),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl
      },
      image: generateImageSchema(article.imagem_capa_arquivo, `Imagem do artigo: ${article.titulo}`),
      keywords: formatKeywords(extractKeywords(
        article.conteudo, 
        article.categoria_principal, 
        article.tags
      )),
      inLanguage: 'pt-BR',
      isAccessibleForFree: article.content_tier === 'free'
    };
  }
  
  /**
   * Valida o schema gerado e retorna warnings
   */
  protected validateSchema(schema: any): string[] {
    const warnings: string[] = [];
    
    // Validar campos obrigatórios
    const requiredWarnings = validateRequiredFields(schema, this.requiredFields);
    warnings.push(...requiredWarnings);
    
    // Validações específicas do Schema.org
    if (!schema.headline || schema.headline.length > 110) {
      warnings.push('Headline deve ter entre 1-110 caracteres para otimização SEO');
    }
    
    if (!schema.description || schema.description.length < 50 || schema.description.length > 160) {
      warnings.push('Description deve ter entre 50-160 caracteres para otimização SEO');
    }
    
    if (!schema.image) {
      warnings.push('Imagem recomendada para rich results');
    }
    
    return warnings;
  }
  
  /**
   * Cria o resultado final da geração
   */
  protected createResult(
    schema: any,
    context: SchemaGenerationContext,
    startTime: number,
    warnings: string[] = [],
    errors: string[] = []
  ): SchemaGenerationResult {
    const endTime = Date.now();
    const generationTime = endTime - startTime;
    
    // Métricas de performance
    const performance: SchemaPerformanceMetrics = {
      generationTime,
      schemaSize: JSON.stringify(schema).length,
      fieldsCount: this.countFields(schema)
    };
    
    // Dados de debug (apenas em desenvolvimento)
    const debug: SchemaDebugData | undefined = context.config.environment === 'development' ? {
      factoryVersion: context.config.version,
      selectedSchemaType: this.schemaType,
      detectionReason: this.getDetectionReason(context),
      timestamp: new Date().toISOString(),
      wordCount: getContentStats(context.article.conteudo).wordCount,
      readingTime: getContentStats(context.article.conteudo).readingTime,
      fallbackChain: context.fallbackChain,
      extractedFields: context.extractedData?.extractedFields
    } : undefined;
    
    return {
      schema,
      schemaType: this.schemaType,
      source: 'manual', // Será sobrescrito pela factory
      confidence: 1.0,   // Será sobrescrito pela factory
      warnings,
      errors,
      performance,
      debug
    };
  }
  
  /**
   * Gera descrição otimizada para o schema
   */
  protected generateDescription(article: any): string {
    // Prioridade: meta_descricao > resumo > truncate(conteudo)
    if (article.meta_descricao && article.meta_descricao.length >= 50) {
      return article.meta_descricao;
    }
    
    if (article.resumo && article.resumo.length >= 50) {
      return article.resumo;
    }
    
    // Extrair primeira sentença significativa do conteúdo
    const content = article.conteudo.replace(/<[^>]*>/g, ' ').trim();
    const sentences = content.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      const cleanSentence = sentence.trim();
      if (cleanSentence.length >= 50 && cleanSentence.length <= 160) {
        return cleanSentence + '.';
      }
    }
    
    // Fallback: truncar conteúdo
    return this.truncateDescription(content);
  }
  
  /**
   * Trunca headline para limite do Google
   */
  protected truncateHeadline(title: string): string {
    if (title.length <= 110) return title;
    
    const truncated = title.substring(0, 107);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 50 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }
  
  /**
   * Trunca descrição para otimização SEO
   */
  protected truncateDescription(text: string): string {
    if (text.length <= 160) return text;
    
    const truncated = text.substring(0, 157);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 100 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }
  
  /**
   * Conta o número total de campos no schema
   */
  protected countFields(obj: any, depth: number = 0): number {
    if (depth > 5) return 0; // Evitar loops infinitos
    
    let count = 0;
    
    for (const key in obj) {
      count++;
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        count += this.countFields(obj[key], depth + 1);
      }
    }
    
    return count;
  }
  
  /**
   * Determina a razão da detecção do schema
   */
  protected getDetectionReason(context: SchemaGenerationContext): string {
    if (context.manualSchemaType) {
      return `Schema manual definido: ${context.manualSchemaType}`;
    }
    
    if (context.article.schema_type_backup) {
      return `Schema backup usado: ${context.article.schema_type_backup}`;
    }
    
    if (context.extractedData) {
      return `Detectado automaticamente por ${context.extractedData.extractorUsed} (confiança: ${context.extractedData.confidence})`;
    }
    
    return 'Fallback padrão';
  }
  
  /**
   * Adiciona campos multimídia se disponíveis
   */
  protected addMultimediaFields(schema: any, article: any): any {
    const enhanced = { ...schema };
    
    // Vídeo
    if (article.url_video) {
      enhanced.video = {
        '@type': 'VideoObject',
        '@id': generateSchemaId('video', article.slug),
        name: `Vídeo: ${article.titulo}`,
        description: this.generateDescription(article),
        uploadDate: formatSchemaDate(article.data_publicacao),
        contentUrl: article.url_video,
        embedUrl: article.url_video
      };
    }
    
    // Podcast/Audio
    if (article.url_podcast) {
      enhanced.audio = {
        '@type': 'AudioObject',
        '@id': generateSchemaId('audio', article.slug),
        name: `Podcast: ${article.titulo}`,
        description: this.generateDescription(article),
        uploadDate: formatSchemaDate(article.data_publicacao),
        contentUrl: article.url_podcast
      };
    }
    
    // Download
    if (article.download_url) {
      enhanced.downloadUrl = article.download_url;
      enhanced.fileFormat = article.download_format || 'application/pdf';
      
      if (article.download_size_mb) {
        enhanced.contentSize = `${article.download_size_mb}MB`;
      }
    }
    
    return enhanced;
  }
  
  /**
   * Adiciona FAQ estruturado se disponível
   */
  protected addFAQFields(schema: any, article: any): any {
    if (!article.faq_data || !Array.isArray(article.faq_data)) {
      return schema;
    }
    
    const faqSchema = {
      '@type': 'FAQPage',
      '@id': generateSchemaId('faq', article.slug),
      mainEntity: article.faq_data.map((faq: any, index: number) => ({
        '@type': 'Question',
        '@id': generateSchemaId('question', `${article.slug}-${index + 1}`),
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          '@id': generateSchemaId('answer', `${article.slug}-${index + 1}`),
          text: faq.answer
        }
      }))
    };
    
    return {
      ...schema,
      mainEntity: [
        ...(schema.mainEntity || []),
        ...faqSchema.mainEntity
      ]
    };
  }
  
  /**
   * Método helper para logging consistente
   */
  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const prefix = `[${this.schemaType} Generator]`;
    
    switch (level) {
      case 'info':
        console.log(`✅ ${prefix} ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`⚠️ ${prefix} ${message}`, data || '');
        break;
      case 'error':
        console.error(`❌ ${prefix} ${message}`, data || '');
        break;
    }
  }
}

// ==========================================
// 🔧 INTERFACES AUXILIARES
// ==========================================

/**
 * Interface para configurações específicas do gerador
 */
export interface GeneratorOptions {
  enableMultimedia?: boolean;
  enableFAQ?: boolean;
  enableAdvancedFields?: boolean;
  strictValidation?: boolean;
}

/**
 * Configuração padrão para geradores
 */
export const DEFAULT_GENERATOR_OPTIONS: GeneratorOptions = {
  enableMultimedia: true,
  enableFAQ: true,
  enableAdvancedFields: true,
  strictValidation: false
};
