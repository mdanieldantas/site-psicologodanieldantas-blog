/**
 * 🎭 GERADOR DE SCHEMA EVENT
 * 
 * Gerador específico para eventos genéricos (Schema.org Event).
 * Adequado para workshops, webinars, palestras e eventos educacionais.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Detecta tipo específico de evento
 * - Informações de localização virtual/física
 * - Dados de ofertas e preços
 * - Status e modo de participação
 * 
 * 🎯 CASOS DE USO:
 * - Workshops de psicologia
 * - Webinars educacionais
 * - Palestras e seminários
 * - Eventos de networking
 * 
 * 📊 DADOS UTILIZADOS:
 * - titulo: Nome do evento
 * - conteudo: Para detecção de tipo e descrição
 * - data_publicacao: Como data do evento
 * - url_video: Para eventos online
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - Event Generator
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
// 🎭 GERADOR EVENT
// ==========================================

/**
 * Gerador específico para Event schemas
 */
class EventGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'Event';
  protected readonly requiredFields: string[] = [
    'name',
    'startDate',
    'location'
  ];
  
  /**
   * Gera schema Event completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando Event para: ${article.titulo}`);
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Detecta tipo específico de evento
      const eventType = this.detectEventType(article.conteudo, article.titulo);
      
      // Determina modo de participação
      const attendanceMode = this.determineAttendanceMode(article.conteudo, article.url_video);
      
      // Gera localização
      const location = this.generateLocation(article.url_video, attendanceMode);
      
      // Extrai duração estimada
      const duration = this.estimateEventDuration(article.conteudo);
      
      // Construção do schema Event
      const schema = {
        ...baseFields,
        '@type': eventType,
        
        // Datas do evento
        startDate: this.generateStartDate(article.data_publicacao),
        endDate: this.generateEndDate(article.data_publicacao, duration),
        
        // Localização (virtual ou física)
        location: location,
        
        // Modo de participação
        eventAttendanceMode: attendanceMode,
        
        // Status do evento
        eventStatus: this.determineEventStatus(article.status),
        
        // Duração se calculada
        ...(duration && { duration: duration }),
        
        // Organizador
        organizer: {
          '@type': 'Person',
          name: article.autor_principal,
          url: 'https://psicologodanieldantas.com.br'
        },
        
        // Audiência
        audience: this.determineEventAudience(article.conteudo),
        
        // Ofertas se for evento pago
        ...(this.isPaidEvent(article.conteudo) && {
          offers: this.generateEventOffers(article.conteudo)
        }),
        
        // Performer se aplicável
        ...(this.hasPerformer(article.conteudo) && {
          performer: {
            '@type': 'Person',
            name: article.autor_principal
          }
        }),
        
        // Categoria do evento
        eventType: this.mapCategoryToEventType(article.categoria_principal),
        
        // Acessibilidade
        isAccessibleForFree: article.content_tier === 'free'
      };
      
      // Validação e warnings
      const warnings = this.validateSchema(schema);
      this.addEventWarnings(warnings, article);
      
      this.log('info', `Event gerado com tipo: ${eventType}`, {
        type: eventType,
        attendanceMode: attendanceMode,
        duration: duration,
        hasOffers: !!schema.offers,
        eventCategory: schema.eventType
      });
      
      return this.createResult(schema, context, startTime, warnings);
      
    } catch (error) {
      const errorMsg = `Erro ao gerar Event: ${error}`;
      this.log('error', errorMsg);
      return this.createResult({}, context, startTime, [], [errorMsg]);
    }
  }
  
  /**
   * Detecta o tipo específico de evento
   */
  private detectEventType(content: string, titulo: string): string {
    const contentLower = content.toLowerCase();
    const tituloLower = titulo.toLowerCase();
    const combinedText = `${tituloLower} ${contentLower}`;
    
    // Mapeamento de tipos de evento
    const eventTypes = {
      'EducationEvent': [
        'curso', 'aula', 'workshop', 'palestra', 'seminário',
        'treinamento', 'capacitação', 'formação', 'aprendizado'
      ],
      'WorkshopEvent': [
        'workshop', 'oficina', 'prática', 'hands-on',
        'atividade prática', 'exercício'
      ],
      'LectureEvent': [
        'palestra', 'conferência', 'apresentação',
        'exposição', 'fala', 'discurso'
      ],
      'BusinessEvent': [
        'networking', 'negócios', 'profissional',
        'corporativo', 'empresarial', 'reunião'
      ],
      'TheaterEvent': [
        'teatro', 'peça', 'drama', 'performance',
        'representação', 'encenação'
      ],
      'MusicEvent': [
        'música', 'musical', 'concerto', 'show',
        'apresentação musical', 'recital'
      ],
      'SportsEvent': [
        'esporte', 'competição', 'torneio',
        'campeonato', 'jogo', 'partida'
      ],
      'SaleEvent': [
        'venda', 'promoção', 'desconto', 'oferta',
        'liquidação', 'black friday'
      ]
    };
    
    // Verifica cada tipo
    for (const [type, terms] of Object.entries(eventTypes)) {
      const matches = terms.filter(term => combinedText.includes(term)).length;
      if (matches >= 1) {
        return type;
      }
    }
    
    // Para psicologia, default para EducationEvent
    if (combinedText.includes('psicologia') || combinedText.includes('terapia')) {
      return 'EducationEvent';
    }
    
    // Default
    return 'Event';
  }
  
  /**
   * Determina o modo de participação do evento
   */
  private determineAttendanceMode(content: string, urlVideo?: string | null): string {
    const contentLower = content.toLowerCase();
    
    // Indicadores de evento online
    const onlineIndicators = [
      'online', 'virtual', 'zoom', 'meet', 'webinar',
      'streaming', 'transmissão', 'ao vivo', 'live'
    ];
    
    // Indicadores de evento presencial
    const offlineIndicators = [
      'presencial', 'local', 'endereço', 'sala',
      'auditório', 'centro', 'instituto', 'clínica'
    ];
    
    // Indicadores de evento misto
    const mixedIndicators = [
      'híbrido', 'misto', 'presencial e online',
      'virtual e presencial', 'duas modalidades'
    ];
    
    // Verifica URL de vídeo
    if (urlVideo) {
      const hasOfflineTerms = offlineIndicators.some(term => 
        contentLower.includes(term)
      );
      
      return hasOfflineTerms ? 
        'https://schema.org/MixedEventAttendanceMode' :
        'https://schema.org/OnlineEventAttendanceMode';
    }
    
    // Verifica termos no conteúdo
    if (mixedIndicators.some(term => contentLower.includes(term))) {
      return 'https://schema.org/MixedEventAttendanceMode';
    }
    
    if (onlineIndicators.some(term => contentLower.includes(term))) {
      return 'https://schema.org/OnlineEventAttendanceMode';
    }
    
    if (offlineIndicators.some(term => contentLower.includes(term))) {
      return 'https://schema.org/OfflineEventAttendanceMode';
    }
    
    // Default para online se não especificado (contexto de blog)
    return 'https://schema.org/OnlineEventAttendanceMode';
  }
  
  /**
   * Gera informações de localização
   */
  private generateLocation(urlVideo?: string | null, attendanceMode?: string): any {
    const locations = [];
    
    // Localização virtual se há URL de vídeo
    if (urlVideo && (
      attendanceMode?.includes('Online') || 
      attendanceMode?.includes('Mixed')
    )) {
      locations.push({
        '@type': 'VirtualLocation',
        url: urlVideo,
        name: 'Transmissão Online'
      });
    }
    
    // Localização física padrão (consultório/clínica)
    if (attendanceMode?.includes('Offline') || attendanceMode?.includes('Mixed')) {
      locations.push({
        '@type': 'Place',
        name: 'Consultório Dr. Daniel Dantas',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'São Paulo',
          addressRegion: 'SP',
          addressCountry: 'BR'
        },
        url: 'https://psicologodanieldantas.com.br'
      });
    }
    
    // Se apenas online e sem URL específica
    if (locations.length === 0) {
      locations.push({
        '@type': 'VirtualLocation',
        url: 'https://psicologodanieldantas.com.br',
        name: 'Evento Online'
      });
    }
    
    return locations.length === 1 ? locations[0] : locations;
  }
  
  /**
   * Estima duração do evento baseado no conteúdo
   */
  private estimateEventDuration(content: string): string | null {
    const contentLower = content.toLowerCase();
    
    // Padrões de duração explícita
    const durationPatterns = [
      /(\d+)\s*hora?s?/g,
      /(\d+)\s*minutos?/g,
      /(\d+)h(\d+)m?/g,
      /(\d+)h(\d+)?/g
    ];
    
    for (const pattern of durationPatterns) {
      const match = contentLower.match(pattern);
      if (match) {
        // Extrai números e converte para ISO 8601
        const hours = match[0].includes('hora') ? 
          parseInt(match[0].match(/\d+/)?.[0] || '0') : 0;
        const minutes = match[0].includes('minuto') ? 
          parseInt(match[0].match(/\d+/)?.[0] || '0') : 0;
        
        if (hours > 0 || minutes > 0) {
          return `PT${hours > 0 ? hours + 'H' : ''}${minutes > 0 ? minutes + 'M' : ''}`;
        }
      }
    }
    
    // Estimativas baseadas no tipo de evento
    if (contentLower.includes('workshop')) return 'PT3H';
    if (contentLower.includes('palestra')) return 'PT1H30M';
    if (contentLower.includes('curso')) return 'PT8H';
    if (contentLower.includes('webinar')) return 'PT1H';
    if (contentLower.includes('reunião')) return 'PT2H';
    
    return null;
  }
  
  /**
   * Gera data de início do evento
   */
  private generateStartDate(dataPublicacao?: string | null): string {
    if (dataPublicacao) {
      const date = new Date(dataPublicacao);
      // Ajusta para uma data futura (adiciona 7 dias)
      date.setDate(date.getDate() + 7);
      return date.toISOString();
    }
    
    // Default: próxima semana
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString();
  }
  
  /**
   * Gera data de fim baseada na duração
   */
  private generateEndDate(dataPublicacao?: string | null, duration?: string | null): string {
    const startDate = new Date(this.generateStartDate(dataPublicacao));
    
    if (duration) {
      // Parse ISO 8601 duration (PT1H30M)
      const hourMatch = duration.match(/(\d+)H/);
      const minuteMatch = duration.match(/(\d+)M/);
      
      const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
      const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
      
      startDate.setHours(startDate.getHours() + hours);
      startDate.setMinutes(startDate.getMinutes() + minutes);
    } else {
      // Default: adiciona 2 horas
      startDate.setHours(startDate.getHours() + 2);
    }
    
    return startDate.toISOString();
  }
  
  /**
   * Determina status do evento
   */
  private determineEventStatus(articleStatus: string): string {
    switch (articleStatus) {
      case 'published':
        return 'https://schema.org/EventScheduled';
      case 'draft':
        return 'https://schema.org/EventPostponed';
      default:
        return 'https://schema.org/EventScheduled';
    }
  }
  
  /**
   * Determina audiência do evento
   */
  private determineEventAudience(content: string): any {
    const contentLower = content.toLowerCase();
    
    // Audiência profissional
    if (contentLower.includes('psicólogo') || contentLower.includes('terapeuta')) {
      return {
        '@type': 'ProfessionalAudience',
        audienceType: 'Mental Health Professionals'
      };
    }
    
    // Audiência estudantil
    if (contentLower.includes('estudante') || contentLower.includes('acadêmico')) {
      return {
        '@type': 'EducationalAudience',
        educationalRole: 'student'
      };
    }
    
    // Audiência geral
    return {
      '@type': 'Audience',
      audienceType: 'General Public'
    };
  }
  
  /**
   * Verifica se é evento pago
   */
  private isPaidEvent(content: string): boolean {
    const contentLower = content.toLowerCase();
    const paidIndicators = [
      'preço', 'valor', 'ingresso', 'inscrição',
      'pagamento', 'taxa', 'investimento', 'R$', 'reais'
    ];
    
    return paidIndicators.some(indicator => contentLower.includes(indicator));
  }
  
  /**
   * Gera ofertas do evento
   */
  private generateEventOffers(content: string): any {
    const contentLower = content.toLowerCase();
    
    // Extrai preços mencionados
    const pricePattern = /R\$\s*(\d+(?:,\d{2})?)/g;
    const priceMatches = content.match(pricePattern);
    
    if (priceMatches && priceMatches.length > 0) {
      return priceMatches.map((priceStr, index) => {
        const price = priceStr.replace('R$', '').replace(',', '.');
        
        return {
          '@type': 'Offer',
          price: price,
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock',
          url: 'https://psicologodanieldantas.com.br/inscricoes',
          validFrom: new Date().toISOString(),
          name: index === 0 ? 'Inscrição Regular' : `Opção ${index + 1}`
        };
      });
    }
    
    // Oferta genérica se não há preço específico
    return [{
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: 'https://psicologodanieldantas.com.br/inscricoes',
      validFrom: new Date().toISOString(),
      name: 'Inscrição Gratuita'
    }];
  }
  
  /**
   * Verifica se há performer mencionado
   */
  private hasPerformer(content: string): boolean {
    const contentLower = content.toLowerCase();
    const performerIndicators = [
      'palestrante', 'apresentador', 'instrutor',
      'facilitador', 'convidado', 'especialista'
    ];
    
    return performerIndicators.some(indicator => contentLower.includes(indicator));
  }
  
  /**
   * Mapeia categoria para tipo de evento
   */
  private mapCategoryToEventType(categoria?: string): string {
    if (!categoria) return 'Educational';
    
    const categoriaLower = categoria.toLowerCase();
    
    if (categoriaLower.includes('psicologia')) return 'Psychology';
    if (categoriaLower.includes('saúde')) return 'Health';
    if (categoriaLower.includes('educação')) return 'Educational';
    if (categoriaLower.includes('negócios')) return 'Business';
    if (categoriaLower.includes('tecnologia')) return 'Technology';
    
    return 'Educational';
  }
  
  /**
   * Adiciona warnings específicos para eventos
   */
  private addEventWarnings(warnings: string[], article: any): void {
    // Verifica datas
    if (!article.data_publicacao) {
      warnings.push('Data de publicação recomendada para calcular data do evento');
    }
    
    // Verifica localização
    if (!article.url_video) {
      warnings.push('URL de vídeo recomendada para eventos online');
    }
    
    // Verifica duração
    const content = article.conteudo.toLowerCase();
    if (!content.includes('hora') && !content.includes('minuto') && !content.includes('duração')) {
      warnings.push('Especificar duração do evento melhora a experiência do usuário');
    }
    
    // Verifica informações de inscrição
    if (!content.includes('inscrição') && !content.includes('participar')) {
      warnings.push('Informações sobre como participar/se inscrever recomendadas');
    }
    
    // Verifica acessibilidade
    if (article.content_tier === 'premium' && !content.includes('preço')) {
      warnings.push('Evento premium deve especificar informações de preço');
    }
  }
}

/**
 * Instância exportada do gerador
 */
export const eventGenerator = new EventGenerator();

// Export da classe para uso em imports nomeados
export { EventGenerator };
