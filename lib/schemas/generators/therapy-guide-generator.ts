/**
 * Gerador de Schema.org para Guias Terapêuticos
 * 
 * Este gerador especializado cria schemas para artigos que funcionam
 * como guias terapêuticos, incluindo guias de tratamento, protocolos
 * clínicos, diretrizes terapêuticas e guias de autoajuda.
 * 
 * @author AI Assistant
 * @see https://schema.org/Guide
 * @see https://schema.org/MedicalGuidelineRecommendation
 * @see https://schema.org/EducationalContent
 * @version 1.0.0
 * @since 2025-01-18
 */

import { BaseSchemaGenerator } from '../core/base-schema';
import type { 
  SchemaGenerationContext,
  SchemaGenerationResult,
  SchemaTypeEnum
} from '../core/types';

/**
 * Interface específica para dados de Guias Terapêuticos
 */
interface TherapyGuideData {
  guideType: 'treatment' | 'self-help' | 'protocol' | 'educational' | 'prevention';
  targetConditions: string[];
  therapeuticApproaches: string[];
  steps: string[];
  recommendations: string[];
  contraindicatons: string[];
  targetAudience: 'Patient' | 'Clinician' | 'General';
  evidenceLevel: 'high' | 'medium' | 'low';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  prerequisites?: string[];
  materials?: string[];
  warnings?: string[];
  outcomes: string[];
  relatedGuides: string[];
}

/**
 * Gerador especializado para schemas TherapyGuide
 * 
 * Identifica e estrutura artigos que funcionam como guias terapêuticos,
 * protocolos de tratamento, diretrizes clínicas e guias de autoajuda.
 */
export class TherapyGuideGenerator extends BaseSchemaGenerator {
  
  protected readonly schemaType: SchemaTypeEnum = 'EducationalContent';
  protected readonly requiredFields: string[] = ['titulo', 'conteudo'];

  /**
   * Verifica se o artigo é um guia terapêutico
   */
  canGenerate(context: SchemaGenerationContext): boolean {
    try {
      const { article } = context;
      const fullText = `${article.titulo} ${article.resumo} ${article.conteudo}`.toLowerCase();
      
      // Palavras-chave específicas para guias terapêuticos
      const guideKeywords = [
        'guia', 'passo a passo', 'como fazer', 'protocolo',
        'diretrizes', 'orientações', 'manual', 'tutorial',
        'instruções', 'método', 'técnica', 'procedimento'
      ];

      const hasGuideKeywords = guideKeywords.some(keyword => 
        fullText.includes(keyword)
      );

      // Termos terapêuticos específicos
      const therapyTerms = [
        'tratamento', 'terapia', 'intervenção', 'abordagem',
        'técnica terapêutica', 'estratégia', 'exercício',
        'prática', 'autoajuda', 'autocuidado', 'manejo',
        'gestão emocional', 'coping', 'enfrentamento'
      ];

      const hasTherapyTerms = therapyTerms.some(term => 
        fullText.includes(term)
      );

      // Estrutura de guia (passos, etapas)
      const structureIndicators = [
        'primeiro passo', 'segundo passo', 'etapa', 'fase',
        'primeiramente', 'em seguida', 'posteriormente',
        'antes de', 'depois de', 'durante', 'ao final',
        'passo 1', 'passo 2', 'passo 3', 'item 1', 'item 2'
      ];

      const hasStructure = structureIndicators.some(indicator => 
        fullText.includes(indicator)
      );

      // Indicadores de orientação/instrução
      const instructionIndicators = [
        'é importante', 'deve-se', 'recomenda-se', 'evite',
        'pratique', 'experimente', 'tente', 'comece',
        'termine', 'mantenha', 'observe', 'monitore'
      ];

      const hasInstructions = instructionIndicators.some(indicator => 
        fullText.includes(indicator)
      );

      // Verbos de ação específicos de guias
      const actionVerbs = [
        'identifique', 'reconheça', 'aprenda', 'desenvolva',
        'implemente', 'aplique', 'utilize', 'empregue',
        'execute', 'realize', 'faça', 'efetue'
      ];

      const hasActionVerbs = actionVerbs.some(verb => 
        fullText.includes(verb)
      );

      // Pontuação baseada em relevância
      let score = 0;
      if (hasGuideKeywords) score += 4;
      if (hasTherapyTerms) score += 3;
      if (hasStructure) score += 3;
      if (hasInstructions) score += 2;
      if (hasActionVerbs) score += 2;

      // Verifica se tem lista numerada ou bullets
      if (this.hasNumberedList(article.conteudo)) score += 2;
      if (this.hasBulletList(article.conteudo)) score += 1;

      // Verifica categoria e tags
      const tags = article.tags || [];
      if (tags.some(tag => typeof tag === 'string' && 
          ['guia', 'tutorial', 'protocolo', 'tratamento'].some(guide => 
            tag.toLowerCase().includes(guide)))) {
        score += 1;
      }

      console.log(`TherapyGuide relevance score: ${score}/17 for article "${article.titulo}"`);
      
      return score >= 8; // Threshold para consideração

    } catch (error) {
      console.error('Error in TherapyGuideGenerator.canGenerate:', error);
      return false;
    }
  }

