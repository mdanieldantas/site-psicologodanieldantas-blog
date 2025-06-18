/**
 * Gerador de Schema.org Workshop/Event
 * 
 * Implementa schemas para workshops, cursos, palestras e eventos
 * educacionais na área de psicologia e bem-estar mental.
 * 
 * Baseado nos tipos Event, EducationalEvent e Course do Schema.org
 * adaptados para contexto educacional em saúde mental.
 * 
 * @see https://schema.org/Event
 * @see https://schema.org/EducationalEvent
 * @see https://schema.org/Course
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
 * Interface específica para dados de Workshop
 */
interface WorkshopData {
  eventType: string;
  eventCategory: string;
  format: 'presencial' | 'online' | 'híbrido';
  duration: string;
  level: string;
  targetAudience: string[];
  topics: string[];
  prerequisites?: string[];
  outcomes: string[];
  methodology: string;
  certification?: boolean;
  materials?: string[];
}

/**
 * Gerador especializado para schemas Workshop/Event
 * 
 * Identifica e estrutura artigos sobre workshops, eventos educacionais,
 * cursos e palestras relacionadas à psicologia e bem-estar.
 */
export class WorkshopGenerator extends BaseSchemaGenerator {
  
  protected readonly schemaType: SchemaTypeEnum = 'Event';
  protected readonly requiredFields: string[] = ['titulo', 'resumo'];
  
  /**
   * Verifica se o artigo se adequa ao tipo Workshop/Event
   * 
   * @param context - Contexto de geração
   * @returns true se o artigo descreve um evento/workshop
   */
  canGenerate(context: SchemaGenerationContext): boolean {
    const { article } = context;
    const content = `${article.titulo} ${article.resumo} ${article.conteudo}`.toLowerCase();
    
    // Palavras-chave que indicam evento/workshop
    const eventIndicators = [
      'workshop', 'curso', 'palestra', 'seminário', 'treinamento',
      'capacitação', 'formação', 'evento', 'encontro', 'conferência',
      'mesa redonda', 'roda de conversa', 'grupo de estudos',
      'oficina', 'aula', 'masterclass', 'webinar', 'live'
    ];
    
    const hasIndicators = eventIndicators.some(indicator => 
      content.includes(indicator)
    );
    
    // Informações temporais de eventos
    const temporalPatterns = [
      /\d{1,2}\/\d{1,2}\/\d{4}/, // Datas
      /\d{1,2}h\d{2}/, // Horários
      /das?\s*\d{1,2}.*às?\s*\d{1,2}/, // "das 9h às 17h"
      /duração.*\d+\s*(?:horas?|h|dias?|semanas?)/, // Duração
      /carga\s*horária/, // Carga horária
      /vagas?\s*limitadas?/, // Vagas limitadas
      /inscrições?.*abertas?/ // Inscrições abertas
    ];
    
    const hasTemporalInfo = temporalPatterns.some(pattern => 
      pattern.test(content)
    );
    
    // Estrutura de curso/evento
    const structuralIndicators = [
      'módulo', 'módulos', 'aula', 'aulas', 'encontro', 'encontros',
      'etapa', 'etapas', 'fase', 'fases', 'cronograma', 'programa',
      'conteúdo programático', 'ementa', 'certificado', 'certificação'
    ];
    
    const hasStructure = structuralIndicators.some(indicator => 
      content.includes(indicator)
    );
    
    // Categorias relevantes
    const relevantCategories = [
      'eventos', 'cursos', 'workshops', 'treinamentos',
      'educação', 'formação', 'capacitação'
    ];
    
    const hasRelevantCategory = relevantCategories.some(cat => 
      article.categoria_principal?.toLowerCase().includes(cat)
    );
    
    return hasIndicators || hasTemporalInfo || hasStructure || hasRelevantCategory;
  }
  
