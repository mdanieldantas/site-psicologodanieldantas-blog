/**
 * Utilitário para extração de FAQ do conteúdo HTML
 * Busca por seções FAQ no HTML do Supabase e converte para objeto estruturado
 */

export interface FAQItem {
  pergunta: string;
  resposta: string;
}

/**
 * Extrai itens de FAQ do HTML baseado na estrutura específica do projeto
 * @param htmlContent - Conteúdo HTML completo do artigo
 * @returns Array de FAQItem ou null se não encontrar FAQ
 */
export function extractFAQFromHTML(htmlContent: string): FAQItem[] | null {
  try {
    // Busca pela div container do FAQ
    const faqRegex = /<div class="faq-accessible"[^>]*>([\s\S]*?)<\/div>/i;
    const faqMatch = htmlContent.match(faqRegex);
    
    if (!faqMatch) {
      console.log('[FAQ Extractor] Nenhuma seção FAQ encontrada no HTML');
      return null;
    }    const faqSection = faqMatch[1];
    
    // Debug: mostra o conteúdo da seção FAQ
    console.log('[FAQ Extractor Debug] Seção FAQ encontrada:', faqSection.substring(0, 200) + '...');
    
    // Extrai todos os blocos <details> dentro da seção FAQ
    const detailsRegex = /<details[^>]*>([\s\S]*?)<\/details>/gi;
    const detailsMatches = [...faqSection.matchAll(detailsRegex)];
    
    console.log('[FAQ Extractor Debug] Quantidade de <details> encontrados:', detailsMatches.length);
    
    if (detailsMatches.length === 0) {
      console.log('[FAQ Extractor] Nenhum item de FAQ encontrado dentro da seção');
      return null;
    }

    const faqItems: FAQItem[] = [];

    for (const [index, detailMatch] of detailsMatches.entries()) {
      const detailContent = detailMatch[1];
      console.log(`[FAQ Extractor Debug] Processando details ${index + 1}:`, detailContent.substring(0, 100) + '...');
      
      // Extrai a pergunta do span com classe faq-question
      const perguntaRegex = /<span class="faq-question"[^>]*>([\s\S]*?)<\/span>/i;
      const perguntaMatch = detailContent.match(perguntaRegex);
      
      // Extrai a resposta da div com classe faq-answer
      const respostaRegex = /<div class="faq-answer"[^>]*>([\s\S]*?)<\/div>/i;
      const respostaMatch = detailContent.match(respostaRegex);
      
      console.log(`[FAQ Extractor Debug] Pergunta encontrada:`, !!perguntaMatch);
      console.log(`[FAQ Extractor Debug] Resposta encontrada:`, !!respostaMatch);
      
      if (perguntaMatch && respostaMatch) {
        const pergunta = cleanText(perguntaMatch[1]);
        const resposta = cleanHtmlContent(respostaMatch[1]);
        
        if (pergunta && resposta) {
          faqItems.push({ pergunta, resposta });
        }
      }
    }

    if (faqItems.length > 0) {
      console.log(`[FAQ Extractor] ${faqItems.length} itens de FAQ extraídos com sucesso`);
      return faqItems;
    }
    
    return null;
    
  } catch (error) {
    console.error('[FAQ Extractor] Erro ao processar HTML:', error);
    return null;
  }
}

/**
 * Gera Schema JSON-LD para FAQ baseado nos itens extraídos
 */
export function generateFAQSchema(
  faqItems: FAQItem[],
  articleTitle: string,
  articleUrl: string,
  authorName: string
) {
  if (!faqItems || faqItems.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${articleUrl}#faq`,
    name: `FAQ - ${articleTitle}`,
    description: `Perguntas frequentes sobre: ${articleTitle}`,
    mainEntity: faqItems.map((faq, index) => ({
      '@type': 'Question',
      '@id': `${articleUrl}#faq-${index + 1}`,
      name: faq.pergunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.resposta,
        author: {
          '@type': 'Person',
          name: authorName
        }
      }
    })),
    about: {
      '@type': 'Article',
      name: articleTitle,
      url: articleUrl
    }
  };
}

/**
 * Limpa texto removendo tags HTML e normalizando espaços
 */
function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Limpa conteúdo HTML preservando links mas removendo formatação desnecessária
 */
function cleanHtmlContent(html: string): string {
  return html
    // Remove tags <p> mantendo conteúdo
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, ' ')
    // Converte links para texto simples com URL
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
    // Remove outras tags HTML
    .replace(/<[^>]*>/g, '')
    // Normaliza espaços
    .replace(/\s+/g, ' ')
    .trim();
}
