/**
 * Gerador de Schema.org para Conteúdo de Tópicos de Saúde
 * 
 * Este gerador especializado cria schemas para artigos sobre tópicos
 * específicos de saúde mental, condições médicas, tratamentos e 
 * informações médicas educacionais na área de psicologia.
 * 
 * @author AI Assistant
 * @see https://schema.org/MedicalWebPage
 * @see https://schema.org/MedicalCondition
 * @see https://schema.org/MedicalEntity
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
 * Interface específica para dados de Tópicos de Saúde
 */
interface HealthTopicData {
  healthTopic: string;
  medicalSpecialty: string;
  targetAudience: 'Patient' | 'Clinician' | 'General';
  contentType: 'information' | 'treatment' | 'prevention' | 'symptoms' | 'causes';
  medicalConditions: string[];
  treatments: string[];
  symptoms: string[];
  riskFactors: string[];
  preventionMethods: string[];
  relatedTopics: string[];
  evidenceLevel: 'high' | 'medium' | 'low';
  lastReviewed?: string;
  authorCredentials?: string;
}

/**
 * Gerador especializado para schemas HealthTopicContent
 * 
 * Identifica e estrutura artigos sobre tópicos específicos de saúde mental,
 * condições psicológicas, tratamentos e informações médicas educacionais.
 */
export class HealthTopicContentGenerator extends BaseSchemaGenerator {
  
  protected readonly schemaType: SchemaTypeEnum = 'MedicalWebPage';
  protected readonly requiredFields: string[] = ['titulo', 'conteudo'];

  /**
   * Verifica se o artigo é sobre um tópico específico de saúde
   */
  canGenerate(context: SchemaGenerationContext): boolean {
    try {
      const { article } = context;
      const fullText = `${article.titulo} ${article.resumo} ${article.conteudo}`.toLowerCase();
      
      // Palavras-chave específicas para tópicos de saúde mental
      const healthKeywords = [
        'sintomas', 'tratamento', 'diagnóstico', 'condição médica',
        'saúde mental', 'transtorno', 'doença', 'síndrome',
        'terapia', 'medicação', 'prevenção', 'fatores de risco',
        'prognóstico', 'recuperação', 'reabilitação'
      ];

      const hasHealthKeywords = healthKeywords.some(keyword => 
        fullText.includes(keyword)
      );

      // Condições/transtornos específicos de psicologia
      const psychologyConditions = [
        'ansiedade', 'depressão', 'bipolar', 'esquizofrenia',
        'ptsd', 'toc', 'tdah', 'autism', 'borderline',
        'pânico', 'fobia', 'estresse pós-traumático',
        'transtorno obsessivo', 'déficit de atenção',
        'burnout', 'síndrome do pânico', 'agorafobia'
      ];

      const hasPsychologyConditions = psychologyConditions.some(condition => 
        fullText.includes(condition)
      );

      // Termos médicos/clínicos
      const medicalTerms = [
        'etiologia', 'patologia', 'epidemiologia', 'incidência',
        'prevalência', 'comorbidade', 'manifestação clínica',
        'critérios diagnósticos', 'dsm-5', 'cid-10',
        'neurotransmissor', 'serotonina', 'dopamina'
      ];

      const hasMedicalTerms = medicalTerms.some(term => 
        fullText.includes(term)
      );

      // Indicadores de conteúdo educacional médico
      const educationalIndicators = [
        'o que é', 'como tratar', 'causas', 'sinais e sintomas',
        'quando procurar ajuda', 'tipos de', 'classificação',
        'fatores de risco', 'prevenção', 'diagnóstico diferencial'
      ];

      const hasEducationalIndicators = educationalIndicators.some(indicator => 
        fullText.includes(indicator)
      );

      // Pontuação baseada em relevância
      let score = 0;
      if (hasHealthKeywords) score += 3;
      if (hasPsychologyConditions) score += 4;
      if (hasMedicalTerms) score += 2;
      if (hasEducationalIndicators) score += 2;

      // Verifica estrutura do artigo
      if (this.hasStructuredHealthContent(fullText)) score += 2;

      // Verifica categoria e tags
      const tags = article.tags || [];
      if (tags.some(tag => typeof tag === 'string' && 
          ['saúde', 'medicina', 'psiquiatria', 'neurologia'].some(health => 
            tag.toLowerCase().includes(health)))) {
        score += 1;
      }

      console.log(`HealthTopicContent relevance score: ${score}/12 for article "${article.titulo}"`);
      
      return score >= 6; // Threshold para consideração

    } catch (error) {
      console.error('Error in HealthTopicContentGenerator.canGenerate:', error);
      return false;
    }
  }