  /**
   * Gera o schema Workshop/Event com propriedades específicas
   * 
   * @param context - Contexto de geração
   * @returns Schema estruturado para Workshop/Event
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    this.log('info', 'Gerando schema Workshop/Event', { articleId: article.id });
    
    // Obtém campos base do artigo
    const baseFields = this.generateBaseFields(context);
    
    // Extrai dados específicos do workshop
    const workshopData = this.extractWorkshopData(context);    // Determina se é Event ou EducationalEvent
    const schemaType = this.determineSchemaType(workshopData);
    
    // Extrai informações de local/online
    const location = this.extractLocation(article.conteudo);
    
    // Extrai informações de preço
    const pricing = this.extractPricing(article.conteudo);
    
    // Construção do schema Event/EducationalEvent
    const schema = {
      ...baseFields,
      '@type': schemaType,
      
      // Tipo específico do evento
      eventType: workshopData.eventType,
      
      // Status do evento
      eventStatus: 'https://schema.org/EventScheduled',
      
      // Modo de participação
      eventAttendanceMode: this.getAttendanceMode(workshopData.format),
      
      // Categoria educacional
      ...(schemaType === 'EducationalEvent' && {
        educationalLevel: {
          '@type': 'DefinedTerm',
          name: workshopData.level,
          inDefinedTermSet: 'Níveis Educacionais'
        }
      }),
      
      // Audiência alvo
      audience: workshopData.targetAudience.map(audience => ({
        '@type': 'EducationalAudience',
        audienceType: audience
      })),
      
      // Tópicos abordados
      about: workshopData.topics.map(topic => ({
        '@type': 'Thing',
        name: topic
      })),
      
      // Duração
      ...(workshopData.duration && {
        duration: workshopData.duration
      }),
      
      // Pré-requisitos
      ...(workshopData.prerequisites && workshopData.prerequisites.length > 0 && {
        requirements: workshopData.prerequisites
      }),
      
      // Resultados esperados
      educationalCredentialAwarded: workshopData.outcomes.join('; '),
      
      // Metodologia
      teaches: workshopData.methodology,
      
      // Certificação
      ...(workshopData.certification && {
        offers: {
          '@type': 'Offer',
          category: 'Certificação',
          description: 'Certificado de participação fornecido'
        }
      }),
      
      // Local (se presencial) ou plataforma (se online)
      ...(location && {
        location: location
      }),
      
      // Informações de preço
      ...(pricing && {
        offers: {
          '@type': 'Offer',
          price: pricing.price,
          priceCurrency: pricing.currency,
          availability: 'https://schema.org/InStock'
        }
      }),
      
      // Materiais necessários
      ...(workshopData.materials && workshopData.materials.length > 0 && {
        materials: workshopData.materials
      }),
      
      // Organização responsável
      organizer: {
        '@type': 'Organization',
        name: baseFields.publisher?.name || 'Dr. Daniel Dantas - Psicólogo',
        url: baseFields.publisher?.url
      },
      
      // Propriedades educacionais específicas
      learningResourceType: 'Workshop/Evento Educacional',
      
      // Categorização
      genre: workshopData.eventCategory,
      
      // Acessibilidade
      isAccessibleForFree: !pricing || pricing.price === '0',
      
      // Idioma
      inLanguage: 'pt-BR'
    };
    
    // Validação e warnings
    const warnings = this.validateWorkshop(schema, workshopData);
    
    const performance = {
      generationTime: Date.now() - startTime,
      fieldsCount: Object.keys(schema).length
    };
    
    this.log('info', `Workshop/Event gerado: ${workshopData.eventType}`, {
      category: workshopData.eventCategory,
      format: workshopData.format,
      topicsCount: workshopData.topics.length
    });
    
    return {
      schema,
      warnings,
      errors: [],
      schemaType: 'Event', // Always return 'Event' as the schemaType
      source: 'extractor',
      confidence: workshopData.topics.length > 2 ? 0.9 : 0.8,
      performance
    };
  }
  
  /**
   * Extrai dados específicos do workshop
   * 
   * @param context - Contexto de geração
   * @returns Dados estruturados do workshop
   */
  private extractWorkshopData(context: SchemaGenerationContext): WorkshopData {
    const { article } = context;
    const content = article.conteudo || '';
    const fullText = `${article.titulo} ${article.resumo} ${content}`;
    
    // Determina tipo de evento
    const eventType = this.determineEventType(fullText);
    
    // Determina categoria
    const eventCategory = this.determineEventCategory(fullText);
    
    // Determina formato
    const format = this.determineFormat(content);
    
    // Extrai duração
    const duration = this.extractDuration(content);
    
    // Determina nível
    const level = this.determineLevel(content);
    
    // Identifica audiência alvo
    const targetAudience = this.extractTargetAudience(content);
    
    // Extrai tópicos
    const topics = this.extractTopics(fullText);
    
    // Extrai pré-requisitos
    const prerequisites = this.extractPrerequisites(content);
    
    // Extrai resultados esperados
    const outcomes = this.extractOutcomes(content);
    
    // Extrai metodologia
    const methodology = this.extractMethodology(content);
    
    // Verifica certificação
    const certification = this.hasCertification(content);
    
    // Extrai materiais
    const materials = this.extractMaterials(content);
    
    return {
      eventType,
      eventCategory,
      format,
      duration,
      level,
      targetAudience,
      topics,
      prerequisites,
      outcomes,
      methodology,
      certification,
      materials
    };
  }
  
