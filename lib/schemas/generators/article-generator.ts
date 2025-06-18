/**
 * 📄 GERADOR DE SCHEMA ARTICLE
 * 
 * Gerador específico para schemas do tipo Article (Schema.org).
 * Corrige o problema da linha 904 do sistema antigo onde Article
 * fazia fallback inadequado para BlogPosting.
 * 
 * 📋 DIFERENÇAS DO BLOGPOSTING:
 * - Mais foco em jornalismo e reportagem
 * - Campos específicos para artigos de notícia
 * - Suporte a seções e editores
 * - Metadados de publicação mais detalhados
 * 
 * 🎯 CASOS DE USO:
 * - Artigos jornalísticos
 * - Reportagens
 * - Análises profundas
 * - Conteúdo editorial
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - Article Generator (Correção linha 904)
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
  getContentStats,
  slugify
} from '../core/utils';

// ==========================================
// 📄 GERADOR ARTICLE
// ==========================================

/**
 * Gerador específico para Article schemas
 * CORRIGE O PROBLEMA DA LINHA 904 - não faz mais fallback inadequado para BlogPosting
 */
export class ArticleGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'Article';
  protected readonly requiredFields: string[] = [
    'headline',
    'author',
    'datePublished',
    'dateModified',
    'publisher',
    'articleBody'
  ];
  
  /**
   * Gera schema Article completo (CORRIGIDO - não é mais BlogPosting)
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando Article para: ${article.titulo} (CORRIGIDO - não é BlogPosting)`);
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Estatísticas do conteúdo
      const contentStats = getContentStats(article.conteudo);
      
      // Schema Article específico (NÃO É BLOGPOSTING)
      const schema = {
        ...baseFields,
        '@type': 'Article', // ✅ CORRIGIDO: Era BlogPosting na linha 904
        
        // Campos específicos do Article
        articleBody: this.extractArticleBody(article.conteudo),
        wordCount: contentStats.wordCount,
        
        // Campos jornalísticos específicos do Article
        articleSection: article.categoria_principal,
        ...(article.subcategoria_nome && {
          articleSection: [article.categoria_principal, article.subcategoria_nome]
        }),
        
        // Dados editoriais
        editor: this.generateEditorInfo(article),
        
        // Classificação do artigo
        genre: this.classifyArticleGenre(article.conteudo, article.categoria_principal),
        
        // Tópicos principais
        about: this.extractMainTopics(article.conteudo, article.categoria_principal),
        
        // Menções e referências
        mentions: this.extractMentions(article.conteudo),
        
        // Credibilidade editorial
        copyrightHolder: {
          '@type': 'Organization',
          name: 'Psicólogo Daniel Dantas',
          url: process.env.NEXT_PUBLIC_SITE_URL
        },
        
        copyrightYear: new Date(article.data_publicacao || Date.now()).getFullYear(),
        
        // Informações de publicação
        publishingPrinciples: `${process.env.NEXT_PUBLIC_SITE_URL}/politica-editorial`,
        
        // Correção (se aplicável)
        ...(article.data_atualizacao !== article.data_criacao && {
          correction: {
            '@type': 'CorrectionComment',
            datePublished: formatSchemaDate(article.data_atualizacao),
            text: 'Artigo atualizado com correções e melhorias'
          }
        })
      };
      
      // Adicionar campos multimídia (específicos para Article)
      const enhancedSchema = this.addArticleMultimediaFields(schema, article);
      
      // Adicionar FAQ se disponível (no contexto de Article)
      const finalSchema = this.addArticleFAQFields(enhancedSchema, article);
      
      // Validar schema
      const warnings = this.validateSchema(finalSchema);
      
      // Metadados específicos do Article (apenas em desenvolvimento)
      if (context.config.environment === 'development') {
        finalSchema._articleMeta = {
          originalFallbackIssue: 'Linha 904 corrigida - não faz mais fallback para BlogPosting',
          journalismScore: this.calculateJournalismScore(article.conteudo),
          editorialQuality: this.assessEditorialQuality(article),
          topicComplexity: this.analyzeTopicComplexity(article.conteudo),
          sourceCredibility: this.assessSourceCredibility(article.conteudo)
        };
      }
      
      this.log('info', `Article gerado com sucesso (${contentStats.wordCount} palavras) - CORRIGIDO`);
      
      return this.createResult(finalSchema, context, startTime, warnings);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      this.log('error', `Erro ao gerar Article: ${errorMessage}`);
      throw error;
    }
  }
    /**
   * Extrai o corpo principal do artigo para schema Article
   */
  private extractArticleBody(content: string): string {
    // Para Article, manter mais estrutura que BlogPosting
    return content
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove scripts
      .replace(/<style[^>]*>.*?<\/style>/gi, '')   // Remove styles
      .trim()
      .substring(0, 10000); // Limite maior para artigos jornalísticos
  }
  
  /**
   * Gera informações do editor (pode ser o mesmo que autor)
   */
  private generateEditorInfo(article: any) {
    return {
      '@type': 'Person',
      '@id': generateSchemaId('editor', slugify(article.autor_principal)),
      name: article.autor_principal,
      jobTitle: 'Editor-Chefe e Psicólogo',
      worksFor: {
        '@type': 'Organization',
        name: 'Psicólogo Daniel Dantas'
      }
    };
  }
  
  /**
   * Classifica o gênero do artigo baseado no conteúdo
   */
  private classifyArticleGenre(content: string, categoria: string): string[] {
    const genres = [];
    const lowerContent = content.toLowerCase();
    const lowerCategoria = categoria.toLowerCase();
    
    // Gêneros baseados na categoria
    if (lowerCategoria.includes('terapia')) {
      genres.push('Artigo Terapêutico');
    }
    
    if (lowerCategoria.includes('pesquisa')) {
      genres.push('Artigo de Pesquisa');
    }
    
    if (lowerCategoria.includes('opinião')) {
      genres.push('Artigo de Opinião');
    }
    
    // Gêneros baseados no conteúdo
    if (lowerContent.includes('estudo') || lowerContent.includes('pesquisa')) {
      genres.push('Artigo Científico');
    }
    
    if (lowerContent.includes('caso') || lowerContent.includes('exemplo')) {
      genres.push('Estudo de Caso');
    }
    
    if (lowerContent.includes('análise') || lowerContent.includes('investigação')) {
      genres.push('Artigo Analítico');
    }
    
    // Fallback
    if (genres.length === 0) {
      genres.push('Artigo Informativo');
    }
    
    return genres;
  }
  
  /**
   * Extrai tópicos principais do artigo
   */
  private extractMainTopics(content: string, categoria: string) {
    const topics = [];
    const lowerContent = content.toLowerCase();
    
    // Tópico principal (categoria)
    topics.push({
      '@type': 'Thing',
      name: categoria,
      description: `Artigo sobre ${categoria.toLowerCase()}`
    });
    
    // Tópicos específicos da psicologia
    const psychTopics = [
      { keyword: 'ansiedade', name: 'Transtornos de Ansiedade' },
      { keyword: 'depressão', name: 'Transtornos do Humor' },
      { keyword: 'relacionamento', name: 'Relacionamentos Interpessoais' },
      { keyword: 'autoestima', name: 'Autoestima e Autoconceito' },
      { keyword: 'stress', name: 'Gestão do Estresse' },
      { keyword: 'mindfulness', name: 'Práticas Mindfulness' },
      { keyword: 'terapia', name: 'Processos Terapêuticos' },
      { keyword: 'desenvolvimento', name: 'Desenvolvimento Pessoal' }
    ];
    
    psychTopics.forEach(topic => {
      if (lowerContent.includes(topic.keyword)) {
        topics.push({
          '@type': 'Thing',
          name: topic.name,
          sameAs: `https://schema.org/${topic.name.replace(/\s+/g, '')}`
        });
      }
    });
    
    return topics.slice(0, 5); // Limitar a 5 tópicos principais
  }
    /**
   * Extrai menções de pessoas, organizações ou conceitos
   */
  private extractMentions(content: string): Array<{ '@type': string; name: string }> {
    const mentions: Array<{ '@type': string; name: string }> = [];
    
    // Padrões para detectar menções
    const patterns = [
      /Dr\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,     // Dr. Nome
      /segundo\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,   // segundo Autor
      /([A-Z][a-z]+)\s+\(\d{4}\)/g,                     // Autor (2024)
      /(CRP|CFP|APA|OMS|DSM-5)/g                        // Organizações
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const name = match[1] || match[0];
        if (name && name.length > 2) {
          mentions.push({
            '@type': 'Person',
            name: name.trim()
          });
        }
      }
    });
    
    return mentions.slice(0, 10); // Limitar a 10 menções
  }
  
  /**
   * Calcula pontuação de qualidade jornalística
   */
  private calculateJournalismScore(content: string): number {
    let score = 50; // Base
    
    // Pontos positivos
    if (content.includes('fonte:') || content.includes('referência:')) score += 15;
    if (content.includes('pesquisa') || content.includes('estudo')) score += 10;
    if (content.includes('dados') || content.includes('estatística')) score += 10;
    if (content.match(/\(\d{4}\)/g)) score += 10; // Citações com ano
    if (content.includes('metodologia')) score += 5;
    
    // Pontos negativos
    if (content.includes('acredito') || content.includes('acho')) score -= 5;
    if (content.includes('sempre') || content.includes('nunca')) score -= 3;
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Avalia qualidade editorial
   */
  private assessEditorialQuality(article: any): string {
    let score = 0;
    
    if (article.meta_titulo) score += 20;
    if (article.meta_descricao) score += 20;
    if (article.resumo) score += 15;
    if (article.imagem_capa_arquivo) score += 15;
    if (article.tags && article.tags.length > 0) score += 10;
    if (article.faq_data) score += 20;
    
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Boa';
    if (score >= 40) return 'Regular';
    return 'Necessita melhorias';
  }
  
  /**
   * Analisa complexidade do tópico
   */
  private analyzeTopicComplexity(content: string): string {
    const technicalTermCount = (content.match(/\b(neuroplasticidade|psicoterapia|cognitivo|sistêmica|psicodinâmica)\b/gi) || []).length;
    const wordCount = content.split(' ').length;
    const complexityRatio = technicalTermCount / (wordCount / 100);
    
    if (complexityRatio > 3) return 'Alta';
    if (complexityRatio > 1.5) return 'Média';
    return 'Baixa';
  }
  
  /**
   * Avalia credibilidade das fontes
   */
  private assessSourceCredibility(content: string): string {
    const hasAcademicSources = /\b(universidade|faculdade|instituto|journal|revista científica)\b/gi.test(content);
    const hasProfessionalSources = /\b(CRP|CFP|APA|OMS|DSM)\b/gi.test(content);
    const hasCitations = /\(\d{4}\)/g.test(content);
    
    if (hasAcademicSources && hasProfessionalSources && hasCitations) return 'Alta';
    if ((hasAcademicSources || hasProfessionalSources) && hasCitations) return 'Média';
    if (hasCitations) return 'Moderada';
    return 'Baixa';
  }
  
  /**
   * Adiciona campos multimídia específicos para Article
   */
  private addArticleMultimediaFields(schema: any, article: any): any {
    const enhanced = { ...schema };
    
    // Para Article, multimídia é considerada "material suplementar"
    const supplementaryMaterial = [];
    
    if (article.url_video) {
      supplementaryMaterial.push({
        '@type': 'VideoObject',
        name: `Material suplementar em vídeo: ${article.titulo}`,
        description: 'Vídeo complementar ao artigo',
        contentUrl: article.url_video
      });
    }
    
    if (article.url_podcast) {
      supplementaryMaterial.push({
        '@type': 'AudioObject',
        name: `Material suplementar em áudio: ${article.titulo}`,
        description: 'Podcast relacionado ao artigo',
        contentUrl: article.url_podcast
      });
    }
    
    if (supplementaryMaterial.length > 0) {
      enhanced.associatedMedia = supplementaryMaterial;
    }
    
    return enhanced;
  }
  
  /**
   * Adiciona FAQ específico para Article
   */
  private addArticleFAQFields(schema: any, article: any): any {
    if (!article.faq_data || !Array.isArray(article.faq_data)) {
      return schema;
    }
    
    // Para Article, FAQ pode ser parte da estrutura editorial
    const enhanced = { ...schema };
    
    enhanced.hasPart = enhanced.hasPart || [];
    enhanced.hasPart.push({
      '@type': 'FAQPage',
      '@id': generateSchemaId('article-faq', article.slug),
      name: `FAQ Editorial: ${article.titulo}`,
      description: 'Perguntas frequentes relacionadas ao artigo',
      mainEntity: article.faq_data.map((faq: any, index: number) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    });
    
    return enhanced;
  }
}
