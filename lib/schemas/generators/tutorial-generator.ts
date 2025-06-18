/**
 * 📚 GERADOR DE SCHEMA TUTORIAL
 * 
 * Gerador específico para schemas do tipo Tutorial (Schema.org).
 * Um dos schemas prioritários da Fase 1 conforme definido no guia.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Otimizado para "how-to" queries
 * - Estrutura passo-a-passo clara
 * - Objetivos de aprendizagem definidos
 * - Suporte a multimídia educacional
 * - Rich Results para tutorial
 * 
 * 🎯 CASOS DE USO:
 * - Tutoriais passo-a-passo
 * - Guias práticos
 * - Instruções detalhadas
 * - Conteúdo educacional estruturado
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - Tutorial Generator (Prioridade 1)
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
  isTutorialContent
} from '../core/utils';

// ==========================================
// 📚 INTERFACES ESPECÍFICAS
// ==========================================

interface TutorialStep {
  '@type': 'HowToStep';
  name: string;
  text: string;
  url?: string;
  image?: string;
}

interface LearningObjective {
  name: string;
  description: string;
}

// ==========================================
// 📚 GERADOR TUTORIAL
// ==========================================

/**
 * Gerador específico para Tutorial schemas
 * Prioridade 1 - Alto potencial para ranking em "how-to" queries
 */