  /**
   * Determina o tipo específico do evento
   */
  private determineEventType(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('workshop')) return 'Workshop';
    if (lowerContent.includes('curso')) return 'Curso';
    if (lowerContent.includes('palestra')) return 'Palestra';
    if (lowerContent.includes('seminário')) return 'Seminário';
    if (lowerContent.includes('treinamento')) return 'Treinamento';
    if (lowerContent.includes('capacitação')) return 'Capacitação';
    if (lowerContent.includes('oficina')) return 'Oficina';
    if (lowerContent.includes('webinar')) return 'Webinar';
    if (lowerContent.includes('masterclass')) return 'Masterclass';
    
    return 'Evento Educacional';
  }
  
  /**
   * Determina se usa Event ou EducationalEvent
   */
  private determineSchemaType(workshopData: WorkshopData): 'Event' | 'EducationalEvent' {
    const educationalTypes = ['Curso', 'Treinamento', 'Capacitação', 'Workshop', 'Oficina'];
    return educationalTypes.includes(workshopData.eventType) ? 'EducationalEvent' : 'Event';
  }
  
  /**
   * Determina a categoria do evento
   */
  private determineEventCategory(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('psicologia clínica') || lowerContent.includes('terapia')) {
      return 'Psicologia Clínica';
    }
    if (lowerContent.includes('psicologia organizacional') || lowerContent.includes('trabalho')) {
      return 'Psicologia Organizacional';
    }
    if (lowerContent.includes('desenvolvimento pessoal') || lowerContent.includes('autoconhecimento')) {
      return 'Desenvolvimento Pessoal';
    }
    if (lowerContent.includes('bem-estar') || lowerContent.includes('qualidade de vida')) {
      return 'Bem-estar e Qualidade de Vida';
    }
    if (lowerContent.includes('relacionamento') || lowerContent.includes('família')) {
      return 'Relacionamentos e Família';
    }
    
    return 'Psicologia e Saúde Mental';
  }
  
  /**
   * Determina o formato do evento
   */
  private determineFormat(content: string): 'presencial' | 'online' | 'híbrido' {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('online') || lowerContent.includes('virtual') || 
        lowerContent.includes('remoto') || lowerContent.includes('webinar')) {
      return 'online';
    }
    if (lowerContent.includes('presencial') || lowerContent.includes('local')) {
      return 'presencial';
    }
    if (lowerContent.includes('híbrido') || lowerContent.includes('misto')) {
      return 'híbrido';
    }
    
    // Se menciona plataformas online, assume online
    if (lowerContent.includes('zoom') || lowerContent.includes('teams') || 
        lowerContent.includes('meet') || lowerContent.includes('plataforma')) {
      return 'online';
    }
    
    return 'online'; // Default para online
  }
  
  /**
   * Converte formato para eventAttendanceMode do Schema.org
   */
  private getAttendanceMode(format: string): string {
    switch (format) {
      case 'online':
        return 'https://schema.org/OnlineEventAttendanceMode';
      case 'presencial':
        return 'https://schema.org/OfflineEventAttendanceMode';
      case 'híbrido':
        return 'https://schema.org/MixedEventAttendanceMode';
      default:
        return 'https://schema.org/OnlineEventAttendanceMode';
    }
  }
  
  /**
   * Extrai duração do evento
   */
  private extractDuration(content: string): string {
    const durationPatterns = [
      /(\d+)\s*(?:horas?|h)/i,
      /(\d+)\s*(?:dias?)/i,
      /(\d+)\s*(?:semanas?)/i,
      /carga\s*horária[:\-]?\s*(\d+)\s*(?:horas?|h)/i
    ];
    
    for (const pattern of durationPatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        const time = parseInt(match[1]);
        if (match[0].includes('dia')) {
          return `P${time}D`;
        } else if (match[0].includes('semana')) {
          return `P${time}W`;
        } else {
          return `PT${time}H`;
        }
      }
    }
    
    return 'PT2H'; // Default: 2 horas
  }
  
  /**
   * Determina o nível do evento
   */
  private determineLevel(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('iniciante') || lowerContent.includes('básico')) {
      return 'Iniciante';
    }
    if (lowerContent.includes('intermediário') || lowerContent.includes('moderado')) {
      return 'Intermediário';
    }
    if (lowerContent.includes('avançado') || lowerContent.includes('especialista')) {
      return 'Avançado';
    }
    
    return 'Todos os níveis';
  }
  
  /**
   * Extrai audiência alvo
   */
  private extractTargetAudience(content: string): string[] {
    const audience: string[] = [];
    const lowerContent = content.toLowerCase();
    
    const audiences = [
      'psicólogos', 'terapeutas', 'profissionais de saúde',
      'estudantes de psicologia', 'público geral', 'pais',
      'educadores', 'gestores', 'líderes', 'cuidadores'
    ];
    
    audiences.forEach(aud => {
      if (lowerContent.includes(aud)) {
        audience.push(aud.charAt(0).toUpperCase() + aud.slice(1));
      }
    });
    
    return audience.length > 0 ? audience : ['Interessados em psicologia'];
  }
  
  /**
   * Extrai tópicos abordados
   */
  private extractTopics(content: string): string[] {
    const topics: string[] = [];
    const lowerContent = content.toLowerCase();
    
    const psychologyTopics = [
      'ansiedade', 'depressão', 'estresse', 'autoestima',
      'relacionamentos', 'comunicação', 'liderança',
      'motivação', 'mindfulness', 'terapia cognitiva',
      'psicanálise', 'desenvolvimento pessoal',
      'inteligência emocional', 'burnout', 'trauma'
    ];
    
    psychologyTopics.forEach(topic => {
      if (lowerContent.includes(topic)) {
        topics.push(topic.charAt(0).toUpperCase() + topic.slice(1));
      }
    });
    
    // Se não encontrou tópicos específicos, usa categoria como tópico
    if (topics.length === 0) {
      topics.push('Psicologia e bem-estar');
    }
    
    return topics;
  }
  
  /**
   * Extrai pré-requisitos
   */
  private extractPrerequisites(content: string): string[] | undefined {
    const prerequisites: string[] = [];
    
    const prereqPatterns = [
      /(?:pré-requisitos?|requisitos?)[:\-]?\s*([^.]{10,200})/gi,
      /(?:necessário|requer)[:\-]?\s*([^.]{10,100})/gi
    ];
    
    prereqPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const text = match.replace(/^[^a-zA-Z]*/, '').trim();
          if (text.length > 10) {
            prerequisites.push(text);
          }
        });
      }
    });
    
    return prerequisites.length > 0 ? prerequisites : undefined;
  }
  
  /**
   * Extrai resultados esperados
   */
  private extractOutcomes(content: string): string[] {
    const outcomes: string[] = [];
    
    const outcomePatterns = [
      /(?:você\s*(?:vai\s*)?(?:aprender|conseguir|obter))[:\-]?\s*([^.]{10,150})/gi,
      /(?:ao\s*final)[:\-]?\s*([^.]{10,150})/gi,
      /(?:objetivos?)[:\-]?\s*([^.]{10,150})/gi
    ];
    
    outcomePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const text = match.replace(/^[^a-zA-Z]*/, '').trim();
          if (text.length > 10) {
            outcomes.push(text);
          }
        });
      }
    });
    
    if (outcomes.length === 0) {
      outcomes.push('Conhecimentos e habilidades na área abordada');
    }
    
    return outcomes;
  }
  
  /**
   * Extrai metodologia
   */
  private extractMethodology(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('prática') || lowerContent.includes('exercícios')) {
      return 'Metodologia prático-experiencial';
    }
    if (lowerContent.includes('teórica') || lowerContent.includes('conceitos')) {
      return 'Metodologia teórico-conceitual';
    }
    if (lowerContent.includes('dinâmica') || lowerContent.includes('interativo')) {
      return 'Metodologia dinâmica e interativa';
    }
    
    return 'Metodologia expositiva e participativa';
  }
  
  /**
   * Verifica se oferece certificação
   */
  private hasCertification(content: string): boolean {
    const lowerContent = content.toLowerCase();
    return lowerContent.includes('certificado') || 
           lowerContent.includes('certificação') ||
           lowerContent.includes('diploma');
  }
  
  /**
   * Extrai materiais necessários
   */
  private extractMaterials(content: string): string[] | undefined {
    const materials: string[] = [];
    
    const materialPatterns = [
      /(?:materiais?|recursos?)\s*(?:necessários?|utilizados?)[:\-]?\s*([^.]{10,200})/gi
    ];
    
    materialPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const text = match.replace(/^[^a-zA-Z]*/, '').trim();
          const items = text.split(/[,\n]/).map(item => item.trim());
          materials.push(...items.filter(item => item.length > 3));
        });
      }
    });
    
    return materials.length > 0 ? materials : undefined;
  }
  
  /**
   * Extrai informações de local/plataforma
   */
  private extractLocation(content: string): any | undefined {
    const lowerContent = content.toLowerCase();
    
    // Se for online, identifica plataforma
    if (lowerContent.includes('zoom')) {
      return {
        '@type': 'VirtualLocation',
        name: 'Zoom',
        url: 'https://zoom.us'
      };
    }
    
    if (lowerContent.includes('teams')) {
      return {
        '@type': 'VirtualLocation',
        name: 'Microsoft Teams'
      };
    }
    
    if (lowerContent.includes('meet')) {
      return {
        '@type': 'VirtualLocation',
        name: 'Google Meet'
      };
    }
    
    // Procura por endereços físicos
    const addressPattern = /(?:endereço|local)[:\-]?\s*([^.]{10,200})/i;
    const match = content.match(addressPattern);
    if (match && match[1]) {
      return {
        '@type': 'Place',
        name: 'Local do Evento',
        address: match[1].trim()
      };
    }
    
    return {
      '@type': 'VirtualLocation',
      name: 'Plataforma Online',
      description: 'Link será enviado aos participantes'
    };
  }
  
  /**
   * Extrai informações de preço
   */
  private extractPricing(content: string): { price: string; currency: string } | undefined {
    const pricePatterns = [
      /R\$\s*(\d+(?:,\d{2})?)/i,
      /(?:preço|valor|investimento)[:\-]?\s*R\$\s*(\d+(?:,\d{2})?)/i,
      /(\d+)\s*reais?/i,
      /gratuito|grátis|free/i
    ];
    
    for (const pattern of pricePatterns) {
      const match = content.match(pattern);
      if (match) {
        if (match[0].toLowerCase().includes('gratuito') || 
            match[0].toLowerCase().includes('grátis') ||
            match[0].toLowerCase().includes('free')) {
          return { price: '0', currency: 'BRL' };
        }
        if (match[1]) {
          return { 
            price: match[1].replace(',', '.'), 
            currency: 'BRL' 
          };
        }
      }
    }
    
    return undefined;
  }
  
  /**
   * Valida schema específico para Workshop
   */
  private validateWorkshop(schema: any, workshopData: WorkshopData): any[] {
    const warnings: any[] = [];
    
    if (workshopData.topics.length === 0) {
      warnings.push({
        type: 'missing_topics',
        message: 'Nenhum tópico específico identificado',
        severity: 'warning',
        suggestion: 'Inclua informações sobre os temas que serão abordados'
      });
    }
    
    if (workshopData.targetAudience.length === 0) {
      warnings.push({
        type: 'missing_audience',
        message: 'Audiência alvo não especificada claramente',
        severity: 'info',
        suggestion: 'Defina quem é o público-alvo do evento'
      });
    }
    
    if (!workshopData.duration || workshopData.duration === 'PT2H') {
      warnings.push({
        type: 'default_duration',
        message: 'Duração padrão aplicada (2 horas)',
        severity: 'info',
        suggestion: 'Especifique a duração real do evento'
      });
    }
      return warnings;
  }
}

/**
 * Instância exportada do gerador
 */
export const workshopGenerator = new WorkshopGenerator();
