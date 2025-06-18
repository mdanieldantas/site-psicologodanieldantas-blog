/**
 * 📋 GERADOR DE SCHEMA HOWTO
 * 
 * Gerador específico para schemas do tipo HowTo (Schema.org).
 * Rich Results GARANTIDOS no Google - um dos schemas mais eficazes para SEO.
 * 
 * 📋 CARACTERÍSTICAS:
 * - Rich Results "How-to" no Google Search
 * - Instruções passo-a-passo estruturadas
 * - Suporte a ferramentas e materiais
 * - Tempo e custo estimados
 * 
 * 🎯 CASOS DE USO:
 * - Guias práticos de psicologia
 * - Tutoriais de técnicas terapêuticas
 * - Exercícios passo-a-passo
 * - Instruções de autocuidado
 * - Métodos de desenvolvimento pessoal
 * 
 * 📊 DADOS UTILIZADOS:
 * - conteudo: Para extrair passos e instruções
 * - titulo: Como nome do guia
 * - categoria: Para ferramentas/materiais específicos
 * - download_*: Para materiais complementares
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 1.0.0 - HowTo Generator
 */

import { BaseSchemaGenerator } from '../core/base-schema';
import type {
  SchemaGenerationContext,
  SchemaGenerationResult,
  SchemaTypeEnum
} from '../core/types';

// 🚀 SEO 2025: Importar extrator automático
import { HowToExtractor, DEFAULT_EXTRACTION_CONFIG } from '../core/auto-extractors';
import type { HowToData, AutoExtractionResult } from '../core/seo-enhancements';

// 🎯 Interface para análise tradicional do HowTo (compatibilidade)
interface HowToAnalysis {
  steps: Array<{
    name: string;
    text: string;
    url?: string;
    image?: string;
    video?: string;
    direction?: string;
    tip?: string;
  }>;
  tools: Array<{
    name: string;
    description?: string;
  }>;
  supplies: Array<{
    name: string;
    description?: string;
  }>;
  sections: Array<{
    name: string;
    steps: Array<{
      name: string;
      text: string;
      direction?: string;
      tip?: string;
    }>;
  }>;
  complexity: string;
  difficulty?: string;
  estimatedCost?: number;
  expectedResult?: string;
}

import {
  generateSchemaId,
  formatSchemaDate,
  getContentStats
} from '../core/utils';

// ==========================================
// 📋 GERADOR HOWTO
// ==========================================

/**
 * Gerador específico para HowTo schemas
 */
