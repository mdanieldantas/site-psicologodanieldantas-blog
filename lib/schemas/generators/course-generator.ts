/**
 * 🎓 COURSE SCHEMA GENERATOR
 * 
 * Gerador de schemas JSON-LD para conteúdo tipo "Curso"
 * - Otimizado para cursos e programas educacionais
 * - Rich snippets para cursos estruturados
 * - Informações de duração e currículo
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - Course Generator
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
// 🎓 COURSE GENERATOR CLASS
// ==========================================

export class CourseGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'Course';
  protected readonly requiredFields: string[] = [
    'headline',
    'author',
    'datePublished',
    'dateModified',
    'publisher'
  ];

  /**
   * Gera schema Course completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando Course para: ${article.titulo}`);
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Estatísticas do conteúdo
      const contentStats = getContentStats(article.conteudo);
      
      // Schema Course específico
      const schema = {
        ...baseFields,
        '@type': 'Course',
        
        // Campos específicos do Course
        courseCode: this.generateCourseCode(article),
        educationalLevel: this.determineEducationalLevel(article),
        timeRequired: `PT${contentStats.readingTime}M`,
        
        // Descrição educacional
        teaches: this.extractLearningObjectives(article),
        educationalUse: 'self-directed learning',
        
        // Estrutura do curso
        ...(this.hasCourseStructure(article.conteudo) && {
          hasPart: this.extractCourseModules(article.conteudo)
        }),
        
        // Público-alvo e pré-requisitos
        audience: {
          '@type': 'EducationalAudience',
          audienceType: 'Pessoas interessadas em psicologia e desenvolvimento pessoal',
          educationalRole: 'student'
        },
        
        // Competências desenvolvidas
        competencyRequired: this.extractPrerequisites(article),
        
        // Provedor do curso
        provider: {
          '@type': 'Organization',
          name: 'Psicólogo Daniel Dantas',
          url: baseFields.publisher?.url || 'https://psicologodanieldantas.com'
        },
        
        // Modalidade
        courseMode: 'online',
        deliveryMode: 'blended',
        
        // Avaliação e certificação
        ...(article.content_tier === 'premium' && {
          hasCredential: {
            '@type': 'EducationalOccupationalCredential',
            name: 'Certificado de Conclusão',
            description: 'Certificado de participação no curso'
          }
        }),
        
        // Linguagem e acessibilidade
        inLanguage: 'pt-BR',
        isAccessibleForFree: article.content_tier === 'free',
        
        // Recursos educacionais
        educationalMaterial: this.extractEducationalResources(article),
        
        // Categorização
        ...(article.categoria_principal && {
          courseSubject: article.categoria_principal
        }),
        
        // Licença educacional
        license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        
        // Informações adicionais
        ...(article.tags && article.tags.length > 0 && {
          about: article.tags.map(tag => ({
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
      
      this.log('info', `Course gerado com sucesso: ${performance.fieldsCount} campos em ${performance.generationTime}ms`);
      
      return {
        schema,
        schemaType: 'Course',
        source: 'manual',
        confidence: this.calculateConfidence(article),
        warnings,
        errors: [],
        performance
      };
      
    } catch (error) {
      this.log('error', `Erro ao gerar Course: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      throw error;
    }
  }

  /**
   * Gera código único do curso
   */
  private generateCourseCode(article: any): string {
    const category = article.categoria_principal.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const id = article.id.toString().padStart(3, '0');
    return `PSI-${category}-${id}`;
  }

  /**
   * Determina o nível educacional do curso
   */
  private determineEducationalLevel(article: any): string {
    const content = article.conteudo.toLowerCase();
    const title = article.titulo.toLowerCase();
    
    // Palavras indicativas de nível
    if (title.includes('básico') || title.includes('iniciante') || content.includes('introdução')) {
      return 'Iniciante';
    }
    
    if (title.includes('avançado') || title.includes('profissional') || content.includes('especialização')) {
      return 'Avançado';
    }
    
    if (title.includes('intermediário') || content.includes('aprofundamento')) {
      return 'Intermediário';
    }
    
    return 'Geral';
  }

  /**
   * Extrai objetivos de aprendizagem
   */
  private extractLearningObjectives(article: any): string[] {
    const objectives: string[] = [];
    const content = article.conteudo.toLowerCase();
    
    // Objetivos baseados na categoria
    const categoryObjectives: Record<string, string[]> = {
      'desenvolvimento-pessoal': [
        'Desenvolver autoconhecimento',
        'Melhorar habilidades pessoais',
        'Fortalecer a autoestima'
      ],
      'relacionamentos': [
        'Compreender dinâmicas relacionais',
        'Melhorar comunicação interpessoal',
        'Desenvolver habilidades sociais'
      ],
      'saude-mental': [
        'Identificar sinais de bem-estar mental',
        'Aplicar técnicas de autocuidado',
        'Compreender processos psicológicos'
      ]
    };
    
    // Buscar objetivos específicos da categoria
    const categorySlug = article.categoria_principal.toLowerCase().replace(/\s+/g, '-');
    if (categoryObjectives[categorySlug]) {
      objectives.push(...categoryObjectives[categorySlug]);
    }
    
    // Objetivos gerais baseados no conteúdo
    if (content.includes('técnica') || content.includes('método')) {
      objectives.push('Aprender técnicas práticas aplicáveis');
    }
    
    if (content.includes('exercício') || content.includes('atividade')) {
      objectives.push('Realizar exercícios práticos');
    }
    
    return objectives.length > 0 ? objectives : ['Compreender conceitos fundamentais da psicologia'];
  }

  /**
   * Verifica se tem estrutura de curso
   */
  private hasCourseStructure(content: string): boolean {
    // Verifica módulos ou capítulos
    const hasModules = /módulo|capítulo|lição|aula/gi.test(content);
    
    // Verifica cabeçalhos estruturados
    const hasHeaders = /<h[2-4][^>]*>/gi.test(content);
    
    // Verifica listas organizadas
    const hasOrderedLists = /<ol[^>]*>/gi.test(content);
    
    return hasModules || hasHeaders || hasOrderedLists;
  }

  /**
   * Extrai módulos do curso
   */
  private extractCourseModules(content: string): any[] {
    const modules: any[] = [];
    
    // Extrair baseado em cabeçalhos
    const headerRegex = /<h([2-4])[^>]*>(.*?)<\/h\1>/gi;
    let match;
    let moduleNumber = 1;
    
    while ((match = headerRegex.exec(content)) !== null) {
      const title = match[2].replace(/<[^>]*>/g, '').trim();
      if (title.length > 3) {
        modules.push({
          '@type': 'CourseInstance',
          name: title,
          courseMode: 'online',
          position: moduleNumber++,
          url: `#module-${moduleNumber}`
        });
      }
    }
    
    // Se não há cabeçalhos, criar módulos baseados em seções
    if (modules.length === 0) {
      const sections = content.split(/\n\s*\n/).filter(s => s.trim().length > 100);
      sections.slice(0, 4).forEach((_, index) => {
        modules.push({
          '@type': 'CourseInstance',
          name: `Módulo ${index + 1}`,
          courseMode: 'online',
          position: index + 1,
          url: `#module-${index + 1}`
        });
      });
    }
    
    return modules;
  }

  /**
   * Extrai pré-requisitos
   */
  private extractPrerequisites(article: any): string[] {
    const content = article.conteudo.toLowerCase();
    const prerequisites: string[] = [];
    
    // Pré-requisitos básicos sempre incluídos
    prerequisites.push('Interesse em psicologia e desenvolvimento pessoal');
    
    // Pré-requisitos específicos baseados no conteúdo
    if (content.includes('experiência') || content.includes('conhecimento prévio')) {
      prerequisites.push('Conhecimentos básicos em psicologia');
    }
    
    if (content.includes('prática') || content.includes('aplicação')) {
      prerequisites.push('Disposição para exercícios práticos');
    }
    
    return prerequisites;
  }

  /**
   * Extrai recursos educacionais
   */
  private extractEducationalResources(article: any): any[] {
    const resources: any[] = [];
    
    // Verificar diferentes tipos de recursos no conteúdo
    if (article.url_video) {
      resources.push({
        '@type': 'VideoObject',
        name: 'Vídeo explicativo',
        url: article.url_video
      });
    }
    
    if (article.url_podcast) {
      resources.push({
        '@type': 'AudioObject',
        name: 'Podcast relacionado',
        url: article.url_podcast
      });
    }
    
    if (article.download_url) {
      resources.push({
        '@type': 'DigitalDocument',
        name: article.download_title || 'Material complementar',
        url: article.download_url,
        fileFormat: article.download_format || 'PDF'
      });
    }
    
    // Recurso principal (o próprio artigo)
    resources.push({
      '@type': 'WebPageElement',
      name: 'Conteúdo principal do curso',
      text: article.resumo || 'Material didático principal'
    });
    
    return resources;
  }

  /**
   * Calcula confiança do schema Course para este conteúdo
   */
  private calculateConfidence(article: any): number {
    let confidence = 0.4; // Base mais baixa que Guide
    
    const titleLower = article.titulo.toLowerCase();
    const contentLower = article.conteudo.toLowerCase();
    
    // Palavras-chave no título
    if (titleLower.includes('curso') || titleLower.includes('treinamento')) confidence += 0.4;
    if (titleLower.includes('workshop') || titleLower.includes('programa')) confidence += 0.3;
    if (titleLower.includes('formação') || titleLower.includes('capacitação')) confidence += 0.3;
    
    // Estrutura do conteúdo
    if (this.hasCourseStructure(article.conteudo)) confidence += 0.2;
    
    // Indicadores de curso no conteúdo
    const courseWords = ['módulo', 'lição', 'aula', 'certificado', 'diploma'];
    const foundWords = courseWords.filter(word => contentLower.includes(word));
    confidence += foundWords.length * 0.1;
    
    // Recursos educacionais
    if (article.url_video || article.url_podcast || article.download_url) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }
}
