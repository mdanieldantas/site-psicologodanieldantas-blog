/**
 * FAQSection Component - Componente de FAQ Interativo
 * 
 * Este é um client component que renderiza uma seção de FAQ com interface
 * expansível, acessível e otimizada para performance. Suporta múltiplas
 * configurações e é compatível com Next.js 15 App Router.
 * 
 * @author Marcos Daniel Gomes Dantas
 * @since 2025-06-20
 * @version 1.0.0
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import type { FAQItem } from '@/lib/faq-utils';

// ========================================================================
// TIPOS E INTERFACES
// ========================================================================

/**
 * Props para o componente FAQSection
 */
export interface FAQSectionProps {
  /** Dados do FAQ processados (vem dos utilitários server-side) */
  faqData: FAQItem[] | null;
  
  /** Título personalizado da seção FAQ */
  titulo?: string;
  
  /** Subtítulo opcional para contexto adicional */
  subtitulo?: string;
  
  /** Se deve mostrar ícones decorativos */
  showIcons?: boolean;
  
  /** Se permite múltiplas perguntas abertas simultaneamente */
  allowMultiple?: boolean;
  
  /** Classe CSS customizada para estilização adicional */
  className?: string;
  
  /** Se deve animar a abertura/fechamento das respostas */
  animated?: boolean;
  
  /** Posição da seção (para analytics e estilização condicional) */
  position?: 'before-content' | 'after-content' | 'before-references' | 'after-references' | 'custom';
  
  /** Se deve mostrar contador de perguntas */
  showCounter?: boolean;
  
  /** Se deve mostrar rodapé com call-to-action */
  showFooter?: boolean;
  
  /** Configurações de acessibilidade */
  accessibility?: {
    /** ID único para a seção (para landmarks) */
    sectionId?: string;
    /** Nível de heading para o título (h2, h3, etc.) */
    headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  };
}

// ========================================================================
// COMPONENTE PRINCIPAL
// ========================================================================

/**
 * Componente FAQ Section
 * 
 * Renderiza uma seção interativa de FAQ com interface expansível,
 * suporte completo a acessibilidade e animações suaves.
 * 
 * @example
 * ```tsx
 * // Uso básico
 * <FAQSection faqData={processedFaq} />
 * 
 * // Uso avançado
 * <FAQSection 
 *   faqData={processedFaq}
 *   titulo="Dúvidas sobre este artigo?"
 *   allowMultiple={true}
 *   position="after-content"
 *   showCounter={true}
 * />
 * ```
 */
