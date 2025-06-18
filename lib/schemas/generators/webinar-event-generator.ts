/**
 * Gerador de Schema.org para Eventos Online/Webinars
 * 
 * Este gerador especializado cria schemas para artigos sobre eventos virtuais,
 * webinars, palestras online e workshops digitais na área de psicologia.
 * 
 * @author AI Assistant
 * @see https://schema.org/Event
 * @see https://schema.org/VirtualLocation 
 * @see https://schema.org/OnlineEventAttendanceMode
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
 * Interface específica para dados de Webinar/Evento Online
 */
interface WebinarData {
  platform: string;
  eventType: 'webinar' | 'live' | 'workshop' | 'palestra' | 'curso';
  accessType: 'free' | 'paid' | 'registration';
  duration: string;
  maxAttendees?: number;
  language: string;
  recordingAvailable: boolean;
  interactionLevel: 'low' | 'medium' | 'high';
  topics: string[];
  targetAudience: string[];
  prerequisites?: string[];
  materials?: string[];
  certification?: boolean;
}

/**
 * Gerador especializado para schemas WebinarEvent
 * 
 * Identifica e estrutura artigos sobre eventos online, webinars,
 * palestras virtuais e workshops digitais relacionados à psicologia.
 */
export class WebinarEventGenerator extends BaseSchemaGenerator {
  
  protected readonly schemaType: SchemaTypeEnum = 'Event';
  protected readonly requiredFields: string[] = ['titulo', 'conteudo'];

  /**
   * Verifica se o artigo é sobre um webinar ou evento online
   */
  canGenerate(context: SchemaGenerationContext): boolean {
    try {
      const { article } = context;
      const fullText = `${article.titulo} ${article.resumo} ${article.conteudo}`.toLowerCase();
      
      // Palavras-chave específicas para webinars/eventos online
      const webinarKeywords = [
        'webinar', 'evento online', 'live', 'transmissão ao vivo',
        'palestra virtual', 'workshop online', 'curso virtual',
        'evento virtual', 'encontro online', 'reunião virtual',
        'zoom', 'teams', 'meet', 'streaming', 'ao vivo',
        'inscrição online', 'participação virtual', 'acesso online'
      ];

      const hasWebinarKeywords = webinarKeywords.some(keyword => 
        fullText.includes(keyword)
      );

      // Verifica indicadores de formato online
      const onlineIndicators = [
        'link de acesso', 'sala virtual', 'plataforma online',
        'transmitido', 'gravação disponível', 'chat ao vivo',
        'interação online', 'perguntas e respostas', 'q&a',
        'certificado digital', 'participação remota'
      ];

      const hasOnlineIndicators = onlineIndicators.some(indicator => 
        fullText.includes(indicator)
      );

      // Verifica padrões de data/hora específicos de eventos
      const dateTimePatterns = [
        /\d{1,2}\/\d{1,2}\/\d{4}.*\d{1,2}[h:]\d{2}/,
        /\d{1,2} de \w+ de \d{4}/,
        /próximo \w+/, /na \w+-feira/,
        /horário.*brasília/i, /fuso horário/i
      ];

      const hasDateTime = dateTimePatterns.some(pattern => 
        pattern.test(fullText)
      );

      // Pontuação baseada em relevância
      let score = 0;
      if (hasWebinarKeywords) score += 4;
      if (hasOnlineIndicators) score += 3;
      if (hasDateTime) score += 2;      // Verifica categoria do artigo usando tags
      const tags = article.tags || [];
      if (tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes('evento'))) score += 2;
      if (tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes('curso'))) score += 1;

      console.log(`WebinarEvent relevance score: ${score}/10 for article "${article.titulo}"`);
      
