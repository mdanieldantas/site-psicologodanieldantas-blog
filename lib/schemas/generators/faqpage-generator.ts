/**
 * 🤔 GERADOR DE SCHEMA FAQPAGE
 * 
 * Gerador específico para páginas de Perguntas Frequentes (Schema.org FAQPage).
 * Extrai automaticamente Q&As do conteúdo e estrutura para Rich Results.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Extração automática de perguntas e respostas
 * - Suporte a múltiplos formatos (headers, listas, inline)
 * - Validação de qualidade das Q&As
 * - Otimização para Featured Snippets
 * 
 * 🎯 CASOS DE USO:
 * - Páginas de FAQ dedicadas
 * - Artigos com seções de perguntas
 * - Guias com Q&As integradas
 * - Conteúdo educacional com dúvidas
 * 
 * 📊 DADOS UTILIZADOS:
 * - conteudo: Para extração de Q&As
 * - titulo: Nome da página FAQ
 * - meta_descricao: Descrição da página
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - FAQPage Generator
 */

import { BaseSchemaGenerator } from '../core/base-schema';
import type {
  SchemaGenerationContext,
  SchemaGenerationResult,
  SchemaTypeEnum
} from '../core/types';

// 🚀 SEO 2025: Importar extrator automático de FAQ
import { EnhancedFAQExtractor, DEFAULT_EXTRACTION_CONFIG } from '../core/auto-extractors';
import type { EnhancedFAQData, AutoExtractionResult } from '../core/seo-enhancements';

// 🎯 Interface para análise tradicional de FAQ (compatibilidade)
interface FAQAnalysis {
  questions: Array<{
    question: string;
    answer: string;
    acceptedAnswer?: {
      '@type': 'Answer';
      text: string;
    };
  }>;
  qualityScore: number;
  totalQuestions: number;
}

// ==========================================
// 🤔 GERADOR FAQPAGE
// ==========================================

/**
 * Gerador específico para FAQPage schemas
 */
