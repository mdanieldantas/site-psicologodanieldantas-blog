/**
 * FAQ Utilities - Sistema de Processamento de FAQ
 * 
 * Este módulo fornece utilitários para processar dados de FAQ vindos do Supabase,
 * oferecendo suporte tanto para dados JSON estruturados quanto para HTML legacy.
 * 
 * @author Marcos Daniel Gomes Dantas
 * @since 2025-06-20
 * @version 1.0.0
 */

// ========================================================================
// TIPOS E INTERFACES
// ========================================================================

/**
 * Interface para um item individual de FAQ
 */
export interface FAQItem {
  /** ID único do item (opcional, gerado automaticamente se não fornecido) */
  id?: string | number;
  /** Pergunta do FAQ */
  pergunta: string;
  /** Resposta do FAQ (pode conter HTML básico) */
  resposta: string;
  /** Categoria opcional para agrupamento */
  categoria?: string;
  /** Metadados adicionais */
  metadata?: {
    /** Data de criação */
    created_at?: string;
    /** Data de última atualização */
    updated_at?: string;
    /** Autor da pergunta/resposta */
    author?: string;
  };
}

/**
 * Tipo para dados brutos vindos do Supabase
 * Pode ser JSON array, string JSON, HTML legacy ou null/undefined
 */
export type RawFAQData = FAQItem[] | string | null | undefined;

// ========================================================================
// FUNÇÕES PRINCIPAIS
// ========================================================================

/**
 * Função principal para processar dados de FAQ do Supabase
 * 
 * Esta função é otimizada para server-side components do Next.js 15
 * e oferece backward compatibility com HTML legacy.
 * 
 * @param faqData - Dados brutos do FAQ vindos do banco
 * @returns Array de FAQItem processados ou null se não houver dados válidos
 * 
 * @example
 * ```tsx
 * // No server component
 * const faqData = processFAQData(artigo.faq_data);
 * if (faqData) {
 *   return <FAQSection faqData={faqData} />;
 * }
 * ```
 */
export function processFAQData(faqData: RawFAQData): FAQItem[] | null {
  // Validação inicial - early return para performance
  if (!faqData) {
    return null;
  }

  try {
    // CASO 1: Dados já em formato de array (JSON nativo)
    if (Array.isArray(faqData)) {
      console.log('📋 [FAQ] Processando dados em formato array');
      return validateAndCleanFAQItems(faqData);
    }

    // CASO 2: String (pode ser JSON stringified ou HTML legacy)
    if (typeof faqData === 'string') {
      const trimmedData = faqData.trim();
      
      // Verifica se é JSON válido
      if (trimmedData.startsWith('[') || trimmedData.startsWith('{')) {
        try {
          console.log('📋 [FAQ] Tentando parsear JSON string');
          const parsed = JSON.parse(trimmedData);
          
          if (Array.isArray(parsed)) {
            return validateAndCleanFAQItems(parsed);
          }
          
          // Se for objeto único, converte para array
          if (typeof parsed === 'object' && parsed !== null) {
            return validateAndCleanFAQItems([parsed]);
          }
        } catch (jsonError) {
          console.warn('⚠️ [FAQ] Falha ao parsear JSON, tentando extrair de HTML:', jsonError);
        }
      }

      // CASO 3: HTML legacy - backward compatibility
      if (trimmedData.includes('<') && trimmedData.includes('>')) {
        console.log('📋 [FAQ] Detectado HTML legacy, extraindo FAQ...');
        return extractFAQFromHTML(trimmedData);
      }
    }

    console.warn('⚠️ [FAQ] Formato de dados não reconhecido:', typeof faqData);
    return null;

  } catch (error) {
    console.error('❌ [FAQ] Erro ao processar dados:', error);
    return null;
  }
}

// ========================================================================
// FUNÇÕES DE VALIDAÇÃO E LIMPEZA
// ========================================================================