class HowToGenerator extends BaseSchemaGenerator {
  protected readonly schemaType: SchemaTypeEnum = 'HowTo';
  protected readonly requiredFields: string[] = [
    'name',
    'description',
    'step',
    'totalTime'
  ];
    /**
   * Gera schema HowTo completo
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    
    try {
      this.log('info', `Gerando HowTo para: ${article.titulo}`);
      
      // Campos base do schema
      const baseFields = this.generateBaseFields(context);
      
      // 🚀 SEO 2025: Extração automática melhorada
      const extractor = new HowToExtractor(DEFAULT_EXTRACTION_CONFIG);
      const autoExtraction = await extractor.extractHowToData(article.conteudo, article.titulo);
      
      // Fallback para análise tradicional se extração automática falhou
      const howToAnalysis = autoExtraction.data ? 
        this.convertAutoExtractionToAnalysis(autoExtraction.data) :
        this.analyzeHowToContent(article);
        
      const contentStats = getContentStats(article.conteudo);
      
      // Log de qualidade da extração
      if (autoExtraction.data) {
        this.log('info', `Extração automática bem-sucedida (confiança: ${autoExtraction.confidence})`);
        if (autoExtraction.warnings.length > 0) {
          this.log('warn', `Avisos na extração: ${autoExtraction.warnings.join(', ')}`);
        }
      } else {
        this.log('warn', 'Usando análise tradicional como fallback');
      }
      
      // Verificar se há passos suficientes
      if (howToAnalysis.steps.length < 2) {
        const warning = 'HowTo requer pelo menos 2 passos estruturados';
        this.log('warn', warning);
        return this.createResult({}, context, startTime, [warning]);
      }
      
      // Schema HowTo específico
      const schema = {
        ...baseFields,
        '@type': 'HowTo',
        
        // Campos obrigatórios do HowTo
        name: this.generateHowToName(article.titulo),
        description: this.generateHowToDescription(article),
        
        // Passos estruturados (CORE do HowTo)
        step: howToAnalysis.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
          ...(step.url && { url: step.url }),
          ...(step.image && { image: step.image })
        })),        // Tempo total estimado
        totalTime: this.estimateHowToTime(
          typeof contentStats.readingTime === 'number' ? contentStats.readingTime : 5, 
          this.getComplexityScore(String(howToAnalysis.complexity))
        ),
        
        // Ferramentas necessárias (se detectadas)
        ...(howToAnalysis.tools.length > 0 && {
          tool: howToAnalysis.tools.map(tool => ({
            '@type': 'HowToTool',
            name: tool.name,
            ...(tool.description && { description: tool.description })
          }))
        }),
        
        // Materiais/suprimentos necessários
        ...(howToAnalysis.supplies.length > 0 && {
          supply: howToAnalysis.supplies.map(supply => ({
            '@type': 'HowToSupply',
            name: supply.name,
            ...(supply.description && { description: supply.description })
          }))
        }),
        
        // Custo estimado (se aplicável)
        ...(howToAnalysis.estimatedCost && {
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'BRL',
            value: howToAnalysis.estimatedCost
          }
        }),
        
        // Seções/agrupamentos de passos
        ...(howToAnalysis.sections.length > 0 && {
          step: howToAnalysis.sections.map((section, sectionIndex) => ({
            '@type': 'HowToSection',
            name: section.name,
            position: sectionIndex + 1,
            itemListElement: section.steps.map((step, stepIndex) => ({
              '@type': 'HowToStep',
              position: stepIndex + 1,
              name: step.name,
              text: step.text,
              ...(step.direction && {
                itemListElement: [{
                  '@type': 'HowToDirection',
                  text: step.direction
                }]
              }),
              ...(step.tip && {
                itemListElement: [
                  ...(step.direction ? [{
                    '@type': 'HowToDirection',
                    text: step.direction
                  }] : []),
                  {
                    '@type': 'HowToTip',
                    text: step.tip
                  }
                ]
              })
            }))
          }))
        }),
        
        // Dificuldade/nível
        ...(howToAnalysis.difficulty && {
          educationalLevel: howToAnalysis.difficulty
        }),
        
        // Categoria específica
        ...(article.categoria_principal && {
          about: {
            '@type': 'Thing',
            name: `Técnicas de ${article.categoria_principal}`,
            description: `Métodos práticos em ${article.categoria_principal}`
          }
        }),
        
        // Material complementar
        ...(article.download_url && {
          associatedMedia: {
            '@type': 'MediaObject',
            contentUrl: article.download_url,
            name: article.download_title || 'Material de Apoio',
            description: article.download_description || 'Recurso complementar para o tutorial',
            encodingFormat: this.getDownloadFormat(article.download_format)
          }
        }),
        
        // Vídeo demonstrativo (se disponível)
        ...(article.url_video && {
          video: {
            '@type': 'VideoObject',
            name: `Demonstração: ${article.titulo}`,
            contentUrl: article.url_video,
            description: 'Vídeo demonstrativo dos passos descritos'
          }
        }),
        
        // Resultado esperado
        ...(howToAnalysis.expectedResult && {
          result: {
            '@type': 'Thing',
            name: howToAnalysis.expectedResult,
            description: 'Resultado esperado após seguir o tutorial'
          }
        }),
        
        // Audiência alvo
        audience: {
          '@type': 'Audience',
          audienceType: this.determineHowToAudience(article, howToAnalysis)
        },
        
        // Contexto de aplicação
        applicationCategory: this.getApplicationCategory(article),
        
        // Acessibilidade
        accessibilityFeature: this.generateHowToAccessibilityFeatures(howToAnalysis)
      };
      
      // Validação do schema gerado
      const warnings = this.validateSchema(schema);
      
      // Warnings específicos do HowTo
      this.addHowToSpecificWarnings(warnings, article, howToAnalysis);
      
      this.log('info', `HowTo gerado com sucesso. ${howToAnalysis.steps.length} passos, dificuldade: ${howToAnalysis.difficulty}`);
      
      return this.createResult(schema, context, startTime, warnings);
      
    } catch (error) {
      const errorMessage = `Erro ao gerar HowTo: ${error instanceof Error ? error.message : String(error)}`;
      this.log('error', errorMessage);
      return this.createResult({}, context, startTime, [], [errorMessage]);
    }
  }
  
  // ==========================================
  // 🔧 MÉTODOS AUXILIARES ESPECÍFICOS
  // ==========================================
  
  /**
   * Analisa conteúdo para extrair estrutura HowTo
   */
  private analyzeHowToContent(article: any): {
    steps: Array<{name: string, text: string, url?: string, image?: string, direction?: string, tip?: string}>;
    sections: Array<{name: string, steps: Array<any>}>;
    tools: Array<{name: string, description?: string}>;
    supplies: Array<{name: string, description?: string}>;
    difficulty: string;
    complexity: number;
    estimatedCost?: number;
    expectedResult?: string;
  } {
    const content = article.conteudo;
    
    // Extrair passos numerados ou com bullets
    const steps = this.extractSteps(content);
    
    // Extrair seções (se houver)
    const sections = this.extractSections(content, steps);
    
    // Extrair ferramentas mencionadas
    const tools = this.extractTools(content, article.categoria_principal);
    
    // Extrair materiais/suprimentos
    const supplies = this.extractSupplies(content);
    
    // Determinar dificuldade
    const difficulty = this.determineDifficulty(content, steps.length);
    
    // Analisar complexidade
    const complexity = this.analyzeComplexity(steps, content);
    
    // Estimar custo (se aplicável)
    const estimatedCost = this.estimateCost(content, tools, supplies);
    
    // Extrair resultado esperado
    const expectedResult = this.extractExpectedResult(content);
    
    return {
      steps,
      sections,
      tools,
      supplies,
      difficulty,
      complexity,
      estimatedCost,
      expectedResult
    };
  }
  