export class FAQPageGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'FAQPage';
  protected readonly requiredFields: string[] = [
    'mainEntity'
  ];
    /**
   * Gera schema FAQPage completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando FAQPage para: ${article.titulo}`);      // 🚀 SEO 2025: Extração automática melhorada
      const extractor = new EnhancedFAQExtractor(DEFAULT_EXTRACTION_CONFIG);
      const autoExtraction = await extractor.enhanceFAQData(
        article.faq_data ? JSON.parse(article.faq_data) : [],
        article.conteudo
      );
      
      // Fallback para extração tradicional se automática falhou
      const faqAnalysis = autoExtraction.data ? 
        this.convertAutoExtractionToAnalysis(autoExtraction.data) :
        this.extractQuestionsTraditional(article.conteudo);
        
      // Log de qualidade da extração
      if (autoExtraction.data) {
        this.log('info', `Extração automática bem-sucedida (confiança: ${autoExtraction.confidence})`);
        if (autoExtraction.warnings.length > 0) {
          this.log('warn', `Avisos na extração: ${autoExtraction.warnings.join(', ')}`);
        }
      } else {
        this.log('warn', 'Usando extração tradicional como fallback');
      }
      
      // Validação mínima
      if (faqAnalysis.questions.length < 2) {
        const warning = `FAQ deve ter pelo menos 2 perguntas válidas (encontradas: ${faqAnalysis.questions.length})`;
        this.log('warn', warning);
        
        // Retorna sem schema se não há Q&As suficientes
        return this.createResult({}, context, startTime, [warning], []);
      }
        // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Construção do schema FAQPage
      const schema = {
        ...baseFields,
        '@type': 'FAQPage',
        mainEntity: faqAnalysis.questions.map((qa: any, index: number) => ({
          '@type': 'Question',
          name: qa.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: qa.answer
          }
        }))
      };
      
      // Validação e warnings
      const warnings = this.validateSchema(schema);
      this.addSEOWarnings(warnings, faqAnalysis.questions);
      
      this.log('info', `FAQPage gerado com ${faqAnalysis.questions.length} perguntas`, {
        questionsCount: faqAnalysis.questions.length,
        averageQuestionLength: Math.round(faqAnalysis.questions.reduce((acc: number, qa: any) => acc + qa.question.length, 0) / faqAnalysis.questions.length),
        averageAnswerLength: Math.round(faqAnalysis.questions.reduce((acc: number, qa: any) => acc + qa.answer.length, 0) / faqAnalysis.questions.length)
      });
      
      return this.createResult(schema, context, startTime, warnings);
      
    } catch (error) {
      const errorMsg = `Erro ao gerar FAQPage: ${error}`;
      this.log('error', errorMsg);
      return this.createResult({}, context, startTime, [], [errorMsg]);
    }
  }
  
  /**
   * Verifica se o conteúdo é elegível para schema FAQPage
   */
  private isApplicableForContent(content: string): boolean {
    if (!content) return false;
    
    const contentLower = content.toLowerCase();    
    // Verifica indicadores de FAQ
    const faqIndicators = [
      'pergunta', 'resposta', 'dúvida', 'questão',
      'faq', 'frequently asked', 'perguntas frequentes',
      'como fazer', 'o que é', 'por que', 'quando',
      'onde', 'quem', 'qual'
    ];
    
    const hasIndicators = faqIndicators.some(indicator => 
      contentLower.includes(indicator)
    );
    
    // Verifica padrões estruturais de Q&A
    const qaPatternsCount = this.countQAPatterns(content);
    
    // Requer pelo menos 2 Q&As para ser considerado FAQ
    return hasIndicators && qaPatternsCount >= 2;
  }
  
  /**
   * Extrai perguntas e respostas do conteúdo
   */
  private extractQuestions(content: string): Array<{question: string, answer: string}> {
    const questions: Array<{question: string, answer: string}> = [];
    
    // Padrão 1: Headers como perguntas
    const headerPattern = /^(#{1,6})\s*(.+\?)\s*\n([\s\S]*?)(?=^#{1,6}|\n\n|\Z)/gm;
    let match;
    
    while ((match = headerPattern.exec(content)) !== null) {
      const question = match[2].trim();
      const answer = this.cleanAnswer(match[3]);
      
      if (this.isValidQA(question, answer)) {
        questions.push({ question, answer });
      }
    }
    
    // Padrão 2: Listas numeradas/com marcadores
    if (questions.length < 2) {
      questions.push(...this.extractFromLists(content));
    }
    
    // Padrão 3: Perguntas inline
    if (questions.length < 2) {
      questions.push(...this.extractInlineQuestions(content));
    }
    
    return questions;
  }
  
  /**
   * Extrai Q&As de listas estruturadas
   */
  private extractFromLists(content: string): Array<{question: string, answer: string}> {
    const questions: Array<{question: string, answer: string}> = [];
    
    // Lista numerada com perguntas
    const listPattern = /^\d+\.\s*(.+\?)\s*\n([\s\S]*?)(?=^\d+\.|\n\n|\Z)/gm;
    let match;
    
    while ((match = listPattern.exec(content)) !== null) {
      const question = match[1].trim();
      const answer = this.cleanAnswer(match[2]);
      
      if (this.isValidQA(question, answer)) {
        questions.push({ question, answer });
      }
    }
    
    return questions;
  }
  
  /**
   * Extrai perguntas inline do texto
   */
  private extractInlineQuestions(content: string): Array<{question: string, answer: string}> {
    const questions: Array<{question: string, answer: string}> = [];
    
    // Padrão: Pergunta seguida de resposta
    const inlinePattern = /([^.!?]*\?)\s*([\s\S]*?)(?=[^.!?]*\?|\n\n|\Z)/g;
    let match;
    
    while ((match = inlinePattern.exec(content)) !== null) {
      const question = match[1].trim();
      const answer = this.cleanAnswer(match[2]);
      
      if (this.isValidQA(question, answer) && answer.length >= 20) {
        questions.push({ question, answer });
      }
    }
    
    return questions;
  }
  
  /**
   * Conta padrões de Q&A no conteúdo
   */
  private countQAPatterns(content: string): number {
    const patterns = [
      /#{1,6}\s*.+\?/g,  // Headers com pergunta
      /^\d+\.\s*.+\?/gm, // Lista numerada com pergunta
      /\*\s*.+\?/g,      // Lista com marcadores
      /\?.*\n.*\w/g      // Pergunta seguida de texto
    ];
    
    let totalCount = 0;
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) totalCount += matches.length;
    });
    
    return totalCount;
  }
  
  /**
   * Limpa e formata a resposta
   */
  private cleanAnswer(answer: string): string {
    return answer
      .trim()
      .replace(/^\n+|\n+$/g, '') // Remove quebras no início/fim
      .replace(/\n{3,}/g, '\n\n') // Normaliza quebras múltiplas
      .replace(/\s+/g, ' ') // Normaliza espaços
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
      .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
      .replace(/`(.*?)`/g, '$1') // Remove markdown code
      .substring(0, 500); // Limita tamanho para SEO
  }
  
  /**
   * Valida se uma pergunta e resposta são adequadas
   */
  private isValidQA(question: string, answer: string): boolean {
    // Pergunta deve terminar com ?
    if (!question.endsWith('?')) return false;
    
    // Pergunta deve ter tamanho razoável
    if (question.length < 5 || question.length > 200) return false;
    
    // Resposta deve ter conteúdo mínimo
    if (answer.length < 10) return false;
    
    // Resposta não deve ser muito longa (evita parágrafos completos)
    if (answer.length > 1000) return false;
    
    // Evita perguntas muito genéricas
    const genericPatterns = [
      /^o que [eé]/i,
      /^como/i,
      /^por que/i,
      /^quando/i,
      /^onde/i
    ];
    
    const isGeneric = genericPatterns.some(pattern => 
      pattern.test(question) && question.length < 20
    );
    
    return !isGeneric;
  }
  
  /**
   * Adiciona warnings de SEO específicos para FAQ
   */
  private addSEOWarnings(warnings: string[], questions: Array<{question: string, answer: string}>): void {
    // Verifica número ideal de perguntas
    if (questions.length < 3) {
      warnings.push('FAQs com 3+ perguntas têm melhor performance');
    }
    
    if (questions.length > 10) {
      warnings.push('Muitas perguntas podem prejudicar a legibilidade');
    }
    
    // Verifica qualidade das perguntas
    const shortQuestions = questions.filter(qa => qa.question.length < 20);
    if (shortQuestions.length > 0) {
      warnings.push(`${shortQuestions.length} pergunta(s) muito curta(s)`);
    }
    
    const longAnswers = questions.filter(qa => qa.answer.length > 300);
    if (longAnswers.length > 0) {
      warnings.push(`${longAnswers.length} resposta(s) muito longa(s) - considere resumir`);
    }
    
    // Verifica duplicatas
    const questionTexts = questions.map(qa => qa.question.toLowerCase());
    const duplicates = questionTexts.filter((q, i) => questionTexts.indexOf(q) !== i);
    if (duplicates.length > 0) {
      warnings.push('Perguntas duplicadas detectadas');
    }
  }
  /**
   * 🚀 SEO 2025: Converte dados de extração automática para formato tradicional
   */
  private convertAutoExtractionToAnalysis(enhancedFAQ: EnhancedFAQData): FAQAnalysis {
    return {
      questions: enhancedFAQ.questions.map(q => ({
        question: q.question,
        answer: q.answer,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer
        }
      })),
      qualityScore: enhancedFAQ.structuringConfidence,
      totalQuestions: enhancedFAQ.questions.length
    };
  }

  /**
   * 🚀 SEO 2025: Método de extração tradicional (renomeado para clareza)
   */
  private extractQuestionsTraditional(content: string): FAQAnalysis {
    const questions = this.extractQuestions(content);
    return {
      questions: questions.map(q => ({
        question: q.question,
        answer: q.answer,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer
        }
      })),
      qualityScore: Math.min(questions.length * 0.3, 1.0),
      totalQuestions: questions.length
    };
  }
}

/**
 * Instância exportada do gerador
 */
export const faqPageGenerator = new FAQPageGenerator();
