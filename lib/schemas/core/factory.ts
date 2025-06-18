/**
 * 🏭 FACTORY DE GERADORES DE SCHEMA
 * 
 * Factory Pattern que coordena todos os geradores de schema específicos.
 * Implementa a lógica de fallback inteligente conforme definido no guia.
 * 
 * 📋 LÓGICA DE PRIORIDADE:
 * 1. Manual → Schema definido no banco (schema_type)
 * 2. Backup → Schema backup do banco (schema_type_backup)  
 * 3. Automático → Detecção via extratores (se habilitado)
 * 4. Fallback → BlogPosting seguro
 * 
 * 🛡️ CARACTERÍSTICAS DE SEGURANÇA:
 * - Fallback automático em qualquer erro
 * - Validação de tipos de schema
 * - Sistema de métricas e logging
 * - Cache opcional para performance
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - Factory Inicial
 */

import type {
  SchemaGenerationContext,
  SchemaGenerationResult,
  SchemaTypeEnum,
  SchemaGeneratorConfig,
  ArticleSchemaDataExtended,
  ExtractedSchemaData
} from './types';

import { BaseSchemaGenerator } from './base-schema';
import { isValidSchemaType } from './types';

// ==========================================
// 🏭 FACTORY PRINCIPAL
// ==========================================

/**
 * Factory responsável por coordenar a geração de schemas
 */
export class SchemaGeneratorFactory {
  private static generators = new Map<SchemaTypeEnum, BaseSchemaGenerator>();
  private static cache = new Map<string, SchemaGenerationResult>();
  
  /**
   * Registra um gerador para um tipo específico de schema
   */
  static registerGenerator(type: SchemaTypeEnum, generator: BaseSchemaGenerator): void {
    this.generators.set(type, generator);
    console.log(`📝 [Factory] Gerador registrado: ${type}`);
  }
  
  /**
   * Remove um gerador (útil para testes)
   */
  static unregisterGenerator(type: SchemaTypeEnum): void {
    this.generators.delete(type);
    console.log(`🗑️ [Factory] Gerador removido: ${type}`);
  }
  
  /**
   * Lista todos os geradores disponíveis
   */
  static getAvailableGenerators(): SchemaTypeEnum[] {
    return Array.from(this.generators.keys());
  }
  
  /**
   * Verifica se um gerador está disponível
   */
  static hasGenerator(type: SchemaTypeEnum): boolean {
    return this.generators.has(type);
  }
  
  /**
   * Gera schema seguindo a lógica de fallback inteligente
   */
  static async generateSchema(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article, config } = context;
    
    try {
      console.log(`🏭 [Factory] Iniciando geração de schema para artigo: ${article.titulo}`);
      
      // Gerar chave de cache
      const cacheKey = this.generateCacheKey(context);
      
      // Verificar cache se habilitado
      if (config.cacheEnabled && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey)!;
        console.log(`💾 [Factory] Schema encontrado no cache: ${cached.schemaType}`);
        return cached;
      }
      
      // 1. PRIORIDADE MANUAL: Schema definido manualmente
      if (context.manualSchemaType) {
        const result = await this.tryGenerateSchema(context.manualSchemaType, context, 'manual');
        if (result) {
          console.log(`✅ [Factory] Schema manual gerado: ${context.manualSchemaType}`);
          return this.cacheAndReturn(cacheKey, result, config);
        }
      }
      
      // 2. BACKUP: Schema backup do banco
      if (article.schema_type_backup && isValidSchemaType(article.schema_type_backup)) {
        const result = await this.tryGenerateSchema(article.schema_type_backup, context, 'backup');
        if (result) {
          console.log(`🔄 [Factory] Schema backup usado: ${article.schema_type_backup}`);
          return this.cacheAndReturn(cacheKey, result, config);
        }
      }
      
      // 3. AUTOMÁTICO: Detecção via extratores
      if (config.enableExtractors && context.extractedData) {
        const { detectedType, confidence } = context.extractedData;
        
        if (confidence > 0.7 && isValidSchemaType(detectedType)) {
          const result = await this.tryGenerateSchema(detectedType, context, 'extractor');
          if (result) {
            result.confidence = confidence;
            console.log(`🤖 [Factory] Schema detectado automaticamente: ${detectedType} (confiança: ${confidence})`);
            return this.cacheAndReturn(cacheKey, result, config);
          }
        } else {
          console.log(`⚠️ [Factory] Confiança baixa para detecção automática: ${confidence}`);
        }
      }
      