export class TutorialGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'Tutorial';
  protected readonly requiredFields: string[] = [
    'headline',
    'description',
    'author',
    'datePublished',
    'teaches'
  ];
  
  /**
   * Gera schema Tutorial completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando Tutorial para: ${article.titulo}`);
      
      // Verificar se o conteúdo é realmente um tutorial
      if (!isTutorialContent(article.conteudo)) {
        this.log('warn', 'Conteúdo pode não ser adequado para Tutorial - considere outro schema');
      }
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Estatísticas do conteúdo
      const contentStats = getContentStats(article.conteudo);
      
      // Extrair informações específicas do tutorial
      const steps = this.extractTutorialSteps(article.conteudo);
      const learningObjectives = this.extractLearningObjectives(article.conteudo);
      const difficulty = this.assessDifficulty(article.conteudo);
      const timeRequired = this.estimateCompletionTime(article.conteudo, contentStats.readingTime);
      
      // Schema Tutorial específico
      const schema = {
        ...baseFields,
        '@type': 'Tutorial',
        
        // Campos específicos do Tutorial
        learningResourceType: 'Tutorial',
        educationalLevel: this.determineEducationalLevel(article.conteudo),
        teaches: learningObjectives.map(obj => obj.name),
        
        // Objetivos de aprendizagem detalhados
        educationalAlignment: learningObjectives.map(obj => ({
          '@type': 'AlignmentObject',
          alignmentType: 'teaches',
          educationalFramework: 'Psicologia Prática',
          targetName: obj.name,
          targetDescription: obj.description
        })),
        
        // Tempo e dificuldade
        timeRequired: `PT${timeRequired}M`, // ISO 8601 Duration
        typicalAgeRange: this.determineAgeRange(article.conteudo),
        
        // Estrutura do tutorial
        ...(steps.length > 0 && {
          hasPart: steps
        }),
        
        // Categorização educacional
        about: [
          {
            '@type': 'Thing',
            name: article.categoria_principal,
            description: `Tutorial sobre ${article.categoria_principal.toLowerCase()}`
          },
          {
            '@type': 'DefinedTerm',
            name: 'Psicologia Aplicada',
            description: 'Aplicação prática de conceitos psicológicos'
          }
        ],
        
        // Pré-requisitos (se detectados)
        competencyRequired: this.extractPrerequisites(article.conteudo),
        
        // Dificuldade e esforço
        interactivityType: this.determineInteractivityType(article.conteudo),
        
        // Linguagem e acessibilidade
        inLanguage: 'pt-BR',
        isAccessibleForFree: article.content_tier === 'free',
        
        // Licença educacional
        license: 'https://creativecommons.org/licenses/by-nc/4.0/',
          // Metadados educacionais adicionais
        learningResourceTypes: ['Tutorial', 'Guia Prático'],
        educationalUse: ['Autoestudo', 'Desenvolvimento Pessoal'],
        
        // Resultado esperado
        educationalCredentialAwarded: this.defineCredentialAwarded(learningObjectives)
      };
      
      // Adicionar campos multimídia educacionais
      const enhancedSchema = this.addEducationalMultimediaFields(schema, article);
      
      // Adicionar FAQ educacional se disponível
      const finalSchema = this.addEducationalFAQFields(enhancedSchema, article);
      
      // Validar schema
      const warnings = this.validateSchema(finalSchema);
      
      // Adicionar warning se não há passos estruturados
      if (steps.length === 0) {
        warnings.push('Tutorial sem passos estruturados detectados - considere adicionar estrutura passo-a-passo');
      }
      
      // Metadados específicos do Tutorial (apenas em desenvolvimento)
      if (context.config.environment === 'development') {
        finalSchema._tutorialMeta = {
          stepsDetected: steps.length,
          learningObjectives: learningObjectives.length,
          difficultyLevel: difficulty,
          completionTimeEstimate: `${timeRequired} minutos`,
          educationalValue: this.calculateEducationalValue(article.conteudo),
          practicalApplication: this.assessPracticalApplication(article.conteudo)
        };
      }
      
      this.log('info', `Tutorial gerado com ${steps.length} passos e ${learningObjectives.length} objetivos`);
      
      return this.createResult(finalSchema, context, startTime, warnings);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      this.log('error', `Erro ao gerar Tutorial: ${errorMessage}`);
      throw error;
    }
  }
  
  /**
   * Extrai passos do tutorial do conteúdo
   */
  private extractTutorialSteps(content: string): TutorialStep[] {
    const steps: TutorialStep[] = [];
    
    // Padrões para detectar passos
    const stepPatterns = [
      /<h[3-6][^>]*>(?:passo\s*)?(\d+)[^<]*([^<]+)<\/h[3-6]>/gi,
      /(\d+\.?\s*[-–—]?\s*)([^.\n]+\.)/gi,
      /^(\d+)\.\s*(.+)$/gmi
    ];
    
    stepPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null && steps.length < 20) {
        const stepNumber = match[1];
        const stepText = match[2];
        
        if (stepText && stepText.trim().length > 10) {
          steps.push({
            '@type': 'HowToStep',
            name: `Passo ${stepNumber}`,
            text: stepText.trim().replace(/<[^>]*>/g, ''),
            url: `#passo-${stepNumber}`
          });
        }
      }
    });
    
    // Se não encontrou passos numerados, tentar extrair de listas
    if (steps.length === 0) {
      const listItems = content.match(/<li[^>]*>([^<]+)<\/li>/gi);
      if (listItems && listItems.length > 2) {
        listItems.slice(0, 10).forEach((item, index) => {
          const text = item.replace(/<[^>]*>/g, '').trim();
          if (text.length > 15) {
            steps.push({
              '@type': 'HowToStep',
              name: `Etapa ${index + 1}`,
              text: text
            });
          }
        });
      }
    }
    
    return steps;
  }
  
  /**
   * Extrai objetivos de aprendizagem do conteúdo
   */
  private extractLearningObjectives(content: string): LearningObjective[] {
    const objectives: LearningObjective[] = [];
    
    // Padrões para objetivos
    const objectivePatterns = [
      /(?:você (?:vai )?aprender[á]?|aprenderemos?|objetivo[s]?)[^.!?]*([^.!?]+)/gi,
      /ao final[^.!?]*([^.!?]+)/gi,
      /depois de ler[^.!?]*([^.!?]+)/gi,
      /este (?:tutorial|guia)[^.!?]*(?:ensina|mostra)[^.!?]*([^.!?]+)/gi
    ];
    
    objectivePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null && objectives.length < 5) {
        const objective = match[1];
        if (objective && objective.trim().length > 20) {
          objectives.push({
            name: this.cleanObjectiveText(objective),
            description: `Objetivo de aprendizagem: ${this.cleanObjectiveText(objective)}`
          });
        }
      }
    });
    
    // Objetivos padrão se não encontrar nenhum
    if (objectives.length === 0) {
      objectives.push({
        name: `Compreender conceitos de ${this.extractMainConcept(content)}`,
        description: 'Desenvolver entendimento prático dos conceitos apresentados'
      });
    }
    
    return objectives;
  }
  
  /**
   * Limpa texto do objetivo extraído
   */
  private cleanObjectiveText(text: string): string {
    return text
      .replace(/^[^a-zA-Z]*/, '') // Remove caracteres não alfabéticos do início
      .replace(/[^.!?]*$/, '')    // Remove até a pontuação final
      .trim()
      .substring(0, 100);         // Limita tamanho
  }
  
  /**
   * Extrai conceito principal do conteúdo
   */
  private extractMainConcept(content: string): string {
    const concepts = [
      'ansiedade', 'depressão', 'autoestima', 'relacionamentos',
      'mindfulness', 'terapia', 'desenvolvimento pessoal', 'comunicação',
      'estresse', 'emoções', 'comportamento', 'psicologia'
    ];
    
    const lowerContent = content.toLowerCase();
    const foundConcept = concepts.find(concept => lowerContent.includes(concept));
    
    return foundConcept || 'psicologia';
  }
  
  /**
   * Avalia dificuldade do tutorial
   */
  private assessDifficulty(content: string): 'Iniciante' | 'Intermediário' | 'Avançado' {
    const technicalTerms = (content.match(/\b(neuroplasticidade|psicoterapia|cognitivo|sistêmica|psicodinâmica|metodologia)\b/gi) || []).length;
    const wordCount = content.split(' ').length;
    const complexity = technicalTerms / (wordCount / 100);
    
    if (complexity > 2) return 'Avançado';
    if (complexity > 0.8) return 'Intermediário';
    return 'Iniciante';
  }
  
  /**
   * Estima tempo de conclusão do tutorial
   */
  private estimateCompletionTime(content: string, readingTime: number): number {
    const steps = this.extractTutorialSteps(content);
    const hasExercises = /exercício|prática|atividade/gi.test(content);
    
    let estimatedTime = readingTime;
    
    // Adicionar tempo para execução dos passos
    estimatedTime += steps.length * 2; // 2 minutos por passo
    
    // Adicionar tempo para exercícios
    if (hasExercises) {
      estimatedTime += 10;
    }
    
    return Math.max(5, Math.min(120, estimatedTime)); // Entre 5 e 120 minutos
  }
  
  /**
   * Determina nível educacional
   */
  private determineEducationalLevel(content: string): string {
    const difficulty = this.assessDifficulty(content);
    const levelMap = {
      'Iniciante': 'beginner',
      'Intermediário': 'intermediate', 
      'Avançado': 'advanced'
    };
    
    return levelMap[difficulty];
  }
  
  /**
   * Determina faixa etária apropriada
   */
  private determineAgeRange(content: string): string {
    if (content.includes('adolescente') || content.includes('jovem')) {
      return '16-25';
    }
    
    if (content.includes('adulto jovem')) {
      return '25-35';
    }
    
    if (content.includes('profissional') || content.includes('carreira')) {
      return '25-65';
    }
    
    return '18+'; // Padrão para conteúdo adulto
  }
  
  /**
   * Extrai pré-requisitos do conteúdo
   */
  private extractPrerequisites(content: string): string[] {
    const prerequisites: string[] = [];
    
    if (content.includes('conhecimento básico') || content.includes('conceitos fundamentais')) {
      prerequisites.push('Conhecimentos básicos de psicologia');
    }
    
    if (content.includes('experiência prévia') || content.includes('já praticou')) {
      prerequisites.push('Experiência prévia com o tema');
    }
    
    if (content.includes('autoconhecimento') || content.includes('reflexão')) {
      prerequisites.push('Disposição para autoconhecimento');
    }
    
    return prerequisites;
  }
  
  /**
   * Determina tipo de interatividade
   */
  private determineInteractivityType(content: string): string {
    if (content.includes('exercício') || content.includes('prática') || content.includes('atividade')) {
      return 'active';
    }
    
    if (content.includes('reflexão') || content.includes('pense') || content.includes('considere')) {
      return 'mixed';
    }
    
    return 'expositive';
  }
  
  /**
   * Define credencial/certificado que pode ser obtido
   */
  private defineCredentialAwarded(objectives: LearningObjective[]): string {
    if (objectives.length >= 3) {
      return 'Certificado de Conclusão do Tutorial';
    }
    
    return 'Conhecimento Aplicado';
  }
  
  /**
   * Calcula valor educacional do conteúdo
   */
  private calculateEducationalValue(content: string): number {
    let score = 50; // Base
    
    // Pontos positivos
    if (content.includes('exemplo') || content.includes('caso prático')) score += 15;
    if (content.includes('exercício') || content.includes('atividade')) score += 20;
    if (content.includes('reflexão') || content.includes('autoavaliação')) score += 10;
    if (content.includes('dica') || content.includes('sugestão')) score += 10;
    if (content.includes('resumo') || content.includes('conclusão')) score += 5;
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Avalia aplicação prática do tutorial
   */
  private assessPracticalApplication(content: string): string {
    const practicalTerms = ['prática', 'exercício', 'aplicar', 'implementar', 'usar', 'utilizar'];
    const lowerContent = content.toLowerCase();
    const practicalCount = practicalTerms.filter(term => lowerContent.includes(term)).length;
    
    if (practicalCount >= 4) return 'Alta aplicação prática';
    if (practicalCount >= 2) return 'Aplicação moderada';
    return 'Aplicação teórica';
  }
  
  /**
   * Adiciona campos multimídia educacionais
   */
  private addEducationalMultimediaFields(schema: any, article: any): any {
    const enhanced = { ...schema };
    
    // Recursos educacionais
    if (article.url_video) {
      enhanced.video = {
        '@type': 'VideoObject',
        name: `Vídeo tutorial: ${article.titulo}`,
        description: 'Vídeo educacional complementar ao tutorial',
        contentUrl: article.url_video,
        learningResourceType: 'Video Tutorial'
      };
    }
    
    if (article.url_podcast) {
      enhanced.audio = {
        '@type': 'AudioObject',
        name: `Áudio tutorial: ${article.titulo}`,
        description: 'Áudio educacional do tutorial',
        contentUrl: article.url_podcast,
        learningResourceType: 'Audio Tutorial'
      };
    }
    
    if (article.download_url) {
      enhanced.material = {
        '@type': 'CreativeWork',
        name: article.download_title || 'Material Complementar',
        description: article.download_description || 'Material educacional para download',
        url: article.download_url,
        learningResourceType: 'Handout'
      };
    }
    
    return enhanced;
  }
  
  /**
   * Adiciona FAQ educacional
   */
  private addEducationalFAQFields(schema: any, article: any): any {
    if (!article.faq_data || !Array.isArray(article.faq_data)) {
      return schema;
    }
    
    const enhanced = { ...schema };
    
    enhanced.hasPart = enhanced.hasPart || [];
    enhanced.hasPart.push({
      '@type': 'FAQPage',
      name: `FAQ do Tutorial: ${article.titulo}`,
      description: 'Perguntas frequentes sobre este tutorial',
      learningResourceType: 'FAQ',
      mainEntity: article.faq_data.map((faq: any) => ({
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
