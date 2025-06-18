/**
 * 🚀 SISTEMA MODULAR DE SCHEMAS - ENTRADA PRINCIPAL
 * 
 * Este arquivo substitui gradualmente o sistema monolítico do
 * lib/article-schema.ts com uma arquitetura modular escalável.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Compatibilidade total com sistema antigo
 * - Migração gradual sem breaking changes
 * - Factory Pattern para geração
 * - Sistema de fallback inteligente
 * - Cache automático e métricas
 * 
 * 🔄 MIGRAÇÃO:
 * - Fase 1: Sistema paralelo (este arquivo)
 * - Fase 2: Substituição gradual
 * - Fase 3: Deprecação do sistema antigo
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - Sistema Modular Inicial
 */

// ==========================================
// 📦 IMPORTAÇÕES DO SISTEMA MODULAR
// ==========================================

import {
  type SchemaGenerationContext,
  type SchemaGenerationResult,
  type ArticleSchemaDataExtended,
  type SchemaTypeEnum,
  type SchemaGeneratorConfig,
  DEFAULT_SCHEMA_CONFIG,
  convertToExtendedData,
  isValidSchemaType,
  generateSchemaByFactory as generateSchemaByModularFactory,
  SCHEMA_SYSTEM_INFO
} from './core';

import { registerAllGenerators, GENERATORS_INFO } from './generators';

/**
 * Inicializa o sistema modular de schemas
 * Deve ser chamado uma vez na inicialização da aplicação
 */
async function initializeSchemaSystem(): Promise<void> {
  try {
    console.log(`🚀 [Schema System] Inicializando sistema modular v${SCHEMA_SYSTEM_INFO.version}`);
    
    // Registrar todos os geradores na factory
    registerAllGenerators();
      console.log(`✅ [Schema System] Sistema inicializado com ${GENERATORS_INFO.statistics.total_implemented} geradores`);
    console.log(`📊 [Schema System] Progresso da implementação: ${GENERATORS_INFO.statistics.coverage_priority_1}`);
    
  } catch (error) {
    console.error('❌ [Schema System] Erro na inicialização:', error);
    throw error;
  }
}

// ==========================================
// 🎯 FUNÇÃO PRINCIPAL PÚBLICA
// ==========================================

/**
 * Função principal para geração de schemas (NOVA VERSÃO MODULAR)
 * Substitui generateSchemaByFactory do sistema antigo
 * 
 * @param data Dados do artigo (formato estendido ou antigo)
 * @param manualSchemaType Tipo de schema manual (prioridade máxima)
 * @param options Opções de configuração
 * @returns Resultado completo da geração de schema
 */
async function generateSchema(
  data: ArticleSchemaDataExtended | any,
  manualSchemaType?: SchemaTypeEnum | string | null,
  options?: {
    enableExtractors?: boolean;
    enableCache?: boolean;
    enableValidation?: boolean;
    environment?: 'development' | 'production' | 'test';
  }
): Promise<SchemaGenerationResult> {
  
  try {
    // Converter dados para formato estendido se necessário
    const extendedData: ArticleSchemaDataExtended = data.categoria_principal 
      ? data // Já está no formato estendido
      : convertToExtendedData(data); // Converter do formato antigo
    
    // Configuração
    const config: SchemaGeneratorConfig = {
      ...DEFAULT_SCHEMA_CONFIG,
      enableExtractors: options?.enableExtractors ?? true,
      cacheEnabled: options?.enableCache ?? true,
      enableValidation: options?.enableValidation ?? false,
      environment: options?.environment ?? (process.env.NODE_ENV as any) ?? 'development'
    };
    
    // Validar tipo de schema manual
    const validManualType = (manualSchemaType && isValidSchemaType(manualSchemaType)) 
      ? manualSchemaType as SchemaTypeEnum 
      : null;
    
    // Gerar schema usando o sistema modular
    const result = await generateSchemaByModularFactory(
      extendedData,
      validManualType,
      config
    );
    
    // Log do resultado
    console.log(`✅ [Schema System] Schema ${result.schemaType} gerado (${result.source}) em ${result.performance.generationTime}ms`);
    
    if (result.warnings.length > 0) {
      console.warn(`⚠️ [Schema System] Warnings:`, result.warnings);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ [Schema System] Erro na geração de schema:', error);
    
    // Fallback de emergência com schema mínimo
    return createEmergencySchema(data, error as Error);
  }
}

/**
 * Função de compatibilidade que retorna apenas o schema (como sistema antigo)
 * 
 * @deprecated Use generateSchema() que retorna resultado completo
 */
async function generateSchemaCompatible(
  data: any,
  manualSchemaType?: string | null
): Promise<any> {
  console.warn('⚠️ [Schema System] generateSchemaCompatible() é deprecated, use generateSchema()');
  
  try {
    const result = await generateSchema(data, manualSchemaType);
    return result.schema;
  } catch (error) {
    console.error('❌ [Schema System] Erro na compatibilidade:', error);
    
    // Fallback ultra-simples
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: data.titulo || 'Artigo',
      author: { '@type': 'Person', name: 'Psicólogo Daniel Dantas' }
    };
  }
}

// ==========================================
// 🛡️ FALLBACK DE EMERGÊNCIA
// ==========================================

/**
 * Cria schema de emergência quando tudo falha
 */
function createEmergencySchema(data: any, error: Error): SchemaGenerationResult {
  const emergencySchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.titulo || data.headline || 'Artigo',
    url: data.url || `${process.env.NEXT_PUBLIC_SITE_URL}/error`,
    datePublished: data.data_publicacao || data.datePublished || new Date().toISOString(),
    dateModified: data.data_atualizacao || data.dateModified || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: data.autor_principal || data.author?.name || 'Psicólogo Daniel Dantas'
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
    warnings: ['Schema de emergência usado devido a erro crítico'],
    errors: [error.message],
    performance: {
      generationTime: 0,
      schemaSize: JSON.stringify(emergencySchema).length,
      fieldsCount: Object.keys(emergencySchema).length
    }
  };
}

// ==========================================
// 🔧 UTILITÁRIOS PÚBLICOS
// ==========================================

/**
 * Verifica se o sistema modular está funcionando
 */
function checkSystemHealth(): {
  status: 'healthy' | 'degraded' | 'error';
  details: any;
} {
  try {
    // TODO: Implementar checks de saúde
    return {
      status: 'healthy',
      details: {
        version: SCHEMA_SYSTEM_INFO.version,
        generators: GENERATORS_INFO.statistics,
        features: SCHEMA_SYSTEM_INFO.features
      }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return {
      status: 'error',
      details: { error: errorMessage }
    };
  }
}

/**
 * Obtém estatísticas do sistema
 */
function getSystemStats() {
  return {
    system: SCHEMA_SYSTEM_INFO,
    generators: GENERATORS_INFO,
    runtime: {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }
  };
}

// ==========================================
// 📋 EXPORTAÇÕES PRINCIPAIS
// ==========================================

// Função principal
export { generateSchema as default };

// Funções específicas
export {
  generateSchema,
  generateSchemaCompatible,
  initializeSchemaSystem,
  checkSystemHealth,
  getSystemStats
};

// Re-exports úteis do core
export type {
  SchemaGenerationResult,
  SchemaTypeEnum,
  ArticleSchemaDataExtended
} from './core';

// Informações do sistema
export {
  SCHEMA_SYSTEM_INFO,
  GENERATORS_INFO
};
