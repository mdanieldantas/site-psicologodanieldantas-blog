/**
 * 📝 GERADOR DE SCHEMA BLOGPOSTING
 * 
 * Gerador específico para schemas do tipo BlogPosting (Schema.org).
 * Este é o tipo base mais usado e serve como fallback seguro.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Schema base para blogs e artigos
 * - Compatível com Google Rich Results
 * - Inclui campos multimídia e FAQ
 * - Otimizado para SEO
 * 
 * 🎯 CASOS DE USO:
 * - Artigos de blog tradicionais
 * - Posts informativos
 * - Conteúdo geral sem tipo específico
 * - Fallback padrão para outros tipos
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - BlogPosting Generator
 */

import { BaseSchemaGenerator } from '../core/base-schema';
import type {
  SchemaGenerationContext,
  SchemaGenerationResult,
  SchemaTypeEnum
} from '../core/types';

import {
  generateSchemaId,
  formatSchemaDate,
  getContentStats
} from '../core/utils';

// ==========================================
// 📝 GERADOR BLOGPOSTING
// ==========================================

/**
 * Gerador específico para BlogPosting schemas
 */
export class BlogPostingGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'BlogPosting';
  protected readonly requiredFields: string[] = [
    'headline',
    'author',
    'datePublished',
    'dateModified',
    'publisher'
  ];
  
  /**
   * Gera schema BlogPosting completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando BlogPosting para: ${article.titulo}`);
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Estatísticas do conteúdo
      const contentStats = getContentStats(article.conteudo);
      
      // Schema BlogPosting específico
      const schema = {
        ...baseFields,
        '@type': 'BlogPosting',
        
        // Campos específicos do BlogPosting
        articleBody: this.extractArticleBody(article.conteudo),
        wordCount: contentStats.wordCount,
        timeRequired: `PT${contentStats.readingTime}M`, // Formato ISO 8601 Duration
        
        // Categorização
        articleSection: article.categoria_principal,
        ...(article.subcategoria_nome && {
          about: {
            '@type': 'Thing',
            name: article.subcategoria_nome
          }
        }),
        
        // Engajamento
        interactionStatistic: this.generateInteractionStats(article),
        
        // Conteúdo estruturado
        ...(article.content_tier !== 'free' && {
          isAccessibleForFree: false,
          hasPart: {
            '@type': 'WebPageElement',
            name: 'Conteúdo Premium',
            description: 'Acesso restrito a membros'
          }
        })
      };
      
      // Adicionar campos multimídia
      const enhancedSchema = this.addMultimediaFields(schema, article);
      
      // Adicionar FAQ se disponível
      const finalSchema = this.addFAQFields(enhancedSchema, article);
      
      // Validar schema
      const warnings = this.validateSchema(finalSchema);
      
      // Adicionar metadados específicos do BlogPosting
      if (context.config.environment === 'development') {
        finalSchema._blogPostingMeta = {
          contentType: this.detectContentType(article.conteudo),
          topicDepth: this.analyzeTopicDepth(article.conteudo),
          readabilityScore: this.calculateReadabilityScore(article.conteudo),
          hasMediaContent: contentStats.hasImages || contentStats.hasVideos
        };
      }
      
      this.log('info', `BlogPosting gerado com sucesso (${contentStats.wordCount} palavras)`);
      
      return this.createResult(finalSchema, context, startTime, warnings);
        } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      this.log('error', `Erro ao gerar BlogPosting: ${errorMessage}`);
      throw error;
    }
  }
  
  /**
   * Extrai o corpo principal do artigo (sem HTML)
   */
  private extractArticleBody(content: string): string {
    return content
      .replace(/<[^>]*>/g, ' ')     // Remove HTML tags
      .replace(/\s+/g, ' ')         // Normaliza espaços
      .trim()
      .substring(0, 5000);          // Limita para performance
  }
  
  /**
   * Gera estatísticas de interação (placeholder para métricas futuras)
   */
  private generateInteractionStats(article: any) {
    return [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ReadAction',
        name: 'Leituras',
        userInteractionCount: 0 // TODO: Integrar com analytics
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ShareAction',
        name: 'Compartilhamentos',
        userInteractionCount: 0 // TODO: Integrar com social media
      }
    ];
  }
  
  /**
   * Detecta o tipo de conteúdo baseado em padrões
   */
  private detectContentType(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('passo a passo') || lowerContent.includes('como fazer')) {
      return 'tutorial';
    }
    
    if (lowerContent.includes('pesquisa') || lowerContent.includes('estudo')) {
      return 'research';
    }
    
    if (lowerContent.includes('opinião') || lowerContent.includes('acredito')) {
      return 'opinion';
    }
    
    if (lowerContent.includes('pergunta') || lowerContent.includes('resposta')) {
      return 'qa';
    }
    
    return 'informational';
  }
  
  /**
   * Analisa a profundidade do tópico (superficial, médio, profundo)
   */
  private analyzeTopicDepth(content: string): 'shallow' | 'medium' | 'deep' {
    const wordCount = content.split(' ').length;
    const technicalTerms = this.countTechnicalTerms(content);
    const references = this.countReferences(content);
    
    const depthScore = (wordCount / 100) + (technicalTerms * 2) + (references * 3);
    
    if (depthScore < 10) return 'shallow';
    if (depthScore < 25) return 'medium';
    return 'deep';
  }
  
  /**
   * Conta termos técnicos de psicologia
   */
  private countTechnicalTerms(content: string): number {
    const technicalTerms = [
      'neuroplasticidade', 'psicoterapia', 'cognitivo', 'comportamental',
      'psicodinâmica', 'humanística', 'gestalt', 'sistêmica',
      'neurotransmissor', 'serotonina', 'dopamina', 'cortisol',
      'amígdala', 'hipocampo', 'córtex', 'limbic'
    ];
    
    const lowerContent = content.toLowerCase();
    return technicalTerms.filter(term => lowerContent.includes(term)).length;
  }
  
  /**
   * Conta referências e citações
   */
  private countReferences(content: string): number {
    const referencePatterns = [
      /\(\d{4}\)/g,                    // (2024)
      /et al\./g,                      // et al.
      /\[[^\]]+\]/g,                   // [citação]
      /segundo .+?,/g,                 // segundo autor,
      /de acordo com .+?,/g            // de acordo com autor,
    ];
    
    let count = 0;
    referencePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) count += matches.length;
    });
    
    return count;
  }
  
  /**
   * Calcula pontuação de legibilidade simplificada
   */
  private calculateReadabilityScore(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const characters = content.replace(/\s/g, '').length;
    
    if (sentences.length === 0 || words.length === 0) return 0;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgCharsPerWord = characters / words.length;
    
    // Fórmula simplificada baseada em Flesch Reading Ease (adaptada para português)
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (avgCharsPerWord / 4.5));
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Adiciona campos específicos do BlogPosting para FAQ
   */
  protected addFAQFields(schema: any, article: any): any {
    const baseResult = super.addFAQFields(schema, article);
    
    // Se há FAQ, adicionar breadcrumb de FAQ
    if (article.faq_data && Array.isArray(article.faq_data) && article.faq_data.length > 0) {
      baseResult.mentions = baseResult.mentions || [];
      baseResult.mentions.push({
        '@type': 'FAQPage',
        name: `FAQ: ${article.titulo}`,
        description: `Perguntas frequentes sobre ${article.titulo}`
      });
    }
    
    return baseResult;
  }
  
  /**
   * Adiciona campos específicos do BlogPosting para multimídia
   */
  protected addMultimediaFields(schema: any, article: any): any {
    const baseResult = super.addMultimediaFields(schema, article);
    
    // Adicionar associatedMedia para BlogPosting
    const mediaItems = [];
    
    if (article.url_video) {
      mediaItems.push({
        '@type': 'VideoObject',
        name: `Vídeo complementar: ${article.titulo}`,
        contentUrl: article.url_video
      });
    }
    
    if (article.url_podcast) {
      mediaItems.push({
        '@type': 'AudioObject', 
        name: `Podcast relacionado: ${article.titulo}`,
        contentUrl: article.url_podcast
      });
    }
    
    if (mediaItems.length > 0) {
      baseResult.associatedMedia = mediaItems;
    }
    
    return baseResult;
  }
}