      return score >= 5; // Threshold para consideração

    } catch (error) {
      console.error('Error in WebinarEventGenerator.canGenerate:', error);
      return false;
    }
  }

  /**
   * Gera o schema WebinarEvent
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    try {
      const { article } = context;
      
      // Obtém campos base do artigo
      const baseFields = this.generateBaseFields(context);
      
      // Extrai dados específicos do webinar
      const webinarData = this.extractWebinarData(context);
      
      // Extrai informações de localização virtual
      const virtualLocation = this.extractVirtualLocation(article.conteudo);
      
      // Extrai informações de preço/inscrição
      const offers = this.extractOffers(article.conteudo);
      
      // Extrai informações de organizador
      const organizer = this.extractOrganizer(article.conteudo);      // Construção do schema Event para webinar
      const schema = {
        ...baseFields,
        
        // Propriedades específicas de eventos online
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        
        // Localização virtual
        location: virtualLocation,
        
        // Modo de participação
        isAccessibleForFree: webinarData.accessType === 'free',
        
        // Audiência alvo
        audience: {
          '@type': 'Audience',
          audienceType: webinarData.targetAudience.join(', '),
          suggestedMinAge: this.extractMinAge(article.conteudo)
        },
        
        // Linguagem do evento
        inLanguage: webinarData.language,
        
        // Duração estimada
        duration: this.formatDuration(webinarData.duration),
        
        // Ofertas (gratuito, pago, inscrição)
        ...(offers && { offers }),
        
        // Organizador
        ...(organizer && { organizer }),
        
        // Propriedades adicionais para webinars
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Plataforma',
            value: webinarData.platform
          },
          {
            '@type': 'PropertyValue', 
            name: 'Tipo de Evento',
            value: webinarData.eventType
          },
          {
            '@type': 'PropertyValue',
            name: 'Gravação Disponível',
            value: webinarData.recordingAvailable ? 'Sim' : 'Não'
          },
          {
            '@type': 'PropertyValue',
            name: 'Nível de Interação',
            value: webinarData.interactionLevel
          },
          ...(webinarData.maxAttendees ? [{
            '@type': 'PropertyValue',
            name: 'Máximo de Participantes',
            value: webinarData.maxAttendees.toString()
          }] : []),
          ...(webinarData.certification ? [{
            '@type': 'PropertyValue',
            name: 'Certificação',
            value: 'Disponível'
          }] : [])
        ],

        // Tópicos abordados
        about: webinarData.topics.map(topic => ({
          '@type': 'Thing',
          name: topic
        })),

        // Pré-requisitos (se houver)
        ...(webinarData.prerequisites && webinarData.prerequisites.length > 0 && {
          requirements: webinarData.prerequisites.join('; ')
        })
      };      console.log(`Generated WebinarEvent schema for article "${article.titulo}"`);
      
      return {
        schema,
        schemaType: 'Event',
        confidence: this.calculateConfidence(webinarData),
        source: 'extractor',
        warnings: [],
        errors: [],
        performance: {
          generationTime: Date.now()
        }
      };} catch (error) {
      console.error('Error generating WebinarEvent schema:', error);
      throw error;
    }
  }

  /**
   * Extrai dados específicos do webinar do contexto
   */
  private extractWebinarData(context: SchemaGenerationContext): WebinarData {
    const { article } = context;
    const fullText = `${article.titulo} ${article.resumo} ${article.conteudo}`.toLowerCase();

    return {
      platform: this.extractPlatform(fullText),
      eventType: this.determineEventType(fullText),
      accessType: this.determineAccessType(fullText),
      duration: this.extractDuration(fullText),
      maxAttendees: this.extractMaxAttendees(fullText),
      language: 'pt-BR',
      recordingAvailable: this.checkRecordingAvailability(fullText),
      interactionLevel: this.determineInteractionLevel(fullText),
      topics: this.extractTopics(fullText),
      targetAudience: this.extractTargetAudience(fullText),
      prerequisites: this.extractPrerequisites(fullText),
      materials: this.extractMaterials(fullText),
      certification: this.checkCertification(fullText)
    };
  }

  /**
   * Extrai a plataforma do webinar
   */
  private extractPlatform(content: string): string {
    const platformPatterns = [
      { pattern: /zoom/i, name: 'Zoom' },
      { pattern: /teams/i, name: 'Microsoft Teams' },
      { pattern: /meet/i, name: 'Google Meet' },
      { pattern: /youtube/i, name: 'YouTube Live' },
      { pattern: /facebook.*live/i, name: 'Facebook Live' },
      { pattern: /instagram.*live/i, name: 'Instagram Live' },
      { pattern: /skype/i, name: 'Skype' },
      { pattern: /webex/i, name: 'Cisco Webex' },
      { pattern: /gotomeeting/i, name: 'GoToMeeting' }
    ];

    const foundPlatform = platformPatterns.find(p => p.pattern.test(content));
    return foundPlatform ? foundPlatform.name : 'Plataforma Online';
  }

  /**
   * Determina o tipo de evento
   */
  private determineEventType(content: string): WebinarData['eventType'] {
    if (content.includes('webinar')) return 'webinar';
    if (content.includes('live') || content.includes('ao vivo')) return 'live';
    if (content.includes('workshop')) return 'workshop';
    if (content.includes('palestra')) return 'palestra';
    if (content.includes('curso')) return 'curso';
    return 'webinar';
  }

  /**
   * Determina o tipo de acesso
   */
  private determineAccessType(content: string): WebinarData['accessType'] {
    if (content.includes('gratuito') || content.includes('grátis') || content.includes('free')) {
      return 'free';
    }
    if (content.includes('pago') || content.includes('investimento') || content.includes('valor')) {
      return 'paid';
    }
    return 'registration';
  }

  /**
   * Extrai duração do evento
   */
  private extractDuration(content: string): string {
    const durationPatterns = [
      /(\d+)\s*horas?/i,
      /(\d+)\s*h(\d+)?/i,
      /(\d+)\s*minutos?/i,
      /(\d+)\s*min/i
    ];

    for (const pattern of durationPatterns) {
      const match = content.match(pattern);
      if (match) {
        if (pattern.source.includes('hora')) {
          return `${match[1]} horas`;
        }
        if (pattern.source.includes('h')) {
          return match[2] ? `${match[1]}h${match[2]}` : `${match[1]} horas`;
        }
        if (pattern.source.includes('minuto')) {
          return `${match[1]} minutos`;
        }
      }
    }

    return '1 hora'; // Default
  }

  /**
   * Extrai número máximo de participantes
   */
  private extractMaxAttendees(content: string): number | undefined {
    const patterns = [
      /máximo.*(\d+).*participantes/i,
      /até.*(\d+).*pessoas/i,
      /limit[aed].*(\d+)/i,
      /vagas.*(\d+)/i
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        return parseInt(match[1], 10);
      }
    }

    return undefined;
  }

  /**
   * Verifica se gravação estará disponível
   */
  private checkRecordingAvailability(content: string): boolean {
    const recordingIndicators = [
      'gravação disponível', 'será gravado', 'replay disponível',
      'acesso posterior', 'gravação do evento', 'material gravado'
    ];

    return recordingIndicators.some(indicator => content.includes(indicator));
  }

  /**
   * Determina nível de interação
   */
  private determineInteractionLevel(content: string): WebinarData['interactionLevel'] {
    const highInteraction = [
      'perguntas e respostas', 'q&a', 'chat ao vivo', 'discussão', 
      'exercícios práticos', 'breakout rooms', 'grupos pequenos'
    ];

    const mediumInteraction = [
      'perguntas', 'chat', 'comentários', 'enquete', 'poll'
    ];

    if (highInteraction.some(indicator => content.includes(indicator))) {
      return 'high';
    }
    if (mediumInteraction.some(indicator => content.includes(indicator))) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Extrai tópicos do evento
   */
  private extractTopics(content: string): string[] {
    const topicPatterns = [
      /tópicos?:\s*(.+?)(?:\n|$)/i,
      /abordaremos:\s*(.+?)(?:\n|$)/i,
      /temas?:\s*(.+?)(?:\n|$)/i,
      /conteúdo:\s*(.+?)(?:\n|$)/i
    ];

    const topics: string[] = [];

    for (const pattern of topicPatterns) {
      const match = content.match(pattern);
      if (match) {
        const topicList = match[1]
          .split(/[,;]/)
          .map(topic => topic.trim())
          .filter(topic => topic.length > 0);
        topics.push(...topicList);
      }
    }

    // Tópicos específicos de psicologia
    const psychologyTopics = [
      'ansiedade', 'depressão', 'terapia cognitiva', 'mindfulness',
      'desenvolvimento pessoal', 'relacionamentos', 'autoestima',
      'estresse', 'saúde mental', 'bem-estar', 'emocional'
    ];

    psychologyTopics.forEach(topic => {
      if (content.includes(topic) && !topics.includes(topic)) {
        topics.push(topic);
      }
    });

    return topics.length > 0 ? topics.slice(0, 10) : ['Psicologia', 'Desenvolvimento Pessoal'];
  }

  /**
   * Extrai audiência alvo
   */
  private extractTargetAudience(content: string): string[] {
    const audiencePatterns = [
      /destinado.*?a:\s*(.+?)(?:\n|$)/i,
      /público.*?alvo:\s*(.+?)(?:\n|$)/i,
      /para:\s*(.+?)(?:\n|$)/i
    ];

    const defaultAudiences = ['Profissionais de Psicologia', 'Estudantes de Psicologia', 'Público em Geral'];
    
    for (const pattern of audiencePatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1]
          .split(/[,;]/)
          .map(audience => audience.trim())
          .filter(audience => audience.length > 0);
      }
    }

    return defaultAudiences;
  }

  /**
   * Extrai pré-requisitos
   */
  private extractPrerequisites(content: string): string[] | undefined {
    const prerequisitePatterns = [
      /pré-requisitos?:\s*(.+?)(?:\n|$)/i,
      /requisitos?:\s*(.+?)(?:\n|$)/i,
      /necessário:\s*(.+?)(?:\n|$)/i
    ];

    for (const pattern of prerequisitePatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1]
          .split(/[,;]/)
          .map(req => req.trim())
          .filter(req => req.length > 0);
      }
    }

    return undefined;
  }

  /**
   * Extrai materiais fornecidos
   */
  private extractMaterials(content: string): string[] | undefined {
    const materialPatterns = [
      /materiais?:\s*(.+?)(?:\n|$)/i,
      /inclusos?:\s*(.+?)(?:\n|$)/i,
      /você receberá:\s*(.+?)(?:\n|$)/i
    ];

    for (const pattern of materialPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1]
          .split(/[,;]/)
          .map(material => material.trim())
          .filter(material => material.length > 0);
      }
    }

    return undefined;
  }

  /**
   * Verifica se oferece certificação
   */
  private checkCertification(content: string): boolean {
    const certificationIndicators = [
      'certificado', 'certificação', 'diploma', 'comprovante',
      'atestado de participação', 'declaração'
    ];

    return certificationIndicators.some(indicator => content.includes(indicator));
  }

  /**
   * Extrai localização virtual
   */
  private extractVirtualLocation(content: string): object {
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = content.match(urlPattern);
    
    const eventUrl = urls?.find(url => 
      url.includes('zoom') || 
      url.includes('teams') || 
      url.includes('meet') ||
      url.includes('youtube') ||
      url.includes('facebook')
    );

    return {
      '@type': 'VirtualLocation',
      url: eventUrl || '#',
      name: 'Sala Virtual do Evento',
      description: 'Acesso online ao evento'
    };
  }

  /**
   * Extrai informações de ofertas/preços
   */
  private extractOffers(content: string): object | undefined {
    const pricePattern = /R\$\s*(\d+(?:[.,]\d{2})?)/g;
    const prices = content.match(pricePattern);
    
    if (content.includes('gratuito') || content.includes('grátis')) {
      return {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
        description: 'Evento gratuito'
      };
    }

    if (prices && prices.length > 0) {
      const price = prices[0].replace('R$', '').replace(',', '.').trim();
      return {
        '@type': 'Offer',
        price: price,
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock'
      };
    }

    return undefined;
  }

  /**
   * Extrai informações do organizador
   */
  private extractOrganizer(content: string): object | undefined {
    const organizerPatterns = [
      /organiz[aed].*?por:?\s*(.+?)(?:\n|$)/i,
      /promov[eid].*?por:?\s*(.+?)(?:\n|$)/i,
      /realiza[çcd]ão:?\s*(.+?)(?:\n|$)/i
    ];

    for (const pattern of organizerPatterns) {
      const match = content.match(pattern);
      if (match) {
        return {
          '@type': 'Organization',
          name: match[1].trim()
        };
      }
    }

    return {
      '@type': 'Organization',
      name: 'Dr. Daniel Dantas',
      description: 'Psicólogo especializado em desenvolvimento pessoal'
    };
  }

  /**
   * Extrai idade mínima sugerida
   */
  private extractMinAge(content: string): number | undefined {
    const agePattern = /idade.*?(\d+)/i;
    const match = content.match(agePattern);
    return match ? parseInt(match[1], 10) : undefined;
  }

  /**
   * Formata duração para ISO 8601
   */
  private formatDuration(duration: string): string {
    if (duration.includes('hora')) {
      const hours = duration.match(/(\d+)/)?.[1] || '1';
      return `PT${hours}H`;
    }
    if (duration.includes('minuto')) {
      const minutes = duration.match(/(\d+)/)?.[1] || '60';
      return `PT${minutes}M`;
    }
    return 'PT1H'; // Default 1 hora
  }

  /**
   * Calcula nível de confiança do schema gerado
   */
  private calculateConfidence(webinarData: WebinarData): number {
    let confidence = 0.6; // Base

    // Aumenta confiança baseada em dados extraídos
    if (webinarData.platform !== 'Plataforma Online') confidence += 0.1;
    if (webinarData.topics.length > 2) confidence += 0.1;
    if (webinarData.targetAudience.length > 1) confidence += 0.05;
    if (webinarData.maxAttendees) confidence += 0.05;
    if (webinarData.prerequisites) confidence += 0.05;
    if (webinarData.certification) confidence += 0.05;    return Math.min(confidence, 1.0);
  }
}

/**
 * Instância exportada do gerador
 */
export const webinarEventGenerator = new WebinarEventGenerator();
