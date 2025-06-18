/**
 * 🎓 SCHOLARLY ARTICLE SCHEMA GENERATOR
 * 
 * Gerador de schemas JSON-LD para conteúdo tipo "ScholarlyArticle"
 * - Otimizado para artigos acadêmicos e científicos
 * - Rich snippets para publicações científicas
 * - Suporte para citações e referências
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - ScholarlyArticle Generator
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
// 🎓 SCHOLARLY ARTICLE GENERATOR CLASS
// ==========================================

export class ScholarlyArticleGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'ScholarlyArticle';
  protected readonly requiredFields: string[] = [
    'headline',
    'author',
    'datePublished',
    'dateModified',
    'publisher'
  ];

  /**
   * Gera schema ScholarlyArticle completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando ScholarlyArticle para: ${article.titulo}`);
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Estatísticas do conteúdo
      const contentStats = getContentStats(article.conteudo);
      
      // Schema ScholarlyArticle específico
      const schema = {
        ...baseFields,
        '@type': 'ScholarlyArticle',
        
        // Campos acadêmicos específicos
        abstract: this.generateAbstract(article),
        articleSection: this.extractSections(article),
        
        // Classificação acadêmica
        academicSubject: this.determineAcademicSubject(article),
        educationalLevel: 'undergraduate', // Nível de graduação por padrão
        
        // Autor com credenciais acadêmicas
        author: {
          ...baseFields.author,
          '@type': 'Person',
          hasCredential: [
            {
              '@type': 'EducationalOccupationalCredential',
              name: 'Psicólogo',
              credentialCategory: 'degree'
            },
            {
              '@type': 'EducationalOccupationalCredential', 
              name: 'Especialista em Psicologia Clínica',
              credentialCategory: 'certification'
            }
          ],
          knowsAbout: [
            'Psicologia Clínica',
            'Terapia',
            'Desenvolvimento Pessoal',
            'Saúde Mental',
            article.categoria_principal
          ],
          memberOf: {
            '@type': 'Organization',
            name: 'Conselho Regional de Psicologia',
            description: 'Órgão regulador da profissão de psicólogo'
          }
        },
        
        // Publisher acadêmico
        publisher: {
          ...baseFields.publisher,
          '@type': 'Organization',
          name: 'Psicólogo Daniel Dantas',
          description: 'Plataforma de conteúdo científico em psicologia'
        },
        
        // Citações e referências
        citation: this.extractCitations(article),
        
        // Palavras-chave acadêmicas
        keywords: this.generateAcademicKeywords(article),
        
        // Linguagem e localização
        inLanguage: 'pt-BR',
        spatialCoverage: 'Brasil',
        
        // Licença acadêmica
        license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        
        // Métricas acadêmicas
        wordCount: contentStats.wordCount,
        timeRequired: `PT${contentStats.readingTime}M`,
        
        // Assunto principal
        about: {
          '@type': 'Thing',
          name: article.categoria_principal,
          description: `Estudo sobre ${article.categoria_principal} na perspectiva da psicologia`
        },
        
        // Público acadêmico
        audience: {
          '@type': 'EducationalAudience',
          audienceType: 'Estudantes e profissionais de psicologia',
          educationalRole: 'student'
        },
        
        // Metodologia (inferida do conteúdo)
        ...(this.hasMethodology(article.conteudo) && {
          materialAndMethods: this.extractMethodology(article)
        }),
        
        // Resultados e conclusões
        ...(this.hasResults(article.conteudo) && {
          result: this.extractResults(article)
        }),
        
        // Financiamento (se aplicável)
        ...(article.content_tier === 'premium' && {
          funding: {
            '@type': 'Grant',
            name: 'Autofinanciado',
            description: 'Pesquisa independente'
          }
        }),
        
        // Versão do artigo
        version: '1.0',
        
        // Tópicos relacionados
        ...(article.tags && article.tags.length > 0 && {
          mentions: article.tags.map(tag => ({
            '@type': 'DefinedTerm',
            name: tag,
            inDefinedTermSet: 'Terminologia Psicológica'
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
      
      this.log('info', `ScholarlyArticle gerado com sucesso: ${performance.fieldsCount} campos em ${performance.generationTime}ms`);
      
      return {
        schema,
        schemaType: 'ScholarlyArticle',
        source: 'manual',
        confidence: this.calculateConfidence(article),
        warnings,
        errors: [],
        performance
      };
      
    } catch (error) {
      this.log('error', `Erro ao gerar ScholarlyArticle: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      throw error;
    }
  }

  /**
   * Gera abstract acadêmico
   */
  private generateAbstract(article: any): string {
    // Usar resumo se disponível
    if (article.resumo && article.resumo.length > 100) {
      return article.resumo;
    }
    
    // Gerar abstract baseado no conteúdo
    const content = article.conteudo.replace(/<[^>]*>/g, ' ');
    const firstParagraphs = content.split(/\n+/).filter((p: string) => p.trim().length > 50).slice(0, 3);
    
    if (firstParagraphs.length > 0) {
      let abstract = firstParagraphs.join(' ').substring(0, 500);
      
      // Adicionar estrutura acadêmica se não existir
      if (!abstract.toLowerCase().includes('objetivo')) {
        abstract = `Objetivo: Este artigo explora ${article.categoria_principal}. ` + abstract;
      }
      
      return abstract.trim() + '...';
    }
    
    return `Estudo sobre ${article.categoria_principal} na perspectiva da psicologia clínica, abordando aspectos teóricos e práticos relevantes para profissionais e estudantes da área.`;
  }

  /**
   * Extrai seções acadêmicas
   */
  private extractSections(article: any): string[] {
    const sections: string[] = [];
    
    // Seções padrão de artigos acadêmicos
    const academicSections = [
      'Introdução', 'Metodologia', 'Resultados', 'Discussão', 'Conclusão',
      'Fundamentação Teórica', 'Revisão de Literatura', 'Análise',
      'Considerações Finais', 'Referências'
    ];
    
    const content = article.conteudo.toLowerCase();
    
    // Verificar quais seções estão presentes
    academicSections.forEach(section => {
      if (content.includes(section.toLowerCase())) {
        sections.push(section);
      }
    });
    
    // Se não encontrou seções específicas, extrair de cabeçalhos
    if (sections.length === 0) {
      const headerRegex = /<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi;
      const matches = article.conteudo.matchAll(headerRegex);
      
      for (const match of matches) {
        const sectionTitle = match[1].replace(/<[^>]*>/g, '').trim();
        if (sectionTitle.length > 3) {
          sections.push(sectionTitle);
        }
      }
    }
    
    // Fallback para seções básicas
    if (sections.length === 0) {
      sections.push('Introdução', 'Desenvolvimento', 'Considerações Finais');
    }
    
    return sections.slice(0, 8); // Máximo 8 seções
  }

  /**
   * Determina assunto acadêmico
   */
  private determineAcademicSubject(article: any): string {
    const categoryMapping: Record<string, string> = {
      'desenvolvimento-pessoal': 'Psicologia do Desenvolvimento',
      'relacionamentos': 'Psicologia Social',
      'saude-mental': 'Psicologia Clínica',
      'terapia': 'Psicoterapia',
      'ansiedade': 'Psicopatologia',
      'depressao': 'Psicopatologia',
      'autoestima': 'Psicologia Positiva',
      'mindfulness': 'Psicologia Cognitiva'
    };
    
    const categorySlug = article.categoria_principal.toLowerCase().replace(/\s+/g, '-');
    return categoryMapping[categorySlug] || 'Psicologia Geral';
  }

  /**
   * Extrai citações do conteúdo
   */
  private extractCitations(article: any): any[] {
    const citations: any[] = [];
    
    // Padrão comum de citações: (Autor, Ano)
    const citationPattern = /\(([A-Z][a-záéíóúãõç\s]+),\s*(\d{4})\)/g;
    const matches = article.conteudo.matchAll(citationPattern);
    
    for (const match of matches) {
      citations.push({
        '@type': 'ScholarlyArticle',
        author: {
          '@type': 'Person',
          name: match[1].trim()
        },
        datePublished: match[2],
        name: `Obra de ${match[1].trim()} (${match[2]})`
      });
    }
    
    // Adicionar citações de referência padrão em psicologia
    const defaultCitations = [
      {
        '@type': 'ScholarlyArticle',
        author: {
          '@type': 'Person',
          name: 'DSM-5'
        },
        name: 'Manual Diagnóstico e Estatístico de Transtornos Mentais',
        publisher: {
          '@type': 'Organization',
          name: 'American Psychiatric Association'
        }
      }
    ];
    
    if (citations.length === 0) {
      citations.push(...defaultCitations);
    }
    
    return citations.slice(0, 10); // Máximo 10 citações
  }

  /**
   * Gera palavras-chave acadêmicas
   */
  private generateAcademicKeywords(article: any): string {
    const keywords = new Set<string>();
    
    // Palavras-chave base acadêmicas
    keywords.add('psicologia');
    keywords.add('artigo científico');
    keywords.add('pesquisa');
    
    // Categoria principal
    if (article.categoria_principal) {
      keywords.add(article.categoria_principal);
    }
    
    // Tags como termos acadêmicos
    if (article.tags) {
      article.tags.forEach((tag: string) => keywords.add(tag));
    }
    
    // Termos acadêmicos específicos da psicologia
    const academicTerms = [
      'saúde mental', 'desenvolvimento humano', 'comportamento',
      'cognição', 'psicoterapia', 'intervenção psicológica'
    ];
    
    const content = article.conteudo.toLowerCase();
    academicTerms.forEach(term => {
      if (content.includes(term)) {
        keywords.add(term);
      }
    });
    
    return Array.from(keywords).join(', ');
  }

  /**
   * Verifica se tem metodologia
   */
  private hasMethodology(content: string): boolean {
    const methodologyWords = [
      'metodologia', 'método', 'procedimento', 'técnica',
      'instrumento', 'coleta de dados', 'amostra'
    ];
    
    const contentLower = content.toLowerCase();
    return methodologyWords.some(word => contentLower.includes(word));
  }

  /**
   * Extrai metodologia
   */
  private extractMethodology(article: any): string {
    const content = article.conteudo.toLowerCase();
    
    // Buscar seção de metodologia
    const methodologySection = content.match(/metodologia[:\-]?\s*([^.!?]*(?:\.[^.!?]*){0,3})/i);
    
    if (methodologySection) {
      return methodologySection[1].trim();
    }
    
    // Fallback baseado no tipo de conteúdo
    if (content.includes('revisão') || content.includes('literatura')) {
      return 'Revisão narrativa da literatura especializada em psicologia.';
    }
    
    if (content.includes('estudo de caso')) {
      return 'Estudo de caso baseado na prática clínica.';
    }
    
    return 'Análise teórica baseada em fundamentos da psicologia clínica.';
  }

  /**
   * Verifica se tem resultados
   */
  private hasResults(content: string): boolean {
    const resultWords = [
      'resultado', 'conclusão', 'achado', 'descoberta',
      'evidência', 'dados', 'análise'
    ];
    
    const contentLower = content.toLowerCase();
    return resultWords.some(word => contentLower.includes(word));
  }

  /**
   * Extrai resultados
   */
  private extractResults(article: any): string {
    const content = article.conteudo.toLowerCase();
    
    // Buscar seção de resultados ou conclusões
    const resultsSection = content.match(/(?:resultado|conclusão)[s]?[:\-]?\s*([^.!?]*(?:\.[^.!?]*){0,2})/i);
    
    if (resultsSection) {
      return resultsSection[1].trim();
    }
    
    // Extrair últimos parágrafos como possíveis conclusões
    const paragraphs = article.conteudo.split(/\n+/).filter((p: string) => p.trim().length > 50);
    if (paragraphs.length > 2) {
      const lastParagraphs = paragraphs.slice(-2).join(' ').replace(/<[^>]*>/g, '');
      return lastParagraphs.substring(0, 300) + '...';
    }
    
    return 'Os resultados demonstram a relevância dos conceitos apresentados para a prática psicológica.';
  }

  /**
   * Calcula confiança do schema ScholarlyArticle para este conteúdo
   */
  private calculateConfidence(article: any): number {
    let confidence = 0.2; // Base baixa
    
    const titleLower = article.titulo.toLowerCase();
    const contentLower = article.conteudo.toLowerCase();
    
    // Palavras acadêmicas no título
    const academicWords = ['estudo', 'análise', 'pesquisa', 'investigação', 'revisão'];
    const foundTitleWords = academicWords.filter(word => titleLower.includes(word));
    confidence += foundTitleWords.length * 0.2;
    
    // Estrutura acadêmica no conteúdo
    const structureWords = ['metodologia', 'resultado', 'conclusão', 'referência', 'citação'];
    const foundStructureWords = structureWords.filter(word => contentLower.includes(word));
    confidence += foundStructureWords.length * 0.1;
    
    // Presença de citações
    const citationPattern = /\([A-Z][a-záéíóúãõç\s]+,\s*\d{4}\)/g;
    const citationCount = (article.conteudo.match(citationPattern) || []).length;
    confidence += Math.min(citationCount * 0.1, 0.3);
    
    // Linguagem formal/acadêmica
    const formalWords = ['portanto', 'entretanto', 'ademais', 'outrossim', 'evidencia'];
    const foundFormalWords = formalWords.filter(word => contentLower.includes(word));
    confidence += foundFormalWords.length * 0.05;
    
    // Referências a teoria/teóricos
    if (contentLower.includes('teoria') || contentLower.includes('teórico')) {
      confidence += 0.15;
    }
    
    return Math.min(confidence, 1.0);
  }
}
