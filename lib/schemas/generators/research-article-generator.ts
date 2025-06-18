/**
 * 🔬 GERADOR DE SCHEMA RESEARCHARTICLE
 * 
 * Gerador específico para artigos de pesquisa (Schema.org ResearchArticle).
 * Foco em conteúdo científico, estudos e pesquisas acadêmicas.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Estrutura científica rigorosa
 * - Metadados de pesquisa
 * - Validação acadêmica
 * - Citações e referências
 * 
 * 🎯 CASOS DE USO:
 * - Estudos de caso em psicologia
 * - Pesquisas empíricas
 * - Artigos científicos
 * - Relatórios de investigação
 * 
 * 📊 DADOS UTILIZADOS:
 * - conteudo: Para estrutura científica
 * - titulo: Como título da pesquisa
 * - autor_principal: Como pesquisador principal
 * - categoria_principal: Para área de pesquisa
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - ResearchArticle Generator
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
// 🔬 GERADOR RESEARCHARTICLE
// ==========================================

/**
 * Gerador específico para ResearchArticle schemas
 */
class ResearchArticleGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'ResearchArticle';
  protected readonly requiredFields: string[] = [
    'headline',
    'author',
    'abstract',
    'datePublished'
  ];
  
  /**
   * Gera schema ResearchArticle completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando ResearchArticle para: ${article.titulo}`);
      
      // Verifica se é conteúdo de pesquisa
      if (!this.isResearchContent(article.conteudo)) {
        const warning = 'Conteúdo pode não ser adequado para ResearchArticle schema';
        this.log('warn', warning);
      }
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Extrai estrutura científica
      const researchStructure = this.extractResearchStructure(article.conteudo);
      
      // Analisa metodologia
      const methodology = this.extractMethodology(article.conteudo);
      
      // Extrai palavras-chave acadêmicas
      const academicKeywords = this.extractAcademicKeywords(article.conteudo);
      
      // Construção do schema ResearchArticle
      const schema = {
        ...baseFields,
        '@type': 'ResearchArticle',
        
        // Abstract/resumo científico
        abstract: this.generateAbstract(article.resumo, article.conteudo),
        
        // Área de pesquisa
        about: this.extractResearchSubject(article.categoria_principal, article.conteudo),
        
        // Metodologia se identificada
        ...(methodology && {
          backstory: methodology
        }),
          // Palavras-chave específicas
        ...(academicKeywords.length > 0 && { keywords: academicKeywords }),
        
        // Estrutura da pesquisa
        ...(researchStructure.sections.length > 0 && {
          articleSection: researchStructure.sections
        }),
        
        // Financiamento se mencionado
        ...(researchStructure.funding && {
          funding: researchStructure.funding
        }),
        
        // Colaboradores se mencionados
        ...(researchStructure.collaborators.length > 0 && {
          contributor: researchStructure.collaborators.map(name => ({
            '@type': 'Person',
            name: name
          }))
        }),
        
        // Citações e referências
        ...(researchStructure.citationCount > 0 && {
          citation: `${researchStructure.citationCount} referências bibliográficas`
        }),
        
        // Tipo específico de pesquisa
        genre: this.determineResearchType(article.conteudo),
        
        // Audiência acadêmica
        audience: {
          '@type': 'Audience',
          audienceType: 'Academic'
        }      };
      
      // Validação e warnings
      const warnings = this.validateSchema(schema);
      this.addResearchWarnings(warnings, article, researchStructure);
      
      this.log('info', `ResearchArticle gerado com ${researchStructure.sections.length} seções`, {
        researchType: schema.genre,
        sectionsCount: researchStructure.sections.length,
        hasMethodology: !!methodology,
        citationCount: researchStructure.citationCount,
        collaboratorsCount: researchStructure.collaborators.length
      });
      
      return this.createResult(schema, context, startTime, warnings);
      
    } catch (error) {
      const errorMsg = `Erro ao gerar ResearchArticle: ${error}`;
      this.log('error', errorMsg);
      return this.createResult({}, context, startTime, [], [errorMsg]);
    }
  }
  
  /**
   * Verifica se o conteúdo é de pesquisa
   */
  private isResearchContent(content: string): boolean {
    const contentLower = content.toLowerCase();
    
    const researchIndicators = [
      'pesquisa', 'estudo', 'investigação', 'análise',
      'metodologia', 'resultados', 'discussão', 'conclusão',
      'hipótese', 'objetivo', 'amostra', 'participantes',
      'dados', 'coleta', 'análise estatística', 'achados',
      'bibliografia', 'referências', 'citação'
    ];
    
    const academicStructure = [
      'introdução', 'método', 'resultados', 'discussão',
      'conclusão', 'abstract', 'resumo', 'palavras-chave',
      'fundamentação teórica', 'revisão da literatura'
    ];
    
    const researchTermsCount = researchIndicators.filter(term => 
      contentLower.includes(term)
    ).length;
    
    const structureTermsCount = academicStructure.filter(term => 
      contentLower.includes(term)
    ).length;
    
    // Requer pelo menos 3 termos de pesquisa e 2 de estrutura
    return researchTermsCount >= 3 && structureTermsCount >= 2;
  }
  
  /**
   * Extrai estrutura científica do artigo
   */
  private extractResearchStructure(content: string): {
    sections: string[],
    funding: string | null,
    collaborators: string[],
    citationCount: number
  } {
    const sections: string[] = [];
    const collaborators: string[] = [];
    let funding: string | null = null;
    let citationCount = 0;
    
    // Seções típicas de artigo científico
    const researchSections = [
      'introdução', 'fundamentação teórica', 'revisão da literatura',
      'metodologia', 'método', 'participantes', 'procedimentos',
      'resultados', 'achados', 'análise dos dados',
      'discussão', 'interpretação', 'implicações',
      'conclusão', 'considerações finais', 'limitações',
      'referências', 'bibliografia'
    ];
    
    // Detecta seções presentes
    researchSections.forEach(section => {
      if (content.toLowerCase().includes(section)) {
        sections.push(this.capitalizeSection(section));
      }
    });
    
    // Extrai colaboradores
    const collaboratorPatterns = [
      /co-?autor(?:es)?[:\s]*([^.!?\n]+)/gi,
      /colaborador(?:es)?[:\s]*([^.!?\n]+)/gi,
      /em\s+colaboração\s+com[:\s]*([^.!?\n]+)/gi,
      /junto\s+com[:\s]*([^.!?\n]+)/gi
    ];
    
    collaboratorPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const names = match[1].split(/[,;e&]/).map(name => name.trim());
        collaborators.push(...names.filter(name => name.length > 2));
      }
    });
    
    // Extrai financiamento
    const fundingPatterns = [
      /financiamento[:\s]*([^.!?\n]+)/gi,
      /apoio\s+(?:de|da|do)[:\s]*([^.!?\n]+)/gi,
      /bolsa[:\s]*([^.!?\n]+)/gi,
      /fomento[:\s]*([^.!?\n]+)/gi
    ];
    
    for (const pattern of fundingPatterns) {
      const match = content.match(pattern);
      if (match) {
        funding = match[1].trim();
        break;
      }
    }
    
    // Conta citações
    const citationPatterns = [
      /\([^)]*\d{4}[^)]*\)/g, // (Autor, 2020)
      /et\s+al\./g, // et al.
      /apud/gi, // apud
      /cf\./g, // cf.
      /ibid/gi // ibid
    ];
    
    citationPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) citationCount += matches.length;
    });
    
    return { sections, funding, collaborators, citationCount };
  }
  
  /**
   * Extrai metodologia da pesquisa
   */
  private extractMethodology(content: string): string | null {
    const contentLower = content.toLowerCase();
    
    // Padrões de metodologia
    const methodologyPatterns = [
      /metodologia[:\s]*([^.!?]*(?:[.!?][^.!?]*){0,2})/gi,
      /método[:\s]*([^.!?]*(?:[.!?][^.!?]*){0,2})/gi,
      /procedimentos?[:\s]*([^.!?]*(?:[.!?][^.!?]*){0,2})/gi,
      /abordagem\s+metodológica[:\s]*([^.!?]*(?:[.!?][^.!?]*){0,2})/gi
    ];
    
    for (const pattern of methodologyPatterns) {
      const match = content.match(pattern);
      if (match && match[1] && match[1].trim().length > 50) {
        return match[1].trim().substring(0, 400);
      }
    }
    
    // Detecta tipo de metodologia mencionada
    const methodTypes = [
      'qualitativa', 'quantitativa', 'mista', 'experimental',
      'observacional', 'descritiva', 'exploratória', 'correlacional',
      'longitudinal', 'transversal', 'estudo de caso'
    ];
    
    const detectedMethods = methodTypes.filter(method => 
      contentLower.includes(method)
    );
    
    if (detectedMethods.length > 0) {
      return `Metodologia: ${detectedMethods.join(', ')}`;
    }
    
    return null;
  }
  
  /**
   * Extrai palavras-chave acadêmicas
   */
  private extractAcademicKeywords(content: string): string[] {
    const keywords: string[] = [];
    
    // Padrão explícito de palavras-chave
    const keywordPattern = /palavras?-chave[:\s]*([^.!?\n]+)/gi;
    const match = content.match(keywordPattern);
    
    if (match && match[0]) {
      const extractedKeywords = match[0]
        .replace(/palavras?-chave[:\s]*/gi, '')
        .split(/[,;.]/)
        .map(kw => kw.trim())
        .filter(kw => kw.length > 2);
      
      keywords.push(...extractedKeywords);
    }
    
    // Se não há palavras-chave explícitas, extrai termos técnicos
    if (keywords.length === 0) {
      const technicalTerms = [
        'psicologia cognitiva', 'terapia cognitivo-comportamental',
        'neuropsicologia', 'psicopatologia', 'desenvolvimento humano',
        'psicologia social', 'psicometria', 'avaliação psicológica',
        'intervenção terapêutica', 'saúde mental', 'bem-estar psicológico',
        'transtorno mental', 'ansiedade', 'depressão', 'trauma'
      ];
      
      const contentLower = content.toLowerCase();
      technicalTerms.forEach(term => {
        if (contentLower.includes(term)) {
          keywords.push(term);
        }
      });
    }
    
    return keywords.slice(0, 10); // Limita a 10 palavras-chave
  }
  
  /**
   * Extrai assunto da pesquisa
   */
  private extractResearchSubject(categoria?: string, content?: string): any {
    const subjects: any[] = [];
    
    // Baseado na categoria
    if (categoria) {
      subjects.push({
        '@type': 'Thing',
        name: categoria
      });
    }
    
    // Extrai tópicos específicos do conteúdo
    if (content) {
      const contentLower = content.toLowerCase();
      
      // Tópicos de psicologia
      const psychologyTopics = [
        'ansiedade', 'depressão', 'trauma', 'estresse',
        'terapia cognitiva', 'psicanálise', 'behaviorismo',
        'desenvolvimento infantil', 'psicologia organizacional',
        'neuropsicologia', 'psicopedagogia'
      ];
      
      psychologyTopics.forEach(topic => {
        if (contentLower.includes(topic)) {
          subjects.push({
            '@type': 'Thing',
            name: this.capitalizeFirst(topic)
          });
        }
      });
    }
    
    return subjects.length > 0 ? subjects : undefined;
  }
  
  /**
   * Determina tipo de pesquisa
   */
  private determineResearchType(content: string): string {
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('estudo de caso')) return 'Case Study';
    if (contentLower.includes('revisão sistemática')) return 'Systematic Review';
    if (contentLower.includes('meta-análise')) return 'Meta-Analysis';
    if (contentLower.includes('pesquisa experimental')) return 'Experimental Research';
    if (contentLower.includes('pesquisa qualitativa')) return 'Qualitative Research';
    if (contentLower.includes('pesquisa quantitativa')) return 'Quantitative Research';
    if (contentLower.includes('survey') || contentLower.includes('levantamento')) return 'Survey Research';
    if (contentLower.includes('longitudinal')) return 'Longitudinal Study';
    if (contentLower.includes('transversal')) return 'Cross-sectional Study';
    
    return 'Research Article';
  }
  
  /**
   * Gera abstract científico
   */
  private generateAbstract(resumo?: string | null, content?: string): string {
    if (resumo && resumo.trim()) {
      return resumo.trim();
    }
    
    if (content) {
      // Procura por abstract explícito
      const abstractPattern = /(?:abstract|resumo)[:\s]*([^.!?]*(?:[.!?][^.!?]*){0,4})/gi;
      const match = content.match(abstractPattern);
      
      if (match && match[1]) {
        return match[1].trim().substring(0, 500);
      }
      
      // Gera abstract dos primeiros parágrafos
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
      const abstract = sentences.slice(0, 3).join('. ').trim();
      
      return abstract.length > 100 ? 
        abstract.substring(0, 497) + '...' : 
        abstract;
    }
    
    return '';
  }
  
  /**
   * Capitaliza primeira letra
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  /**
   * Capitaliza seção
   */
  private capitalizeSection(section: string): string {
    return section.split(' ')
      .map(word => this.capitalizeFirst(word))
      .join(' ');
  }
  
  /**
   * Adiciona warnings específicos para pesquisa
   */
  private addResearchWarnings(warnings: string[], article: any, structure: any): void {
    const content = article.conteudo.toLowerCase();
    
    // Verifica estrutura científica
    if (structure.sections.length < 3) {
      warnings.push('Artigos de pesquisa se beneficiam de estrutura científica clara');
    }
    
    // Verifica citações
    if (structure.citationCount === 0) {
      warnings.push('Pesquisas requerem referências bibliográficas');
    } else if (structure.citationCount < 5) {
      warnings.push('Considere expandir a fundamentação teórica com mais referências');
    }
    
    // Verifica metodologia
    if (!content.includes('metodologia') && !content.includes('método')) {
      warnings.push('Descrição metodológica é essencial para pesquisas');
    }
    
    // Verifica abstract
    if (!article.resumo) {
      warnings.push('Abstract/resumo é obrigatório para artigos científicos');
    }
    
    // Verifica palavras-chave
    if (!content.includes('palavras-chave') && !content.includes('keywords')) {
      warnings.push('Palavras-chave facilitam indexação e descoberta');
    }
    
    // Verifica ética em pesquisa
    if (content.includes('participantes') && !content.includes('ética') && 
        !content.includes('consentimento')) {
      warnings.push('Pesquisas com participantes devem mencionar aspectos éticos');
    }
  }
}

/**
 * Instância exportada do gerador
 */
export const researchArticleGenerator = new ResearchArticleGenerator();

// Export da classe para uso em imports nomeados
export { ResearchArticleGenerator };
