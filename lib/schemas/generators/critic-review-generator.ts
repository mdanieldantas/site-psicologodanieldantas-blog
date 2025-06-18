/**
 * 📝 GERADOR DE SCHEMA CRITICREVIEW
 * 
 * Gerador específico para críticas especializadas (Schema.org CriticReview).
 * Foco em reviews profissionais de livros, métodos e técnicas terapêuticas.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Análise crítica profissional
 * - Avaliação técnica especializada
 * - Credibilidade do revisor
 * - Contexto acadêmico/profissional
 * 
 * 🎯 CASOS DE USO:
 * - Críticas de livros de psicologia
 * - Avaliação de métodos terapêuticos
 * - Reviews de pesquisas e estudos
 * - Análises técnicas especializadas
 * 
 * 📊 DADOS UTILIZADOS:
 * - conteudo: Para análise crítica
 * - titulo: Para item sendo criticado
 * - autor_principal: Como crítico especialista
 * - categoria_principal: Para área de especialização
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - CriticReview Generator
 */

import { BaseSchemaGenerator } from '../core/base-schema';
import type {
  SchemaGenerationContext,
  SchemaGenerationResult,
  SchemaTypeEnum
} from '../core/types';

import {
  generateSchemaId,
  formatSchemaDate
} from '../core/utils';

// ==========================================
// 📝 GERADOR CRITICREVIEW
// ==========================================

/**
 * Gerador específico para CriticReview schemas
 */
class CriticReviewGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'CriticReview';
  protected readonly requiredFields: string[] = [
    'itemReviewed',
    'reviewBody',
    'author'
  ];
  
  /**
   * Gera schema CriticReview completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando CriticReview para: ${article.titulo}`);
      
      // Verifica se é conteúdo crítico especializado
      if (!this.isCriticalReviewContent(article.conteudo, article.titulo)) {
        const warning = 'Conteúdo pode não ser adequado para CriticReview schema';
        this.log('warn', warning);
      }
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Extrai item sendo criticado
      const itemReviewed = this.extractCriticalItem(article.titulo, article.conteudo);
      
      // Avalia rating crítico
      const reviewRating = this.generateCriticalRating(article.conteudo);
      
      // Extrai aspectos da crítica
      const criticalAnalysis = this.extractCriticalAnalysis(article.conteudo);
      
      // Construção do schema CriticReview
      const schema = {
        ...baseFields,
        '@type': 'CriticReview',
        
        // Item sendo criticado
        itemReviewed: itemReviewed,
        
        // Corpo da crítica
        reviewBody: this.generateCriticalReviewBody(article.conteudo),
        
        // Rating crítico se aplicável
        ...(reviewRating && { reviewRating }),
        
        // Aspectos da crítica
        ...(criticalAnalysis.strengths.length > 0 && {
          positiveNotes: {
            '@type': 'ItemList',
            itemListElement: criticalAnalysis.strengths.map((note, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: note
            }))
          }
        }),
        
        ...(criticalAnalysis.weaknesses.length > 0 && {
          negativeNotes: {
            '@type': 'ItemList',
            itemListElement: criticalAnalysis.weaknesses.map((note, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: note
            }))
          }
        }),
        
        // Recomendação crítica
        ...(criticalAnalysis.recommendation && {
          reviewAspect: criticalAnalysis.recommendation
        })
      };
      
      // Validação e warnings
      const warnings = this.validateSchema(schema);
      this.addCriticalReviewWarnings(warnings, article);
      
      this.log('info', `CriticReview gerado para item: ${itemReviewed.name}`, {
        itemType: itemReviewed['@type'],
        hasRating: !!reviewRating,
        strengthsCount: criticalAnalysis.strengths.length,
        weaknessesCount: criticalAnalysis.weaknesses.length
      });
      
      return this.createResult(schema, context, startTime, warnings);
      
    } catch (error) {
      const errorMsg = `Erro ao gerar CriticReview: ${error}`;
      this.log('error', errorMsg);
      return this.createResult({}, context, startTime, [], [errorMsg]);
    }
  }
  
  /**
   * Verifica se o conteúdo é uma crítica especializada
   */
  private isCriticalReviewContent(content: string, titulo: string): boolean {
    const combined = `${titulo} ${content}`.toLowerCase();
    
    const criticalIndicators = [
      'crítica', 'análise crítica', 'avaliação crítica',
      'resenha', 'review crítico', 'análise técnica',
      'avaliação especializada', 'perspectiva crítica',
      'exame crítico', 'discussão crítica', 'revisão crítica'
    ];
    
    const academicIndicators = [
      'metodologia', 'fundamentação teórica', 'base científica',
      'evidências', 'pesquisa', 'estudo', 'literatura',
      'referências', 'bibliografia', 'fonte acadêmica'
    ];
    
    const hasCriticalContent = criticalIndicators.some(indicator => 
      combined.includes(indicator)
    );
    
    const hasAcademicContent = academicIndicators.some(indicator => 
      combined.includes(indicator)
    );
    
    return hasCriticalContent || hasAcademicContent;
  }
  
  /**
   * Extrai o item sendo criticado
   */
  private extractCriticalItem(titulo: string, content: string): any {
    const tituloLower = titulo.toLowerCase();
    const contentLower = content.toLowerCase();
    
    let itemType = 'CreativeWork';
    let itemName = titulo;
    
    // Padrões específicos para críticas acadêmicas/profissionais
    const criticalPatterns = [
      { 
        type: 'Book', 
        indicators: ['livro', 'obra', 'publicação', 'manual', 'guia'],
        extractors: [
          /(?:livro|obra)\s+["']([^"']+)["']/i,
          /crítica\s+do\s+livro\s+([^.!?\n]+)/i
        ]
      },
      { 
        type: 'ScholarlyArticle', 
        indicators: ['artigo', 'paper', 'estudo', 'pesquisa', 'publicação científica'],
        extractors: [
          /(?:artigo|estudo)\s+["']([^"']+)["']/i,
          /análise\s+do\s+(?:artigo|estudo)\s+([^.!?\n]+)/i
        ]
      },
      { 
        type: 'Theory', 
        indicators: ['teoria', 'abordagem teórica', 'modelo teórico', 'framework'],
        extractors: [
          /teoria\s+(?:de|da|do)\s+([^.!?\n]+)/i,
          /abordagem\s+([^.!?\n]+)/i
        ]
      },
      { 
        type: 'Therapy', 
        indicators: ['terapia', 'tratamento', 'intervenção', 'método terapêutico'],
        extractors: [
          /(?:terapia|método)\s+([^.!?\n]+)/i,
          /tratamento\s+(?:de|da|do)\s+([^.!?\n]+)/i
        ]
      },
      { 
        type: 'Course', 
        indicators: ['curso', 'formação', 'capacitação', 'programa'],
        extractors: [
          /curso\s+(?:de|da|do)\s+([^.!?\n]+)/i,
          /programa\s+([^.!?\n]+)/i
        ]
      }
    ];
    
    // Detecta tipo e extrai nome
    for (const pattern of criticalPatterns) {
      if (pattern.indicators.some(indicator => 
        tituloLower.includes(indicator) || contentLower.includes(indicator)
      )) {
        itemType = pattern.type;
        
        // Tenta extrair nome específico
        for (const extractor of pattern.extractors) {
          const match = titulo.match(extractor) || content.match(extractor);
          if (match && match[1]) {
            itemName = match[1].trim();
            break;
          }
        }
        break;
      }
    }
    
    // Constrói objeto especializado
    const item: any = {
      '@type': itemType,
      name: itemName
    };
    
    // Adiciona campos específicos
    if (itemType === 'Book') {
      const authorMatch = content.match(/(?:autor|autora)[:\s]+([^.!?\n]+)/i);
      if (authorMatch) {
        item.author = {
          '@type': 'Person',
          name: authorMatch[1].trim()
        };
      }
      
      const publisherMatch = content.match(/(?:editora|publisher)[:\s]+([^.!?\n]+)/i);
      if (publisherMatch) {
        item.publisher = {
          '@type': 'Organization',
          name: publisherMatch[1].trim()
        };
      }
    }
    
    if (itemType === 'ScholarlyArticle') {
      const journalMatch = content.match(/(?:revista|journal)[:\s]+([^.!?\n]+)/i);
      if (journalMatch) {
        item.isPartOf = {
          '@type': 'Periodical',
          name: journalMatch[1].trim()
        };
      }
    }
    
    return item;
  }
  
  /**
   * Gera rating crítico baseado em análise técnica
   */
  private generateCriticalRating(content: string): any | null {
    const contentLower = content.toLowerCase();
    
    // Termos técnicos positivos
    const positiveTerms = [
      'metodologicamente sólido', 'fundamentado', 'rigoroso',
      'bem estruturado', 'coerente', 'consistente', 'válido',
      'confiável', 'abrangente', 'profundo', 'inovador',
      'contribuição significativa', 'relevante', 'atual'
    ];
    
    // Termos técnicos negativos
    const negativeTerms = [
      'metodologicamente fraco', 'não fundamentado', 'superficial',
      'inconsistente', 'incoerente', 'limitado', 'incompleto',
      'desatualizado', 'questionável', 'falhas metodológicas',
      'evidências insuficientes', 'conclusões precipitadas'
    ];
    
    // Calcula pontuação técnica
    const positiveScore = positiveTerms.filter(term => 
      contentLower.includes(term)
    ).length;
    
    const negativeScore = negativeTerms.filter(term => 
      contentLower.includes(term)
    ).length;
    
    // Determina rating baseado na análise técnica
    let ratingValue: number;
    
    if (positiveScore >= 3 && negativeScore === 0) {
      ratingValue = 5; // Excelente
    } else if (positiveScore >= 2 && negativeScore <= 1) {
      ratingValue = 4; // Muito bom
    } else if (positiveScore >= 1 && negativeScore <= 1) {
      ratingValue = 3; // Adequado
    } else if (negativeScore >= 2) {
      ratingValue = 2; // Problemas significativos
    } else {
      ratingValue = 1; // Inadequado
    }
    
    return {
      '@type': 'Rating',
      ratingValue: ratingValue,
      bestRating: 5,
      worstRating: 1,
      reviewAspect: 'Technical Quality'
    };
  }
  
  /**
   * Extrai análise crítica estruturada
   */
  private extractCriticalAnalysis(content: string): {
    strengths: string[],
    weaknesses: string[],
    recommendation: string | null
  } {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    // Padrões para pontos fortes
    const strengthPatterns = [
      /pontos? fortes?[:\s]*([^.!?\n]+)/gi,
      /aspectos? positivos?[:\s]*([^.!?\n]+)/gi,
      /contribuições?[:\s]*([^.!?\n]+)/gi,
      /qualidades?[:\s]*([^.!?\n]+)/gi,
      /méritos?[:\s]*([^.!?\n]+)/gi
    ];
    
    // Padrões para pontos fracos
    const weaknessPatterns = [
      /pontos? fracos?[:\s]*([^.!?\n]+)/gi,
      /aspectos? negativos?[:\s]*([^.!?\n]+)/gi,
      /limitações?[:\s]*([^.!?\n]+)/gi,
      /deficiências?[:\s]*([^.!?\n]+)/gi,
      /problemas?[:\s]*([^.!?\n]+)/gi,
      /falhas?[:\s]*([^.!?\n]+)/gi
    ];
    
    // Extrai pontos fortes
    strengthPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const strength = match[1].trim();
        if (strength.length > 15 && strength.length < 300) {
          strengths.push(strength);
        }
      }
    });
    
    // Extrai pontos fracos
    weaknessPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const weakness = match[1].trim();
        if (weakness.length > 15 && weakness.length < 300) {
          weaknesses.push(weakness);
        }
      }
    });
    
    // Extrai recomendação crítica
    const recommendation = this.extractCriticalRecommendation(content);
    
    return { strengths, weaknesses, recommendation };
  }
  
  /**
   * Extrai recomendação crítica
   */
  private extractCriticalRecommendation(content: string): string | null {
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('altamente recomendado') || 
        contentLower.includes('excelente contribuição')) {
      return 'Highly Recommended';
    }
    
    if (contentLower.includes('recomendado') && 
        !contentLower.includes('não recomendado')) {
      return 'Recommended';
    }
    
    if (contentLower.includes('recomendado com ressalvas') ||
        contentLower.includes('recomendação condicional')) {
      return 'Conditionally Recommended';
    }
    
    if (contentLower.includes('não recomendado') ||
        contentLower.includes('não recomendo')) {
      return 'Not Recommended';
    }
    
    return null;
  }
  
  /**
   * Gera corpo da crítica estruturado
   */
  private generateCriticalReviewBody(content: string): string {
    // Remove formatação markdown
    const cleanContent = content
      .replace(/#+\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .trim();
    
    // Extrai parágrafos mais críticos/analíticos
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 30);
    
    // Prioriza sentenças com termos críticos
    const criticalKeywords = [
      'análise', 'avaliação', 'crítica', 'metodologia',
      'fundamentação', 'evidência', 'consistência',
      'contribuição', 'limitação', 'problema', 'qualidade'
    ];
    
    const criticalSentences = sentences.filter(sentence => 
      criticalKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      )
    );
    
    // Usa sentenças críticas ou primeiras sentenças
    const selectedSentences = criticalSentences.length >= 2 ? 
      criticalSentences.slice(0, 4) : 
      sentences.slice(0, 4);
    
    const reviewBody = selectedSentences.join('. ').trim();
    
    // Limita tamanho para SEO
    return reviewBody.length > 600 ? 
      reviewBody.substring(0, 597) + '...' : 
      reviewBody;
  }
  
  /**
   * Adiciona warnings específicos para críticas
   */
  private addCriticalReviewWarnings(warnings: string[], article: any): void {
    const content = article.conteudo.toLowerCase();
    
    // Verifica fundamentação
    if (!content.includes('referência') && !content.includes('bibliografia') && 
        !content.includes('fonte')) {
      warnings.push('Críticas se beneficiam de referências e fundamentação');
    }
    
    // Verifica equilíbrio crítico
    if (!content.includes('ponto forte') && !content.includes('ponto fraco')) {
      warnings.push('Análise crítica equilibrada recomendada');
    }
    
    // Verifica credenciais do crítico
    if (!content.includes('experiência') && !content.includes('especialista')) {
      warnings.push('Mencionar credenciais do crítico aumenta autoridade');
    }
    
    // Verifica profundidade
    if (article.conteudo.length < 500) {
      warnings.push('Críticas especializadas requerem análise mais profunda');
    }
    
    // Verifica metodologia
    if (!content.includes('metodologia') && !content.includes('método') && 
        !content.includes('abordagem')) {
      warnings.push('Discussão metodológica enriquece crítica técnica');
    }
  }
}

/**
 * Instância exportada do gerador
 */
export const criticReviewGenerator = new CriticReviewGenerator();

// Export da classe para uso em imports nomeados
export { CriticReviewGenerator };
