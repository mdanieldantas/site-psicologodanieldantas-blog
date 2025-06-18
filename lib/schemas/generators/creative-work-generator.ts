/**
 * 🎨 GERADOR DE SCHEMA CREATIVEWORK
 * 
 * Gerador específico para trabalhos criativos genéricos (Schema.org CreativeWork).
 * Adequado para conteúdo que não se encaixa em tipos mais específicos.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Schema genérico flexível
 * - Detecta tipo de obra criativa
 * - Informações de licença e uso
 * - Metadados de criação e formato
 * 
 * 🎯 CASOS DE USO:
 * - Trabalhos acadêmicos
 * - Relatórios e documentos
 * - Materiais educacionais gerais
 * - Conteúdo criativo diverso
 * 
 * 📊 DADOS UTILIZADOS:
 * - conteudo: Para classificação da obra
 * - download_*: Para informações de arquivo
 * - categoria_principal: Para tipo de trabalho
 * - autor_principal: Para informações de autoria
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - CreativeWork Generator
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
// 🎨 GERADOR CREATIVEWORK
// ==========================================

/**
 * Gerador específico para CreativeWork schemas
 */
class CreativeWorkGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'CreativeWork';
  protected readonly requiredFields: string[] = [
    'name',
    'author',
    'dateCreated'
  ];
  
  /**
   * Gera schema CreativeWork completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando CreativeWork para: ${article.titulo}`);
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Detecta tipo específico de obra criativa
      const creativeWorkType = this.detectCreativeWorkType(article.conteudo, article.categoria_principal);
      
      // Análise de conteúdo
      const contentStats = getContentStats(article.conteudo);
      
      // Construção do schema CreativeWork
      const schema = {
        ...baseFields,
        '@type': 'CreativeWork',
        
        // Tipo adicional específico se detectado
        ...(creativeWorkType !== 'CreativeWork' && {
          additionalType: `https://schema.org/${creativeWorkType}`
        }),
        
        // Informações da obra
        abstract: this.generateAbstract(article.resumo, article.conteudo),
        
        // Categoria/gênero da obra
        genre: this.mapCategoryToGenre(article.categoria_principal),
        
        // Informações de criação
        dateCreated: formatSchemaDate(article.data_criacao),
        
        // Estatísticas do conteúdo
        wordCount: contentStats.wordCount,
        
        // Nível educacional se aplicável
        ...(this.isEducationalContent(article.conteudo) && {
          educationalLevel: this.detectEducationalLevel(article.conteudo)
        }),
        
        // Informações de licença
        license: this.determineLicense(article.content_tier),
        
        // Formato e acesso
        isAccessibleForFree: article.content_tier === 'free',
        
        // Informações de download se disponível
        ...(article.download_url && {
          encoding: {
            '@type': 'MediaObject',
            contentUrl: article.download_url,
            encodingFormat: article.download_format || 'application/pdf',
            contentSize: article.download_size_mb ? `${article.download_size_mb}MB` : undefined,
            name: article.download_title || article.titulo,
            description: article.download_description
          }
        }),
        
        // Público-alvo se detectável
        audience: this.detectAudience(article.conteudo),
        
        // Material extent para obras físicas/digitais
        ...(article.download_size_mb && {
          materialExtent: `${contentStats.wordCount} palavras, ${article.download_size_mb}MB`        })
      };
      
      // Validação e warnings
      const warnings = this.validateSchema(schema);
      this.addCreativeWorkWarnings(warnings, article, contentStats);
      
      this.log('info', `CreativeWork gerado com tipo: ${creativeWorkType}`, {
        type: creativeWorkType,
        genre: schema.genre,
        wordCount: contentStats.wordCount,
        hasDownload: !!article.download_url,
        educationalLevel: schema.educationalLevel
      });
      
      return this.createResult(schema, context, startTime, warnings);
      
    } catch (error) {
      const errorMsg = `Erro ao gerar CreativeWork: ${error}`;
      this.log('error', errorMsg);
      return this.createResult({}, context, startTime, [], [errorMsg]);
    }
  }
  
  /**
   * Detecta o tipo específico de obra criativa
   */
  private detectCreativeWorkType(content: string, categoria?: string): string {
    const contentLower = content.toLowerCase();
    const categoriaLower = categoria?.toLowerCase() || '';
    
    // Análise por categoria
    if (categoriaLower.includes('artigo') || categoriaLower.includes('blog')) {
      return 'Article';
    }
    if (categoriaLower.includes('livro') || categoriaLower.includes('ebook')) {
      return 'Book';
    }
    if (categoriaLower.includes('curso') || categoriaLower.includes('aula')) {
      return 'Course';
    }
    if (categoriaLower.includes('relatório') || categoriaLower.includes('pesquisa')) {
      return 'Report';
    }
    
    // Análise por conteúdo
    if (contentLower.includes('metodologia') && contentLower.includes('resultados')) {
      return 'ScholarlyArticle';
    }
    if (contentLower.includes('receita') || contentLower.includes('ingredientes')) {
      return 'Recipe';
    }
    if (contentLower.includes('passo a passo') || contentLower.includes('tutorial')) {
      return 'HowTo';
    }
    if (contentLower.includes('pergunta') && contentLower.includes('resposta')) {
      return 'FAQPage';
    }
    if (contentLower.includes('dataset') || contentLower.includes('dados')) {
      return 'Dataset';
    }
    
    // Verifica se é conteúdo educacional
    const educationalIndicators = [
      'aprenda', 'ensino', 'educação', 'curso', 'lição',
      'exercício', 'atividade', 'material didático'
    ];
    
    if (educationalIndicators.some(indicator => contentLower.includes(indicator))) {
      return 'LearningResource';
    }
    
    // Default
    return 'CreativeWork';
  }
  
  /**
   * Gera abstract/resumo da obra
   */
  private generateAbstract(resumo?: string | null, content?: string): string {
    if (resumo && resumo.trim()) {
      return resumo.trim();
    }
    
    if (content) {
      // Extrai primeiros parágrafos como abstract
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
      const abstract = sentences.slice(0, 3).join('. ').trim();
      
      if (abstract.length > 50) {
        return abstract.length > 300 ? abstract.substring(0, 297) + '...' : abstract;
      }
    }
    
    return '';
  }
  
  /**
   * Mapeia categoria para gênero Schema.org
   */
  private mapCategoryToGenre(categoria?: string): string {
    if (!categoria) return 'General';
    
    const categoriaLower = categoria.toLowerCase();
    
    const genreMap: Record<string, string> = {
      'psicologia': 'Psychology',
      'saúde': 'Health',
      'educação': 'Education',
      'tecnologia': 'Technology',
      'ciência': 'Science',
      'medicina': 'Medicine',
      'filosofia': 'Philosophy',
      'pesquisa': 'Research',
      'autoajuda': 'Self-help',
      'desenvolvimento': 'Personal Development',
      'terapia': 'Therapy',
      'mindfulness': 'Mindfulness',
      'relacionamentos': 'Relationships'
    };
    
    for (const [key, value] of Object.entries(genreMap)) {
      if (categoriaLower.includes(key)) {
        return value;
      }
    }
    
    return 'General';
  }
  
  /**
   * Verifica se é conteúdo educacional
   */
  private isEducationalContent(content: string): boolean {
    const contentLower = content.toLowerCase();
    
    const educationalTerms = [
      'aprenda', 'ensino', 'educação', 'curso', 'lição',
      'tutorial', 'guia', 'passo a passo', 'exercício',
      'atividade', 'prática', 'exemplo', 'caso de estudo'
    ];
    
    return educationalTerms.some(term => contentLower.includes(term));
  }
  
  /**
   * Detecta nível educacional do conteúdo
   */
  private detectEducationalLevel(content: string): string {
    const contentLower = content.toLowerCase();
    
    // Indicadores de nível básico
    const basicIndicators = [
      'iniciante', 'básico', 'fundamental', 'introdução',
      'primeiros passos', 'começando', 'fácil'
    ];
    
    // Indicadores de nível intermediário
    const intermediateIndicators = [
      'intermediário', 'moderado', 'desenvolvimento',
      'aprofundando', 'expandindo'
    ];
    
    // Indicadores de nível avançado
    const advancedIndicators = [
      'avançado', 'especialista', 'profissional', 'mestrado',
      'doutorado', 'pesquisa', 'complexo', 'sofisticado'
    ];
    
    if (advancedIndicators.some(term => contentLower.includes(term))) {
      return 'Advanced';
    }
    if (intermediateIndicators.some(term => contentLower.includes(term))) {
      return 'Intermediate';
    }
    if (basicIndicators.some(term => contentLower.includes(term))) {
      return 'Beginner';
    }
    
    // Analisa complexidade por comprimento e vocabulário
    const words = content.split(/\s+/);
    const avgWordLength = words.reduce((acc, word) => acc + word.length, 0) / words.length;
    
    if (avgWordLength > 6) return 'Intermediate';
    if (avgWordLength > 4) return 'Beginner';
    
    return 'General';
  }
  
  /**
   * Determina licença baseada no content tier
   */
  private determineLicense(contentTier?: string | null): string {
    switch (contentTier) {
      case 'free':
        return 'https://creativecommons.org/licenses/by/4.0/';
      case 'premium':
        return 'All Rights Reserved';
      case 'exclusive':
        return 'Exclusive License';
      default:
        return 'https://creativecommons.org/licenses/by-nc/4.0/';
    }
  }
  
  /**
   * Detecta audiência do conteúdo
   */
  private detectAudience(content: string): any {
    const contentLower = content.toLowerCase();
    
    // Audiência profissional
    const professionalTerms = [
      'profissional', 'especialista', 'clínico', 'terapeuta',
      'psicólogo', 'médico', 'técnica avançada', 'protocolo'
    ];
    
    // Audiência geral/paciente
    const generalTerms = [
      'qualquer pessoa', 'todos', 'família', 'amigos',
      'autoajuda', 'dicas simples', 'fácil de entender'
    ];
    
    // Audiência estudantil
    const studentTerms = [
      'estudante', 'aluno', 'aprendiz', 'curso',
      'universidade', 'faculdade', 'acadêmico'
    ];
    
    if (professionalTerms.some(term => contentLower.includes(term))) {
      return {
        '@type': 'ProfessionalAudience',
        audienceType: 'Medical Professional'
      };
    }
    
    if (studentTerms.some(term => contentLower.includes(term))) {
      return {
        '@type': 'EducationalAudience',
        educationalRole: 'student'
      };
    }
    
    if (generalTerms.some(term => contentLower.includes(term))) {
      return {
        '@type': 'Audience',
        audienceType: 'General Public'
      };
    }
    
    // Default
    return {
      '@type': 'Audience',
      audienceType: 'General'
    };
  }
  
  /**
   * Adiciona warnings específicos para CreativeWork
   */
  private addCreativeWorkWarnings(warnings: string[], article: any, contentStats: any): void {
    // Verifica completude do conteúdo
    if (contentStats.wordCount < 300) {
      warnings.push('Obra criativa muito curta - considere expandir o conteúdo');
    }
    
    if (contentStats.wordCount > 10000) {
      warnings.push('Obra criativa muito longa - considere dividir em partes');
    }
    
    // Verifica informações de download
    if (article.download_url && !article.download_title) {
      warnings.push('Título do download recomendado para melhor SEO');
    }
    
    if (article.download_url && !article.download_description) {
      warnings.push('Descrição do download recomendada para acessibilidade');
    }
    
    // Verifica resumo/abstract
    if (!article.resumo) {
      warnings.push('Abstract/resumo recomendado para obras criativas');
    }
    
    // Verifica licença para conteúdo premium
    if (article.content_tier === 'premium' && !warnings.some(w => w.includes('licença'))) {
      warnings.push('Considere especificar termos de licença para conteúdo premium');
    }
  }
}

/**
 * Instância exportada do gerador
 */
export const creativeWorkGenerator = new CreativeWorkGenerator();

// Export da classe para uso em imports nomeados
export { CreativeWorkGenerator };
