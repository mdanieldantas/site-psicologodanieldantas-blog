/**
 * 🔊 GERADOR DE SCHEMA AUDIOOBJECT
 * 
 * Gerador específico para schemas do tipo AudioObject (Schema.org).
 * Utilizado para conteúdo de áudio geral que não se enquadra em PodcastEpisode.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Rich Results para áudio no Google
 * - Compatível com múltiplas plataformas de áudio
 * - Metadados completos de áudio
 * - Suporte a arquivos de áudio diretos
 * 
 * 🎯 CASOS DE USO:
 * - Gravações de áudio standalone
 * - Meditações guiadas
 * - Áudios educacionais curtos
 * - Exercícios de relaxamento
 * - Conteúdo de áudio terapêutico
 * 
 * 📊 DADOS UTILIZADOS:
 * - url_podcast: Reutilizado para áudio geral
 * - download_url: Para arquivos de áudio para download
 * - conteudo: Para duração estimada e descrição
 * - titulo: Nome do áudio
 * - autor_principal: Narrador/criador
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - AudioObject Generator
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
// 🔊 GERADOR AUDIOOBJECT
// ==========================================

/**
 * Gerador específico para AudioObject schemas
 */
class AudioObjectGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'AudioObject';
  protected readonly requiredFields: string[] = [
    'name',
    'description',
    'contentUrl',
    'uploadDate',
    'author'
  ];
  
  /**
   * Gera schema AudioObject completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando AudioObject para: ${article.titulo}`);
      
      // Verificar se existe URL de áudio (pode ser podcast ou download)
      const audioUrl = this.getAudioUrl(article);
      if (!audioUrl) {
        const error = 'AudioObject requer url_podcast ou download_url com formato de áudio';
        this.log('error', error);
        return this.createResult({}, context, startTime, [], [error]);
      }
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // Estatísticas do conteúdo para duração estimada
      const contentStats = getContentStats(article.conteudo);
      
      // Detectar tipo e características do áudio
      const audioInfo = this.analyzeAudioUrl(audioUrl, article);
      
      // Schema AudioObject específico
      const schema = {
        ...baseFields,
        '@type': 'AudioObject',
        
        // Campos obrigatórios do AudioObject
        name: article.titulo,
        description: this.generateAudioDescription(article, audioInfo.type),
        contentUrl: audioUrl,
        uploadDate: formatSchemaDate(article.data_publicacao || article.data_criacao),
        
        // Metadados de áudio
        encodingFormat: audioInfo.format,
        duration: this.estimateAudioDuration(contentStats.readingTime, audioInfo.type),
        
        // Informações de arquivo (se download disponível)
        ...(article.download_url && article.download_url === audioUrl && {
          contentSize: article.download_size_mb ? `${article.download_size_mb}MB` : undefined,
          fileFormat: audioInfo.format
        }),
        
        // Características do áudio
        genre: this.mapContentToAudioGenre(article, audioInfo.type),
        inLanguage: 'pt-BR',
        
        // Tipo específico de áudio (se detectado)
        ...(audioInfo.type && {
          about: {
            '@type': 'Thing',
            name: this.getAudioTypeDescription(audioInfo.type),
            description: `Conteúdo de áudio: ${audioInfo.type}`
          }
        }),
        
        // Player/reprodução
        ...(audioInfo.playerType && {
          playerType: audioInfo.playerType
        }),
        
        // Transcrição (se disponível)
        ...(this.hasTranscription(article) && {
          transcript: {
            '@type': 'MediaObject',
            contentUrl: `${baseFields.url}#transcript`,
            encodingFormat: 'text/html',
            name: `Transcrição: ${article.titulo}`
          }
        }),
        
        // Acessibilidade
        accessMode: ['auditory'],
        accessibilityFeature: this.generateAudioAccessibilityFeatures(article, audioInfo),
        
        // Duração específica para diferentes tipos
        timeRequired: this.estimateAudioDuration(contentStats.readingTime, audioInfo.type),
        
        // Audiência educacional/terapêutica (se aplicável)
        ...(this.isTherapeuticAudio(article, audioInfo.type) && {
          audience: {
            '@type': 'EducationalAudience',
            educationalRole: ['patient', 'general public'],
            audienceType: 'individuals seeking mental health support'
          },
          educationalUse: this.getEducationalUse(audioInfo.type)
        }),
        
        // Contexto de saúde mental (se aplicável)
        ...(this.isMentalHealthAudio(article) && {
          isAccessibleForFree: article.content_tier === 'free',
          usageInfo: 'Para fins educacionais e de bem-estar pessoal',
          about: {
            '@type': 'MedicalCondition',
            name: this.extractMentalHealthTopic(article)
          }
        })
      };
      
      // Validação do schema gerado
      const warnings = this.validateSchema(schema);
      
      // Warnings específicos do AudioObject
      this.addAudioSpecificWarnings(warnings, article, audioInfo);
      
      this.log('info', `AudioObject gerado com sucesso. Tipo: ${audioInfo.type}, Duração: ${schema.duration}`);
      
      return this.createResult(schema, context, startTime, warnings);
      
    } catch (error) {
      const errorMessage = `Erro ao gerar AudioObject: ${error instanceof Error ? error.message : String(error)}`;
      this.log('error', errorMessage);
      return this.createResult({}, context, startTime, [], [errorMessage]);
    }
  }
  
  // ==========================================
  // 🔧 MÉTODOS AUXILIARES ESPECÍFICOS
  // ==========================================
  
  /**
   * Obtém URL de áudio disponível
   */
  private getAudioUrl(article: any): string | null {
    // Priorizar download de áudio, depois podcast
    if (article.download_url && this.isAudioFile(article.download_url)) {
      return article.download_url;
    }
    
    if (article.url_podcast) {
      return article.url_podcast;
    }
    
    return null;
  }
  
  /**
   * Verifica se URL é de arquivo de áudio
   */
  private isAudioFile(url: string): boolean {
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'];
    const urlLower = url.toLowerCase();
    
    return audioExtensions.some(ext => urlLower.includes(ext));
  }
  
  /**
   * Analisa URL/contexto do áudio para determinar tipo e características
   */
  private analyzeAudioUrl(url: string, article: any): {
    type: string;
    format: string;
    playerType?: string;
    platform?: string;
  } {
    const urlLower = url.toLowerCase();
    const titleLower = article.titulo.toLowerCase();
    const contentLower = article.conteudo.toLowerCase();
    
    // Detectar tipo baseado no título e conteúdo
    const audioType = this.detectAudioType(titleLower, contentLower);
    
    // Detectar formato
    let format = 'audio/mp3'; // padrão
    if (urlLower.includes('.wav')) format = 'audio/wav';
    else if (urlLower.includes('.m4a')) format = 'audio/mp4';
    else if (urlLower.includes('.aac')) format = 'audio/aac';
    else if (urlLower.includes('.ogg')) format = 'audio/ogg';
    else if (urlLower.includes('.flac')) format = 'audio/flac';
    
    // Detectar plataforma
    let platform;
    if (urlLower.includes('soundcloud')) platform = 'SoundCloud';
    else if (urlLower.includes('spotify')) platform = 'Spotify';
    else if (urlLower.includes('anchor.fm')) platform = 'Anchor';
    
    return {
      type: audioType,
      format,
      playerType: this.getPlayerType(format),
      platform
    };
  }
  
  /**
   * Detecta tipo de áudio baseado no contexto
   */
  private detectAudioType(title: string, content: string): string {
    const typePatterns = {
      meditation: ['meditação', 'meditar', 'mindfulness', 'relaxamento'],
      therapy: ['terapia', 'terapêutico', 'sessão', 'exercício terapêutico'],
      exercise: ['exercício', 'prática', 'atividade', 'técnica'],
      guide: ['guia', 'orientação', 'instrução', 'como fazer'],
      interview: ['entrevista', 'conversa', 'diálogo', 'bate-papo'],
      lecture: ['palestra', 'apresentação', 'conferência', 'aula'],
      story: ['história', 'relato', 'narrativa', 'caso'],
      music: ['música', 'melodia', 'som', 'instrumental']
    };
    
    const textToAnalyze = `${title} ${content}`.toLowerCase();
    
    for (const [type, keywords] of Object.entries(typePatterns)) {
      if (keywords.some(keyword => textToAnalyze.includes(keyword))) {
        return type;
      }
    }
    
    return 'general'; // tipo genérico
  }
  
  /**
   * Obtém tipo de player necessário
   */
  private getPlayerType(format: string): string {
    const playerMap: Record<string, string> = {
      'audio/mp3': 'MP3 compatible',
      'audio/wav': 'WAV compatible',
      'audio/mp4': 'M4A compatible',
      'audio/aac': 'AAC compatible',
      'audio/ogg': 'OGG compatible',
      'audio/flac': 'FLAC compatible'
    };
    
    return playerMap[format] || 'Standard audio player';
  }
  
  /**
   * Estima duração do áudio baseado no tipo e tempo de leitura
   */
  private estimateAudioDuration(readingTimeMinutes: number, audioType: string): string {
    const typeMultipliers: Record<string, number> = {
      meditation: 1.5,      // Meditações são mais lentas
      therapy: 2.0,         // Exercícios terapêuticos são pausados
      exercise: 1.8,        // Exercícios guiados são detalhados
      guide: 2.2,          // Guias incluem pausas para reflexão
      interview: 1.0,       // Entrevistas seguem ritmo natural
      lecture: 1.3,         // Palestras incluem pausas
      story: 1.4,          // Narrativas são mais dramáticas
      music: 0.8,          // Música instrumental
      general: 1.5         // Padrão geral
    };
    
    const multiplier = typeMultipliers[audioType] || 1.5;
    const estimatedMinutes = Math.max(2, Math.round(readingTimeMinutes * multiplier));
    
    return `PT${estimatedMinutes}M`;
  }
  
  /**
   * Gera descrição específica para áudio
   */
  private generateAudioDescription(article: any, audioType: string): string {
    const baseDescription = this.generateDescription(article);
    
    const typeDescriptions: Record<string, string> = {
      meditation: 'Prática de meditação guiada para bem-estar e autoconhecimento.',
      therapy: 'Exercício terapêutico para desenvolvimento pessoal e mental.',
      exercise: 'Atividade prática para aplicação de conceitos psicológicos.',
      guide: 'Orientação passo-a-passo para desenvolvimento de habilidades.',
      interview: 'Conversa com especialista sobre temas relevantes.',
      lecture: 'Apresentação educacional sobre conceitos importantes.',
      story: 'Narrativa ilustrativa para compreensão de conceitos.',
      music: 'Conteúdo sonoro para relaxamento e bem-estar.',
      general: 'Conteúdo de áudio educacional sobre psicologia e desenvolvimento.'
    };
    
    const typeDesc = typeDescriptions[audioType] || typeDescriptions.general;
    
    if (baseDescription.length < 100) {
      return `${baseDescription} ${typeDesc}`;
    }
    
    return baseDescription;
  }
  
  /**
   * Mapeia conteúdo para gênero de áudio
   */
  private mapContentToAudioGenre(article: any, audioType: string): string {
    const typeGenres: Record<string, string> = {
      meditation: 'Wellness',
      therapy: 'Health & Fitness',
      exercise: 'Education',
      guide: 'Education',
      interview: 'Society & Culture',
      lecture: 'Education',
      story: 'Arts',
      music: 'Music',
      general: 'Education'
    };
    
    return typeGenres[audioType] || 'Education';
  }
  
  /**
   * Obtém descrição do tipo de áudio
   */
  private getAudioTypeDescription(audioType: string): string {
    const descriptions: Record<string, string> = {
      meditation: 'Meditação Guiada',
      therapy: 'Exercício Terapêutico',
      exercise: 'Atividade Prática',
      guide: 'Guia de Orientação',
      interview: 'Entrevista',
      lecture: 'Palestra Educacional',
      story: 'História Ilustrativa',
      music: 'Conteúdo Musical',
      general: 'Áudio Educacional'
    };
    
    return descriptions[audioType] || 'Conteúdo de Áudio';
  }
  
  /**
   * Verifica se é áudio terapêutico
   */
  private isTherapeuticAudio(article: any, audioType: string): boolean {
    const therapeuticTypes = ['meditation', 'therapy', 'exercise'];
    const therapeuticKeywords = ['terapia', 'cura', 'bem-estar', 'ansiedade', 'relaxamento'];
    
    if (therapeuticTypes.includes(audioType)) return true;
    
    const textToAnalyze = `${article.titulo} ${article.conteudo}`.toLowerCase();
    return therapeuticKeywords.some(keyword => textToAnalyze.includes(keyword));
  }
  
  /**
   * Verifica se é áudio de saúde mental
   */
  private isMentalHealthAudio(article: any): boolean {
    const mentalHealthKeywords = [
      'ansiedade', 'depressão', 'estresse', 'trauma', 'autoestima',
      'saúde mental', 'psicológico', 'emocional', 'mental'
    ];
    
    const textToAnalyze = `${article.titulo} ${article.conteudo}`.toLowerCase();
    return mentalHealthKeywords.some(keyword => textToAnalyze.includes(keyword));
  }
  
  /**
   * Extrai tópico de saúde mental
   */
  private extractMentalHealthTopic(article: any): string {
    const topics: Record<string, string> = {
      'ansiedade': 'Transtorno de Ansiedade',
      'depressão': 'Depressão',
      'estresse': 'Estresse',
      'trauma': 'Trauma Psicológico',
      'autoestima': 'Autoestima',
      'relacionamento': 'Relacionamentos Interpessoais'
    };
    
    const textToAnalyze = `${article.titulo} ${article.conteudo}`.toLowerCase();
    
    for (const [keyword, topic] of Object.entries(topics)) {
      if (textToAnalyze.includes(keyword)) {
        return topic;
      }
    }
    
    return 'Saúde Mental';
  }
  
  /**
   * Obtém uso educacional baseado no tipo
   */
  private getEducationalUse(audioType: string): string {
    const uses: Record<string, string> = {
      meditation: 'Prática de mindfulness',
      therapy: 'Desenvolvimento pessoal',
      exercise: 'Aplicação prática',
      guide: 'Aprendizado guiado',
      interview: 'Aprofundamento de conhecimento',
      lecture: 'Educação formal',
      story: 'Aprendizado narrativo',
      general: 'Educação continuada'
    };
    
    return uses[audioType] || 'Desenvolvimento pessoal';
  }
  
  /**
   * Verifica se há transcrição
   */
  private hasTranscription(article: any): boolean {
    const contentStats = getContentStats(article.conteudo);
    return contentStats.wordCount > 150;
  }
  
  /**
   * Gera características de acessibilidade
   */
  private generateAudioAccessibilityFeatures(article: any, audioInfo: any): string[] {
    const features = ['auditory'];
    
    if (this.hasTranscription(article)) {
      features.push('alternativeText');
    }
    
    if (audioInfo.type === 'meditation' || audioInfo.type === 'therapy') {
      features.push('therapeuticEnhanced');
    }
    
    return features;
  }
  
  /**
   * Adiciona warnings específicos do AudioObject
   */
  private addAudioSpecificWarnings(warnings: string[], article: any, audioInfo: any): void {
    if (!this.getAudioUrl(article)) {
      warnings.push('AudioObject: URL de áudio é obrigatória (url_podcast ou download_url)');
    }
    
    if (!this.hasTranscription(article)) {
      warnings.push('AudioObject: Transcrição recomendada para acessibilidade');
    }
    
    if (audioInfo.type === 'general') {
      warnings.push('AudioObject: Tipo de áudio não especificado, considere adicionar contexto');
    }
    
    if (this.isTherapeuticAudio(article, audioInfo.type) && article.content_tier !== 'free') {
      warnings.push('AudioObject: Conteúdo terapêutico recomendado como gratuito');
    }
  }
  
  /**
   * Obtém razão da detecção deste tipo de schema
   */
  protected getDetectionReason(context: SchemaGenerationContext): string {
    return 'AudioObject selecionado devido à presença de conteúdo de áudio (url_podcast ou download de áudio)';
  }
}

// ==========================================
// 📝 EXPORTAÇÃO DO GERADOR
// ==========================================

export { AudioObjectGenerator };
