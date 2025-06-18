/**
 * 🔍 EXTRATORES AUTOMÁTICOS SEO 2025
 * 
 * Sistema de extração automática de dados para Rich Results,
 * implementando as melhorias identificadas no relatório SEO
 * sem necessidade de novos campos no banco de dados.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Extração de HowTo steps do conteúdo HTML
 * - Análise automática de FAQ estruturado
 * - Detecção de dados multimídia
 * - Fallbacks inteligentes e robustos
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - Auto Extractors
 */

import type {
  HowToData,
  HowToStep,
  EnhancedFAQData,
  EnhancedFAQQuestion,
  EnhancedVideoData,
  EnhancedPodcastData,
  AutoExtractionResult,
  ExtractionMethod,
  ExtractionConfig,
  MedicalContentData,
  Article2025Extensions,
  SpeakableSpecification
} from './seo-enhancements';

// ==========================================
// 🎯 CONFIGURAÇÃO PADRÃO
// ==========================================

/**
 * Configuração padrão para extração automática
 */
export const DEFAULT_EXTRACTION_CONFIG: ExtractionConfig = {
  enableAutoExtraction: true,
  minimumConfidence: 0.7,
  extractionTimeout: 5000, // 5 segundos
  enabledMethods: [
    'content-analysis',
    'heading-structure', 
    'list-detection',
    'pattern-matching',
    'fallback-generation'
  ],
  useFallbacks: true
};

// ==========================================
// 🔍 EXTRATOR DE HOWTO STEPS
// ==========================================

/**
 * Extrai steps estruturados para HowTo Rich Results
 */
export class HowToExtractor {
  private config: ExtractionConfig;

  constructor(config: ExtractionConfig = DEFAULT_EXTRACTION_CONFIG) {
    this.config = config;
  }

