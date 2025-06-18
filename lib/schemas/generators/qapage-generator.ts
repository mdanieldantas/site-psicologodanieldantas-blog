/**
 * ❓ QAPAGE SCHEMA GENERATOR
 * 
 * Gerador de schemas JSON-LD para conteúdo tipo "QAPage"
 * - Otimizado para páginas de perguntas e respostas
 * - Rich snippets para Q&A estruturado
 * - Suporte para múltiplas perguntas e respostas
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - QAPage Generator
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
// ❓ QAPAGE GENERATOR CLASS
// ==========================================

export class QAPageGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'QAPage';
  protected readonly requiredFields: string[] = [
    'headline',
    'author',
    'datePublished',
    'dateModified',
    'publisher'
  ];

  /**
   * Gera schema QAPage completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando QAPage para: ${article.titulo}`);
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Estatísticas do conteúdo
      const contentStats = getContentStats(article.conteudo);
      
      // Extrair questões do conteúdo
      const questions = this.extractQuestions(article);
      
      // Schema QAPage específico
      const schema = {
        ...baseFields,
        '@type': 'QAPage',
        
        // Questão principal (baseada no título)
        mainEntity: {
          '@type': 'Question',
          '@id': generateSchemaId('question', article.slug),
          name: article.titulo,
          text: article.titulo,
          answerCount: 1,
          acceptedAnswer: {
            '@type': 'Answer',
            text: this.generateMainAnswer(article),
            author: baseFields.author,
            dateCreated: baseFields.datePublished,
            upvoteCount: this.estimateUpvotes(article)
          }
        },
        
        // Questões adicionais extraídas do conteúdo
        ...(questions.length > 0 && {
          hasPart: questions.map((qa, index) => ({
            '@type': 'Question',
            '@id': generateSchemaId('question', `${article.slug}-${index + 1}`),
            name: qa.question,
            text: qa.question,
            answerCount: 1,
            acceptedAnswer: {
              '@type': 'Answer',
              text: qa.answer,
              author: baseFields.author,
              dateCreated: baseFields.datePublished
            }
          }))
        }),
        
        // Categorização específica
        about: {
          '@type': 'Thing',
          name: article.categoria_principal,
          description: `Perguntas e respostas sobre ${article.categoria_principal}`
        },
        
        // Público-alvo
        audience: {
          '@type': 'Audience',
          audienceType: 'Pessoas com dúvidas sobre psicologia e desenvolvimento pessoal'
        },
        
        // Palavras-chave específicas para Q&A
        keywords: this.generateQAKeywords(article),
        
        // Interatividade
        interactionStatistic: [
          {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/CommentAction',
            userInteractionCount: this.estimateInteractions(article)
          },
          {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/ShareAction',
            userInteractionCount: Math.floor(this.estimateInteractions(article) * 0.1)
          }
        ],
        
        // Tópicos relacionados
        ...(article.tags && article.tags.length > 0 && {
          mentions: article.tags.map(tag => ({
            '@type': 'Thing',
            name: tag,
            description: `Informações sobre ${tag}`
          }))
        }),
        
        // FAQ estruturado (se disponível no banco)
        ...(article.faq_data && {
          additionalProperty: {
            '@type': 'PropertyValue',
            name: 'FAQ Data',
            value: JSON.stringify(article.faq_data)
          }
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
      
      this.log('info', `QAPage gerado com sucesso: ${performance.fieldsCount} campos em ${performance.generationTime}ms`);
      
      return {
        schema,
        schemaType: 'QAPage',
        source: 'manual',
        confidence: this.calculateConfidence(article),
        warnings,
        errors: [],
        performance
      };
      
    } catch (error) {
      this.log('error', `Erro ao gerar QAPage: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      throw error;
    }
  }

  /**
   * Extrai questões e respostas do conteúdo
   */
  private extractQuestions(article: any): Array<{question: string, answer: string}> {
    const content = article.conteudo;
    const questions: Array<{question: string, answer: string}> = [];
    
    // Padrão 1: Perguntas em cabeçalhos seguidas de parágrafos
    const headerQuestionRegex = /<h[2-6][^>]*>(.*?\?[^<]*)<\/h[2-6]>/gi;
    const matches = content.matchAll(headerQuestionRegex);
    
    for (const match of matches) {
      const question = match[1].replace(/<[^>]*>/g, '').trim();
      if (question.length > 10) {
        // Encontrar a resposta (próximo parágrafo após o cabeçalho)
        const questionIndex = content.indexOf(match[0]);
        const afterQuestion = content.substring(questionIndex + match[0].length);
        const answerMatch = afterQuestion.match(/<p[^>]*>(.*?)<\/p>/i);
        
        if (answerMatch) {
          const answer = answerMatch[1].replace(/<[^>]*>/g, '').trim();
          if (answer.length > 20) {
            questions.push({ question, answer: answer.substring(0, 500) });
          }
        }
      }
    }
    
    // Padrão 2: Perguntas em negrito seguidas de respostas
    const boldQuestionRegex = /<strong[^>]*>(.*?\?[^<]*)<\/strong>/gi;
    const boldMatches = content.matchAll(boldQuestionRegex);
    
    for (const match of boldMatches) {
      const question = match[1].replace(/<[^>]*>/g, '').trim();
      if (question.length > 10 && !questions.some(q => q.question === question)) {
        // Buscar resposta após o <strong>
        const questionIndex = content.indexOf(match[0]);
        const afterQuestion = content.substring(questionIndex + match[0].length);
        const answerText = afterQuestion.substring(0, 1000).replace(/<[^>]*>/g, '').trim();
        
        if (answerText.length > 20) {
          const answer = answerText.split('\n')[0] || answerText.substring(0, 300);
          questions.push({ question, answer });
        }
      }
    }
    
    // Padrão 3: FAQ estruturado do banco de dados
    if (article.faq_data && Array.isArray(article.faq_data)) {
      article.faq_data.forEach((faq: any) => {
        if (faq.question && faq.answer) {
          questions.push({
            question: faq.question,
            answer: faq.answer
          });
        }
      });
    }
    
    return questions.slice(0, 10); // Limitar a 10 questões
  }

  /**
   * Gera resposta principal baseada no resumo ou conteúdo
   */
  private generateMainAnswer(article: any): string {
    // Usar resumo se disponível
    if (article.resumo && article.resumo.length > 50) {
      return article.resumo;
    }
    
    // Caso contrário, extrair primeiro parágrafo significativo
    const content = article.conteudo.replace(/<[^>]*>/g, ' ');
    const paragraphs = content.split(/\n+/).filter((p: string) => p.trim().length > 100);
    
    if (paragraphs.length > 0) {
      return paragraphs[0].substring(0, 500).trim() + '...';
    }
    
    // Fallback
    return `Este artigo aborda questões importantes sobre ${article.categoria_principal}, fornecendo informações úteis e práticas para o seu desenvolvimento pessoal.`;
  }

  /**
   * Gera palavras-chave específicas para Q&A
   */
  private generateQAKeywords(article: any): string {
    const keywords = new Set<string>();
    
    // Palavras base
    keywords.add('perguntas e respostas');
    keywords.add('dúvidas');
    keywords.add('esclarecimentos');
    
    // Categoria
    if (article.categoria_principal) {
      keywords.add(article.categoria_principal);
      keywords.add(`dúvidas sobre ${article.categoria_principal}`);
    }
    
    // Tags
    if (article.tags) {
      article.tags.forEach((tag: string) => keywords.add(tag));
    }
    
    // Palavras específicas da psicologia
    const psychKeywords = ['psicologia', 'terapia', 'saúde mental', 'desenvolvimento pessoal'];
    psychKeywords.forEach(keyword => keywords.add(keyword));
    
    return Array.from(keywords).join(', ');
  }

  /**
   * Estima número de interações baseado no conteúdo
   */
  private estimateInteractions(article: any): number {
    let interactions = 10; // Base
    
    // Mais interações para conteúdo premium
    if (article.content_tier === 'premium') interactions += 20;
    
    // Mais interações para artigos longos
    const wordCount = article.conteudo.replace(/<[^>]*>/g, '').split(/\s+/).length;
    interactions += Math.floor(wordCount / 100);
    
    // Mais interações se tem FAQ estruturado
    if (article.faq_data && Array.isArray(article.faq_data)) {
      interactions += article.faq_data.length * 5;
    }
    
    return Math.min(interactions, 100); // Máximo 100
  }

  /**
   * Estima upvotes para a resposta principal
   */
  private estimateUpvotes(article: any): number {
    let upvotes = 5; // Base
    
    // Mais upvotes para conteúdo de qualidade
    if (article.content_tier === 'premium') upvotes += 10;
    
    // Mais upvotes se o artigo é recente
    const publishedDate = new Date(article.data_publicacao || article.data_criacao);
    const monthsOld = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsOld < 6) upvotes += 5;
    
    return Math.min(upvotes, 50); // Máximo 50
  }

  /**
   * Calcula confiança do schema QAPage para este conteúdo
   */
  private calculateConfidence(article: any): number {
    let confidence = 0.3; // Base baixa
    
    const titleLower = article.titulo.toLowerCase();
    const contentLower = article.conteudo.toLowerCase();
    
    // Título em forma de pergunta
    if (titleLower.includes('?') || titleLower.includes('como') || titleLower.includes('por que')) {
      confidence += 0.4;
    }
    
    // Palavras indicativas de Q&A
    const qaWords = ['pergunta', 'resposta', 'dúvida', 'questão', 'faq'];
    const foundWords = qaWords.filter(word => titleLower.includes(word) || contentLower.includes(word));
    confidence += foundWords.length * 0.1;
    
    // Presença de perguntas no conteúdo
    const questionCount = (contentLower.match(/\?/g) || []).length;
    confidence += Math.min(questionCount * 0.05, 0.3);
    
    // FAQ estruturado no banco
    if (article.faq_data && Array.isArray(article.faq_data) && article.faq_data.length > 0) {
      confidence += 0.4;
    }
    
    // Estrutura de perguntas em cabeçalhos
    const headerQuestions = (article.conteudo.match(/<h[2-6][^>]*>.*?\?.*?<\/h[2-6]>/gi) || []).length;
    confidence += headerQuestions * 0.1;
    
    return Math.min(confidence, 1.0);
  }
}