const FAQSection: React.FC<FAQSectionProps> = ({
  faqData,
  titulo = "Perguntas Frequentes",
  subtitulo,
  showIcons = true,
  allowMultiple = false,
  className = "",
  animated = true,
  position = 'after-content',
  showCounter = true,
  showFooter = true,
  accessibility = {}
}) => {
  // ========================================================================
  // VALIDAÇÃO E EARLY RETURNS
  // ========================================================================
  
  // Early return se não houver dados válidos
  if (!faqData || !Array.isArray(faqData) || faqData.length === 0) {
    return null;
  }
  // ========================================================================
  // ESTADO E MEMOIZAÇÃO
  // ========================================================================

  // Estado para controlar a hidratação (evita mismatch servidor/cliente)
  const [isHydrated, setIsHydrated] = useState(false);

  // Estado para controlar quais itens estão abertos
  const [openItems, setOpenItems] = useState<Set<string | number>>(new Set());

  // useEffect para marcar quando a hidratação está completa
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Configurações de acessibilidade com defaults
  const accessibilityConfig = useMemo(() => ({
    sectionId: accessibility.sectionId || 'faq-section',
    headingLevel: accessibility.headingLevel || 'h2'
  }), [accessibility]);

  // Validação final dos itens FAQ (memoizada para performance)
  const validFaqItems = useMemo(() => {
    return faqData.filter(item => 
      item && 
      typeof item.pergunta === 'string' && 
      typeof item.resposta === 'string' &&
      item.pergunta.trim() !== '' && 
      item.resposta.trim() !== ''
    );
  }, [faqData]);

  // Se após validação não sobrou nenhum item válido
  if (validFaqItems.length === 0) {
    return null;
  }

  // Função para gerar IDs estáveis baseados no conteúdo
  const generateStableId = useCallback((item: FAQItem, index: number): string => {
    if (item.id) return String(item.id);
    
    // Gera ID baseado no hash da pergunta para ser estável entre servidor/cliente
    const perguntaHash = item.pergunta
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 10);
    
    return `faq-${perguntaHash}-${index}`;
  }, []);

  // ========================================================================
  // HANDLERS E CALLBACKS
  // ========================================================================

  /**
   * Toggle do estado aberto/fechado de um item FAQ
   * Otimizado com useCallback para evitar re-renders desnecessários
   */
  const toggleItem = useCallback((id: string | number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      
      if (newSet.has(id)) {
        // Se já está aberto, fecha
        newSet.delete(id);
      } else {
        // Se não permite múltiplos, fecha todos os outros primeiro
        if (!allowMultiple) {
          newSet.clear();
        }
        // Abre o item atual
        newSet.add(id);
      }
      
      return newSet;
    });
  }, [allowMultiple]);

  /**
   * Handler para teclas de navegação (acessibilidade)
   */
  const handleKeyDown = useCallback((
    event: React.KeyboardEvent,
    itemId: string | number
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleItem(itemId);
    }
  }, [toggleItem]);

  // ========================================================================
  // CONFIGURAÇÕES DINÂMICAS
  // ========================================================================

  // Classes CSS baseadas na posição e configurações
  const sectionClasses = useMemo(() => {
    const baseClasses = "faq-section w-full max-w-4xl mx-auto";
    const positionClasses = {
      'before-content': 'border-b border-[#E8E6E2] pb-8 mb-8',
      'after-content': 'border-t border-[#E8E6E2] pt-8 mt-8',
      'before-references': 'mb-8',
      'after-references': 'mt-8',
      'custom': ''
    };
    
    return `${baseClasses} ${positionClasses[position]} ${className}`;
  }, [position, className]);

  // ========================================================================
  // RENDERIZAÇÃO
  // ========================================================================

  // Componente do título dinâmico baseado no nível de heading
  const TitleComponent = accessibilityConfig.headingLevel;

  return (
    <section 
      id={accessibilityConfig.sectionId}
      className={sectionClasses}
      data-position={position}
      data-testid="faq-section"
      aria-labelledby={`${accessibilityConfig.sectionId}-heading`}
      role="region"
    >
      {/* ========================================================================
          CABEÇALHO DA SEÇÃO
          ======================================================================== */}
      <header className="faq-header mb-8">
        <div className="flex items-center gap-4 mb-4">
          {/* Ícone decorativo */}
          {showIcons && (
            <div 
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#C19A6B]/20 to-[#A57C3A]/20 rounded-full"
              aria-hidden="true"
            >
              <HelpCircle className="w-6 h-6 text-[#C19A6B]" />
            </div>
          )}

          {/* Título principal */}
          <div className="flex-1">
            <TitleComponent 
              id={`${accessibilityConfig.sectionId}-heading`}
              className="text-2xl md:text-3xl font-bold text-[#583B1F] leading-tight"
            >
              {titulo}
              {/* Contador de perguntas */}
              {showCounter && (
                <span className="ml-3 text-lg font-normal text-[#735B43]">
                  ({validFaqItems.length} {validFaqItems.length === 1 ? 'pergunta' : 'perguntas'})
                </span>
              )}
            </TitleComponent>

            {/* Subtítulo opcional */}
            {subtitulo && (
              <p className="mt-2 text-[#735B43] text-lg leading-relaxed">
                {subtitulo}
              </p>
            )}
          </div>

          {/* Linha decorativa */}
          <div 
            className="hidden sm:block w-20 h-1 bg-gradient-to-r from-[#C19A6B] to-transparent rounded-full"
            aria-hidden="true"
          />
        </div>
      </header>

      {/* ========================================================================
          LISTA DE PERGUNTAS E RESPOSTAS
          ======================================================================== */}      <div className="faq-list space-y-4" role="list">
        {validFaqItems.map((item, index) => {
          const itemId = generateStableId(item, index);
          const isOpen = isHydrated && openItems.has(itemId);
          
          return (
            <div 
              key={itemId}
              className="faq-item bg-white border border-[#E8E6E2] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              role="listitem"
            >
              {/* Pergunta (botão expansível) */}
              <button
                onClick={() => toggleItem(itemId)}
                onKeyDown={(e) => handleKeyDown(e, itemId)}
                className="faq-question w-full px-6 py-5 text-left flex items-center justify-between 
                         hover:bg-[#F8F5F0]/50 transition-colors duration-200 
                         focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/50 focus:ring-offset-2
                         group-hover:bg-[#F8F5F0]/30"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${itemId}`}
                type="button"
                data-testid={`faq-question-${itemId}`}
              >
                {/* Texto da pergunta */}
                <span className="text-[#583B1F] font-semibold text-lg md:text-xl pr-6 leading-relaxed flex-1">
                  {item.pergunta}
                </span>

                {/* Ícone de expansão */}
                <div className="flex-shrink-0 ml-4">
                  <div className={`p-1 rounded-full transition-all duration-300 ${
                    isOpen ? 'bg-[#C19A6B]/20 rotate-180' : 'bg-[#C19A6B]/10'
                  }`}>
                    <ChevronDown className="w-5 h-5 text-[#C19A6B] transition-transform duration-300" />
                  </div>
                </div>
              </button>

              {/* Resposta (conteúdo expansível) */}
              <div 
                id={`faq-answer-${itemId}`}
                className={`faq-answer transition-all duration-300 overflow-hidden ${
                  animated 
                    ? (isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0') 
                    : (isOpen ? 'block' : 'hidden')
                }`}
                aria-hidden={!isOpen}
                data-testid={`faq-answer-${itemId}`}
              >
                <div className="px-6 pb-6 pt-2 border-t border-[#F0EBE2]">
                  <div 
                    className="text-[#735B43] leading-relaxed text-base md:text-lg prose prose-slate max-w-none
                             prose-p:mb-3 prose-a:text-[#A57C3A] prose-a:font-medium prose-a:no-underline 
                             hover:prose-a:underline prose-strong:text-[#583B1F] prose-em:text-[#735B43]"
                    dangerouslySetInnerHTML={{ 
                      __html: item.resposta.replace(/\n/g, '<br />') 
                    }}
                  />

                  {/* Metadados opcionais */}
                  {item.metadata?.author && (
                    <div className="mt-4 pt-3 border-t border-[#F0EBE2]/50">
                      <p className="text-sm text-[#735B43]/70 italic">
                        — {item.metadata.author}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>      {/* ========================================================================
          RODAPÉ DA SEÇÃO
          ======================================================================== */}
      {showFooter && isHydrated && (
        <footer className="faq-footer mt-8 pt-6 border-t border-[#E8E6E2]/50 text-center">
          <div className="space-y-3">
            <p className="text-[#735B43] text-base leading-relaxed">
              Não encontrou a resposta que procurava?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/blogflorescerhumano/contato"
                className="inline-flex items-center px-6 py-3 bg-[#C19A6B] text-white font-medium 
                         rounded-lg hover:bg-[#A57C3A] transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/50 focus:ring-offset-2"
              >
                Entre em contato
              </a>
              <span className="text-[#735B43]/70 text-sm">
                ou continue lendo o artigo
              </span>
            </div>
          </div>
        </footer>
      )}
    </section>
  );
};

// ========================================================================
// EXPORT
// ========================================================================

export default FAQSection;