  /**
   * Gera o schema TherapyGuide
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    try {
      const { article } = context;
      
      // Obtém campos base do artigo
      const baseFields = this.generateBaseFields(context);
      
      // Extrai dados específicos do guia terapêutico
      const guideData = this.extractTherapyGuideData(context);
      
      // Extrai partes/seções do guia
      const guideParts = this.extractGuideParts(article.conteudo);
      
      // Extrai recomendações estruturadas
      const recommendations = this.extractRecommendations(article.conteudo);

      // Construção do schema Guide/EducationalContent
      const schema = {
        ...baseFields,
        
        // Propriedades específicas de Guide
        about: guideData.targetConditions.map(condition => ({
          '@type': 'Thing',
          name: condition
        })),
        
        // Público-alvo
        audience: {
          '@type': 'Audience',
          audienceType: guideData.targetAudience,
          suggestedMinAge: this.extractMinAge(article.conteudo)
        },
        
        // Aspectos abordados no guia
        reviewAspect: guideData.therapeuticApproaches,
        
        // Partes do guia (se identificadas)
        ...(guideParts.length > 0 && {
          hasPart: guideParts
        }),
        
        // Nível educacional/dificuldade
        educationalLevel: {
          '@type': 'DefinedTerm',
          name: guideData.difficulty,
          inDefinedTermSet: 'Therapy Guide Difficulty Levels'
        },
        
        // Tempo estimado
        timeRequired: this.formatDuration(guideData.estimatedDuration),
        
        // Tipo de recurso de aprendizagem
        learningResourceType: ['guide', 'therapeutic protocol'],
        
        // Propriedades adicionais para guias terapêuticos
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Tipo de Guia',
            value: guideData.guideType
          },
          {
            '@type': 'PropertyValue',
            name: 'Nível de Evidência',
            value: guideData.evidenceLevel
          },
          {
            '@type': 'PropertyValue',
            name: 'Público-Alvo',
            value: guideData.targetAudience
          },
          {
            '@type': 'PropertyValue',
            name: 'Duração Estimada',
            value: guideData.estimatedDuration
          },
          ...(guideData.prerequisites && guideData.prerequisites.length > 0 ? [{
            '@type': 'PropertyValue',
            name: 'Pré-requisitos',
            value: guideData.prerequisites.join('; ')
          }] : []),
          ...(guideData.materials && guideData.materials.length > 0 ? [{
            '@type': 'PropertyValue',
            name: 'Materiais Necessários',
            value: guideData.materials.join('; ')
          }] : [])
        ],

        // Resultados esperados
        ...(guideData.outcomes.length > 0 && {
          educationalAlignment: guideData.outcomes.map(outcome => ({
            '@type': 'AlignmentObject',
            alignmentType: 'teaches',
            targetName: outcome
          }))
        }),

        // Recomendações estruturadas (se houver)
        ...(recommendations.length > 0 && {
          mentions: recommendations
        }),

        // Avisos e contraindicações
        ...(guideData.warnings && guideData.warnings.length > 0 && {
          warning: guideData.warnings.join('; ')
        }),

        // Guias relacionados
        ...(guideData.relatedGuides.length > 0 && {
          relatedLink: guideData.relatedGuides.map(guide => ({
            '@type': 'LinkRole',
            linkRelationship: 'related',
            name: guide
          }))
        })
      };

      console.log(`Generated TherapyGuide schema for article "${article.titulo}"`);
      
      return {
        schema,
        schemaType: 'EducationalContent',
        confidence: this.calculateConfidence(guideData),
        source: 'extractor',
        warnings: [],
        errors: [],
        performance: {
          generationTime: Date.now()
        }
      };

    } catch (error) {
      console.error('Error generating TherapyGuide schema:', error);
      throw error;
    }
  }

  /**
   * Extrai dados específicos do guia terapêutico do contexto
   */
  private extractTherapyGuideData(context: SchemaGenerationContext): TherapyGuideData {
    const { article } = context;
    const fullText = `${article.titulo} ${article.resumo} ${article.conteudo}`.toLowerCase();

    return {
      guideType: this.determineGuideType(fullText),
      targetConditions: this.extractTargetConditions(fullText),
      therapeuticApproaches: this.extractTherapeuticApproaches(fullText),
      steps: this.extractSteps(article.conteudo),
      recommendations: this.extractRecommendationTexts(fullText),
      contraindicatons: this.extractContraindications(fullText),
      targetAudience: this.determineTargetAudience(fullText),
      evidenceLevel: this.determineEvidenceLevel(fullText),
      difficulty: this.determineDifficulty(fullText),
      estimatedDuration: this.extractEstimatedDuration(fullText),
      prerequisites: this.extractPrerequisites(fullText),
      materials: this.extractMaterials(fullText),
      warnings: this.extractWarnings(fullText),
      outcomes: this.extractOutcomes(fullText),
      relatedGuides: this.extractRelatedGuides(fullText)
    };
  }