  /**
   * Gera o schema HealthTopicContent
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    try {
      const { article } = context;
      
      // Obtém campos base do artigo
      const baseFields = this.generateBaseFields(context);
      
      // Extrai dados específicos do tópico de saúde
      const healthData = this.extractHealthTopicData(context);
      
      // Extrai informações sobre condições médicas
      const medicalConditions = this.extractMedicalConditions(article.conteudo);
      
      // Extrai informações sobre tratamentos
      const treatments = this.extractTreatments(article.conteudo);

      // Construção do schema MedicalWebPage
      const schema = {
        ...baseFields,
        
        // Propriedades específicas de MedicalWebPage
        audience: `https://schema.org/${healthData.targetAudience}`,
        specialty: this.getMedicalSpecialtyURL(healthData.medicalSpecialty),
        
        // Última revisão médica
        ...(healthData.lastReviewed && {
          lastReviewed: healthData.lastReviewed
        }),
        
        // Tópico principal de saúde
        about: medicalConditions.length > 0 ? medicalConditions : [{
          '@type': 'Thing',
          name: healthData.healthTopic
        }],
        
        // Conteúdo principal da página
        mainContentOfPage: this.extractMainContent(article.conteudo),
        
        // Informações sobre tratamentos/medicamentos mencionados
        ...(treatments.length > 0 && {
          mentions: treatments
        }),
        
        // Propriedades adicionais para tópicos de saúde
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Especialidade Médica',
            value: healthData.medicalSpecialty
          },
          {
            '@type': 'PropertyValue',
            name: 'Tipo de Conteúdo',
            value: healthData.contentType
          },
          {
            '@type': 'PropertyValue',
            name: 'Nível de Evidência',
            value: healthData.evidenceLevel
          },
          {
            '@type': 'PropertyValue',
            name: 'Público-Alvo',
            value: healthData.targetAudience
          },
          ...(healthData.authorCredentials ? [{
            '@type': 'PropertyValue',
            name: 'Credenciais do Autor',
            value: healthData.authorCredentials
          }] : [])
        ],

        // Tópicos relacionados
        ...(healthData.relatedTopics.length > 0 && {
          relatedLink: healthData.relatedTopics.map(topic => ({
            '@type': 'LinkRole',
            linkRelationship: 'related',
            name: topic
          }))
        }),

        // Fatores de risco (se identificados)
        ...(healthData.riskFactors.length > 0 && {
          significantLink: healthData.riskFactors.map(factor => ({
            '@type': 'LinkRole',
            linkRelationship: 'riskFactor',
            name: factor
          }))
        })
      };

      console.log(`Generated HealthTopicContent schema for article "${article.titulo}"`);
      
      return {
        schema,
        schemaType: 'MedicalWebPage',
        confidence: this.calculateConfidence(healthData),
        source: 'extractor',
        warnings: [],
        errors: [],
        performance: {
          generationTime: Date.now()
        }
      };

    } catch (error) {
      console.error('Error generating HealthTopicContent schema:', error);
      throw error;
    }
  }

  /**
   * Extrai dados específicos do tópico de saúde do contexto
   */
  private extractHealthTopicData(context: SchemaGenerationContext): HealthTopicData {
    const { article } = context;
    const fullText = `${article.titulo} ${article.resumo} ${article.conteudo}`.toLowerCase();

    return {
      healthTopic: this.extractHealthTopic(article.titulo),
      medicalSpecialty: this.determineMedicalSpecialty(fullText),
      targetAudience: this.determineTargetAudience(fullText),
      contentType: this.determineContentType(fullText),
      medicalConditions: this.extractMedicalConditionNames(fullText),
      treatments: this.extractTreatmentNames(fullText),
      symptoms: this.extractSymptoms(fullText),
      riskFactors: this.extractRiskFactors(fullText),
      preventionMethods: this.extractPreventionMethods(fullText),
      relatedTopics: this.extractRelatedTopics(fullText),
      evidenceLevel: this.determineEvidenceLevel(fullText),
      lastReviewed: this.extractLastReviewed(fullText),
      authorCredentials: this.extractAuthorCredentials(fullText)
    };
  }

  /**
   * Verifica se tem estrutura de conteúdo médico
   */
  private hasStructuredHealthContent(content: string): boolean {
    const structureIndicators = [
      'sintomas incluem', 'tratamento consiste', 'causas principais',
      'fatores de risco', 'prevenção', 'diagnóstico', 'prognóstico',
      'o que é', 'como se manifesta', 'quando procurar'
    ];

    return structureIndicators.filter(indicator => 
      content.includes(indicator)
    ).length >= 2;
  }

