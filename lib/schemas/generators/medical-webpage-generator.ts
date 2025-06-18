/**
 * 🏥 GERADOR DE SCHEMA MEDICALWEBPAGE
 * 
 * Gerador específico para páginas web médicas (Schema.org MedicalWebPage).
 * Especializado em conteúdo de saúde mental e psicologia.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Conformidade com padrões médicos
 * - Validação de precisão médica
 * - Campos específicos de saúde
 * - Audiência e especialidade médica
 * 
 * 🎯 CASOS DE USO:
 * - Artigos sobre transtornos mentais
 * - Guias de tratamento psicológico
 * - Informações sobre terapias
 * - Conteúdo educacional médico
 * 
 * 📊 DADOS UTILIZADOS:
 * - conteudo: Para detecção de termos médicos
 * - categoria_principal: Para especialidade
 * - tags: Para condições médicas
 * - data_revisao: Para lastReviewed
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - MedicalWebPage Generator
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
  extractKeywords
} from '../core/utils';

// ==========================================
// 🏥 GERADOR MEDICALWEBPAGE
// ==========================================

/**
 * Gerador específico para MedicalWebPage schemas
 */
export class MedicalWebPageGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'MedicalWebPage';
  protected readonly requiredFields: string[] = [
    'about',
    'audience',
    'lastReviewed'
  ];
  
  /**
   * Gera schema MedicalWebPage completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando MedicalWebPage para: ${article.titulo}`);
      
      // Verificação se o conteúdo é médico
      if (!this.isMedicalContent(article.conteudo)) {
        const warning = 'Conteúdo pode não ser adequado para MedicalWebPage';
        this.log('warn', warning);
      }
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Detecção de especialidade médica
      const specialty = this.detectMedicalSpecialty(article.conteudo, article.categoria_principal);
      
      // Extração de condições médicas mencionadas
      const medicalConditions = this.extractMedicalConditions(article.conteudo);
      
      // Construção do schema MedicalWebPage
      const schema = {
        ...baseFields,
        '@type': 'MedicalWebPage',
        
        // Especialidade médica
        specialty: specialty,
        
        // Audiência (pacientes ou profissionais)
        audience: this.determineMedicalAudience(article.conteudo),
          // Data da última revisão médica (usando data_atualizacao)
        lastReviewed: formatSchemaDate(article.data_atualizacao),
        
        // Sobre o que trata a página
        about: medicalConditions.length > 0 ? medicalConditions : [
          {
            '@type': 'MedicalCondition',
            name: this.extractMainMedicalTopic(article.titulo, article.conteudo)
          }
        ],
        
        // Conteúdo principal da página
        mainContentOfPage: this.extractMainContent(article.conteudo),
        
        // Aspect médico (diagnóstico, tratamento, etc.)
        aspect: this.detectMedicalAspect(article.conteudo)
      };
      
      // Validação e warnings
      const warnings = this.validateSchema(schema);
      this.addMedicalWarnings(warnings, article);
      
      this.log('info', `MedicalWebPage gerado com especialidade: ${specialty}`, {
        specialty,
        audience: schema.audience,
        medicalConditionsCount: medicalConditions.length,
        aspect: schema.aspect
      });
      
      return this.createResult(schema, context, startTime, warnings);
      
    } catch (error) {
      const errorMsg = `Erro ao gerar MedicalWebPage: ${error}`;
      this.log('error', errorMsg);
      return this.createResult({}, context, startTime, [], [errorMsg]);
    }
  }
  
  /**
   * Verifica se o conteúdo é de natureza médica
   */
  private isMedicalContent(content: string): boolean {
    const contentLower = content.toLowerCase();
    
    const medicalTerms = [
      // Psicologia e saúde mental
      'transtorno', 'ansiedade', 'depressão', 'terapia', 'psicoterapia',
      'psicológico', 'mental', 'emocional', 'comportamental',
      'diagnóstico', 'tratamento', 'sintoma', 'síndrome',
      
      // Termos médicos gerais
      'doença', 'condição', 'médico', 'clínico', 'saúde',
      'paciente', 'patologia', 'medicamento', 'fármaco',
      
      // Psicologia específica
      'cognitivo', 'behaviorista', 'psicanálise', 'gestalt',
      'tcc', 'terapia cognitiva', 'mindfulness', 'trauma'
    ];
    
    const medicalTermsFound = medicalTerms.filter(term => 
      contentLower.includes(term)
    ).length;
    
    // Pelo menos 3 termos médicos para considerar conteúdo médico
    return medicalTermsFound >= 3;
  }
  
  /**
   * Detecta a especialidade médica do conteúdo
   */
  private detectMedicalSpecialty(content: string, categoria?: string): string {
    const contentLower = content.toLowerCase();
    const categoriaLower = categoria?.toLowerCase() || '';
    
    // Mapeamento de especialidades médicas
    const specialties = {
      'Psychiatry': [
        'psiquiatria', 'psiquiátrico', 'medicamento psiquiátrico',
        'antidepressivo', 'ansiolítico', 'bipolar', 'esquizofrenia'
      ],
      'Psychology': [
        'psicologia', 'psicológico', 'terapia', 'psicoterapia',
        'comportamental', 'cognitivo', 'emocional', 'autoestima'
      ],
      'MentalHealth': [
        'saúde mental', 'bem-estar mental', 'equilíbrio emocional',
        'stress', 'burnout', 'mindfulness', 'meditação'
      ],
      'Neurology': [
        'neurologia', 'neurológico', 'cérebro', 'neurônio',
        'sistema nervoso', 'neurotransmissor'
      ]
    };
    
    // Verifica categoria primeiro
    if (categoriaLower.includes('psicologia')) return 'Psychology';
    if (categoriaLower.includes('psiquiatria')) return 'Psychiatry';
    if (categoriaLower.includes('neurologia')) return 'Neurology';
    
    // Analisa conteúdo
    for (const [specialty, terms] of Object.entries(specialties)) {
      const matches = terms.filter(term => contentLower.includes(term)).length;
      if (matches >= 2) {
        return specialty;
      }
    }
    
    // Default para Psychology (contexto do blog)
    return 'Psychology';
  }
  
  /**
   * Determina a audiência médica do conteúdo
   */
  private determineMedicalAudience(content: string): string {
    const contentLower = content.toLowerCase();
    
    // Indicadores de audiência profissional
    const professionalIndicators = [
      'diagnóstico diferencial', 'critérios diagnósticos', 'dsm-5',
      'protocolo clínico', 'intervenção terapêutica', 'avaliação clínica',
      'técnica terapêutica', 'supervisão clínica', 'caso clínico'
    ];
    
    // Indicadores de audiência pública/pacientes
    const patientIndicators = [
      'como lidar', 'dicas para', 'o que fazer quando',
      'sinais de alerta', 'quando procurar ajuda', 'autocuidado',
      'família', 'parentes', 'amigos', 'apoio social'
    ];
    
    const professionalCount = professionalIndicators.filter(term => 
      contentLower.includes(term)
    ).length;
    
    const patientCount = patientIndicators.filter(term => 
      contentLower.includes(term)
    ).length;
    
    if (professionalCount > patientCount) {
      return 'https://schema.org/MedicalAudience';
    } else {
      return 'https://schema.org/Patient';
    }
  }
  
  /**
   * Extrai condições médicas mencionadas no conteúdo
   */
  private extractMedicalConditions(content: string): Array<{[key: string]: any}> {
    const conditions: Array<{[key: string]: any}> = [];
    const contentLower = content.toLowerCase();
    
    // Lista de condições de saúde mental comuns
    const mentalHealthConditions = [
      'ansiedade generalizada', 'transtorno de ansiedade', 'ansiedade',
      'depressão maior', 'transtorno depressivo', 'depressão',
      'transtorno bipolar', 'bipolar',
      'transtorno obsessivo-compulsivo', 'toc',
      'transtorno de pânico', 'síndrome do pânico', 'pânico',
      'fobia social', 'ansiedade social',
      'transtorno de estresse pós-traumático', 'ptsd', 'trauma',
      'transtorno de déficit de atenção', 'tdah', 'hiperatividade',
      'transtorno alimentar', 'anorexia', 'bulimia',
      'burnout', 'esgotamento profissional',
      'insônia', 'transtorno do sono',
      'transtorno de personalidade borderline',
      'esquizofrenia', 'psicose'
    ];
    
    mentalHealthConditions.forEach(condition => {
      if (contentLower.includes(condition)) {
        conditions.push({
          '@type': 'MedicalCondition',
          name: this.capitalizeCondition(condition)
        });
      }
    });
    
    // Remove duplicatas baseado no nome
    const uniqueConditions = conditions.filter((condition, index, self) =>
      index === self.findIndex(c => c.name === condition.name)
    );
    
    return uniqueConditions;
  }
  
  /**
   * Extrai o tópico médico principal
   */
  private extractMainMedicalTopic(titulo: string, content: string): string {
    // Tenta extrair do título primeiro
    const titleLower = titulo.toLowerCase();
    
    const topicPatterns = [
      /(?:transtorno|síndrome|doença)\s+[\w\s]+/gi,
      /(?:ansiedade|depressão|bipolar|pânico)[\w\s]*/gi,
      /(?:terapia|tratamento)\s+[\w\s]+/gi
    ];
    
    for (const pattern of topicPatterns) {
      const match = titulo.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }
    
    // Se não encontrar no título, usa uma extração genérica
    return titulo;
  }
  
  /**
   * Extrai conteúdo principal médico
   */
  private extractMainContent(content: string): string[] {
    const mainContentTypes = [];
    const contentLower = content.toLowerCase();
    
    // Tipos de conteúdo médico
    if (contentLower.includes('diagnóstico')) mainContentTypes.push('Diagnóstico');
    if (contentLower.includes('tratamento') || contentLower.includes('terapia')) {
      mainContentTypes.push('Tratamento');
    }
    if (contentLower.includes('sintoma') || contentLower.includes('sinais')) {
      mainContentTypes.push('Sintomas');
    }
    if (contentLower.includes('causa') || contentLower.includes('etiologia')) {
      mainContentTypes.push('Causas');
    }
    if (contentLower.includes('prevenção') || contentLower.includes('prevenindo')) {
      mainContentTypes.push('Prevenção');
    }
    if (contentLower.includes('prognóstico') || contentLower.includes('evolução')) {
      mainContentTypes.push('Prognóstico');
    }
    
    return mainContentTypes.length > 0 ? mainContentTypes : ['Informações Gerais'];
  }
  
  /**
   * Detecta o aspecto médico da página
   */
  private detectMedicalAspect(content: string): string {
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('diagnóstico') || contentLower.includes('identificar')) {
      return 'https://schema.org/DiagnosisAspect';
    }
    if (contentLower.includes('tratamento') || contentLower.includes('terapia')) {
      return 'https://schema.org/TreatmentAspect';
    }
    if (contentLower.includes('causa') || contentLower.includes('origem')) {
      return 'https://schema.org/EtiologyAspect';
    }
    if (contentLower.includes('sintoma') || contentLower.includes('sinais')) {
      return 'https://schema.org/SymptomsAspect';
    }
    if (contentLower.includes('prevenção') || contentLower.includes('evitar')) {
      return 'https://schema.org/PreventionAspect';
    }
    if (contentLower.includes('prognóstico') || contentLower.includes('evolução')) {
      return 'https://schema.org/PrognosisAspect';
    }
    
    // Default para aspecto geral
    return 'https://schema.org/OverviewAspect';
  }
  
  /**
   * Capitaliza nome de condição médica
   */
  private capitalizeCondition(condition: string): string {
    return condition
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
    /**
   * Adiciona warnings específicos para conteúdo médico
   */
  private addMedicalWarnings(warnings: string[], article: any): void {
    // Verifica data de atualização (como proxy para revisão)
    if (article.data_atualizacao) {
      const updateDate = new Date(article.data_atualizacao);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (updateDate < oneYearAgo) {
        warnings.push('Conteúdo médico com mais de 1 ano desde última atualização');
      }
    }
    
    // Verifica precisão médica
    const content = article.conteudo.toLowerCase();
    const disclaimerTerms = [
      'consulte um médico', 'consulte um psicólogo', 'procure ajuda profissional',
      'não substitui consulta médica', 'orientação profissional'
    ];
    
    const hasDisclaimer = disclaimerTerms.some(term => content.includes(term));
    if (!hasDisclaimer) {
      warnings.push('Considere adicionar disclaimer médico apropriado');
    }
    
    // Verifica fontes científicas
    if (!content.includes('pesquisa') && !content.includes('estudo') && !content.includes('evidência')) {
      warnings.push('Conteúdo médico se beneficia de referências a evidências científicas');
    }
  }
}

/**
 * Instância exportada do gerador
 */
export const medicalWebPageGenerator = new MedicalWebPageGenerator();