  /**
   * Verifica se tem lista numerada
   */
  private hasNumberedList(content: string): boolean {
    const numberedPatterns = [
      /\n\s*\d+[\.)]/g,
      /\n\s*\d+\s*[-–—]/g,
      /passo\s+\d+/gi,
      /etapa\s+\d+/gi
    ];

    return numberedPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Verifica se tem lista com bullets
   */
  private hasBulletList(content: string): boolean {
    const bulletPatterns = [
      /\n\s*[•·▪▫◦‣⁃]/g,
      /\n\s*[-*+]\s/g,
      /\n\s*[▶►]\s/g
    ];

    return bulletPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Determina o tipo de guia
   */
  private determineGuideType(content: string): TherapyGuideData['guideType'] {
    if (content.includes('autoajuda') || content.includes('autocuidado')) {
      return 'self-help';
    }
    if (content.includes('protocolo') || content.includes('procedimento clínico')) {
      return 'protocol';
    }
    if (content.includes('prevenção') || content.includes('prevenir')) {
      return 'prevention';
    }
    if (content.includes('tratamento') || content.includes('terapia')) {
      return 'treatment';
    }
    return 'educational';
  }

  /**
   * Extrai condições-alvo
   */
  private extractTargetConditions(content: string): string[] {
    const conditions = [
      'ansiedade', 'depressão', 'estresse', 'insônia', 'burnout',
      'síndrome do pânico', 'fobia', 'trauma', 'luto', 'raiva',
      'baixa autoestima', 'problemas de relacionamento',
      'transtorno obsessivo', 'bipolaridade', 'esquizofrenia'
    ];

    return conditions.filter(condition => content.includes(condition));
  }

  /**
   * Extrai abordagens terapêuticas
   */
  private extractTherapeuticApproaches(content: string): string[] {
    const approaches = [
      'terapia cognitivo-comportamental', 'mindfulness', 'meditação',
      'relaxamento', 'respiração', 'reestruturação cognitiva',
      'exposição gradual', 'dessensibilização', 'técnicas de enfrentamento',
      'psicoeducação', 'terapia de aceitação', 'terapia familiar'
    ];

    return approaches.filter(approach => content.includes(approach));
  }

  /**
   * Extrai passos/etapas do guia
   */
  private extractSteps(content: string): string[] {
    const stepPatterns = [
      /(?:passo|etapa)\s+\d+:?\s*(.+?)(?=\n|$)/gi,
      /\d+[\.)]\s*(.+?)(?=\n|$)/g,
      /(?:primeiro|segundo|terceiro|quarto|quinto).*?:(.+?)(?=\n|$)/gi
    ];

    const steps: string[] = [];

    stepPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 10) {
          steps.push(match[1].trim());
        }
      }
    });

    return steps.slice(0, 20); // Limita a 20 passos
  }

  /**
   * Extrai textos de recomendações
   */
  private extractRecommendationTexts(content: string): string[] {
    const recommendationPatterns = [
      /recomenda-se:?\s*(.+?)(?=\n|$)/gi,
      /é importante:?\s*(.+?)(?=\n|$)/gi,
      /deve-se:?\s*(.+?)(?=\n|$)/gi,
      /sugestão:?\s*(.+?)(?=\n|$)/gi
    ];

    const recommendations: string[] = [];

    recommendationPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 5) {
          recommendations.push(match[1].trim());
        }
      }
    });

    return recommendations.slice(0, 10);
  }

  /**
   * Extrai contraindicações
   */
  private extractContraindications(content: string): string[] {
    const contraindicationPatterns = [
      /evite:?\s*(.+?)(?=\n|$)/gi,
      /não.*faça:?\s*(.+?)(?=\n|$)/gi,
      /contraindicação:?\s*(.+?)(?=\n|$)/gi,
      /cuidado:?\s*(.+?)(?=\n|$)/gi
    ];

    const contraindications: string[] = [];

    contraindicationPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 5) {
          contraindications.push(match[1].trim());
        }
      }
    });

    return contraindications;
  }

  /**
   * Determina público-alvo
   */
  private determineTargetAudience(content: string): TherapyGuideData['targetAudience'] {
    if (content.includes('profissionais') || content.includes('terapeutas') || 
        content.includes('psicólogos') || content.includes('clínicos')) {
      return 'Clinician';
    }
    if (content.includes('pacientes') || content.includes('pessoas que sofrem') ||
        content.includes('quem tem')) {
      return 'Patient';
    }
    return 'General';
  }

  /**
   * Determina nível de evidência
   */
  private determineEvidenceLevel(content: string): TherapyGuideData['evidenceLevel'] {
    if (content.includes('baseado em evidência') || content.includes('pesquisa científica') ||
        content.includes('estudos clínicos') || content.includes('meta-análise')) {
      return 'high';
    }
    if (content.includes('estudos') || content.includes('pesquisa') ||
        content.includes('literatura científica')) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Determina dificuldade
   */
  private determineDifficulty(content: string): TherapyGuideData['difficulty'] {
    if (content.includes('avançado') || content.includes('complexo') ||
        content.includes('profissional') || content.includes('especialista')) {
      return 'advanced';
    }
    if (content.includes('intermediário') || content.includes('após dominar') ||
        content.includes('experiência prévia')) {
      return 'intermediate';
    }
    return 'beginner';
  }

  /**
   * Extrai duração estimada
   */
  private extractEstimatedDuration(content: string): string {
    const durationPatterns = [
      /duração.*?(\d+)\s*semanas?/i,
      /durante.*?(\d+)\s*meses?/i,
      /por.*?(\d+)\s*dias?/i,
      /(\d+)\s*sessões?/i,
      /(\d+)\s*minutos?\s*por\s*dia/i
    ];

    for (const pattern of durationPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return '1-2 semanas'; // Default
  }

  /**
   * Extrai pré-requisitos
   */
  private extractPrerequisites(content: string): string[] | undefined {
    const prerequisitePatterns = [
      /pré-requisitos?:?\s*(.+?)(?=\n|$)/gi,
      /antes de.*?:?\s*(.+?)(?=\n|$)/gi,
      /é necessário:?\s*(.+?)(?=\n|$)/gi
    ];

    const prerequisites: string[] = [];

    prerequisitePatterns.forEach(pattern => {
      const match = content.match(pattern);
      if (match && match[1]) {
        prerequisites.push(...match[1].split(/[,;]/).map(p => p.trim()));
      }
    });

    return prerequisites.length > 0 ? prerequisites : undefined;
  }

  /**
   * Extrai materiais necessários
   */
  private extractMaterials(content: string): string[] | undefined {
    const materialPatterns = [
      /materiais?:?\s*(.+?)(?=\n|$)/gi,
      /você vai precisar:?\s*(.+?)(?=\n|$)/gi,
      /recursos necessários:?\s*(.+?)(?=\n|$)/gi
    ];

    const materials: string[] = [];

    materialPatterns.forEach(pattern => {
      const match = content.match(pattern);
      if (match && match[1]) {
        materials.push(...match[1].split(/[,;]/).map(m => m.trim()));
      }
    });

    return materials.length > 0 ? materials : undefined;
  }

  /**
   * Extrai avisos
   */
  private extractWarnings(content: string): string[] | undefined {
    const warningPatterns = [
      /atenção:?\s*(.+?)(?=\n|$)/gi,
      /aviso:?\s*(.+?)(?=\n|$)/gi,
      /importante:?\s*(.+?)(?=\n|$)/gi,
      /cuidado:?\s*(.+?)(?=\n|$)/gi
    ];

    const warnings: string[] = [];

    warningPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 10) {
          warnings.push(match[1].trim());
        }
      }
    });

    return warnings.length > 0 ? warnings : undefined;
  }

  /**
   * Extrai resultados esperados
   */
  private extractOutcomes(content: string): string[] {
    const outcomePatterns = [
      /resultados?:?\s*(.+?)(?=\n|$)/gi,
      /benefícios?:?\s*(.+?)(?=\n|$)/gi,
      /ao final.*?:?\s*(.+?)(?=\n|$)/gi,
      /você será capaz de:?\s*(.+?)(?=\n|$)/gi
    ];

    const outcomes: string[] = [];

    outcomePatterns.forEach(pattern => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 5) {
          outcomes.push(match[1].trim());
        }
      }
    });

    // Resultados padrão para guias terapêuticos
    if (outcomes.length === 0) {
      outcomes.push('Melhoria no bem-estar emocional', 'Desenvolvimento de habilidades de enfrentamento');
    }

    return outcomes;
  }

  /**
   * Extrai guias relacionados
   */
  private extractRelatedGuides(content: string): string[] {
    const relatedPatterns = [
      /veja também:?\s*(.+?)(?=\n|$)/gi,
      /artigos relacionados:?\s*(.+?)(?=\n|$)/gi,
      /leia mais sobre:?\s*(.+?)(?=\n|$)/gi
    ];

    const related: string[] = [];

    relatedPatterns.forEach(pattern => {
      const match = content.match(pattern);
      if (match && match[1]) {
        related.push(...match[1].split(/[,;]/).map(r => r.trim()));
      }
    });

    return related;
  }

  /**
   * Extrai partes/seções do guia
   */
  private extractGuideParts(content: string): object[] {
    const sectionPatterns = [
      /(?:^|\n)\s*##\s*(.+?)(?=\n|$)/g, // Markdown headers
      /(?:^|\n)\s*([A-Z][^a-z\n]*?)(?=\n|$)/g, // ALL CAPS sections
      /(?:^|\n)\s*\d+\.\s*([^0-9\n].+?)(?=\n|$)/g // Numbered sections
    ];

    const parts: object[] = [];
    
    sectionPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 5 && match[1].trim().length < 100) {
          parts.push({
            '@type': 'Guide',
            name: match[1].trim(),
            about: 'Seção do guia terapêutico'
          });
        }
      }
    });

    return parts.slice(0, 10); // Limita a 10 partes
  }

  /**
   * Extrai recomendações estruturadas
   */
  private extractRecommendations(content: string): object[] {
    const recommendations = this.extractRecommendationTexts(content.toLowerCase());
    
    return recommendations.map(rec => ({
      '@type': 'MedicalGuidelineRecommendation',
      recommendationStrength: 'Standard recommendation',
      evidenceLevel: 'https://schema.org/EvidenceLevelC',
      text: rec
    }));
  }

  /**
   * Extrai idade mínima sugerida
   */
  private extractMinAge(content: string): number | undefined {
    const agePattern = /(?:maiores? de|acima de|mínimo.*?)(\d+)\s*anos?/i;
    const match = content.match(agePattern);
    return match ? parseInt(match[1], 10) : undefined;
  }

  /**
   * Formata duração para ISO 8601
   */
  private formatDuration(duration: string): string {
    if (duration.includes('semana')) {
      const weeks = duration.match(/(\d+)/)?.[1] || '1';
      return `P${weeks}W`;
    }
    if (duration.includes('mês')) {
      const months = duration.match(/(\d+)/)?.[1] || '1';
      return `P${months}M`;
    }
    if (duration.includes('dia')) {
      const days = duration.match(/(\d+)/)?.[1] || '7';
      return `P${days}D`;
    }
    return 'P1W'; // Default 1 semana
  }

  /**
   * Calcula nível de confiança do schema gerado
   */
  private calculateConfidence(guideData: TherapyGuideData): number {
    let confidence = 0.7; // Base

    // Aumenta confiança baseada em dados extraídos
    if (guideData.steps.length > 0) confidence += 0.1;
    if (guideData.therapeuticApproaches.length > 0) confidence += 0.05;
    if (guideData.targetConditions.length > 0) confidence += 0.05;
    if (guideData.recommendations.length > 0) confidence += 0.05;
    if (guideData.evidenceLevel === 'high') confidence += 0.05;
    if (guideData.prerequisites) confidence += 0.025;
    if (guideData.materials) confidence += 0.025;    return Math.min(confidence, 1.0);
  }
}

/**
 * Instância exportada do gerador
 */
export const therapyGuideGenerator = new TherapyGuideGenerator();
