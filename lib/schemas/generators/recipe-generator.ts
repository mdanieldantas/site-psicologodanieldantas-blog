/**
 * Gerador de Schema.org Recipe
 * 
 * Implementa o tipo Recipe do Schema.org para artigos que contêm
 * "receitas" terapêuticas, rotinas de bem-estar, exercícios práticos
 * ou instruções passo-a-passo para melhorar a saúde mental.
 * 
 * Baseado na documentação Schema.org v15+ adaptado para contexto
 * psicológico e de bem-estar mental.
 * 
 * @see https://schema.org/Recipe
 * @see https://schema.org/HowTo
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
 * Interface específica para dados de Recipe
 */
interface RecipeData {
  recipeCategory: string;
  recipeType: string;
  instructions: Array<{
    '@type': string;
    text: string;
    position?: number;
  }>;
  ingredients?: string[];
  nutrition?: {
    benefits: string[];
    mentalHealthImpact: string;
  };
  duration: {
    prepTime?: string;
    totalTime?: string;
  };
  difficulty?: string;
  suitableFor?: string[];
}

/**
 * Gerador especializado para schemas Recipe
 * 
 * Adapta o conceito de receita para práticas de bem-estar mental,
 * rotinas terapêuticas e exercícios de autocuidado.
 */
export class RecipeGenerator extends BaseSchemaGenerator {
  
  protected readonly schemaType: SchemaTypeEnum = 'Recipe';
  protected readonly requiredFields: string[] = ['titulo', 'resumo'];
  
  /**
   * Verifica se o artigo se adequa ao tipo Recipe
   * 
   * @param context - Contexto de geração
   * @returns true se o artigo contém indicadores de receita/rotina
   */
  canGenerate(context: SchemaGenerationContext): boolean {
    const { article } = context;
    const content = `${article.titulo} ${article.resumo} ${article.conteudo}`.toLowerCase();
    
    // Palavras-chave que indicam receita/rotina
    const recipeIndicators = [
      'receita', 'rotina', 'passo a passo', 'passo-a-passo', 'instruções',
      'como fazer', 'tutorial', 'guia prático', 'exercício', 'exercícios',
      'técnica', 'métodos', 'procedimento', 'sequência', 'etapas',
      'ingredientes', 'materiais necessários', 'você vai precisar',
      'tempo necessário', 'duração', 'preparação', 'preparo'
    ];
    
    const hasIndicators = recipeIndicators.some(indicator => 
      content.includes(indicator)
    );
    
    // Padrões estruturais de receita
    const structuralPatterns = [
      /(\d+\.|\d+\)|\•)\s*[^.]{10,}/g, // Lista numerada/bullets
      /passo\s*\d+/g, // "Passo 1", "Passo 2"
      /primeiro.*segundo.*terceiro/i, // Sequência ordenada
      /ingredientes?[:]/i, // Seção de ingredientes
      /modo\s*de\s*(fazer|preparo)/i // Modo de fazer
    ];
    
    const hasStructure = structuralPatterns.some(pattern => 
      pattern.test(content)
    );
    
    // Categorias relevantes
    const relevantCategories = [
      'exercícios', 'bem-estar', 'autocuidado', 'mindfulness',
      'relaxamento', 'técnicas', 'práticas', 'rotinas'
    ];
    
    const hasRelevantCategory = relevantCategories.some(cat => 
      article.categoria_principal?.toLowerCase().includes(cat)
    );
    
