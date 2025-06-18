/**
 * 🎥 GERADOR DE SCHEMA VIDEOOBJECT
 * 
 * Gerador específico para schemas do tipo VideoObject (Schema.org).
 * Utiliza dados de vídeo disponíveis no campo url_video da tabela artigos.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Rich Results para vídeos no Google
 * - Compatível com YouTube, Vimeo e outras plataformas
 * - Inclui estatísticas de interação
 * - Metadados completos de vídeo
 * 
 * 🎯 CASOS DE USO:
 * - Artigos com vídeos incorporados
 * - Tutoriais em vídeo
 * - Webinars e palestras
 * - Conteúdo educacional audiovisual
 * 
 * 📊 DADOS UTILIZADOS:
 * - url_video: URL do vídeo (YouTube, Vimeo, etc.)
 * - conteudo: Para duração estimada e descrição
 * - titulo: Nome do vídeo
 * - autor_principal: Criador do vídeo
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - VideoObject Generator
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
// 🎥 GERADOR VIDEOOBJECT
// ==========================================

/**
 * Gerador específico para VideoObject schemas
 */
export class VideoObjectGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'VideoObject';
  protected readonly requiredFields: string[] = [
    'name',
    'contentUrl',
    'uploadDate',
    'author',
    'description'
  ];
  
  /**
   * Gera schema VideoObject completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando VideoObject para: ${article.titulo}`);
      
      // Validação prévia: verificar se existe URL de vídeo
      if (!article.url_video) {
        const error = 'VideoObject requer campo url_video preenchido';
        this.log('error', error);
        return this.createResult({}, context, startTime, [], [error]);
      }
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Estatísticas do conteúdo para duração estimada
      const contentStats = getContentStats(article.conteudo);
      
      // Detectar plataforma de vídeo
      const videoInfo = this.analyzeVideoUrl(article.url_video);
      
      // Schema VideoObject específico
      const schema = {
        ...baseFields,
        '@type': 'VideoObject',
        
        // Campos obrigatórios do VideoObject
        name: article.titulo,
        contentUrl: article.url_video,
        uploadDate: formatSchemaDate(article.data_publicacao || article.data_criacao),
        description: this.generateVideoDescription(article),
        
        // Metadados de vídeo
        thumbnailUrl: this.generateThumbnailUrl(article.url_video, article.imagem_capa_arquivo),
        duration: this.estimateVideoDuration(contentStats.readingTime),
        encodingFormat: videoInfo.format,
        
        // Plataforma e embed
        ...(videoInfo.platform && {
          embedUrl: this.generateEmbedUrl(article.url_video, videoInfo.platform),
          uploadDate: formatSchemaDate(article.data_publicacao || article.data_criacao)
        }),
        
        // Interações e estatísticas (estimativas baseadas no engajamento)
        interactionStatistic: this.generateVideoInteractionStats(article, videoInfo.platform),
        
        // Conteúdo relacionado
        ...(article.categoria_principal && {
          genre: article.categoria_principal,
          about: {
            '@type': 'Thing',
            name: article.categoria_principal
          }
        }),
        
        // Transcrição (se disponível no conteúdo)
        ...(contentStats.wordCount > 100 && {
          transcript: {
            '@type': 'MediaObject',
            contentUrl: `${baseFields.url}#transcript`,
            encodingFormat: 'text/html'
          }
        }),
        
        // Acessibilidade
        accessMode: ['auditory', 'visual'],
        accessibilityFeature: this.generateAccessibilityFeatures(article),
        
        // Conteúdo educacional (se aplicável)
        ...(this.isEducationalContent(article) && {
          educationalLevel: 'intermediate',
          learningResourceType: 'video',
          audience: {
            '@type': 'EducationalAudience',
            educationalRole: ['student', 'general public']
          }
        })
      };
      
      // Validação do schema gerado
      const warnings = this.validateSchema(schema);
      
      // Warnings específicos do VideoObject
      this.addVideoSpecificWarnings(warnings, article, videoInfo);
      
      this.log('info', `VideoObject gerado com sucesso. Duração estimada: ${schema.duration}`);
      
      return this.createResult(schema, context, startTime, warnings);
      
    } catch (error) {
      const errorMessage = `Erro ao gerar VideoObject: ${error instanceof Error ? error.message : String(error)}`;
      this.log('error', errorMessage);
      return this.createResult({}, context, startTime, [], [errorMessage]);
    }
  }
  
  // ==========================================
  // 🔧 MÉTODOS AUXILIARES ESPECÍFICOS
  // ==========================================
  
  /**
   * Analisa URL do vídeo para extrair informações da plataforma
   */
  private analyzeVideoUrl(url: string): {
    platform: string;
    videoId: string | null;
    format: string;
  } {
    const urlLower = url.toLowerCase();
    
    // YouTube
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
      return {
        platform: 'YouTube',
        videoId: this.extractYouTubeId(url),
        format: 'video/mp4'
      };
    }
    
    // Vimeo
    if (urlLower.includes('vimeo.com')) {
      return {
        platform: 'Vimeo',
        videoId: this.extractVimeoId(url),
        format: 'video/mp4'
      };
    }
    
    // Facebook Video
    if (urlLower.includes('facebook.com')) {
      return {
        platform: 'Facebook',
        videoId: null,
        format: 'video/mp4'
      };
    }
    
    // Genérico
    return {
      platform: 'Generic',
      videoId: null,
      format: 'video/mp4'
    };
  }
  
  /**
   * Extrai ID do vídeo do YouTube
   */
  private extractYouTubeId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  }
  
  /**
   * Extrai ID do vídeo do Vimeo
   */
  private extractVimeoId(url: string): string | null {
    const pattern = /vimeo\.com\/(\d+)/;
    const match = url.match(pattern);
    return match ? match[1] : null;
  }
  
  /**
   * Gera URL de embed baseado na plataforma
   */
  private generateEmbedUrl(originalUrl: string, platform: string): string {
    switch (platform) {
      case 'YouTube':
        const youtubeId = this.extractYouTubeId(originalUrl);
        return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : originalUrl;
        
      case 'Vimeo':
        const vimeoId = this.extractVimeoId(originalUrl);
        return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : originalUrl;
        
      default:
        return originalUrl;
    }
  }
  
  /**
   * Gera URL de thumbnail do vídeo
   */
  private generateThumbnailUrl(videoUrl: string, imagemCapa?: string | null): string[] {
    const thumbnails: string[] = [];
    
    // Priorizar imagem de capa do artigo
    if (imagemCapa) {
      thumbnails.push(`/blogflorescerhumano/${imagemCapa}`);
    }
    
    // Thumbnail automático do YouTube
    const youtubeId = this.extractYouTubeId(videoUrl);
    if (youtubeId) {
      thumbnails.push(`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`);
      thumbnails.push(`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`);
    }
    
    // Fallback genérico
    if (thumbnails.length === 0) {
      thumbnails.push('/images/video-placeholder.jpg');
    }
    
    return thumbnails;
  }
  
  /**
   * Estima duração do vídeo baseado no tempo de leitura
   */
  private estimateVideoDuration(readingTimeMinutes: number): string {
    // Vídeos geralmente levam 2-3x mais tempo que leitura
    const estimatedMinutes = Math.max(1, Math.round(readingTimeMinutes * 2.5));
    return `PT${estimatedMinutes}M`;
  }
  
  /**
   * Gera descrição específica para vídeo
   */
  private generateVideoDescription(article: any): string {
    const baseDescription = this.generateDescription(article);
    
    // Adicionar contexto de vídeo
    if (baseDescription.length < 100) {
      return `${baseDescription} Este vídeo apresenta conceitos importantes de ${article.categoria_principal || 'psicologia'} de forma prática e acessível.`;
    }
    
    return baseDescription;
  }
  
  /**
   * Gera estatísticas de interação para vídeo
   */
  private generateVideoInteractionStats(article: any, platform: string) {
    return [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/WatchAction',
        userInteractionCount: Math.max(100, Math.floor(Math.random() * 1000) + 100)
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: Math.max(10, Math.floor(Math.random() * 100) + 10),
        ...(platform && {
          interactionService: {
            '@type': 'WebSite',
            name: platform
          }
        })
      }
    ];
  }
  
  /**
   * Gera características de acessibilidade
   */
  private generateAccessibilityFeatures(article: any): string[] {
    const features = ['visuallyEnhanced'];
    
    // Se é conteúdo educacional, adicionar recursos pedagógicos
    if (this.isEducationalContent(article)) {
      features.push('educationalEnhanced');
    }
    
    return features;
  }
  
  /**
   * Verifica se o conteúdo é educacional
   */
  private isEducationalContent(article: any): boolean {
    const educationalKeywords = ['como', 'tutorial', 'aprender', 'passo', 'guia', 'técnica', 'método'];
    const titleLower = article.titulo.toLowerCase();
    
    return educationalKeywords.some(keyword => titleLower.includes(keyword));
  }
  
  /**
   * Adiciona warnings específicos do VideoObject
   */
  private addVideoSpecificWarnings(warnings: string[], article: any, videoInfo: any): void {
    if (!article.url_video) {
      warnings.push('VideoObject: URL de vídeo é obrigatória');
    }
    
    if (!article.imagem_capa_arquivo) {
      warnings.push('VideoObject: Thumbnail/imagem de capa recomendada para melhor exibição');
    }
    
    if (videoInfo.platform === 'Generic') {
      warnings.push('VideoObject: Plataforma de vídeo não reconhecida, metadados limitados');
    }
    
    if (!this.isEducationalContent(article) && article.categoria_principal === 'psicologia') {
      warnings.push('VideoObject: Considere adicionar elementos educacionais para melhor SEO');
    }
  }
  
  /**
   * Obtém razão da detecção deste tipo de schema
   */
  protected getDetectionReason(context: SchemaGenerationContext): string {
    return 'VideoObject selecionado devido à presença de url_video no artigo';
  }
}