  /**
   * Extrai o tópico principal de saúde
   */
  private extractHealthTopic(title: string): string {
    // Remove artigos e palavras comuns para extrair o tópico principal
    const cleanTitle = title
      .replace(/^(o|a|os|as|um|uma)\s+/i, '')
      .replace(/\s+(na|em|de|do|da|dos|das)\s+psicologia$/i, '')
      .trim();
    
    return cleanTitle || title;
  }

  /**
   * Determina a especialidade médica
   */
  private determineMedicalSpecialty(content: string): string {
    const specialties = [
      { pattern: /psiquiatria|psiquiátrico/i, value: 'Psychiatry' },
      { pattern: /neurologia|neurológico/i, value: 'Neurology' },
      { pattern: /psicologia|psicológico/i, value: 'Psychology' },
      { pattern: /cardiologia|cardiovascular/i, value: 'Cardiovascular' },
      { pattern: /endocrino|hormonal/i, value: 'Endocrinology' },
      { pattern: /clínica médica|medicina interna/i, value: 'InternalMedicine' }
    ];

    const found = specialties.find(s => s.pattern.test(content));
    return found ? found.value : 'Psychology';
  }

  /**
   * Determina o público-alvo
   */
  private determineTargetAudience(content: string): HealthTopicData['targetAudience'] {
    if (content.includes('profissionais') || content.includes('clínicos') || 
        content.includes('terapeutas') || content.includes('psicólogos')) {
      return 'Clinician';
    }
    if (content.includes('pacientes') || content.includes('diagnóstico médico') ||
        content.includes('tratamento específico')) {
      return 'Patient';
    }
    return 'General';
  }

  /**
   * Determina o tipo de conteúdo
   */
  private determineContentType(content: string): HealthTopicData['contentType'] {
    if (content.includes('tratamento') || content.includes('terapia') || 
        content.includes('medicação')) {
      return 'treatment';
    }
    if (content.includes('prevenção') || content.includes('prevenir') ||
        content.includes('evitar')) {
      return 'prevention';
    }
    if (content.includes('sintomas') || content.includes('sinais') ||
        content.includes('manifestações')) {
      return 'symptoms';
    }
    if (content.includes('causas') || content.includes('origem') ||
        content.includes('etiologia')) {
      return 'causes';
    }
    return 'information';
  }

  /**
   * Extrai nomes de condições médicas
   */
  private extractMedicalConditionNames(content: string): string[] {
    const conditions = [
      'ansiedade', 'depressão', 'transtorno bipolar', 'esquizofrenia',
      'ptsd', 'toc', 'tdah', 'transtorno do espectro autista',
      'síndrome do pânico', 'agorafobia', 'fobia social',
      'transtorno obsessivo-compulsivo', 'transtorno borderline',
      'transtorno de estresse pós-traumático', 'burnout'
    ];

    return conditions.filter(condition => content.includes(condition));
  }

  /**
   * Extrai nomes de tratamentos
   */
  private extractTreatmentNames(content: string): string[] {
    const treatments = [
      'terapia cognitivo-comportamental', 'psicanálise', 'terapia familiar',
      'mindfulness', 'meditação', 'antidepressivos', 'ansiolíticos',
      'psicoterapia', 'terapia de grupo', 'terapia ocupacional'
    ];

    return treatments.filter(treatment => content.includes(treatment));
  }

  /**
   * Extrai sintomas mencionados
   */
  private extractSymptoms(content: string): string[] {
    const symptoms = [
      'insônia', 'fadiga', 'irritabilidade', 'perda de apetite',
      'dificuldade de concentração', 'pensamentos suicidas',
      'ataques de pânico', 'sudorese', 'palpitações',
      'tremores', 'náusea', 'tontura'
    ];

    return symptoms.filter(symptom => content.includes(symptom));
  }

  /**
   * Extrai fatores de risco
   */
  private extractRiskFactors(content: string): string[] {
    const riskFactors = [
      'histórico familiar', 'trauma', 'estresse crônico',
      'uso de substâncias', 'isolamento social', 'idade',
      'gênero', 'condições médicas pré-existentes'
    ];

    return riskFactors.filter(factor => content.includes(factor));
  }

  /**
   * Extrai métodos de prevenção
   */
  private extractPreventionMethods(content: string): string[] {
    const methods = [
      'exercício físico', 'dieta equilibrada', 'sono adequado',
      'manejo do estresse', 'suporte social', 'terapia preventiva',
      'estilo de vida saudável', 'evitar álcool'
    ];

    return methods.filter(method => content.includes(method));
  }

