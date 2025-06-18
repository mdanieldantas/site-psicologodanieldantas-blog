/**
 * Gerador de Schema.org CaseStudy
 * 
 * Implementa o tipo CaseStudy do Schema.org para artigos que representam
 * estudos de caso clínicos, análises de pacientes ou casos práticos
 * na área de psicologia.
 * 
 * Baseado na documentação Schema.org v15+ e nas melhores práticas
 * de SEO para conteúdo médico e educacional.
 * 
 * @see https://schema.org/CaseStudy
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
 * Interface específica para dados de CaseStudy
 */
interface CaseStudyData {
  caseType: string;
  subject: string;
  methodology: string[];
  findings: string[];
  intervention?: string;
  outcome?: string;
  participants?: number;
  duration?: string;
  ethicalConsiderations?: string;
}

/**
 * Gerador especializado para schemas CaseStudy
 * 
 * Identifica e estrutura artigos que representam estudos de caso,
 * adicionando propriedades específicas como metodologia, achados,
 * intervenções e resultados.
 */
export class CaseStudyGenerator extends BaseSchemaGenerator {
  
  protected readonly schemaType: SchemaTypeEnum = 'CaseStudy';
  protected readonly requiredFields: string[] = ['titulo', 'resumo'];
  
  /**
   * Verifica se o artigo se adequa ao tipo CaseStudy
   * 
   * @param context - Contexto de geração com dados do artigo
   * @returns true se o artigo contém indicadores de estudo de caso
   */
  canGenerate(context: SchemaGenerationContext): boolean {
    const { article } = context;
    const content = `${article.titulo} ${article.resumo} ${article.conteudo}`.toLowerCase();
    
    // Palavras-chave que indicam estudo de caso
    const caseStudyIndicators = [
      'estudo de caso', 'case study', 'caso clínico', 'relato de caso',
      'análise de caso', 'estudo clínico', 'caso prático', 'história clínica',
      'paciente', 'cliente', 'atendimento', 'intervenção terapêutica',
      'tratamento individual', 'sessão terapêutica', 'acompanhamento'
    ];
    
    const hasIndicators = caseStudyIndicators.some(indicator => 
      content.includes(indicator)
    );
    
    // Categoria relevante
    const relevantCategories = [
      'psicologia clínica', 'terapia', 'psicoterapia', 'estudos de caso',
      'relatos clínicos', 'prática clínica', 'intervenção'
    ];
    
    const hasRelevantCategory = relevantCategories.some(cat => 
      article.categoria_principal?.toLowerCase().includes(cat)
    );
    
    return hasIndicators || hasRelevantCategory;
  }
  
  /**
   * Gera o schema CaseStudy com propriedades específicas
   * 
   * @param context - Contexto de geração
   * @returns Schema estruturado para CaseStudy
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    this.log('info', 'Gerando schema CaseStudy', { articleId: article.id });
    
    // Obtém campos base do artigo
    const baseFields = this.generateBaseFields(context);
    
    // Extrai dados específicos do estudo de caso
    const caseStudyData = this.extractCaseStudyData(context);
    
    // Analisa aspectos éticos
    const ethicalInfo = this.analyzeEthicalAspects(article.conteudo);
    
    // Identifica população alvo
    const targetPopulation = this.identifyTargetPopulation(article.conteudo);
    
    // Construção do schema CaseStudy
    const schema = {
      ...baseFields,
      '@type': 'CaseStudy',
      
      // Tipo específico do caso
      genre: caseStudyData.caseType,
      
      // Assunto principal do estudo
      about: {
        '@type': 'MedicalCondition',
        name: caseStudyData.subject
      },
      
      // Audiência especializada
      audience: {
        '@type': 'EducationalAudience',
        audienceType: 'Profissionais de Saúde Mental'
      },
      
      // Metodologia empregada
      ...(caseStudyData.methodology.length > 0 && {
        teaches: caseStudyData.methodology
      }),
      
      // Principais achados
      ...(caseStudyData.findings.length > 0 && {
        educationalAlignment: caseStudyData.findings.map(finding => ({
          '@type': 'AlignmentObject',
          alignmentType: 'teaches',
          targetName: finding
        }))
      }),
      
      // Intervenção aplicada
      ...(caseStudyData.intervention && {
        mainEntity: {
          '@type': 'MedicalProcedure',
          name: caseStudyData.intervention
        }
      }),
      
      // Resultado do caso
      ...(caseStudyData.outcome && {
        result: caseStudyData.outcome
      }),
      
      // Duração do acompanhamento
      ...(caseStudyData.duration && {
        duration: caseStudyData.duration
      }),
      
      // Número de participantes
      ...(caseStudyData.participants && {
        numberOfItems: caseStudyData.participants
      }),
      
      // População alvo
      ...(targetPopulation && {
        targetPopulation: targetPopulation
      }),
      
      // Considerações éticas
      ...(ethicalInfo && {
        usageInfo: ethicalInfo
      }),
      
      // Propriedades educacionais
      learningResourceType: 'Estudo de Caso',
      educationalLevel: {
        '@type': 'DefinedTerm',
        name: 'Profissional',
        inDefinedTermSet: 'Níveis Educacionais'
      },
      
      // Licença e acesso
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/'
    };
    
    // Validação e warnings
    const warnings = this.validateCaseStudy(schema, caseStudyData);
      const performance = {
      generationTime: Date.now() - startTime,
      fieldsCount: Object.keys(schema).length
    };
    
    this.log('info', `CaseStudy gerado: ${caseStudyData.caseType}`, {
      subject: caseStudyData.subject,
      methodologyCount: caseStudyData.methodology.length,
      hasIntervention: !!caseStudyData.intervention
    });
    
    return {
      schema,
      warnings,
      errors: [],
      schemaType: this.schemaType,
      source: 'extractor',
      confidence: caseStudyData.methodology.length > 0 ? 0.9 : 0.7,
      performance
    };
  }
  
  /**
   * Extrai dados específicos do estudo de caso
   * 
   * @param context - Contexto de geração
   * @returns Dados estruturados do caso
   */
  private extractCaseStudyData(context: SchemaGenerationContext): CaseStudyData {
    const { article } = context;
    const content = article.conteudo || '';
    const fullText = `${article.titulo} ${article.resumo} ${content}`;
    
    // Determina o tipo de caso
    const caseType = this.determineCaseType(fullText);
    
    // Extrai assunto principal
    const subject = this.extractSubject(fullText, article.categoria_principal);
    
    // Identifica metodologia
    const methodology = this.extractMethodology(content);
    
    // Extrai achados principais
    const findings = this.extractFindings(content);
    
    // Identifica intervenção
    const intervention = this.extractIntervention(content);
    
    // Extrai resultado
    const outcome = this.extractOutcome(content);
    
    // Identifica duração
    const duration = this.extractDuration(content);
    
    // Conta participantes
    const participants = this.countParticipants(content);
    
    return {
      caseType,
      subject,
      methodology,
      findings,
      intervention,
      outcome,
      participants,
      duration
    };
  }
  
