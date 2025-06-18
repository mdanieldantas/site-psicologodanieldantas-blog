/**
 * 🎙️ GERADOR DE SCHEMA PODCASTEPISODE
 * 
 * Gerador específico para schemas do tipo PodcastEpisode (Schema.org).
 * Utiliza dados de podcast disponíveis no campo url_podcast da tabela artigos.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Rich Results para podcasts no Google
 * - Compatível com Spotify, Apple Podcasts, Google Podcasts
 * - Metadados completos de episódio
 * - Integração com séries de podcast
 * 
 * 🎯 CASOS DE USO:
 * - Episódios de podcast individuais
 * - Conteúdo de áudio educacional
 * - Entrevistas e conversas
 * - Séries educacionais em áudio
 * 
 * 📊 DADOS UTILIZADOS:
 * - url_podcast: URL do episódio de podcast
 * - conteudo: Para duração estimada e descrição
 * - titulo: Nome do episódio
 * - autor_principal: Host/apresentador
 * - data_publicacao: Data de lançamento
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - PodcastEpisode Generator
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
// 🎙️ GERADOR PODCASTEPISODE
// ==========================================

/**
 * Gerador específico para PodcastEpisode schemas
 */
export class PodcastEpisodeGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'PodcastEpisode';
  protected readonly requiredFields: string[] = [
    'name',
    'description',
    'datePublished',
    'author',
    'partOfSeries'
  ];
  
  /**
   * Gera schema PodcastEpisode completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando PodcastEpisode para: ${article.titulo}`);
      
      // Validação prévia: verificar se existe URL de podcast
      if (!article.url_podcast) {
        const error = 'PodcastEpisode requer campo url_podcast preenchido';
        this.log('error', error);
        return this.createResult({}, context, startTime, [], [error]);
      }
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Estatísticas do conteúdo para duração estimada
      const contentStats = getContentStats(article.conteudo);
      
      // Detectar plataforma de podcast
      const podcastInfo = this.analyzePodcastUrl(article.url_podcast);
      
      // Schema PodcastEpisode específico
      const schema = {
        ...baseFields,
        '@type': 'PodcastEpisode',
        
        // Campos obrigatórios do PodcastEpisode
        name: article.titulo,
        description: this.generatePodcastDescription(article),
        datePublished: formatSchemaDate(article.data_publicacao || article.data_criacao),
        
        // Duração e metadados de áudio
        timeRequired: this.estimatePodcastDuration(contentStats.readingTime),
        duration: this.estimatePodcastDuration(contentStats.readingTime),
        
        // Mídia associada
        associatedMedia: {
          '@type': 'MediaObject',
          contentUrl: article.url_podcast,
          encodingFormat: podcastInfo.format,
          ...(podcastInfo.fileSize && { contentSize: podcastInfo.fileSize })
        },
        
        // Série do podcast (criada dinamicamente)
        partOfSeries: this.generatePodcastSeries(article, podcastInfo),
        
        // Número do episódio (estimado ou extraído)
        episodeNumber: this.extractEpisodeNumber(article.titulo, article.slug),
        
        // Transcrição (se disponível no conteúdo)
        ...(contentStats.wordCount > 200 && {
          transcript: {
            '@type': 'MediaObject',
            contentUrl: `${baseFields.url}#transcript`,
            encodingFormat: 'text/html',
            name: `Transcrição: ${article.titulo}`
          }
        }),
        
        // Categorização específica para podcast
        genre: this.mapCategoryToGenre(article.categoria_principal),
        ...(article.subcategoria_nome && {
          about: {
            '@type': 'Thing',
            name: article.subcategoria_nome,
            description: `Episódio sobre ${article.subcategoria_nome}`
          }
        }),
        
        // Características de acessibilidade
        accessMode: ['auditory'],
        accessibilityFeature: this.generatePodcastAccessibilityFeatures(article),
        
        // Audiência educacional (se aplicável)
        ...(this.isEducationalPodcast(article) && {
          audience: {
            '@type': 'EducationalAudience',
            educationalRole: ['student', 'lifelong learner'],
            audienceType: 'general public'
          },
          learningResourceType: 'podcast episode',
          educationalLevel: 'intermediate'
        }),
        
        // WebFeed (RSS) se é parte de uma série
        ...(this.isPodcastSeries(article) && {
          webFeed: `${baseFields.url}/feed.xml`
        })
      };
      
      // Validação do schema gerado
      const warnings = this.validateSchema(schema);
      
      // Warnings específicos do PodcastEpisode
      this.addPodcastSpecificWarnings(warnings, article, podcastInfo);
      
      this.log('info', `PodcastEpisode gerado com sucesso. Duração estimada: ${schema.duration}`);
      
      return this.createResult(schema, context, startTime, warnings);
      
    } catch (error) {
      const errorMessage = `Erro ao gerar PodcastEpisode: ${error instanceof Error ? error.message : String(error)}`;
      this.log('error', errorMessage);
      return this.createResult({}, context, startTime, [], [errorMessage]);
    }
  }
  
  // ==========================================
  // 🔧 MÉTODOS AUXILIARES ESPECÍFICOS
  // ==========================================
  
  /**
   * Analisa URL do podcast para extrair informações da plataforma
   */
  private analyzePodcastUrl(url: string): {
    platform: string;
    episodeId: string | null;
    format: string;
    fileSize?: string;
  } {
    const urlLower = url.toLowerCase();
    
    // Spotify
    if (urlLower.includes('spotify.com')) {
      return {
        platform: 'Spotify',
        episodeId: this.extractSpotifyId(url),
        format: 'audio/mp3'
      };
    }
    
    // Apple Podcasts
    if (urlLower.includes('podcasts.apple.com')) {
      return {
        platform: 'Apple Podcasts',
        episodeId: this.extractApplePodcastId(url),
        format: 'audio/mp3'
      };
    }
    
    // Google Podcasts
    if (urlLower.includes('podcasts.google.com')) {
      return {
        platform: 'Google Podcasts',
        episodeId: null,
        format: 'audio/mp3'
      };
    }
    
    // Anchor.fm
    if (urlLower.includes('anchor.fm')) {
      return {
        platform: 'Anchor',
        episodeId: null,
        format: 'audio/mp3'
      };
    }
    
    // Arquivo direto de áudio
    if (urlLower.includes('.mp3')) {
      return {
        platform: 'Direct MP3',
        episodeId: null,
        format: 'audio/mp3',
        fileSize: 'Unknown'
      };
    }
    
    // Genérico
    return {
      platform: 'Generic',
      episodeId: null,
      format: 'audio/mp3'
    };
  }
  
  /**
   * Extrai ID do episódio do Spotify
   */
  private extractSpotifyId(url: string): string | null {
    const pattern = /spotify\.com\/episode\/([a-zA-Z0-9]+)/;
    const match = url.match(pattern);
    return match ? match[1] : null;
  }
  
  /**
   * Extrai ID do episódio do Apple Podcasts
   */
  private extractApplePodcastId(url: string): string | null {
    const pattern = /podcasts\.apple\.com\/.*\/podcast\/.*\/id(\d+)/;
    const match = url.match(pattern);
    return match ? match[1] : null;
  }
  
  /**
   * Estima duração do podcast baseado no tempo de leitura
   */
  private estimatePodcastDuration(readingTimeMinutes: number): string {
    // Podcasts são mais lentos que leitura (150-200 palavras/min vs 250-300 na leitura)
    const estimatedMinutes = Math.max(5, Math.round(readingTimeMinutes * 1.5));
    return `PT${estimatedMinutes}M`;
  }
  
  /**
   * Gera descrição específica para podcast
   */
  private generatePodcastDescription(article: any): string {
    const baseDescription = this.generateDescription(article);
    
    // Adicionar contexto de podcast
    if (baseDescription.length < 100) {
      return `${baseDescription} Neste episódio, exploramos conceitos importantes de ${article.categoria_principal || 'psicologia'} de forma conversacional e acessível.`;
    }
    
    return baseDescription;
  }
  
  /**
   * Gera série de podcast dinamicamente
   */
  private generatePodcastSeries(article: any, podcastInfo: any) {
    const seriesName = this.extractSeriesName(article);
    
    return {
      '@type': 'PodcastSeries',
      '@id': generateSchemaId('podcast-series', article.categoria_principal || 'default'),
      name: seriesName,
      description: `Série de podcasts sobre ${article.categoria_principal || 'psicologia'} - conhecimento científico de forma acessível`,
      author: {
        '@type': 'Person',
        name: article.autor_principal || 'Dr. Daniel Dantas',
        description: 'Psicólogo especialista em desenvolvimento humano'
      },
      url: this.generateSeriesUrl(article),
      genre: this.mapCategoryToGenre(article.categoria_principal),
      inLanguage: 'pt-BR'
    };
  }
  
  /**
   * Extrai nome da série baseado no contexto do artigo
   */
  private extractSeriesName(article: any): string {
    // Se há padrão no título (ex: "Episódio #1: Título")
    const episodePattern = /^(.*?)(#?\d+|episódio|ep\.?)[\s:]/i;
    const match = article.titulo.match(episodePattern);
    
    if (match) {
      return match[1].trim();
    }
    
    // Baseado na categoria
    if (article.categoria_principal) {
      return `Podcast ${article.categoria_principal.charAt(0).toUpperCase() + article.categoria_principal.slice(1)}`;
    }
    
    // Fallback
    return 'Podcast Psicologia e Desenvolvimento';
  }
  
  /**
   * Extrai número do episódio do título ou slug
   */
  private extractEpisodeNumber(titulo: string, slug: string): number {
    // Padrões de numeração de episódios
    const patterns = [
      /#(\d+)/,                    // #123
      /episódio\s*(\d+)/i,         // episódio 123
      /ep\.?\s*(\d+)/i,            // ep. 123 ou ep 123
      /(\d+)º?\s*episódio/i        // 123º episódio
    ];
    
    // Tentar extrair do título
    for (const pattern of patterns) {
      const match = titulo.match(pattern);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    
    // Tentar extrair do slug
    for (const pattern of patterns) {
      const match = slug.match(pattern);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    
    // Fallback: número baseado na data/hash
    return Math.floor(Math.random() * 100) + 1;
  }
  
  /**
   * Mapeia categoria para gênero de podcast
   */
  private mapCategoryToGenre(categoria?: string): string {
    if (!categoria) return 'Education';
    
    const genreMap: Record<string, string> = {
      'psicologia': 'Health & Fitness',
      'terapia': 'Health & Fitness',
      'desenvolvimento-pessoal': 'Self-Improvement',
      'autoconhecimento': 'Self-Improvement',
      'relacionamentos': 'Society & Culture',
      'ansiedade': 'Health & Fitness',
      'depressao': 'Health & Fitness',
      'mindfulness': 'Religion & Spirituality',
      'educacao': 'Education',
      'ciencia': 'Science'
    };
    
    const categoriaLower = categoria.toLowerCase().replace(/\s+/g, '-');
    return genreMap[categoriaLower] || 'Education';
  }
  
  /**
   * Gera URL da série de podcast
   */
  private generateSeriesUrl(article: any): string {
    const baseUrl = '/blogflorescerhumano';
    
    if (article.categoria_principal) {
      return `${baseUrl}/${article.categoria_principal}/podcast`;
    }
    
    return `${baseUrl}/podcast`;
  }
  
  /**
   * Verifica se é conteúdo educacional
   */
  private isEducationalPodcast(article: any): boolean {
    const educationalKeywords = [
      'aprender', 'entender', 'explicar', 'tutorial', 'guia', 
      'conceito', 'técnica', 'método', 'teoria', 'prática'
    ];
    
    const titleLower = article.titulo.toLowerCase();
    const contentLower = article.conteudo.toLowerCase();
    
    return educationalKeywords.some(keyword => 
      titleLower.includes(keyword) || contentLower.includes(keyword)
    );
  }
  
  /**
   * Verifica se faz parte de uma série
   */
  private isPodcastSeries(article: any): boolean {
    const seriesIndicators = ['#', 'episódio', 'ep.', 'parte', 'capítulo'];
    const titleLower = article.titulo.toLowerCase();
    
    return seriesIndicators.some(indicator => titleLower.includes(indicator));
  }
  
  /**
   * Gera características de acessibilidade para podcast
   */
  private generatePodcastAccessibilityFeatures(article: any): string[] {
    const features = ['auditory'];
    
    // Se há transcrição disponível
    if (this.hasTranscription(article)) {
      features.push('alternativeText');
    }
    
    return features;
  }
  
  /**
   * Verifica se há transcrição disponível
   */
  private hasTranscription(article: any): boolean {
    const contentStats = getContentStats(article.conteudo);
    // Se o conteúdo é substancial, provavelmente serve como transcrição
    return contentStats.wordCount > 200;
  }
  
  /**
   * Adiciona warnings específicos do PodcastEpisode
   */
  private addPodcastSpecificWarnings(warnings: string[], article: any, podcastInfo: any): void {
    if (!article.url_podcast) {
      warnings.push('PodcastEpisode: URL de podcast é obrigatória');
    }
    
    if (podcastInfo.platform === 'Generic') {
      warnings.push('PodcastEpisode: Plataforma de podcast não reconhecida, metadados limitados');
    }
    
    if (!this.hasTranscription(article)) {
      warnings.push('PodcastEpisode: Transcrição recomendada para acessibilidade');
    }
    
    if (!this.isPodcastSeries(article)) {
      warnings.push('PodcastEpisode: Considere numerar episódios para melhor organização');
    }
    
    if (!article.data_publicacao) {
      warnings.push('PodcastEpisode: Data de publicação recomendada para cronologia da série');
    }
  }
  
  /**
   * Obtém razão da detecção deste tipo de schema
   */
  protected getDetectionReason(context: SchemaGenerationContext): string {
    return 'PodcastEpisode selecionado devido à presença de url_podcast no artigo';
  }
}