  /**
   * Extrai tópicos relacionados
   */
  private extractRelatedTopics(content: string): string[] {
    const topics = [
      'saúde mental', 'bem-estar emocional', 'qualidade de vida',
      'relacionamentos interpessoais', 'desenvolvimento pessoal',
      'autoestima', 'resiliência', 'inteligência emocional'
    ];

    return topics.filter(topic => content.includes(topic));
  }

  /**
   * Determina nível de evidência
   */
  private determineEvidenceLevel(content: string): HealthTopicData['evidenceLevel'] {
    if (content.includes('meta-análise') || content.includes('revisão sistemática') ||
        content.includes('ensaio clínico randomizado')) {
      return 'high';
    }
    if (content.includes('estudo controlado') || content.includes('pesquisa científica') ||
        content.includes('evidências')) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Extrai data da última revisão
   */
  private extractLastReviewed(content: string): string | undefined {
    const datePattern = /última atualização.*?(\d{1,2}\/\d{1,2}\/\d{4})/i;
    const match = content.match(datePattern);
    return match ? match[1] : undefined;
  }

  /**
   * Extrai credenciais do autor
   */
  private extractAuthorCredentials(content: string): string | undefined {
    const credentialsPattern = /(CRP|CRM|PhD|Dr\.|Dra\.|Psicólogo|Psiquiatra)/i;
    const match = content.match(credentialsPattern);
    return match ? match[1] : undefined;
  }

  /**
   * Extrai condições médicas estruturadas
   */
  private extractMedicalConditions(content: string): object[] {
    const conditionNames = this.extractMedicalConditionNames(content.toLowerCase());
    
    return conditionNames.map(name => ({
      '@type': 'MedicalCondition',
      name: name,
      ...(this.getMedicalCode(name) && {
        code: this.getMedicalCode(name)
      })
    }));
  }

  /**
   * Extrai tratamentos estruturados
   */
  private extractTreatments(content: string): object[] {
    const treatmentNames = this.extractTreatmentNames(content.toLowerCase());
    
    return treatmentNames.map(name => ({
      '@type': name.includes('medicação') || name.includes('antidepressivo') ? 'Drug' : 'MedicalTherapy',
      name: name
    }));
  }

  /**
   * Extrai conteúdo principal
   */
  private extractMainContent(content: string): string[] {
    const sections = [
      'Sintomas', 'Tratamento', 'Diagnóstico', 'Causas', 
      'Prevenção', 'Prognóstico', 'Fatores de Risco'
    ];
    
    return sections.filter(section => 
      content.toLowerCase().includes(section.toLowerCase())
    );
  }

  /**
   * Obtém URL da especialidade médica
   */
  private getMedicalSpecialtyURL(specialty: string): string {
    return `https://schema.org/${specialty}`;
  }

  /**
   * Obtém código médico para condição (simulado)
   */
  private getMedicalCode(conditionName: string): object | undefined {
    // Mapeamento básico para algumas condições comuns
    const codeMappings: Record<string, { code: string; system: string }> = {
      'depressão': { code: 'F32', system: 'ICD-10' },
      'ansiedade': { code: 'F41', system: 'ICD-10' },
      'transtorno bipolar': { code: 'F31', system: 'ICD-10' },
      'esquizofrenia': { code: 'F20', system: 'ICD-10' },
      'ptsd': { code: 'F43.1', system: 'ICD-10' }
    };

    const mapping = codeMappings[conditionName];
    if (mapping) {
      return {
        '@type': 'MedicalCode',
        code: mapping.code,
        codingSystem: mapping.system
      };
    }

    return undefined;
  }

  /**
   * Calcula nível de confiança do schema gerado
   */
  private calculateConfidence(healthData: HealthTopicData): number {
    let confidence = 0.7; // Base

    // Aumenta confiança baseada em dados extraídos
    if (healthData.medicalConditions.length > 0) confidence += 0.1;
    if (healthData.treatments.length > 0) confidence += 0.05;
    if (healthData.symptoms.length > 0) confidence += 0.05;
    if (healthData.riskFactors.length > 0) confidence += 0.05;
    if (healthData.evidenceLevel === 'high') confidence += 0.05;
    if (healthData.authorCredentials) confidence += 0.05;
    if (healthData.lastReviewed) confidence += 0.05;    return Math.min(confidence, 1.0);
  }
}

/**
 * Instância exportada do gerador
 */
export const healthTopicContentGenerator = new HealthTopicContentGenerator();