  /**
   * Extrai dados HowTo do conteúdo HTML
   */
  async extractHowToData(
    content: string,
    title: string
  ): Promise<AutoExtractionResult<HowToData | null>> {
    const startTime = Date.now();
    const warnings: string[] = [];

    try {
      // Método 1: Extração de cabeçalhos estruturados
      let steps = this.extractStepsFromHeadings(content);
      let method: ExtractionMethod = 'heading-structure';
      let confidence = this.calculateStepsConfidence(steps, content);

      // Método 2: Fallback para listas se não encontrou steps
      if (steps.length === 0 || confidence < 0.5) {
        steps = this.extractStepsFromLists(content);
        method = 'list-detection';
        confidence = this.calculateStepsConfidence(steps, content);
        warnings.push('Usando extração de listas como fallback');
      }

      // Método 3: Fallback final - geração mínima
      if (steps.length === 0 || confidence < this.config.minimumConfidence) {
        steps = this.generateMinimalSteps(content, title);
        method = 'fallback-generation';
        confidence = 0.3;
        warnings.push('Usando geração mínima de steps');
      }

      // Validação final
      if (steps.length < 2) {
        return {
          data: null,
          confidence: 0,
          extractionMethod: method,
          warnings: [...warnings, 'HowTo requer pelo menos 2 passos'],
          extractionTime: Date.now() - startTime
        };
      }

      const howToData: HowToData = {
        name: this.cleanTitle(title),
        description: this.extractDescription(content),
        totalTime: this.estimateTotalTime(content, steps.length),
        steps: steps,
        extractionConfidence: confidence
      };

      return {
        data: howToData,
        confidence: confidence,
        extractionMethod: method,
        warnings: warnings,
        extractionTime: Date.now() - startTime
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return {
        data: null,
        confidence: 0,
        extractionMethod: 'fallback-generation',
        warnings: [...warnings, `Erro na extração: ${errorMessage}`],
        extractionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Extrai steps baseado em cabeçalhos H2/H3/H4
   */
  private extractStepsFromHeadings(content: string): HowToStep[] {
    const steps: HowToStep[] = [];
    const headerPattern = /<h([2-4])[^>]*>(.*?)<\/h[2-4]>/gi;
    
    let match;
    let stepNumber = 1;

    while ((match = headerPattern.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const headerText = this.stripHtml(match[2]).trim();

      if (this.isStepHeader(headerText)) {
        const stepContent = this.extractStepContent(content, match.index);
        
        steps.push({
          '@type': 'HowToStep',
          name: headerText,
          text: stepContent,
          position: stepNumber++,
          timeRequired: this.estimateStepTime(stepContent)
        });
      }
    }

    return steps;
  }
  /**
   * Extrai steps baseado em listas ordenadas e não ordenadas
   */
  private extractStepsFromLists(content: string): HowToStep[] {
    const steps: HowToStep[] = [];
    
    // Busca listas ordenadas primeiro
    const olPattern = /<ol[^>]*>(.*?)<\/ol>/gi;
    const olMatch = olPattern.exec(content);
    
    if (olMatch) {
      const listContent = olMatch[1];
      const liPattern = /<li[^>]*>(.*?)<\/li>/gi;
      let liMatch;
      let position = 1;

      while ((liMatch = liPattern.exec(listContent)) !== null) {
        const stepText = this.stripHtml(liMatch[1]).trim();
        
        if (stepText.length > 10) { // Filtrar items muito curtos
          steps.push({
            '@type': 'HowToStep',
            name: `Passo ${position}`,
            text: stepText,
            position: position++,
            timeRequired: this.estimateStepTime(stepText)
          });
        }
      }
    }

    return steps;
  }

  /**
   * Gera steps mínimos como fallback
   */
  private generateMinimalSteps(content: string, title: string): HowToStep[] {
    const cleanContent = this.stripHtml(content);
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    if (sentences.length < 2) {
      return [
        {
          '@type': 'HowToStep',
          name: 'Passo 1',
          text: `Leia e compreenda os conceitos apresentados em: ${title}`,
          position: 1,
          timeRequired: 'PT5M'
        },
        {
          '@type': 'HowToStep', 
          name: 'Passo 2',
          text: 'Aplique os conhecimentos na sua prática diária',
          position: 2,
          timeRequired: 'PT10M'
        }
      ];
    }

    return sentences.slice(0, 3).map((sentence, index) => ({
      '@type': 'HowToStep' as const,
      name: `Passo ${index + 1}`,
      text: sentence.trim(),
      position: index + 1,
      timeRequired: 'PT5M'
    }));
  }

  /**
   * Verifica se um cabeçalho indica um passo
   */
  private isStepHeader(headerText: string): boolean {
    const stepPatterns = [
      /^\d+[\.\)]\s*/i,                    // "1. Como fazer"
      /^passo\s*\d+/i,                     // "Passo 1"
      /^etapa\s*\d+/i,                     // "Etapa 1"
      /^(primeiro|segundo|terceiro|quarto|quinto)/i,
      /^como\s+/i,                         // "Como iniciar"
      /^(comece|inicie|pratique|realize)/i,
      /^(aprenda|descubra|desenvolva)/i
    ];

    return stepPatterns.some(pattern => pattern.test(headerText));
  }

  /**
   * Extrai conteúdo relevante para o passo
   */
  private extractStepContent(content: string, headerIndex: number): string {
    const afterHeader = content.substring(headerIndex);
    const nextHeaderMatch = afterHeader.match(/<h[2-4][^>]*>/i);
    
    let sectionContent: string;
    if (nextHeaderMatch) {
      sectionContent = afterHeader.substring(0, nextHeaderMatch.index);
    } else {
      sectionContent = afterHeader.substring(0, 500); // Limite de 500 chars
    }

    return this.stripHtml(sectionContent)
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 300); // Máximo 300 chars por step
  }

  /**
   * Calcula confiança baseado na qualidade dos steps extraídos
   */
  private calculateStepsConfidence(steps: HowToStep[], content: string): number {
    if (steps.length === 0) return 0;
    
    let confidence = 0.5; // Base
    
    // Bonus por número adequado de steps
    if (steps.length >= 3 && steps.length <= 10) {
      confidence += 0.2;
    }
    
    // Bonus por steps com bom conteúdo
    const avgStepLength = steps.reduce((sum, step) => sum + step.text.length, 0) / steps.length;
    if (avgStepLength > 50) {
      confidence += 0.2;
    }
    
    // Bonus por steps bem nomeados
    const wellNamedSteps = steps.filter(step => 
      step.name.length > 5 && !step.name.match(/^passo\s*\d+$/i)
    ).length;
    
    if (wellNamedSteps / steps.length > 0.5) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Estima tempo total baseado no conteúdo
   */
  private estimateTotalTime(content: string, stepCount: number): string {
    const wordCount = this.stripHtml(content).split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / 200); // 200 palavras/min
    const practiceTimeMinutes = stepCount * 3; // 3 min por step
    
    const totalMinutes = Math.max(readingTimeMinutes + practiceTimeMinutes, 5);
    return `PT${totalMinutes}M`;
  }

  /**
   * Estima tempo para um passo individual
   */
  private estimateStepTime(stepContent: string): string {
    const wordCount = stepContent.split(/\s+/).length;
    const minutes = Math.max(Math.ceil(wordCount / 100), 2); // Min 2 minutos
    return `PT${minutes}M`;
  }

  /**
   * Limpa título removendo prefixos desnecessários
   */
  private cleanTitle(title: string): string {
    return title
      .replace(/^(como|tutorial|guia|passo\s*a\s*passo):\s*/i, '')
      .trim();
  }

  /**
   * Extrai descrição do início do conteúdo
   */
  private extractDescription(content: string): string {
    const cleanContent = this.stripHtml(content);
    const firstParagraph = cleanContent.split('\n')[0];
    
    if (firstParagraph.length > 50 && firstParagraph.length < 200) {
      return firstParagraph.trim();
    }
    
    return cleanContent.substring(0, 150).trim() + '...';
  }

  /**
   * Remove tags HTML de forma segura
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

// ==========================================
// 📋 EXTRATOR DE FAQ APRIMORADO
// ==========================================

/**
 * Extrai e aprimora dados FAQ para Rich Results
 */
export class EnhancedFAQExtractor {
  private config: ExtractionConfig;

  constructor(config: ExtractionConfig = DEFAULT_EXTRACTION_CONFIG) {
    this.config = config;
  }

  /**
   * Aprimora dados FAQ existentes do banco
   */
  async enhanceFAQData(
    existingFAQData: any[],
    content: string,
    authorName?: string
  ): Promise<AutoExtractionResult<EnhancedFAQData | null>> {
    const startTime = Date.now();
    const warnings: string[] = [];

    try {
      if (!existingFAQData || existingFAQData.length === 0) {
        // Tentar extrair FAQ do conteúdo
        const extractedFAQ = this.extractFAQFromContent(content);
        
        if (extractedFAQ.length === 0) {
          return {
            data: null,
            confidence: 0,
            extractionMethod: 'content-analysis',
            warnings: ['Nenhum FAQ encontrado no conteúdo'],
            extractionTime: Date.now() - startTime
          };
        }

        existingFAQData = extractedFAQ;
        warnings.push('FAQ extraído automaticamente do conteúdo');
      }

      const enhancedQuestions: EnhancedFAQQuestion[] = existingFAQData.map((faq, index) => {
        const enhanced: EnhancedFAQQuestion = {
          question: faq.question || `Pergunta ${index + 1}`,
          answer: faq.answer || 'Resposta não encontrada',
          author: authorName || 'Psicólogo Daniel Dantas',
          category: this.categorizeQuestion(faq.question),
          keywords: this.extractKeywords(faq.question + ' ' + faq.answer),
          dateAnswered: new Date().toISOString().split('T')[0],
          answerConfidence: this.calculateAnswerConfidence(faq.answer)
        };

        return enhanced;
      });

      const enhancedFAQ: EnhancedFAQData = {
        questions: enhancedQuestions,
        category: this.determineMainCategory(enhancedQuestions),
        audience: 'Pessoas interessadas em psicologia e bem-estar',
        lastUpdated: new Date().toISOString().split('T')[0],
        structuringConfidence: this.calculateStructuringConfidence(enhancedQuestions)
      };

      return {
        data: enhancedFAQ,
        confidence: enhancedFAQ.structuringConfidence,
        extractionMethod: 'content-analysis',
        warnings: warnings,
        extractionTime: Date.now() - startTime
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return {
        data: null,
        confidence: 0,
        extractionMethod: 'fallback-generation',
        warnings: [...warnings, `Erro na extração FAQ: ${errorMessage}`],
        extractionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Extrai FAQ do conteúdo HTML quando não existe no banco
   */
  private extractFAQFromContent(content: string): any[] {
    const faqs: any[] = [];
    
    // Padrão 1: Buscar seções de FAQ explícitas
    const faqSectionPattern = /<h[2-4][^>]*>.*?(faq|perguntas|dúvidas).*?<\/h[2-4]>/gi;
    const faqMatch = faqSectionPattern.exec(content);
    
    if (faqMatch) {
      // Extrair Q&As após seção FAQ
      const afterFAQ = content.substring(faqMatch.index);
      faqs.push(...this.extractQAPatterns(afterFAQ));
    }

    // Padrão 2: Buscar padrões Q&A no texto
    if (faqs.length === 0) {
      faqs.push(...this.extractQAPatterns(content));
    }

    return faqs.slice(0, 5); // Máximo 5 perguntas extraídas
  }

  /**
   * Extrai padrões de pergunta e resposta
   */
  private extractQAPatterns(content: string): any[] {
    const faqs: any[] = [];
    
    // Padrão: Pergunta em header + texto seguinte
    const questionPattern = /<h[3-5][^>]*>(.*?\?.*?)<\/h[3-5]>/gi;
    let match;

    while ((match = questionPattern.exec(content)) !== null) {
      const question = this.stripHtml(match[1]).trim();
      const answer = this.extractAnswerAfterQuestion(content, match.index + match[0].length);
      
      if (question.length > 10 && answer.length > 20) {
        faqs.push({
          question: question,
          answer: answer
        });
      }
    }

    return faqs;
  }

  /**
   * Extrai resposta após uma pergunta
   */
  private extractAnswerAfterQuestion(content: string, startIndex: number): string {
    const afterQuestion = content.substring(startIndex);
    const nextHeaderMatch = afterQuestion.match(/<h[2-5][^>]*>/i);
    
    let answerContent: string;
    if (nextHeaderMatch) {
      answerContent = afterQuestion.substring(0, nextHeaderMatch.index);
    } else {
      answerContent = afterQuestion.substring(0, 500);
    }

    return this.stripHtml(answerContent)
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 300);
  }

  /**
   * Categoriza uma pergunta baseado no conteúdo
   */
  private categorizeQuestion(question: string): string {
    const categories = {
      'Conceitos Básicos': /o que (é|são)|definição|significa|conceito/i,
      'Como Fazer': /como|passo|método|forma|maneira/i,
      'Problemas': /problema|dificuldade|quando|sintoma/i,
      'Tratamento': /terapia|tratamento|cura|solução|ajuda/i,
      'Prevenção': /prevenir|evitar|proteção|cuidado/i
    };

    for (const [category, pattern] of Object.entries(categories)) {
      if (pattern.test(question)) {
        return category;
      }
    }

    return 'Geral';
  }

  /**
   * Extrai palavras-chave de uma pergunta e resposta
   */
  private extractKeywords(text: string): string[] {
    const cleanText = this.stripHtml(text).toLowerCase();
    const psychologyTerms = [
      'ansiedade', 'depressão', 'estresse', 'terapia', 'psicologia',
      'autoestima', 'relacionamento', 'trauma', 'mindfulness',
      'emocional', 'comportamento', 'mental', 'bem-estar',
      'cognitivo', 'humanista', 'rogers', 'freud'
    ];

    return psychologyTerms.filter(term => cleanText.includes(term));
  }

  /**
   * Calcula confiança da resposta baseado na qualidade
   */
  private calculateAnswerConfidence(answer: string): number {
    if (!answer || answer.length < 20) return 0.2;
    if (answer.length < 50) return 0.5;
    if (answer.length < 100) return 0.7;
    if (answer.length < 200) return 0.9;
    return 1.0;
  }

  /**
   * Determina categoria principal das perguntas
   */
  private determineMainCategory(questions: EnhancedFAQQuestion[]): string {
    const categoryCount: Record<string, number> = {};
    
    questions.forEach(q => {
      if (q.category) {
        categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
      }
    });

    const mainCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b
    );

    return mainCategory || 'Psicologia Geral';
  }

  /**
   * Calcula confiança geral na estruturação
   */
  private calculateStructuringConfidence(questions: EnhancedFAQQuestion[]): number {
    if (questions.length === 0) return 0;
    
    const avgConfidence = questions.reduce((sum, q) => 
      sum + (q.answerConfidence || 0.5), 0
    ) / questions.length;

    // Bonus por ter múltiplas perguntas
    const lengthBonus = Math.min(questions.length / 5, 0.2);
    
    return Math.min(avgConfidence + lengthBonus, 1.0);
  }

  /**
   * Remove tags HTML de forma segura
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

// ==========================================
// 🎥 EXTRATOR DE DADOS MULTIMÍDIA
// ==========================================

/**
 * Extrai dados aprimorados para VideoObject e PodcastEpisode
 */
export class MultimediaExtractor {
  private config: ExtractionConfig;

  constructor(config: ExtractionConfig = DEFAULT_EXTRACTION_CONFIG) {
    this.config = config;
  }

  /**
   * Extrai dados aprimorados de vídeo
   */
  async extractVideoData(
    videoUrl: string,
    title: string,
    content: string
  ): Promise<AutoExtractionResult<EnhancedVideoData | null>> {
    const startTime = Date.now();
    const warnings: string[] = [];

    try {
      if (!videoUrl) {
        return {
          data: null,
          confidence: 0,
          extractionMethod: 'content-analysis',
          warnings: ['URL de vídeo não fornecida'],
          extractionTime: Date.now() - startTime
        };
      }

      const videoData: EnhancedVideoData = {
        name: title,
        description: this.extractDescription(content),
        contentUrl: videoUrl,
        embedUrl: this.generateEmbedUrl(videoUrl),
        duration: this.extractDurationFromContent(content),
        uploadDate: new Date().toISOString().split('T')[0],
        thumbnailUrl: this.generateThumbnailUrl(videoUrl),
        inLanguage: 'pt-BR'
      };

      return {
        data: videoData,
        confidence: 0.8,
        extractionMethod: 'content-analysis',
        warnings: warnings,
        extractionTime: Date.now() - startTime
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return {
        data: null,
        confidence: 0,
        extractionMethod: 'fallback-generation',
        warnings: [...warnings, `Erro na extração de vídeo: ${errorMessage}`],
        extractionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Extrai dados aprimorados de podcast
   */
  async extractPodcastData(
    podcastUrl: string,
    title: string,
    content: string
  ): Promise<AutoExtractionResult<EnhancedPodcastData | null>> {
    const startTime = Date.now();
    const warnings: string[] = [];

    try {
      if (!podcastUrl) {
        return {
          data: null,
          confidence: 0,
          extractionMethod: 'content-analysis',
          warnings: ['URL de podcast não fornecida'],
          extractionTime: Date.now() - startTime
        };
      }

      const podcastData: EnhancedPodcastData = {
        name: title,
        description: this.extractDescription(content),
        contentUrl: podcastUrl,
        duration: this.extractDurationFromContent(content),
        datePublished: new Date().toISOString().split('T')[0],
        about: this.extractTopics(content)
      };

      return {
        data: podcastData,
        confidence: 0.8,
        extractionMethod: 'content-analysis',
        warnings: warnings,
        extractionTime: Date.now() - startTime
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return {
        data: null,
        confidence: 0,
        extractionMethod: 'fallback-generation',
        warnings: [...warnings, `Erro na extração de podcast: ${errorMessage}`],
        extractionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Extrai duração do conteúdo usando padrões
   */
  private extractDurationFromContent(content: string): string | undefined {
    const patterns = [
      /duração[:\s]*(\d+)\s*minutos?/i,
      /tempo[:\s]*(\d+)\s*min/i,
      /(\d+)\s*minutos? de (áudio|vídeo)/i,
      /assista[:\s]*(\d+)\s*minutos?/i,
      /ouça[:\s]*(\d+)\s*minutos?/i
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        return `PT${match[1]}M`;
      }
    }

    // Fallback: calcular baseado no wordCount
    const wordCount = this.stripHtml(content).split(/\s+/).length;
    const estimatedMinutes = Math.ceil(wordCount / 150); // 150 palavras/min para áudio
    return `PT${Math.min(estimatedMinutes, 60)}M`; // Max 60 minutos
  }

  /**
   * Gera URL de embed para vídeos do YouTube
   */
  private generateEmbedUrl(videoUrl: string): string | undefined {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = this.extractYouTubeId(videoUrl);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
    }
    return undefined;
  }

  /**
   * Extrai ID do YouTube da URL
   */
  private extractYouTubeId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Gera URL de thumbnail para vídeos
   */
  private generateThumbnailUrl(videoUrl: string): string | undefined {
    const videoId = this.extractYouTubeId(videoUrl);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : undefined;
  }

  /**
   * Extrai tópicos abordados no conteúdo
   */
  private extractTopics(content: string): string[] {
    const cleanContent = this.stripHtml(content).toLowerCase();
    const psychologyTopics = [
      'ansiedade',
      'depressão', 
      'autoestima',
      'relacionamentos',
      'mindfulness',
      'terapia cognitivo-comportamental',
      'psicologia humanista',
      'gestão de estresse',
      'desenvolvimento pessoal',
      'saúde mental'
    ];

    return psychologyTopics.filter(topic => cleanContent.includes(topic));
  }

  /**
   * Extrai descrição do conteúdo
   */
  private extractDescription(content: string): string {
    const cleanContent = this.stripHtml(content);
    const firstSentences = cleanContent.split(/[.!?]+/).slice(0, 2).join('. ');
    
    if (firstSentences.length > 50 && firstSentences.length < 200) {
      return firstSentences.trim() + '.';
    }
    
    return cleanContent.substring(0, 150).trim() + '...';
  }

  /**
   * Remove tags HTML de forma segura
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

// ==========================================
// 🔧 EXTRATOR DE DADOS SPEAKABLE
// ==========================================

/**
 * Extrai dados para Speakable (Voice Search) 2025
 */
export class SpeakableExtractor {
  /**
   * Gera especificação speakable para voice search
   */
  static generateSpeakableSpec(content: string): SpeakableSpecification {
    const cssSelectors: string[] = [];
    
    // Sempre incluir título principal
    cssSelectors.push('h1');
    
    // Incluir subtítulos importantes
    cssSelectors.push('h2');
    
    // Incluir resumos e destaques
    if (content.includes('class="summary"') || content.includes('class="highlight"')) {
      cssSelectors.push('.summary', '.highlight');
    }
    
    // Incluir FAQ se presente
    if (content.toLowerCase().includes('faq') || content.toLowerCase().includes('pergunta')) {
      cssSelectors.push('.faq-question', '.faq-answer');
    }

    return {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors
    };
  }
}

// ==========================================
// 🚀 EXPORTAÇÕES PRINCIPAIS
// ==========================================

// Todas as classes e constantes já foram exportadas inline
// Não são necessárias exportações duplicadas