  /**
   * Extrai passos do conteúdo
   */
  private extractSteps(content: string): Array<{name: string, text: string, direction?: string, tip?: string}> {
    const steps = [];
      // Padrões de passos
    const stepPatterns = [
      /(\d+)\.?\s*([^.]*?)[:.]?\s*(.*?)(?=\d+\.|$)/g,
      /(?:passo\s*\d+|etapa\s*\d+)[:\s]*(.*?)(?=passo\s*\d+|etapa\s*\d+|$)/gi,
      /•\s*(.*?)(?=•|$)/g,
      /-\s*(.*?)(?=-|$)/g
    ];
      for (const pattern of stepPatterns) {
      let match;
      pattern.lastIndex = 0; // Reset regex
      
      while ((match = pattern.exec(content)) !== null) {
        if (match[1] && match[1].length > 10) {
          const stepText = match[1].trim();
          
          // Extrair nome do passo (primeira sentença ou frase curta)
          const sentences = stepText.split(/[.!?]+/);
          const name = sentences[0].trim();
          const text = stepText;
          
          // Detectar dicas dentro do passo
          const tip = this.extractTipFromStep(stepText);
          
          steps.push({
            name: name.length > 60 ? name.substring(0, 57) + '...' : name,
            text,
            ...(tip && { tip })
          });
        }
      }
      
      if (steps.length > 0) break; // Usar primeiro padrão que encontrar passos
    }
    
    // Se não encontrou passos estruturados, criar baseado em parágrafos
    if (steps.length === 0) {
      const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 50);
      
      paragraphs.slice(0, 5).forEach((paragraph, index) => {
        const cleanParagraph = paragraph.replace(/<[^>]*>/g, '').trim();
        if (cleanParagraph.length > 20) {
          const sentences = cleanParagraph.split(/[.!?]+/);
          const name = sentences[0].trim();
          
          steps.push({
            name: `Passo ${index + 1}: ${name.length > 40 ? name.substring(0, 37) + '...' : name}`,
            text: cleanParagraph
          });
        }
      });
    }
    
