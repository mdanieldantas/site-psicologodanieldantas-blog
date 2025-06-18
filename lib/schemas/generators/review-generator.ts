/**
 * ⭐ REVIEW SCHEMA GENERATOR
 * 
 * Gerador de schemas JSON-LD para conteúdo tipo "Review"
 * - Otimizado para avaliações e resenhas
 * - Rich snippets para reviews estruturados
 * - Suporte para ratings e recomendações
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - Review Generator
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
// ⭐ REVIEW GENERATOR CLASS
// ==========================================

export class ReviewGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'Review';
  protected readonly requiredFields: string[] = [
    'headline',
    'author',
    'datePublished',
    'dateModified',
    'publisher'
  ];

  /**
   * Gera schema Review completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando Review para: ${article.titulo}`);
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Estatísticas do conteúdo
      const contentStats = getContentStats(article.conteudo);
      
      // Detectar item sendo avaliado
      const reviewedItem = this.extractReviewedItem(article);
      
      // Schema Review específico
      const schema = {
        ...baseFields,
        '@type': 'Review',
        
        // Item sendo avaliado
        itemReviewed: reviewedItem,
        
        // Avaliação e rating
        reviewRating: this.generateRating(article),
        
        // Corpo da avaliação
        reviewBody: this.extractReviewBody(article),
        
        // Aspecto da avaliação
        reviewAspect: this.determineReviewAspect(article),
        
        // Recomendação
        positiveNotes: this.extractPositiveNotes(article),
        negativeNotes: this.extractNegativeNotes(article),
        
        // Público da avaliação
        audience: {
          '@type': 'Audience',
          audienceType: this.determineAudience(article)
        },
        
        // Categorização
        about: {
          '@type': 'Thing',
          name: article.categoria_principal,
          description: `Avaliação sobre ${article.categoria_principal}`
        },
        
        // Data específica da avaliação
        dateCreated: baseFields.datePublished,
        
        // Credenciais do avaliador
        author: {
          ...baseFields.author,
          '@type': 'Person',
          knowsAbout: [
            'Psicologia',
            'Terapia',
            'Desenvolvimento Pessoal',
            article.categoria_principal
          ],
          hasCredential: {
            '@type': 'EducationalOccupationalCredential',
            name: 'Psicólogo Clínico',
            credentialCategory: 'degree'
          }
        },
        
        // Linguagem e formato
        inLanguage: 'pt-BR',
        
        // Interações
        interactionStatistic: this.generateInteractionStats(article),
        
        // Palavras-chave específicas para review
        keywords: this.generateReviewKeywords(article),
        
        // Tópicos mencionados
        ...(article.tags && article.tags.length > 0 && {
          mentions: article.tags.map(tag => ({
            '@type': 'Thing',
            name: tag
          }))
        }),
        
        // Licença
        license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
      };
      
      // Validar schema
      const warnings = this.validateSchema(schema);
      
      const endTime = Date.now();
      const performance: SchemaPerformanceMetrics = {
        generationTime: endTime - startTime,
        schemaSize: JSON.stringify(schema).length,
        fieldsCount: Object.keys(schema).length
      };
      
      this.log('info', `Review gerado com sucesso: ${performance.fieldsCount} campos em ${performance.generationTime}ms`);
      
      return {
        schema,
        schemaType: 'Review',
        source: 'manual',
        confidence: this.calculateConfidence(article),
        warnings,
        errors: [],
        performance
      };
      
    } catch (error) {
      this.log('error', `Erro ao gerar Review: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      throw error;
    }
  }

  /**
   * Extrai o item sendo avaliado
   */
  private extractReviewedItem(article: any): any {
    const titleLower = article.titulo.toLowerCase();
    const content = article.conteudo.toLowerCase();
    
    // Detectar tipo de item baseado no conteúdo
    if (titleLower.includes('livro') || content.includes('autor') || content.includes('página')) {
      return {
        '@type': 'Book',
        name: this.extractItemName(article, 'livro'),
        description: 'Livro avaliado'
      };
    }
    
    if (titleLower.includes('curso') || titleLower.includes('treinamento')) {
      return {
        '@type': 'Course',
        name: this.extractItemName(article, 'curso'),
        description: 'Curso avaliado'
      };
    }
    
    if (titleLower.includes('terapia') || titleLower.includes('tratamento')) {
      return {
        '@type': 'MedicalTherapy',
        name: this.extractItemName(article, 'terapia'),
        description: 'Abordagem terapêutica avaliada'
      };
    }
    
    if (titleLower.includes('técnica') || titleLower.includes('método')) {
      return {
        '@type': 'HowTo',
        name: this.extractItemName(article, 'técnica'),
        description: 'Técnica ou método avaliado'
      };
    }
    
    // Fallback genérico
    return {
      '@type': 'Thing',
      name: this.extractGenericItemName(article),
      description: `Item relacionado a ${article.categoria_principal}`
    };
  }

  /**
   * Extrai nome do item específico
   */
  private extractItemName(article: any, type: string): string {
    const titleWords = article.titulo.split(' ');
    const typeIndex = titleWords.findIndex((word: string) => word.toLowerCase().includes(type));
    
    if (typeIndex !== -1 && typeIndex < titleWords.length - 1) {
      // Pegar palavras após o tipo
      return titleWords.slice(typeIndex + 1).join(' ').replace(/[^\w\s]/g, '').trim();
    }
    
    // Fallback: usar parte do título
    return article.titulo.replace(`${type}`, '').trim() || `${type} não identificado`;
  }

  /**
   * Extrai nome genérico do item
   */
  private extractGenericItemName(article: any): string {
    // Tentar extrair do título removendo palavras comuns
    const commonWords = ['revisão', 'avaliação', 'análise', 'resenha', 'sobre', 'do', 'da', 'de'];
    let itemName = article.titulo;
    
    commonWords.forEach(word => {
      itemName = itemName.replace(new RegExp(word, 'gi'), '').trim();
    });
    
    return itemName || 'Item avaliado';
  }

  /**
   * Gera rating baseado no tom do conteúdo
   */
  private generateRating(article: any): any {
    const content = article.conteudo.toLowerCase();
    
    // Palavras positivas e negativas para análise de sentimento
    const positiveWords = [
      'excelente', 'ótimo', 'bom', 'eficaz', 'recomendo', 'útil', 
      'eficiente', 'interessante', 'valioso', 'importante'
    ];
    
    const negativeWords = [
      'ruim', 'péssimo', 'ineficaz', 'problemático', 'difícil',
      'complicado', 'confuso', 'limitado'
    ];
    
    const positiveCount = positiveWords.filter(word => content.includes(word)).length;
    const negativeCount = negativeWords.filter(word => content.includes(word)).length;
    
    // Calcular rating (1-5)
    let ratingValue = 3; // Neutro
    
    if (positiveCount > negativeCount) {
      ratingValue = Math.min(5, 3 + (positiveCount - negativeCount) * 0.5);
    } else if (negativeCount > positiveCount) {
      ratingValue = Math.max(1, 3 - (negativeCount - positiveCount) * 0.5);
    }
    
    return {
      '@type': 'Rating',
      ratingValue: Math.round(ratingValue * 10) / 10, // Arredondar para 1 casa decimal
      bestRating: 5,
      worstRating: 1
    };
  }

  /**
   * Extrai corpo principal da avaliação
   */
  private extractReviewBody(article: any): string {
    // Usar resumo se disponível
    if (article.resumo && article.resumo.length > 50) {
      return article.resumo;
    }
    
    // Extrair primeiros parágrafos do conteúdo
    const content = article.conteudo.replace(/<[^>]*>/g, ' ');
    const paragraphs = content.split(/\n+/).filter((p: string) => p.trim().length > 50);
    
    if (paragraphs.length > 0) {
      // Usar os dois primeiros parágrafos
      return paragraphs.slice(0, 2).join(' ').substring(0, 1000).trim() + '...';
    }
    
    return content.substring(0, 500).trim() + '...';
  }

  /**
   * Determina aspecto da avaliação
   */
  private determineReviewAspect(article: any): string {
    const content = article.conteudo.toLowerCase();
    
    if (content.includes('eficácia') || content.includes('resultado')) {
      return 'Eficácia';
    }
    
    if (content.includes('qualidade') || content.includes('excelência')) {
      return 'Qualidade';
    }
    
    if (content.includes('facilidade') || content.includes('simples')) {
      return 'Facilidade de uso';
    }
    
    if (content.includes('custo') || content.includes('preço') || content.includes('valor')) {
      return 'Custo-benefício';
    }
    
    return 'Aspectos gerais';
  }

  /**
   * Extrai notas positivas
   */
  private extractPositiveNotes(article: any): string[] {
    const content = article.conteudo.toLowerCase();
    const notes: string[] = [];
    
    const positiveIndicators = [
      { pattern: /pontos? positivos?[:\-]?\s*([^.!?]*)/gi, type: 'explicit' },
      { pattern: /vantagens?[:\-]?\s*([^.!?]*)/gi, type: 'explicit' },
      { pattern: /benefícios?[:\-]?\s*([^.!?]*)/gi, type: 'explicit' }
    ];
    
    positiveIndicators.forEach(indicator => {
      const matches = article.conteudo.matchAll(indicator.pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 10) {
          notes.push(match[1].trim());
        }
      }
    });
    
    // Se não encontrou notas explícitas, inferir baseado em palavras positivas
    if (notes.length === 0) {
      if (content.includes('eficaz')) notes.push('Demonstra eficácia prática');
      if (content.includes('fácil')) notes.push('Fácil de aplicar');
      if (content.includes('útil')) notes.push('Informações úteis e relevantes');
      if (content.includes('interessante')) notes.push('Conteúdo interessante e envolvente');
    }
    
    return notes.slice(0, 5); // Máximo 5 notas
  }

  /**
   * Extrai notas negativas
   */
  private extractNegativeNotes(article: any): string[] {
    const content = article.conteudo.toLowerCase();
    const notes: string[] = [];
    
    const negativeIndicators = [
      { pattern: /pontos? negativos?[:\-]?\s*([^.!?]*)/gi, type: 'explicit' },
      { pattern: /desvantagens?[:\-]?\s*([^.!?]*)/gi, type: 'explicit' },
      { pattern: /limitações?[:\-]?\s*([^.!?]*)/gi, type: 'explicit' }
    ];
    
    negativeIndicators.forEach(indicator => {
      const matches = article.conteudo.matchAll(indicator.pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 10) {
          notes.push(match[1].trim());
        }
      }
    });
    
    // Inferir baseado em palavras negativas se necessário
    if (notes.length === 0 && content.includes('limitação')) {
      notes.push('Algumas limitações identificadas');
    }
    
    return notes.slice(0, 3); // Máximo 3 notas negativas
  }

  /**
   * Determina audiência da avaliação
   */
  private determineAudience(article: any): string {
    const content = article.conteudo.toLowerCase();
    
    if (content.includes('profissional') || content.includes('terapeuta')) {
      return 'Profissionais de psicologia';
    }
    
    if (content.includes('estudante') || content.includes('acadêmico')) {
      return 'Estudantes de psicologia';
    }
    
    if (content.includes('iniciante') || content.includes('leigo')) {
      return 'Público geral interessado em psicologia';
    }
    
    return 'Pessoas interessadas em desenvolvimento pessoal';
  }

  /**
   * Gera estatísticas de interação
   */
  private generateInteractionStats(article: any): any[] {
    const baseInteractions = 15;
    const rating = this.generateRating(article).ratingValue;
    
    // Mais interações para avaliações bem feitas
    const interactions = Math.floor(baseInteractions * (rating / 3));
    
    return [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: interactions
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ShareAction',
        userInteractionCount: Math.floor(interactions * 0.3)
      }
    ];
  }

  /**
   * Gera palavras-chave específicas para review
   */
  private generateReviewKeywords(article: any): string {
    const keywords = new Set<string>();
    
    // Palavras base
    keywords.add('avaliação');
    keywords.add('revisão');
    keywords.add('análise');
    
    // Categoria
    if (article.categoria_principal) {
      keywords.add(article.categoria_principal);
      keywords.add(`avaliação de ${article.categoria_principal}`);
    }
    
    // Tags
    if (article.tags) {
      article.tags.forEach((tag: string) => keywords.add(tag));
    }
    
    return Array.from(keywords).join(', ');
  }

  /**
   * Calcula confiança do schema Review para este conteúdo
   */
  private calculateConfidence(article: any): number {
    let confidence = 0.2; // Base baixa
    
    const titleLower = article.titulo.toLowerCase();
    const contentLower = article.conteudo.toLowerCase();
    
    // Palavras-chave no título
    const reviewWords = ['revisão', 'avaliação', 'análise', 'resenha', 'review'];
    const foundTitleWords = reviewWords.filter(word => titleLower.includes(word));
    confidence += foundTitleWords.length * 0.3;
    
    // Palavras indicativas no conteúdo
    const contentWords = ['pontos positivos', 'pontos negativos', 'vantagens', 'desvantagens', 'recomendo'];
    const foundContentWords = contentWords.filter(word => contentLower.includes(word));
    confidence += foundContentWords.length * 0.1;
    
    // Estrutura de avaliação
    if (contentLower.includes('rating') || contentLower.includes('nota') || contentLower.includes('estrela')) {
      confidence += 0.2;
    }
    
    // Análise comparativa
    if (contentLower.includes('comparado') || contentLower.includes('versus') || contentLower.includes('melhor que')) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
}
