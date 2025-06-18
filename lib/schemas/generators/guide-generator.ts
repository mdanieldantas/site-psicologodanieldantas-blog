/**
 * 🎯 GUIDE SCHEMA GENERATOR
 * 
 * Gerador de schemas JSON-LD para conteúdo tipo "Guia"
 * - Otimizado para tutoriais passo-a-passo
 * - Rich snippets para guias práticos
 * - Estrutura hierárquica para seções
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - Guide Generator
 */

import { BaseSchemaGenerator } from '../core/base-schema';
import type {
  SchemaGenerationContext,
  SchemaGenerationResult,
  SchemaTypeEnum,
  SchemaPerformanceMetrics
} from '../core/types';

import {
  generateSchemaId,
  formatSchemaDate,
  getContentStats
} from '../core/utils';

// ==========================================
// 🎯 GUIDE GENERATOR CLASS
// ==========================================

export class GuideGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'Guide';
  protected readonly requiredFields: string[] = [
    'headline',
    'author',
    'datePublished',
    'dateModified',
    'publisher'
  ];

  /**
   * Gera schema Guide completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando Guide para: ${article.titulo}`);
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Estatísticas do conteúdo
      const contentStats = getContentStats(article.conteudo);
      
      // Schema Guide específico
      const schema = {
        ...baseFields,
        '@type': 'Guide',
        
        // Campos específicos do Guide
        about: {
          '@type': 'Thing',
          name: article.titulo,
          description: this.generateDescription(article)
        },
        
        // Estrutura hierárquica do guia
        ...(this.hasStructuredContent(article.conteudo) && {
          hasPart: this.extractGuideSections(article.conteudo)
        }),
        
        // Tempo estimado e nível
        timeRequired: `PT${contentStats.readingTime}M`,
        educationalLevel: this.determineEducationalLevel(article),
        
        // Público-alvo específico
        audience: {
          '@type': 'Audience',
          audienceType: 'Pessoas interessadas em psicologia e desenvolvimento pessoal'
        },
        
        // Formato e tipo de recurso educacional
        learningResourceType: 'guide',
        genre: 'Guia prático',
        
        // Acessibilidade
        accessibilityFeature: [
          'structuralNavigation',
          'readingOrder',
          'alternativeText'
        ],
        
        // Licença
        license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        
        // Categorização específica
        ...(article.categoria_principal && {
          genre: `Guia de ${article.categoria_principal}`
        }),
        
        // Conteúdo relacionado
        ...(article.tags && article.tags.length > 0 && {
          mentions: article.tags.map(tag => ({
            '@type': 'Thing',
            name: tag
          }))
        })
      };
      
      // Validar schema
      const warnings = this.validateSchema(schema);
      
      const endTime = Date.now();
      const performance: SchemaPerformanceMetrics = {
        generationTime: endTime - startTime,
        schemaSize: JSON.stringify(schema).length,
        fieldsCount: Object.keys(schema).length
      };
        this.log('info', `Guide gerado com sucesso: ${performance.fieldsCount} campos em ${performance.generationTime}ms`);
      
      return {
        schema,
        schemaType: 'Guide',
        source: 'manual',
        confidence: this.calculateConfidence(article),
        warnings,
        errors: [],
        performance
      };
      
    } catch (error) {
      this.log('error', `Erro ao gerar Guide: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      throw error;
    }
  }

  /**
   * Verifica se o conteúdo tem estrutura de guia
   */
  private hasStructuredContent(content: string): boolean {
    // Verifica presença de cabeçalhos estruturados
    const hasHeaders = /<h[2-6][^>]*>/gi.test(content);
    
    // Verifica presença de listas
    const hasLists = /<[ou]l[^>]*>/gi.test(content);
    
    // Verifica palavras indicativas de passos
    const stepIndicators = /passo|etapa|fase|primeiro|segundo|terceiro|finalmente/gi;
    const hasSteps = stepIndicators.test(content);
    
    return hasHeaders || hasLists || hasSteps;
  }

  /**
   * Extrai seções estruturadas do guia
   */
  private extractGuideSections(content: string): any[] {
    const sections: any[] = [];
    
    // Extrair cabeçalhos como seções
    const headerRegex = /<h([2-6])[^>]*>(.*?)<\/h\1>/gi;
    let match;
    let position = 1;
    
    while ((match = headerRegex.exec(content)) !== null) {
      sections.push({
        '@type': 'CreativeWork',
        name: match[2].replace(/<[^>]*>/g, '').trim(),
        position: position++,
        url: `#section-${position}`
      });
    }
    
    // Se não há cabeçalhos, criar seções baseadas em parágrafos
    if (sections.length === 0) {
      const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 50);
      paragraphs.slice(0, 5).forEach((_, index) => {
        sections.push({
          '@type': 'CreativeWork',
          name: `Seção ${index + 1}`,
          position: index + 1,
          url: `#section-${index + 1}`
        });
      });
    }
    
    return sections;
  }

  /**
   * Determina o nível educacional do guia
   */
  private determineEducationalLevel(article: any): string {
    const content = article.conteudo.toLowerCase();
    
    // Nível básico - linguagem simples
    if (content.includes('simples') || content.includes('básico') || content.includes('iniciante')) {
      return 'Iniciante';
    }
    
    // Nível intermediário - conceitos mais elaborados
    if (content.includes('avançado') || content.includes('profissional') || content.includes('técnico')) {
      return 'Avançado';
    }
    
    return 'Intermediário';
  }

  /**
   * Calcula confiança do schema Guide para este conteúdo
   */
  private calculateConfidence(article: any): number {
    let confidence = 0.5; // Base
    
    const titleLower = article.titulo.toLowerCase();
    const contentLower = article.conteudo.toLowerCase();
    
    // Palavras-chave no título
    if (titleLower.includes('guia') || titleLower.includes('como')) confidence += 0.3;
    if (titleLower.includes('tutorial') || titleLower.includes('passo a passo')) confidence += 0.2;
    
    // Estrutura do conteúdo
    if (this.hasStructuredContent(article.conteudo)) confidence += 0.2;
    
    // Palavras indicativas no conteúdo
    const guideWords = ['primeiro', 'segundo', 'etapa', 'passo', 'instrução'];
    const foundWords = guideWords.filter(word => contentLower.includes(word));
    confidence += foundWords.length * 0.05;
    
    return Math.min(confidence, 1.0);
  }
}