  /**
   * Determina o tipo específico do estudo de caso
   */
  private determineCaseType(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('caso clínico') || lowerContent.includes('relato clínico')) {
      return 'Caso Clínico';
    }
    if (lowerContent.includes('estudo longitudinal') || lowerContent.includes('acompanhamento')) {
      return 'Estudo Longitudinal';
    }
    if (lowerContent.includes('análise qualitativa') || lowerContent.includes('pesquisa qualitativa')) {
      return 'Análise Qualitativa';
    }
    if (lowerContent.includes('intervenção terapêutica') || lowerContent.includes('tratamento')) {
      return 'Intervenção Terapêutica';
    }
    
    return 'Estudo de Caso';
  }
  
  /**
   * Extrai o assunto principal do estudo
   */
  private extractSubject(content: string, category?: string): string {
    const lowerContent = content.toLowerCase();
    
    // Transtornos psicológicos comuns
    const disorders = [
      'ansiedade', 'depressão', 'bipolar', 'transtorno bipolar',
      'pânico', 'fobia', 'estresse pós-traumático', 'ptsd',
      'obsessivo-compulsivo', 'toc', 'borderline', 'esquizofrenia',
      'autismo', 'tdah', 'burnout', 'luto'
    ];
    
    for (const disorder of disorders) {
      if (lowerContent.includes(disorder)) {
        return disorder.charAt(0).toUpperCase() + disorder.slice(1);
      }
    }
    
    // Usa categoria se não encontrar transtorno específico
    return category || 'Condição Psicológica';
  }
  
  /**
   * Extrai metodologias utilizadas
   */
  private extractMethodology(content: string): string[] {
    const lowerContent = content.toLowerCase();
    const methodologies: string[] = [];
    
    const methods = [
      'entrevista clínica', 'observação', 'terapia cognitivo-comportamental',
      'psicanálise', 'terapia sistêmica', 'gestalt', 'humanística',
      'avaliação psicológica', 'testagem', 'intervenção grupal',
      'terapia familiar', 'psicoterapia individual'
    ];
    
    methods.forEach(method => {
      if (lowerContent.includes(method)) {
        methodologies.push(method.charAt(0).toUpperCase() + method.slice(1));
      }
    });
    
    return methodologies;
  }
  
  /**
   * Extrai principais achados do estudo
   */
  private extractFindings(content: string): string[] {
    const findings: string[] = [];
    
    // Busca por padrões de resultados
    const resultPatterns = [
      /(?:resultado|achado|descoberta)[s]?[:\-]?\s*([^.]{10,100})/gi,
      /(?:observou-se|verificou-se|constatou-se)[:\-]?\s*([^.]{10,100})/gi,
      /(?:evidenciou|demonstrou|revelou)[:\-]?\s*([^.]{10,100})/gi
    ];
    
    resultPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const finding = match.replace(/^[^:]*:?\s*/, '').trim();
          if (finding.length > 10 && finding.length < 200) {
            findings.push(finding);
          }
        });
      }
    });
    
    return findings.slice(0, 3); // Limita a 3 principais achados
  }
  
  /**
   * Identifica intervenção aplicada
   */
  private extractIntervention(content: string): string | undefined {
    const lowerContent = content.toLowerCase();
    
    const interventions = [
      'terapia cognitivo-comportamental', 'psicanálise', 'gestalt',
      'terapia sistêmica', 'mindfulness', 'relaxamento',
      'dessensibilização', 'exposição', 'reestruturação cognitiva'
    ];
    
    for (const intervention of interventions) {
      if (lowerContent.includes(intervention)) {
        return intervention.charAt(0).toUpperCase() + intervention.slice(1);
      }
    }
    
    return undefined;
  }
  
  /**
   * Extrai resultado do tratamento/estudo
   */
  private extractOutcome(content: string): string | undefined {
    const outcomePatterns = [
      /(?:resultado|desfecho|evolução)[:\-]?\s*([^.]{20,150})/i,
      /(?:melhora|piora|estabilização|remissão)[:\-]?\s*([^.]{10,100})/i
    ];
    
    for (const pattern of outcomePatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return undefined;
  }
  
  /**
   * Extrai duração do acompanhamento
   */
  private extractDuration(content: string): string | undefined {
    const durationPatterns = [
      /(\d+)\s*(?:meses?|anos?)\s*de\s*(?:acompanhamento|tratamento|seguimento)/i,
      /(?:durante|por)\s*(\d+)\s*(?:meses?|anos?|semanas?)/i
    ];
    
    for (const pattern of durationPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return undefined;
  }
  
  /**
   * Conta número de participantes/pacientes
   */
  private countParticipants(content: string): number | undefined {
    const participantPatterns = [
      /(\d+)\s*(?:pacientes?|participantes?|casos?|sujeitos?)/i,
      /(?:paciente|participante|caso|sujeito)\s*(?:único|individual)/i
    ];
    
    for (const pattern of participantPatterns) {
      const match = content.match(pattern);
      if (match) {
        if (match[0].includes('único') || match[0].includes('individual')) {
          return 1;
        }
        if (match[1]) {
          const num = parseInt(match[1]);
          if (!isNaN(num) && num > 0) {
            return num;
          }
        }
      }
    }
    
    return undefined;
  }
  
  /**
   * Analisa aspectos éticos mencionados
   */
  private analyzeEthicalAspects(content: string): string | undefined {
    const lowerContent = content.toLowerCase();
    
    const ethicalTerms = [
      'consentimento informado', 'termo de consentimento', 'ética',
      'comitê de ética', 'confidencialidade', 'anonimato',
      'privacidade', 'sigilo profissional'
    ];
    
    const mentionsEthics = ethicalTerms.some(term => lowerContent.includes(term));
    
    if (mentionsEthics) {
      return 'Aspectos éticos considerados conforme diretrizes profissionais';
    }
    
    return undefined;
  }
  
  /**
   * Identifica população alvo do estudo
   */
  private identifyTargetPopulation(content: string): string | undefined {
    const lowerContent = content.toLowerCase();
    
    const populations = [
      'adolescentes', 'crianças', 'adultos', 'idosos',
      'mulheres', 'homens', 'universitários', 'profissionais',
      'pacientes psiquiátricos', 'cuidadores'
    ];
    
    for (const population of populations) {
      if (lowerContent.includes(population)) {
        return population.charAt(0).toUpperCase() + population.slice(1);
      }
    }
    
    return undefined;
  }
  
  /**
   * Valida schema específico para CaseStudy
   */
  private validateCaseStudy(schema: any, caseData: CaseStudyData): any[] {
    const warnings: any[] = [];
    
    if (caseData.methodology.length === 0) {
      warnings.push({
        type: 'missing_methodology',
        message: 'Nenhuma metodologia identificada no estudo de caso',
        severity: 'warning',
        suggestion: 'Inclua informações sobre métodos utilizados na investigação'
      });
    }
    
    if (caseData.findings.length === 0) {
      warnings.push({
        type: 'missing_findings',
        message: 'Nenhum achado principal identificado',
        severity: 'warning',
        suggestion: 'Destaque os principais resultados encontrados'
      });
    }
    
    if (!caseData.participants) {
      warnings.push({
        type: 'missing_participants',
        message: 'Número de participantes não especificado',
        severity: 'info',
        suggestion: 'Considere especificar quantos casos foram estudados'
      });
    }
    
    if (!schema.about || !schema.about.name) {
      warnings.push({
        type: 'missing_subject',
        message: 'Assunto principal do caso não identificado claramente',
        severity: 'error',
        suggestion: 'Especifique claramente o tema central do estudo de caso'
      });
    }    return warnings;
  }
}

/**
 * Instância exportada do gerador
 */
export const caseStudyGenerator = new CaseStudyGenerator();