/**
 * Valida e limpa array de itens FAQ
 * Remove itens inválidos e garante consistência dos dados
 * 
 * @param items - Array bruto de itens FAQ
 * @returns Array validado e limpo
 */
function validateAndCleanFAQItems(items: any[]): FAQItem[] | null {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const validItems: FAQItem[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    // Validação básica de estrutura
    if (!item || typeof item !== 'object') {
      console.warn(`⚠️ [FAQ] Item ${i} não é um objeto válido, pulando...`);
      continue;
    }

    // Validação de campos obrigatórios
    const pergunta = cleanString(item.pergunta || item.question || '');
    const resposta = cleanString(item.resposta || item.answer || item.response || '');

    if (!pergunta || !resposta) {
      console.warn(`⚠️ [FAQ] Item ${i} não possui pergunta ou resposta válida, pulando...`);
      continue;
    }

    // Criação do item validado
    const validItem: FAQItem = {
      id: item.id || `faq-item-${i}`,
      pergunta: pergunta,
      resposta: resposta,
      categoria: cleanString(item.categoria || item.category || ''),
      metadata: {
        created_at: item.created_at || item.createdAt,
        updated_at: item.updated_at || item.updatedAt,
        author: cleanString(item.author || ''),
      }
    };

    validItems.push(validItem);
  }

  console.log(`✅ [FAQ] ${validItems.length} itens validados de ${items.length} originais`);
  
  return validItems.length > 0 ? validItems : null;
}

/**
 * Limpa e sanitiza strings
 * Remove HTML tags desnecessárias e whitespace excessivo
 * 
 * @param str - String para limpar
 * @returns String limpa ou string vazia
 */
function cleanString(str: any): string {
  if (typeof str !== 'string') {
    return '';
  }

  return str
    .trim()
    .replace(/\s+/g, ' ') // Normaliza whitespace
    .replace(/[\r\n]+/g, ' ') // Remove quebras de linha múltiplas
    .substring(0, 5000); // Limite de segurança para evitar textos muito longos
}

// ========================================================================
// BACKWARD COMPATIBILITY - EXTRAÇÃO DE HTML LEGACY
// ========================================================================

/**
 * Extrai dados de FAQ de HTML legacy (backward compatibility)
 * 
 * Esta função suporta vários padrões comuns de FAQ em HTML,
 * permitindo migração gradual do formato antigo para JSON.
 * 
 * @param html - String HTML contendo FAQ
 * @returns Array de FAQItem extraídos ou null
 */
function extractFAQFromHTML(html: string): FAQItem[] | null {
  console.log('🔄 [FAQ] Iniciando extração de HTML legacy...');
  
  const faqItems: FAQItem[] = [];

  try {
    // PADRÃO 1: <details><summary>Pergunta</summary>Resposta</details>
    const detailsPattern = /<details[^>]*>[\s\S]*?<summary[^>]*>(.*?)<\/summary>[\s\S]*?<div[^>]*>(.*?)<\/div>[\s\S]*?<\/details>/gi;
    extractByPattern(html, detailsPattern, faqItems, 'details-summary');

    // PADRÃO 2: <h3>Pergunta</h3><p>Resposta</p>
    const headingPattern = /<h[3-6][^>]*>(.*?)<\/h[3-6]>\s*<p[^>]*>(.*?)<\/p>/gi;
    extractByPattern(html, headingPattern, faqItems, 'heading-paragraph');

    // PADRÃO 3: <strong>Pergunta</strong><br>Resposta
    const strongPattern = /<strong[^>]*>(.*?)<\/strong>\s*<br[^>]*>\s*(.*?)(?=<strong|<\/|$)/gi;
    extractByPattern(html, strongPattern, faqItems, 'strong-br');

    // PADRÃO 4: **Pergunta**\nResposta (Markdown-like)
    const markdownPattern = /\*\*(.*?)\*\*\s*\n(.*?)(?=\*\*|$)/gi;
    extractByPattern(html, markdownPattern, faqItems, 'markdown-like');

    if (faqItems.length > 0) {
      console.log(`✅ [FAQ] ${faqItems.length} itens extraídos de HTML legacy`);
      return faqItems;
    }

    console.warn('⚠️ [FAQ] Nenhum padrão de FAQ reconhecido no HTML');
    return null;

  } catch (error) {
    console.error('❌ [FAQ] Erro na extração de HTML:', error);
    return null;
  }
}