      // 4. FALLBACK: BlogPosting seguro
      const fallbackResult = await this.generateFallback(context);
      console.log(`🔄 [Factory] Usando fallback BlogPosting`);
      return this.cacheAndReturn(cacheKey, fallbackResult, config);
      
    } catch (error) {
      console.error(`❌ [Factory] Erro na geração de schema:`, error);
      
      // FALLBACK DE EMERGÊNCIA
      const emergencyResult = await this.generateEmergencyFallback(context, error as Error);
      return emergencyResult;
    }
  }
  
  /**
   * Tenta gerar schema com um tipo específico
   */
  private static async tryGenerateSchema(
    schemaType: SchemaTypeEnum,
    context: SchemaGenerationContext,
    source: 'manual' | 'backup' | 'extractor'
  ): Promise<SchemaGenerationResult | null> {
    try {
      const generator = this.generators.get(schemaType);
      
      if (!generator) {
        console.warn(`⚠️ [Factory] Gerador não encontrado para: ${schemaType}`);
        return null;
      }
      
      const result = await generator.generate(context);
      result.source = source;
      
      return result;
      
    } catch (error) {
      console.error(`❌ [Factory] Erro ao gerar ${schemaType}:`, error);
      return null;
    }
  }
  
  /**
   * Gera fallback BlogPosting
   */
  private static async generateFallback(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const blogGenerator = this.generators.get('BlogPosting');
    
    if (!blogGenerator) {
      throw new Error('Gerador BlogPosting não encontrado para fallback');
    }
    
    const result = await blogGenerator.generate(context);
    result.source = 'fallback';
    result.warnings.push('Usando fallback BlogPosting - considere definir schema manual');
    
    return result;
  }
  
  /**
   * Gera fallback de emergência quando tudo falha
   */
  private static async generateEmergencyFallback(
    context: SchemaGenerationContext,
    error: Error
  ): Promise<SchemaGenerationResult> {
    const { article } = context;
    const startTime = Date.now();
    
    // Schema mínimo de emergência
    const emergencySchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.titulo,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blogflorescerhumano/${article.categoria_principal}/${article.slug}`,
      datePublished: article.data_publicacao || new Date().toISOString(),
      dateModified: article.data_atualizacao || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: article.autor_principal
      },
      publisher: {
        '@type': 'Organization',
        name: 'Psicólogo Daniel Dantas'
      }
    };
    
    return {
      schema: emergencySchema,
      schemaType: 'BlogPosting',
      source: 'fallback',
      confidence: 0.1,
      warnings: [
        'Schema de emergência usado devido a erro crítico',
        `Erro original: ${error.message}`
      ],
      errors: [error.message],
      performance: {
        generationTime: Date.now() - startTime,
        schemaSize: JSON.stringify(emergencySchema).length,
        fieldsCount: Object.keys(emergencySchema).length
      }
    };
  }
  
  /**
   * Gera chave única para cache
   */
  private static generateCacheKey(context: SchemaGenerationContext): string {
    const { article, manualSchemaType, extractedData } = context;
    
    const keyParts = [
      article.id,
      article.data_atualizacao,
      manualSchemaType || 'null',
      extractedData?.detectedType || 'null',
      extractedData?.confidence || '0'
    ];
    
    return keyParts.join('|');
  }
  
  /**
   * Armazena no cache e retorna resultado
   */
  private static cacheAndReturn(
    cacheKey: string,
    result: SchemaGenerationResult,
    config: SchemaGeneratorConfig
  ): SchemaGenerationResult {
    if (config.cacheEnabled) {
      this.cache.set(cacheKey, result);
        // Limpar cache antigo (manter apenas 100 entradas)
      if (this.cache.size > 100) {
        const firstKey = this.cache.keys().next().value;
        if (firstKey) {
          this.cache.delete(firstKey);
        }
      }
    }
    
    return result;
  }
  
  /**
   * Limpa o cache
   */
  static clearCache(): void {
    this.cache.clear();
    console.log(`🧹 [Factory] Cache limpo`);
  }
  
  /**
   * Obtém estatísticas do cache
   */
  static getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0 // TODO: Implementar tracking de hit rate
    };
  }
}

// ==========================================
// 🎯 FUNÇÃO PRINCIPAL DE ENTRADA
// ==========================================

/**
 * Função principal para gerar schemas (interface pública)
 * Substitui a função generateSchemaByFactory do sistema antigo
 */
export async function generateSchemaByFactory(
  data: ArticleSchemaDataExtended,
  manualSchemaType?: SchemaTypeEnum | null,
  config?: Partial<SchemaGeneratorConfig>,
  extractedData?: ExtractedSchemaData
): Promise<SchemaGenerationResult> {
  
  // Configuração padrão
  const defaultConfig: SchemaGeneratorConfig = {
    enableFallback: true,
    enableExtractors: true,
    prioritizeManual: true,
    cacheEnabled: true,
    enableValidation: false,
    environment: process.env.NODE_ENV as any || 'development',
    version: '1.0.0'
  };
  
  // Merge configurações
  const finalConfig = { ...defaultConfig, ...config };
  
  // Cadeia de fallback padrão
  const fallbackChain: SchemaTypeEnum[] = [
    manualSchemaType || data.schema_type,
    data.schema_type_backup as SchemaTypeEnum,
    extractedData?.detectedType,
    'BlogPosting'
  ].filter((type): type is SchemaTypeEnum => type != null && isValidSchemaType(type));
  
  // Contexto completo
  const context: SchemaGenerationContext = {
    article: data,
    manualSchemaType,
    extractedData,
    fallbackChain,
    config: finalConfig,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substring(2, 15)
    }
  };
  
  return await SchemaGeneratorFactory.generateSchema(context);
}

// ==========================================
// 🔄 FUNÇÃO DE COMPATIBILIDADE
// ==========================================

/**
 * Função de compatibilidade com o sistema antigo
 * @deprecated Use generateSchemaByFactory() para novos desenvolvimentos
 */
export async function generateArticleSchema(
  data: any,
  manualSchemaType?: string | null
): Promise<any> {
  console.warn(`⚠️ [Compatibilidade] generateArticleSchema() é deprecated, use generateSchemaByFactory()`);
  
  try {
    const result = await generateSchemaByFactory(data, manualSchemaType as SchemaTypeEnum);
    return result.schema;
  } catch (error) {
    console.error(`❌ [Compatibilidade] Erro na geração:`, error);
    
    // Fallback ultra-simples para compatibilidade
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: data.titulo,
      author: { '@type': 'Person', name: data.autor_principal || 'Psicólogo Daniel Dantas' }
    };
  }
}
