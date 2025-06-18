/**
 * 📚 GERADOR DE SCHEMA EDUCATIONALCONTENT
 * 
 * Gerador específico para schemas do tipo EducationalContent (Schema.org).
 * Essencial para SEO 2025 - Google prioriza conteúdo educacional estruturado.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Rich Results educacionais no Google
 * - Alinhamento com frameworks educacionais
 * - Audiência e nível educacional definidos
 * - Recursos de aprendizagem estruturados
 * 
 * 🎯 CASOS DE USO:
 * - Artigos educacionais estruturados
 * - Conteúdo acadêmico de psicologia
 * - Material didático online
 * - Recursos para estudantes e profissionais
 * - Conteúdo com objetivos de aprendizagem claros
 * 
 * 📊 DADOS UTILIZADOS:
 * - conteudo: Para extrair objetivos de aprendizagem
 * - categoria/subcategoria: Para área de conhecimento
 * - autor_principal: Como educador/especialista
 * - titulo: Como título educacional
 * - tags: Para palavras-chave educacionais
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - EducationalContent Generator
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
  extractKeywords
} from '../core/utils';

// ==========================================
// 📚 GERADOR EDUCATIONALCONTENT
// ==========================================

/**
 * Gerador específico para EducationalContent schemas
 */
class EducationalContentGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'EducationalContent';
  protected readonly requiredFields: string[] = [
    'name',
    'description',
    'educationalLevel',
    'learningResourceType',
    'audience',
    'author'
  ];
  
  /**
   * Gera schema EducationalContent completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando EducationalContent para: ${article.titulo}`);
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Análise educacional do conteúdo
      const educationalAnalysis = this.analyzeEducationalContent(article);
      const contentStats = getContentStats(article.conteudo);
      
      // Schema EducationalContent específico
      const schema = {
        ...baseFields,
        '@type': 'EducationalContent',
        
        // Campos obrigatórios do EducationalContent
        name: article.titulo,
        description: this.generateEducationalDescription(article),
        
        // Nível educacional baseado na complexidade
        educationalLevel: educationalAnalysis.level,
        
        // Tipo de recurso educacional
        learningResourceType: educationalAnalysis.resourceType,
        
        // Audiência educacional específica
        audience: this.generateEducationalAudience(article, educationalAnalysis),
        
        // Área de conhecimento e disciplina
        teaches: educationalAnalysis.teaches,
        about: this.generateEducationalAbout(article),
        
        // Objetivos de aprendizagem extraídos
        ...(educationalAnalysis.learningObjectives.length > 0 && {
          educationalAlignment: educationalAnalysis.learningObjectives.map((objective, index) => ({
            '@type': 'AlignmentObject',
            alignmentType: 'teaches',
            targetName: objective,
            targetDescription: `Objetivo de aprendizagem ${index + 1}`
          }))
        }),
        
        // Pré-requisitos (se detectados)
        ...(educationalAnalysis.prerequisites.length > 0 && {
          coursePrerequisites: educationalAnalysis.prerequisites.map(prereq => ({
            '@type': 'EducationalContent',
            name: prereq
          }))
        }),
        
        // Tempo necessário para aprendizagem
        timeRequired: this.estimateStudyTime(contentStats.readingTime, educationalAnalysis.complexity),
        
        // Competências desenvolvidas
        ...(educationalAnalysis.competencies.length > 0 && {
          competencyRequired: educationalAnalysis.competencies
        }),
        
        // Dificuldade e complexidade
        educationalFramework: this.getEducationalFramework(article.categoria_principal),
        typicalAgeRange: this.determineAgeRange(educationalAnalysis.level),
        
        // Interatividade e uso educacional
        interactivityType: this.determineInteractivityType(article),
        educationalUse: this.getEducationalUse(educationalAnalysis.resourceType),
        
        // Material complementar (se houver)
        ...(article.url_video && {
          video: {
            '@type': 'VideoObject',
            name: `Vídeo: ${article.titulo}`,
            contentUrl: article.url_video,
            learningResourceType: 'video'
          }
        }),
        
        ...(article.url_podcast && {
          audio: {
            '@type': 'AudioObject',
            name: `Áudio: ${article.titulo}`,
            contentUrl: article.url_podcast,
            learningResourceType: 'audio'
          }
        }),
        
        ...(article.download_url && {
          associatedMedia: {
            '@type': 'MediaObject',
            contentUrl: article.download_url,
            name: article.download_title || 'Material Complementar',
            description: article.download_description || 'Recurso educacional para download',
            encodingFormat: this.getFileFormat(article.download_format || undefined),
            learningResourceType: 'text'
          }
        }),
        
        // Acessibilidade educacional
        accessMode: this.getEducationalAccessModes(article),
        accessibilityFeature: this.generateEducationalAccessibilityFeatures(article, educationalAnalysis),
        
        // Contexto de saúde mental (específico para psicologia)
        ...(this.isMentalHealthEducation(article) && {
          hasPart: [{
            '@type': 'EducationalContent',
            name: 'Aplicação Prática',
            description: 'Como aplicar os conceitos na vida real',
            learningResourceType: 'practical application'
          }]
        }),
        
        // Licença e uso educacional
        license: this.getEducationalLicense(article.content_tier || undefined),
        isAccessibleForFree: article.content_tier === 'free',
        
        // Palavras-chave educacionais
        keywords: this.generateEducationalKeywords(article, educationalAnalysis)
      };
      
      // Validação do schema gerado
      const warnings = this.validateSchema(schema);
      
      // Warnings específicos do EducationalContent
      this.addEducationalSpecificWarnings(warnings, article, educationalAnalysis);
      
      this.log('info', `EducationalContent gerado com sucesso. Nível: ${educationalAnalysis.level}, Tipo: ${educationalAnalysis.resourceType}`);
      
      return this.createResult(schema, context, startTime, warnings);
      
    } catch (error) {
      const errorMessage = `Erro ao gerar EducationalContent: ${error instanceof Error ? error.message : String(error)}`;
      this.log('error', errorMessage);
      return this.createResult({}, context, startTime, [], [errorMessage]);
    }
  }
  
  // ==========================================
  // 🔧 MÉTODOS AUXILIARES ESPECÍFICOS
  // ==========================================
  
  /**
   * Analisa conteúdo para determinar características educacionais
   */
  private analyzeEducationalContent(article: any): {
    level: string;
    resourceType: string;
    complexity: number;
    teaches: string[];
    learningObjectives: string[];
    prerequisites: string[];
    competencies: string[];
  } {
    const title = article.titulo.toLowerCase();
    const content = article.conteudo.toLowerCase();
    const textToAnalyze = `${title} ${content}`;
    
    // Determinar nível educacional
    const level = this.determineEducationalLevel(textToAnalyze);
    
    // Determinar tipo de recurso
    const resourceType = this.determineResourceType(title, content);
    
    // Analisar complexidade (1-5)
    const complexity = this.analyzeComplexity(content);
    
    // Extrair conceitos ensinados
    const teaches = this.extractTeaches(textToAnalyze);
    
    // Extrair objetivos de aprendizagem
    const learningObjectives = this.extractLearningObjectives(content);
    
    // Extrair pré-requisitos
    const prerequisites = this.extractPrerequisites(content);
    
    // Extrair competências
    const competencies = this.extractCompetencies(textToAnalyze);
    
    return {
      level,
      resourceType,
      complexity,
      teaches,
      learningObjectives,
      prerequisites,
      competencies
    };
  }
  
  /**
   * Determina nível educacional baseado no conteúdo
   */
  private determineEducationalLevel(text: string): string {
    const levelIndicators = {
      beginner: ['básico', 'iniciante', 'introdução', 'começar', 'primeiro', 'inicial'],
      intermediate: ['intermediário', 'desenvolver', 'aprofundar', 'aplicar', 'prática'],
      advanced: ['avançado', 'especialista', 'complexo', 'detalhado', 'profundo', 'especialização'],
      expert: ['pesquisa', 'teoria', 'análise crítica', 'metodologia', 'evidência científica']
    };
    
    let scores = { beginner: 0, intermediate: 0, advanced: 0, expert: 0 };
    
    for (const [level, indicators] of Object.entries(levelIndicators)) {
      scores[level as keyof typeof scores] = indicators.filter(indicator => 
        text.includes(indicator)
      ).length;
    }
    
    // Análise de complexidade lexical
    const sentences = text.split(/[.!?]+/);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
    
    if (avgSentenceLength > 25) scores.advanced += 2;
    else if (avgSentenceLength > 15) scores.intermediate += 1;
    else scores.beginner += 1;
    
    // Retornar nível com maior pontuação
    const maxLevel = Object.entries(scores).reduce((a, b) => scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b)[0];
    
    const levelMap: Record<string, string> = {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      expert: 'Expert'
    };
    
    return levelMap[maxLevel] || 'Intermediate';
  }
  
  /**
   * Determina tipo de recurso educacional
   */
  private determineResourceType(title: string, content: string): string {
    const typePatterns = {
      'tutorial': ['como', 'passo a passo', 'tutorial', 'guia prático'],
      'lecture': ['conceito', 'teoria', 'explicação', 'entender'],
      'exercise': ['exercício', 'atividade', 'prática', 'aplicação'],
      'assessment': ['avaliação', 'teste', 'questionário', 'perguntas'],
      'case study': ['caso', 'exemplo', 'estudo de caso', 'situação'],
      'reference': ['definição', 'glossário', 'referência', 'manual'],
      'presentation': ['apresentação', 'slides', 'palestra', 'seminário']
    };
    
    for (const [type, patterns] of Object.entries(typePatterns)) {
      if (patterns.some(pattern => title.includes(pattern) || content.includes(pattern))) {
        return type;
      }
    }
    
    return 'article'; // padrão
  }
  
  /**
   * Analisa complexidade do conteúdo (1-5)
   */
  private analyzeComplexity(content: string): number {
    let complexity = 1;
    
    // Indicadores de complexidade
    const complexityIndicators = {
      2: ['porque', 'então', 'assim', 'portanto'],
      3: ['além disso', 'no entanto', 'por outro lado', 'consequentemente'],
      4: ['fundamentalmente', 'epistemológico', 'metodologia', 'paradigma'],
      5: ['metacognição', 'fenomenologia', 'hermenêutica', 'dialética']
    };
    
    for (const [level, indicators] of Object.entries(complexityIndicators)) {
      if (indicators.some(indicator => content.includes(indicator))) {
        complexity = Math.max(complexity, parseInt(level));
      }
    }
    
    // Análise de estrutura
    const paragraphs = content.split(/\n\s*\n/);
    if (paragraphs.length > 10) complexity = Math.max(complexity, 3);
    if (paragraphs.length > 20) complexity = Math.max(complexity, 4);
    
    return complexity;
  }
  
  /**
   * Extrai conceitos que são ensinados
   */
  private extractTeaches(text: string): string[] {
    const concepts = [];
    
    // Padrões de conceitos em psicologia
    const psychConcepts = [
      'ansiedade', 'depressão', 'autoestima', 'trauma', 'resilência',
      'mindfulness', 'terapia cognitiva', 'behaviorismo', 'psicanálise',
      'desenvolvimento humano', 'personalidade', 'emoções', 'cognição'
    ];
    
    for (const concept of psychConcepts) {
      if (text.includes(concept)) {
        concepts.push(concept.charAt(0).toUpperCase() + concept.slice(1));
      }
    }
    
    return concepts.slice(0, 5); // Limitar a 5 conceitos
  }
  
  /**
   * Extrai objetivos de aprendizagem do conteúdo
   */
  private extractLearningObjectives(content: string): string[] {
    const objectives = [];
    
    // Padrões de objetivos
    const objectivePatterns = [
      /ao final,?\s*(?:você|o leitor)\s*(.*?)(?:\.|;|$)/gi,
      /(?:aprenderá|compreenderá|será capaz de)\s*(.*?)(?:\.|;|$)/gi,
      /(?:objetivo|meta|propósito)(?:\s*é\s*|\s*:\s*)(.*?)(?:\.|;|$)/gi
    ];
    
    for (const pattern of objectivePatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].length > 10 && match[1].length < 150) {
          objectives.push(match[1].trim());
        }
      }
    }
    
    return objectives.slice(0, 3); // Limitar a 3 objetivos
  }
  
  /**
   * Extrai pré-requisitos do conteúdo
   */
  private extractPrerequisites(content: string): string[] {
    const prerequisites = [];
    
    // Padrões de pré-requisitos
    const prereqPatterns = [
      /(?:antes de|primeiro|é importante|recomenda-se)\s*(.*?)(?:\.|;|$)/gi,
      /(?:pré-requisito|necessário)(?:\s*é\s*|\s*:\s*)(.*?)(?:\.|;|$)/gi
    ];
    
    for (const pattern of prereqPatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].length > 10 && match[1].length < 100) {
          prerequisites.push(match[1].trim());
        }
      }
    }
    
    return prerequisites.slice(0, 2); // Limitar a 2 pré-requisitos
  }
  
  /**
   * Extrai competências desenvolvidas
   */
  private extractCompetencies(text: string): string[] {
    const competencies = [];
    
    const competencyKeywords = [
      'autoconhecimento', 'inteligência emocional', 'comunicação',
      'empathy', 'resiliência', 'assertividade', 'liderança',
      'tomada de decisão', 'resolução de problemas', 'criatividade'
    ];
    
    for (const keyword of competencyKeywords) {
      if (text.includes(keyword)) {
        competencies.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    }
    
    return competencies.slice(0, 4); // Limitar a 4 competências
  }
  
  /**
   * Gera audiência educacional específica
   */
  private generateEducationalAudience(article: any, analysis: any) {
    const baseAudience = {
      '@type': 'EducationalAudience',
      educationalRole: this.determineEducationalRole(analysis.level),
      audienceType: 'general public'
    };
    
    // Adicionar contexto profissional se aplicável
    if (this.isProfessionalContent(article)) {
      return [
        baseAudience,
        {
          '@type': 'ProfessionalAudience',
          audienceType: 'psychology professionals'
        }
      ];
    }
    
    return baseAudience;
  }
  
  /**
   * Determina papel educacional da audiência
   */
  private determineEducationalRole(level: string): string[] {
    const roleMap: Record<string, string[]> = {
      'Beginner': ['student', 'general public'],
      'Intermediate': ['student', 'professional'],
      'Advanced': ['professional', 'educator'],
      'Expert': ['researcher', 'educator', 'specialist']
    };
    
    return roleMap[level] || ['student', 'general public'];
  }
  
  /**
   * Verifica se é conteúdo profissional
   */
  private isProfessionalContent(article: any): boolean {
    const professionalKeywords = [
      'terapia', 'clínica', 'diagnóstico', 'intervenção',
      'técnica terapêutica', 'profissional', 'psicólogo'
    ];
    
    const text = `${article.titulo} ${article.conteudo}`.toLowerCase();
    return professionalKeywords.some(keyword => text.includes(keyword));
  }
  
  /**
   * Estima tempo de estudo baseado na leitura e complexidade
   */
  private estimateStudyTime(readingTime: number, complexity: number): string {
    // Tempo de estudo é maior que tempo de leitura
    const studyMultiplier = 1.5 + (complexity * 0.3);
    const studyTime = Math.round(readingTime * studyMultiplier);
    
    return `PT${studyTime}M`;
  }
  
  /**
   * Obtém framework educacional baseado na categoria
   */
  private getEducationalFramework(categoria?: string): string {
    if (!categoria) return 'Psychology Education Framework';
    
    const frameworkMap: Record<string, string> = {
      'psicologia-clinica': 'Clinical Psychology Framework',
      'psicologia-cognitiva': 'Cognitive Psychology Framework',
      'desenvolvimento-pessoal': 'Personal Development Framework',
      'terapia': 'Therapeutic Framework',
      'mindfulness': 'Mindfulness-Based Framework'
    };
    
    const categoryKey = categoria.toLowerCase().replace(/\s+/g, '-');
    return frameworkMap[categoryKey] || 'General Psychology Framework';
  }
  
  /**
   * Determina faixa etária apropriada
   */
  private determineAgeRange(level: string): string {
    const ageMap: Record<string, string> = {
      'Beginner': '16-25',
      'Intermediate': '18-45',
      'Advanced': '25-65',
      'Expert': '30+'
    };
    
    return ageMap[level] || '18+';
  }
  
  /**
   * Determina tipo de interatividade
   */
  private determineInteractivityType(article: any): string {
    const hasExercises = /exercício|atividade|prática/.test(article.conteudo.toLowerCase());
    const hasQuestions = /pergunta|questionário|reflexão/.test(article.conteudo.toLowerCase());
    
    if (hasExercises || hasQuestions) return 'active';
    return 'expositive';
  }
  
  /**
   * Obtém uso educacional
   */
  private getEducationalUse(resourceType: string): string {
    const useMap: Record<string, string> = {
      'tutorial': 'skill development',
      'lecture': 'knowledge acquisition',
      'exercise': 'practice and application',
      'assessment': 'evaluation',
      'case study': 'practical analysis',
      'reference': 'information lookup',
      'presentation': 'formal instruction'
    };
    
    return useMap[resourceType] || 'general education';
  }
  
  /**
   * Obtém modos de acesso educacional
   */
  private getEducationalAccessModes(article: any): string[] {
    const modes = ['textual', 'visual'];
    
    if (article.url_video) modes.push('auditory');
    if (article.url_podcast) modes.push('auditory');
    
    return modes;
  }
  
  /**
   * Gera características de acessibilidade educacional
   */
  private generateEducationalAccessibilityFeatures(article: any, analysis: any): string[] {
    const features = ['structuredContent'];
    
    if (analysis.learningObjectives.length > 0) {
      features.push('learningObjectives');
    }
    
    if (article.url_video || article.url_podcast) {
      features.push('multiModal');
    }
    
    return features;
  }
  
  /**
   * Verifica se é educação em saúde mental
   */
  private isMentalHealthEducation(article: any): boolean {
    const mentalHealthKeywords = [
      'saúde mental', 'bem-estar', 'psicológico', 'emocional',
      'ansiedade', 'depressão', 'estresse', 'trauma'
    ];
    
    const text = `${article.titulo} ${article.conteudo}`.toLowerCase();
    return mentalHealthKeywords.some(keyword => text.includes(keyword));
  }
  
  /**
   * Obtém licença educacional
   */
  private getEducationalLicense(contentTier?: string): string {
    if (contentTier === 'free') {
      return 'Creative Commons - Educational Use';
    }
    
    return 'All Rights Reserved - Educational License';
  }
  
  /**
   * Gera palavras-chave educacionais
   */
  private generateEducationalKeywords(article: any, analysis: any): string {
    const baseKeywords = extractKeywords(article.conteudo, article.categoria_principal, article.tags);
    const educationalKeywords = [
      'educação', 'aprendizagem', 'ensino', 'desenvolvimento',
      analysis.level.toLowerCase(), analysis.resourceType
    ];
    
    return [...baseKeywords, ...educationalKeywords].slice(0, 10).join(', ');
  }
  
  /**
   * Gera descrição educacional
   */
  private generateEducationalDescription(article: any): string {
    const baseDescription = this.generateDescription(article);
    
    if (baseDescription.length < 120) {
      return `${baseDescription} Material educacional estruturado para desenvolvimento de conhecimento em psicologia e crescimento pessoal.`;
    }
    
    return baseDescription;
  }
  
  /**
   * Gera objeto educacional "about"
   */
  private generateEducationalAbout(article: any) {
    return {
      '@type': 'DefinedTerm',
      name: article.categoria_principal || 'Psicologia',
      description: `Conceitos e práticas em ${article.categoria_principal || 'psicologia'}`,
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Vocabulário de Psicologia',
        url: '/blogflorescerhumano/glossario'
      }
    };
  }
  
  /**
   * Obtém formato de arquivo
   */
  private getFileFormat(format?: string): string {
    if (!format) return 'application/pdf';
    
    const formatMap: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
      'html': 'text/html'
    };
    
    return formatMap[format.toLowerCase()] || 'application/pdf';
  }
  
  /**
   * Adiciona warnings específicos do EducationalContent
   */
  private addEducationalSpecificWarnings(warnings: string[], article: any, analysis: any): void {
    if (analysis.learningObjectives.length === 0) {
      warnings.push('EducationalContent: Objetivos de aprendizagem não detectados - considere adicionar');
    }
    
    if (analysis.complexity < 2) {
      warnings.push('EducationalContent: Conteúdo pode ser muito simples para classificação educacional');
    }
    
    if (!this.isProfessionalContent(article) && analysis.level === 'Expert') {
      warnings.push('EducationalContent: Nível expert sem contexto profissional pode confundir audiência');
    }
    
    if (!article.categoria_principal) {
      warnings.push('EducationalContent: Categoria educacional recomendada para melhor classificação');
    }
  }
  
  /**
   * Obtém razão da detecção deste tipo de schema
   */
  protected getDetectionReason(context: SchemaGenerationContext): string {
    return 'EducationalContent selecionado devido ao conteúdo educacional estruturado detectado';
  }
}

// ==========================================
// 📝 EXPORTAÇÃO DO GERADOR
// ==========================================

export { EducationalContentGenerator };