    return steps.slice(0, 8); // Máximo 8 passos para otimização
  }
  
  /**
   * Extrai dica de um passo
   */
  private extractTipFromStep(stepText: string): string | undefined {
    const tipPatterns = [
      /(?:dica|tip|lembre-se|importante):\s*(.*?)(?:\.|$)/i,
      /\(([^)]*(?:dica|importante|lembre)[^)]*)\)/i
    ];
    
    for (const pattern of tipPatterns) {
      const match = stepText.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return undefined;
  }
  
  /**
   * Extrai seções do conteúdo
   */
  private extractSections(content: string, steps: any[]): Array<{name: string, steps: Array<any>}> {
    const sections = [];
    
    // Procurar por títulos de seção (h2, h3, etc)
    const sectionMatches = content.matchAll(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi);
    
    for (const match of sectionMatches) {
      const sectionName = match[1].replace(/<[^>]*>/g, '').trim();
      
      if (sectionName.length > 5 && sectionName.length < 100) {
        // Dividir passos por seção seria complexo aqui
        // Por simplicidade, criar seções conceituais
        sections.push({
          name: sectionName,
          steps: steps.slice(0, Math.ceil(steps.length / 2))
        });
      }
    }
    
    return sections.slice(0, 3); // Máximo 3 seções
  }
  
  /**
   * Extrai ferramentas mencionadas
   */
  private extractTools(content: string, categoria?: string): Array<{name: string, description?: string}> {
    const tools = [];
    
    // Ferramentas específicas por categoria
    const categoryTools: Record<string, string[]> = {
      'psicologia': ['diário', 'questionário', 'escala de avaliação'],
      'mindfulness': ['aplicativo de meditação', 'timer', 'almofada'],
      'terapia': ['formulário', 'escala', 'protocolo'],
      'autoconhecimento': ['diário', 'lista', 'questionário']
    };
    
    // Padrões genéricos de ferramentas
    const toolPatterns = [
      /(?:use|utilize|ferramenta|instrumento|aplicativo)(?:\s+(?:o|a|um|uma))?\s+([^.,:;!?]{5,30})/gi,
      /(?:precisa|necessário|requer)(?:\s+(?:de\s+)?(?:um|uma))?\s+([^.,:;!?]{5,30})/gi
    ];
    
    // Adicionar ferramentas específicas da categoria
    if (categoria && categoryTools[categoria.toLowerCase()]) {
      categoryTools[categoria.toLowerCase()].forEach(tool => {
        if (content.toLowerCase().includes(tool)) {
          tools.push({ name: tool.charAt(0).toUpperCase() + tool.slice(1) });
        }
      });
    }
    
    // Extrair ferramentas do texto
    for (const pattern of toolPatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        const toolName = match[1].trim();
        if (toolName.length > 3 && toolName.length < 50) {
          tools.push({ name: toolName });
        }
      }
    }
    
    return tools.slice(0, 5); // Máximo 5 ferramentas
  }
  
  /**
   * Extrai materiais/suprimentos
   */
  private extractSupplies(content: string): Array<{name: string, description?: string}> {
    const supplies = [];
    
    const supplyPatterns = [
      /(?:material|suprimento|você precisa)(?:\s+(?:de\s+)?(?:um|uma))?\s+([^.,:;!?]{5,40})/gi,
      /(?:tenha em mãos|separe|prepare)(?:\s+(?:um|uma))?\s+([^.,:;!?]{5,40})/gi
    ];
    
    for (const pattern of supplyPatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        const supplyName = match[1].trim();
        if (supplyName.length > 3 && supplyName.length < 50) {
          supplies.push({ name: supplyName });
        }
      }
    }
    
    return supplies.slice(0, 3); // Máximo 3 suprimentos
  }
  
  /**
   * Determina dificuldade do tutorial
   */
  private determineDifficulty(content: string, stepsCount: number): string {
    let difficulty = 'beginner';
    
    // Indicadores de dificuldade
    const difficultyIndicators = {
      advanced: ['complexo', 'avançado', 'difícil', 'requer experiência'],
      intermediate: ['médio', 'moderado', 'alguma experiência', 'conhecimento prévio'],
      beginner: ['simples', 'fácil', 'iniciante', 'básico']
    };
    
    const contentLower = content.toLowerCase();
    
    for (const [level, indicators] of Object.entries(difficultyIndicators)) {
      if (indicators.some(indicator => contentLower.includes(indicator))) {
        difficulty = level;
        break;
      }
    }
    
    // Ajustar baseado no número de passos
    if (stepsCount > 6) difficulty = difficulty === 'beginner' ? 'intermediate' : 'advanced';
    if (stepsCount > 10) difficulty = 'advanced';
    
    return difficulty;
  }
  
  /**
   * Analisa complexidade (1-5)
   */
  private analyzeComplexity(steps: any[], content: string): number {
    let complexity = 1;
    
    // Baseado no número de passos
    if (steps.length > 3) complexity = 2;
    if (steps.length > 5) complexity = 3;
    if (steps.length > 8) complexity = 4;
    
    // Baseado no conteúdo
    const complexityKeywords = ['avançado', 'técnica', 'metodologia', 'protocolo'];
    if (complexityKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
      complexity = Math.max(complexity, 3);
    }
    
    return Math.min(complexity, 5);
  }
  
  /**
   * Estima custo do tutorial
   */
  private estimateCost(content: string, tools: any[], supplies: any[]): number | undefined {
    // Se é psicologia/terapia, geralmente sem custo direto
    if (tools.length === 0 && supplies.length === 0) return undefined;
    
    // Custo básico para materiais simples
    if (supplies.length > 0) return 0; // Materiais gratuitos/básicos
    
    return undefined;
  }
  
  /**
   * Extrai resultado esperado
   */
  private extractExpectedResult(content: string): string | undefined {
    const resultPatterns = [
      /(?:ao final|resultado|você será capaz|você conseguirá)\s+(?:de\s+)?([^.!?]{10,100})/gi,
      /(?:objetivo|meta|propósito)(?:\s*é\s*|\s*:\s*)([^.!?]{10,100})/gi
    ];
    
    for (const pattern of resultPatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return undefined;
  }
  
  /**
   * Gera nome otimizado do HowTo
   */
  private generateHowToName(title: string): string {
    // Se já começa com "Como", manter
    if (title.toLowerCase().startsWith('como')) {
      return title;
    }
    
    // Adicionar "Como" se necessário
    return `Como ${title.charAt(0).toLowerCase() + title.slice(1)}`;
  }
  
  /**
   * Gera descrição do HowTo
   */
  private generateHowToDescription(article: any): string {
    const baseDescription = this.generateDescription(article);
    
    if (!baseDescription.toLowerCase().includes('passo') && !baseDescription.toLowerCase().includes('tutorial')) {
      return `${baseDescription} Guia passo-a-passo com instruções detalhadas e práticas.`;
    }
    
    return baseDescription;
  }
  
  /**
   * Estima tempo total do tutorial
   */
  private estimateHowToTime(readingTime: number, complexity: number): string {
    // HowTo leva mais tempo que leitura (prática)
    const practiceMultiplier = 2 + (complexity * 0.5);
    const totalTime = Math.max(5, Math.round(readingTime * practiceMultiplier));
    
    return `PT${totalTime}M`;
  }
  
  /**
   * Determina audiência do HowTo
   */
  private determineHowToAudience(article: any, analysis: any): string {
    const difficultyAudience = {
      beginner: 'general public',
      intermediate: 'people with basic knowledge',
      advanced: 'professionals and advanced practitioners'
    };
    
    return difficultyAudience[analysis.difficulty as keyof typeof difficultyAudience] || 'general public';
  }
  
  /**
   * Obtém categoria de aplicação
   */
  private getApplicationCategory(article: any): string {
    if (!article.categoria_principal) return 'Self-Help';
    
    const categoryMap: Record<string, string> = {
      'psicologia': 'Psychology',
      'terapia': 'Therapy',
      'mindfulness': 'Wellness',
      'desenvolvimento-pessoal': 'Self-Development',
      'relacionamentos': 'Relationships'
    };
    
    const categoryKey = article.categoria_principal.toLowerCase().replace(/\s+/g, '-');
    return categoryMap[categoryKey] || 'Self-Help';
  }
  
  /**
   * Obtém formato de download
   */
  private getDownloadFormat(format?: string | null): string {
    if (!format) return 'application/pdf';
    
    const formatMap: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'txt': 'text/plain'
    };
    
    return formatMap[format.toLowerCase()] || 'application/pdf';
  }
  
  /**
   * Gera características de acessibilidade
   */
  private generateHowToAccessibilityFeatures(analysis: any): string[] {
    const features = ['structuredNavigation'];
    
    if (analysis.steps.length > 0) {
      features.push('stepByStep');
    }
    
    if (analysis.tools.length > 0 || analysis.supplies.length > 0) {
      features.push('resourceList');
    }
    
    return features;
  }
  
  /**
   * Adiciona warnings específicos do HowTo
   */
  private addHowToSpecificWarnings(warnings: string[], article: any, analysis: any): void {
    if (analysis.steps.length < 3) {
      warnings.push('HowTo: Pelo menos 3 passos recomendados para melhor estrutura');
    }
    
    if (analysis.steps.length > 10) {
      warnings.push('HowTo: Mais de 10 passos pode ser muito complexo - considere dividir em seções');
    }
    
    if (analysis.tools.length === 0 && analysis.supplies.length === 0) {
      warnings.push('HowTo: Ferramentas ou materiais não detectados - considere especificar');
    }
    
    if (!analysis.expectedResult) {
      warnings.push('HowTo: Resultado esperado não detectado - considere adicionar');
    }
  }
  
  /**
   * Obtém razão da detecção deste tipo de schema
   */
  protected getDetectionReason(context: SchemaGenerationContext): string {
    return 'HowTo selecionado devido ao conteúdo estruturado em passos/instruções detectado';
  }
  /**
   * 🚀 SEO 2025: Converte dados de extração automática para formato tradicional
   */
  private convertAutoExtractionToAnalysis(howToData: HowToData): HowToAnalysis {
    return {
      steps: howToData.steps.map(step => ({
        name: step.name,
        text: step.text,
        image: step.image,
        video: step.video,
        direction: step.text, // Texto como direção
        tip: step.tip
      })),
      tools: howToData.tools || [],
      supplies: howToData.supplies || [],
      sections: [], // Seções não suportadas na extração automática ainda
      complexity: 'medium', // Complexidade padrão para dados extraídos
      estimatedCost: howToData.estimatedCost?.value,
      expectedResult: 'Resultado conforme instruções do tutorial' // Resultado padrão
    };
  }
  
  /**
   * 🚀 SEO 2025: Converte complexidade string para score numérico
   */
  private getComplexityScore(complexity: string): number {
    switch (complexity.toLowerCase()) {
      case 'low':
      case 'básico':
      case 'fácil':
        return 1;
      case 'medium':
      case 'médio':
      case 'intermediário':
        return 2;
      case 'high':
      case 'alto':
      case 'avançado':
      case 'expert':
        return 3;
      default:
        return 2; // Padrão médio
    }
  }
}

// ==========================================
// 📝 EXPORTAÇÃO DO GERADOR
// ==========================================

export { HowToGenerator };