    return hasIndicators || hasStructure || hasRelevantCategory;
  }
  
  /**
   * Gera o schema Recipe com propriedades específicas
   * 
   * @param context - Contexto de geração
   * @returns Schema estruturado para Recipe
   */
  async generate(context: SchemaGenerationContext): Promise<SchemaGenerationResult> {
    const startTime = Date.now();
    const { article } = context;
    this.log('info', 'Gerando schema Recipe', { articleId: article.id });
    
    // Obtém campos base do artigo
    const baseFields = this.generateBaseFields(context);
    
    // Extrai dados específicos da receita
    const recipeData = this.extractRecipeData(context);
    
    // Analisa benefícios nutricionais (mentais)
    const nutrition = this.extractNutritionalInfo(article.conteudo);
    
    // Identifica audiência adequada
    const targetAudience = this.identifyTargetAudience(article.conteudo);
    
    // Construção do schema Recipe
    const schema = {
      ...baseFields,
      '@type': 'Recipe',
        // Categoria da receita
      recipeCategory: recipeData.recipeCategory,
      
      // Tipo específico (como propriedade adicional)
      recipeType: recipeData.recipeType,
      
      // Instruções detalhadas
      recipeInstructions: recipeData.instructions,
      
      // "Ingredientes" (materiais/recursos necessários)
      ...(recipeData.ingredients && recipeData.ingredients.length > 0 && {
        recipeIngredient: recipeData.ingredients
      }),
      
      // Informações de tempo
      ...(recipeData.duration.prepTime && {
        prepTime: recipeData.duration.prepTime
      }),
      
      ...(recipeData.duration.totalTime && {
        totalTime: recipeData.duration.totalTime
      }),
      
      // Dificuldade
      ...(recipeData.difficulty && {
        recipeDifficulty: recipeData.difficulty
      }),
      
      // Benefícios para saúde mental
      ...(nutrition && {
        nutrition: {
          '@type': 'NutritionInformation',
          healthBenefit: nutrition.benefits,
          description: nutrition.mentalHealthImpact
        }
      }),
      
      // Adequado para
      ...(recipeData.suitableFor && recipeData.suitableFor.length > 0 && {
        suitableForDiet: recipeData.suitableFor
      }),
      
      // Audiência específica
      ...(targetAudience && {
        audience: {
          '@type': 'Audience',
          audienceType: targetAudience
        }
      }),
      
      // Propriedades educacionais
      educationalLevel: {
        '@type': 'DefinedTerm',
        name: 'Iniciante a Intermediário',
        inDefinedTermSet: 'Níveis de Dificuldade'
      },
      
      // Yield/rendimento (benefícios esperados)
      recipeYield: this.extractExpectedBenefits(article.conteudo),
      
      // Palavras-chave específicas
      keywords: this.extractRecipeKeywords(article.conteudo),
      
      // Categoria de saúde
      healthCondition: this.identifyHealthConditions(article.conteudo),
      
      // Licença e acesso
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/'
    };
    
    // Validação e warnings
    const warnings = this.validateRecipe(schema, recipeData);
    
    const performance = {
      generationTime: Date.now() - startTime,
      fieldsCount: Object.keys(schema).length
    };
    
    this.log('info', `Recipe gerado: ${recipeData.recipeType}`, {
      category: recipeData.recipeCategory,
      instructionsCount: recipeData.instructions.length,
      hasIngredients: !!(recipeData.ingredients && recipeData.ingredients.length > 0)
    });
    
    return {
      schema,
      warnings,
      errors: [],
      schemaType: this.schemaType,
      source: 'extractor',
      confidence: recipeData.instructions.length > 2 ? 0.9 : 0.7,
      performance
    };
  }
  
  /**
   * Extrai dados específicos da receita
   * 
   * @param context - Contexto de geração
   * @returns Dados estruturados da receita
   */
  private extractRecipeData(context: SchemaGenerationContext): RecipeData {
    const { article } = context;
    const content = article.conteudo || '';
    const fullText = `${article.titulo} ${article.resumo} ${content}`;
    
    // Determina categoria da receita
    const recipeCategory = this.determineRecipeCategory(fullText);
    
    // Determina tipo específico
    const recipeType = this.determineRecipeType(fullText);
    
    // Extrai instruções
    const instructions = this.extractInstructions(content);
    
    // Extrai "ingredientes" (materiais necessários)
    const ingredients = this.extractIngredients(content);
    
    // Extrai informações de duração
    const duration = this.extractDuration(content);
    
    // Determina dificuldade
    const difficulty = this.determineDifficulty(content);
    
    // Identifica para quem é adequado
    const suitableFor = this.extractSuitableFor(content);
    
    return {
      recipeCategory,
      recipeType,
      instructions,
      ingredients,
      duration,
      difficulty,
      suitableFor
    };
  }
  
  /**
   * Determina a categoria da receita
   */
  private determineRecipeCategory(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('mindfulness') || lowerContent.includes('meditação')) {
      return 'Práticas de Mindfulness';
    }
    if (lowerContent.includes('relaxamento') || lowerContent.includes('respiração')) {
      return 'Técnicas de Relaxamento';
    }
    if (lowerContent.includes('exercício') || lowerContent.includes('atividade física')) {
      return 'Exercícios de Bem-estar';
    }
    if (lowerContent.includes('sono') || lowerContent.includes('dormir')) {
      return 'Higiene do Sono';
    }
    if (lowerContent.includes('ansiedade') || lowerContent.includes('estresse')) {
      return 'Manejo de Ansiedade e Estresse';
    }
    if (lowerContent.includes('autoestima') || lowerContent.includes('autoconfiança')) {
      return 'Fortalecimento da Autoestima';
    }
    
    return 'Bem-estar Mental';
  }
  
  /**
   * Determina o tipo específico da receita
   */
  private determineRecipeType(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('rotina') || lowerContent.includes('hábito')) {
      return 'Rotina de Bem-estar';
    }
    if (lowerContent.includes('exercício') || lowerContent.includes('prática')) {
      return 'Exercício Terapêutico';
    }
    if (lowerContent.includes('técnica') || lowerContent.includes('método')) {
      return 'Técnica de Autocuidado';
    }
    
    return 'Prática de Bem-estar';
  }
  
  /**
   * Extrai instruções passo-a-passo
   */
  private extractInstructions(content: string): Array<{
    '@type': string;
    text: string;
    position?: number;
  }> {
    const instructions: Array<{
      '@type': string;
      text: string;
      position?: number;
    }> = [];
    
    // Padrões para identificar instruções
    const patterns = [
      /(?:passo\s*\d+|etapa\s*\d+|\d+\.|\d+\)|\•)\s*([^.\n]{15,200})/gi,
      /(?:primeiro|segundo|terceiro|quarto|quinto)[:\-]?\s*([^.\n]{15,200})/gi,
      /(?:inicialmente|em seguida|depois|finalmente)[:\-]?\s*([^.\n]{15,200})/gi
    ];
    
    let position = 1;
    
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const text = match.replace(/^[^a-zA-Z]*/, '').trim();
          if (text.length > 15) {
            instructions.push({
              '@type': 'HowToStep',
              text: text,
              position: position++
            });
          }
        });
      }
    });
    
    // Se não encontrou instruções estruturadas, tenta extrair parágrafos como instruções
    if (instructions.length === 0) {
      const paragraphs = content.split('\n').filter(p => p.trim().length > 30);
      paragraphs.slice(0, 5).forEach((paragraph, index) => {
        instructions.push({
          '@type': 'HowToStep',
          text: paragraph.trim(),
          position: index + 1
        });
      });
    }
    
    return instructions.slice(0, 10); // Limita a 10 instruções
  }
  
  /**
   * Extrai "ingredientes" (materiais necessários)
   */
  private extractIngredients(content: string): string[] | undefined {
    const ingredients: string[] = [];
    
    // Padrões para identificar materiais necessários
    const patterns = [
      /(?:você vai precisar|materiais necessários|ingredientes)[:\-]?\s*([^.]{10,200})/gi,
      /(?:necessário|precisa|requer)[:\-]?\s*([^.]{10,100})/gi
    ];
    
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const text = match.replace(/^[^a-zA-Z]*/, '').trim();
          // Divide por vírgulas ou quebras de linha
          const items = text.split(/[,\n]/).map(item => item.trim());
          ingredients.push(...items.filter(item => item.length > 3));
        });
      }
    });
    
    return ingredients.length > 0 ? ingredients.slice(0, 10) : undefined;
  }
  
  /**
   * Extrai informações de duração
   */
  private extractDuration(content: string): {
    prepTime?: string;
    totalTime?: string;
  } {
    const duration: {
      prepTime?: string;
      totalTime?: string;
    } = {};
    
    // Padrões para tempo de preparação
    const prepPatterns = [
      /(?:preparação|preparo)[:\-]?\s*(\d+)\s*(?:minutos?|min)/i,
      /(?:tempo\s*de\s*preparo)[:\-]?\s*(\d+)\s*(?:minutos?|min)/i
    ];
    
    // Padrões para tempo total
    const totalPatterns = [
      /(?:duração|tempo\s*total)[:\-]?\s*(\d+)\s*(?:minutos?|min|horas?|h)/i,
      /(?:leva|demora)\s*(\d+)\s*(?:minutos?|min|horas?|h)/i
    ];
    
    prepPatterns.forEach(pattern => {
      const match = content.match(pattern);
      if (match && match[1]) {
        duration.prepTime = `PT${match[1]}M`;
      }
    });
    
    totalPatterns.forEach(pattern => {
      const match = content.match(pattern);
      if (match && match[1]) {
        const time = parseInt(match[1]);
        if (match[0].includes('hora') || match[0].includes('h')) {
          duration.totalTime = `PT${time}H`;
        } else {
          duration.totalTime = `PT${time}M`;
        }
      }
    });
    
    return duration;
  }
  
  /**
   * Determina o nível de dificuldade
   */
  private determineDifficulty(content: string): string | undefined {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('fácil') || lowerContent.includes('simples') || lowerContent.includes('básico')) {
      return 'Fácil';
    }
    if (lowerContent.includes('intermediário') || lowerContent.includes('moderado')) {
      return 'Intermediário';
    }
    if (lowerContent.includes('difícil') || lowerContent.includes('avançado') || lowerContent.includes('complexo')) {
      return 'Difícil';
    }
    
    return undefined;
  }
  
  /**
   * Extrai para quem é adequado
   */
  private extractSuitableFor(content: string): string[] {
    const suitableFor: string[] = [];
    const lowerContent = content.toLowerCase();
    
    const audiences = [
      'iniciantes', 'crianças', 'adolescentes', 'adultos', 'idosos',
      'pessoas com ansiedade', 'pessoas com depressão', 'estudantes',
      'profissionais', 'pais', 'cuidadores'
    ];
    
    audiences.forEach(audience => {
      if (lowerContent.includes(audience)) {
        suitableFor.push(audience.charAt(0).toUpperCase() + audience.slice(1));
      }
    });
    
    return suitableFor;
  }
  
  /**
   * Extrai informações nutricionais (benefícios mentais)
   */
  private extractNutritionalInfo(content: string): {
    benefits: string[];
    mentalHealthImpact: string;
  } | undefined {
    const benefits: string[] = [];
    const lowerContent = content.toLowerCase();
    
    const mentalBenefits = [
      'reduz ansiedade', 'diminui estresse', 'melhora humor',
      'aumenta autoestima', 'promove relaxamento', 'melhora sono',
      'aumenta concentração', 'reduz tensão', 'promove bem-estar'
    ];
    
    mentalBenefits.forEach(benefit => {
      if (lowerContent.includes(benefit)) {
        benefits.push(benefit.charAt(0).toUpperCase() + benefit.slice(1));
      }
    });
    
    if (benefits.length > 0) {
      return {
        benefits,
        mentalHealthImpact: 'Prática regular pode contribuir para melhoria da saúde mental e bem-estar geral'
      };
    }
    
    return undefined;
  }
  
  /**
   * Identifica audiência alvo
   */
  private identifyTargetAudience(content: string): string | undefined {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('profissional') || lowerContent.includes('terapeuta')) {
      return 'Profissionais de Saúde Mental';
    }
    if (lowerContent.includes('iniciante') || lowerContent.includes('começando')) {
      return 'Iniciantes em Práticas de Bem-estar';
    }
    if (lowerContent.includes('família') || lowerContent.includes('pais')) {
      return 'Famílias e Cuidadores';
    }
    
    return 'Pessoas interessadas em bem-estar mental';
  }
  
  /**
   * Extrai benefícios esperados
   */
  private extractExpectedBenefits(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('relaxamento') || lowerContent.includes('calma')) {
      return 'Sensação de relaxamento e calma';
    }
    if (lowerContent.includes('energia') || lowerContent.includes('vigor')) {
      return 'Aumento de energia e disposição';
    }
    if (lowerContent.includes('clareza') || lowerContent.includes('foco')) {
      return 'Maior clareza mental e foco';
    }
    
    return 'Melhoria no bem-estar mental';
  }
  
  /**
   * Extrai palavras-chave específicas de receitas
   */
  private extractRecipeKeywords(content: string): string[] {
    const keywords: string[] = [];
    const lowerContent = content.toLowerCase();
    
    const recipeKeywords = [
      'receita de bem-estar', 'rotina saudável', 'autocuidado',
      'prática diária', 'exercício mental', 'técnica de relaxamento',
      'mindfulness', 'meditação', 'respiração', 'sono', 'estresse'
    ];
    
    recipeKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        keywords.push(keyword);
      }
    });
    
    return keywords.length > 0 ? keywords : ['bem-estar mental', 'autocuidado'];
  }
  
  /**
   * Identifica condições de saúde relacionadas
   */
  private identifyHealthConditions(content: string): string[] | undefined {
    const conditions: string[] = [];
    const lowerContent = content.toLowerCase();
    
    const healthConditions = [
      'ansiedade', 'depressão', 'estresse', 'insônia',
      'síndrome do pânico', 'burnout', 'luto'
    ];
    
    healthConditions.forEach(condition => {
      if (lowerContent.includes(condition)) {
        conditions.push(condition.charAt(0).toUpperCase() + condition.slice(1));
      }
    });
    
    return conditions.length > 0 ? conditions : undefined;
  }
  
  /**
   * Valida schema específico para Recipe
   */
  private validateRecipe(schema: any, recipeData: RecipeData): any[] {
    const warnings: any[] = [];
    
    if (recipeData.instructions.length < 2) {
      warnings.push({
        type: 'insufficient_instructions',
        message: 'Poucas instruções identificadas para uma receita completa',
        severity: 'warning',
        suggestion: 'Inclua mais passos detalhados para a prática'
      });
    }
    
    if (!recipeData.duration.totalTime && !recipeData.duration.prepTime) {
      warnings.push({
        type: 'missing_duration',
        message: 'Informação de duração não encontrada',
        severity: 'info',
        suggestion: 'Considere incluir tempo estimado para a prática'
      });
    }
    
    if (!recipeData.ingredients || recipeData.ingredients.length === 0) {
      warnings.push({
        type: 'missing_materials',
        message: 'Materiais necessários não especificados',
        severity: 'info',
        suggestion: 'Liste materiais ou recursos necessários para a prática'
      });
    }
      return warnings;
  }
}

/**
 * Instância exportada do gerador
 */
export const recipeGenerator = new RecipeGenerator();