/**
 * Extrai FAQ usando um padrão regex específico
 * 
 * @param html - HTML source
 * @param pattern - Regex pattern
 * @param faqItems - Array para adicionar itens encontrados
 * @param patternName - Nome do padrão para logging
 */
function extractByPattern(
  html: string, 
  pattern: RegExp, 
  faqItems: FAQItem[], 
  patternName: string
): void {
  let match;
  let count = 0;

  while ((match = pattern.exec(html)) !== null && count < 50) { // Limite de segurança
    const pergunta = cleanHTMLString(match[1]);
    const resposta = cleanHTMLString(match[2]);

    if (pergunta && resposta && pergunta.length > 5 && resposta.length > 10) {
      faqItems.push({
        id: `extracted-${patternName}-${count}`,
        pergunta,
        resposta,
        categoria: 'legacy-html',
        metadata: {
          created_at: new Date().toISOString(),
          author: 'html-extractor'
        }
      });
      count++;
    }
  }

  if (count > 0) {
    console.log(`📋 [FAQ] Padrão '${patternName}': ${count} itens extraídos`);
  }
}

/**
 * Limpa HTML específico para FAQ extraído
 * Remove tags HTML mas preserva formatação básica
 * 
 * @param str - String HTML para limpar
 * @returns String limpa
 */
function cleanHTMLString(str: string): string {
  if (!str) return '';

  return str
    .replace(/<script[\s\S]*?<\/script>/gi, '') // Remove scripts
    .replace(/<style[\s\S]*?<\/style>/gi, '') // Remove styles
    .replace(/<[^>]+>/g, ' ') // Remove todas as tags HTML
    .replace(/&nbsp;/g, ' ') // Replace &nbsp;
    .replace(/&amp;/g, '&') // Replace &amp;
    .replace(/&lt;/g, '<') // Replace &lt;
    .replace(/&gt;/g, '>') // Replace &gt;
    .replace(/&quot;/g, '"') // Replace &quot;
    .replace(/&#39;/g, "'") // Replace &#39;
    .replace(/\s+/g, ' ') // Normaliza whitespace
    .trim()
    .substring(0, 2000); // Limite de segurança
}

// ========================================================================
// UTILITÁRIOS AUXILIARES
// ========================================================================

/**
 * Verifica se há dados de FAQ válidos
 * Útil para renderização condicional
 * 
 * @param faqData - Dados para verificar
 * @returns true se há FAQ válido
 */
export function hasFAQData(faqData: RawFAQData): boolean {
  const processed = processFAQData(faqData);
  return processed !== null && processed.length > 0;
}

/**
 * Conta o número de itens de FAQ válidos
 * 
 * @param faqData - Dados para contar
 * @returns Número de itens válidos
 */
export function countFAQItems(faqData: RawFAQData): number {
  const processed = processFAQData(faqData);
  return processed ? processed.length : 0;
}

/**
 * Filtra FAQ por categoria
 * 
 * @param faqData - Dados de FAQ
 * @param categoria - Categoria para filtrar
 * @returns FAQ filtrado por categoria
 */
export function filterFAQByCategory(faqData: RawFAQData, categoria: string): FAQItem[] | null {
  const processed = processFAQData(faqData);
  
  if (!processed) {
    return null;
  }

  const filtered = processed.filter(item => 
    item.categoria && item.categoria.toLowerCase() === categoria.toLowerCase()
  );

  return filtered.length > 0 ? filtered : null;
}

// ========================================================================
// EXPORTS
// ========================================================================

// Todos os tipos e funções já são exportados acima
