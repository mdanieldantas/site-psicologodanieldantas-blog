'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface TableOfContentsProps {
  articleContentId: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
  element: HTMLElement; // Guardar referência ao elemento para cálculo de offsetTop
}

export default function TableOfContents({ articleContentId }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [visible, setVisible] = useState(false); // Se o ToC deve ser renderizado (>=3 headings)
  const [isTocOpen, setIsTocOpen] = useState(false); // Para o modo sanduíche em mobile
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const tocRef = useRef<HTMLDivElement>(null);

  const collectHeadings = useCallback(() => {
    const articleContent = document.getElementById(articleContentId);
    if (!articleContent) return;

    const headingElements = Array.from(articleContent.querySelectorAll('h2, h3')) as HTMLElement[];
    if (headingElements.length < 3) {
      setVisible(false);
      setHeadings([]);
      return;
    }

    const headingsData = headingElements.map((heading, index) => {
      if (!heading.id) {
        const headingText = heading.textContent?.trim() || '';
        heading.id = headingText
          .toLowerCase()
          .replace(/[^\w\\sáàâãéèêíïóôõöúçñ]/g, '') // Mantido o \s para preservar espaços antes de substituir
          .replace(/\s+/g, '-') || `heading-${index}-${Math.random().toString(36).substring(2, 9)}`;
      }
      return {
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName[1]),
        element: heading,
      };
    });

    if (headingsData.length >= 3) {
      setHeadings(headingsData);
      setVisible(true);
    } else {
      setVisible(false);
      setHeadings([]);
    }
  }, [articleContentId]);

  useEffect(() => {
    // Usar requestAnimationFrame para garantir que o DOM esteja pronto
    const animationFrameId = requestAnimationFrame(collectHeadings);
    return () => cancelAnimationFrame(animationFrameId);
  }, [collectHeadings]);

  const handleScroll = useCallback(() => {
    if (!headings.length) return;

    let currentActiveId: string | null = null;
    const scrollPosition = window.scrollY + 200; // Offset para ativar um pouco antes

    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i];
      if (heading.element.offsetTop <= scrollPosition) {
        currentActiveId = heading.id;
        break;
      }
    }
    setActiveHeadingId(currentActiveId);
  }, [headings]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Define o ativo inicial
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


  const mainSectionsCount = headings.filter(heading => heading.level === 2).length;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // Compensar o header fixo
        behavior: 'smooth'
      });
      
      element.style.transition = 'background-color 0.5s ease';
      element.style.backgroundColor = 'rgba(193, 154, 107, 0.1)';
      setTimeout(() => {
        element.style.backgroundColor = 'transparent';
      }, 1500);
      
      window.history.pushState(null, '', `#${id}`);
      if (window.innerWidth < 768) { // md breakpoint
        setIsTocOpen(false); // Fecha o menu sanduíche no mobile após o clique
      }
    }
  };

  const toggleToc = () => {
    setIsTocOpen(!isTocOpen);
  };

  if (!visible || headings.length === 0) {
    return null;
  }

  const renderTocContent = () => (
    <div 
      className="mt-4 md:mt-0 bg-[#F8F5F0] md:bg-transparent p-5 md:p-0 rounded-lg md:rounded-none border border-[#C19A6B]/20 md:border-none shadow-sm md:shadow-none"
    >
      <h4 className="text-lg font-semibold mb-3 text-[#583B1F] flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2 text-[#C19A6B]" 
          fill="none"
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          />
        </svg>
        Índice do artigo: <span className="text-sm font-normal text-[#735B43] ml-1">({mainSectionsCount} seções)</span>
      </h4>
      <ul className="pl-1 md:pl-5 space-y-1.5"> {/* Ajustado space-y e pl para mobile */}
        {headings.map((heading) => (
          <li key={heading.id} className={`${
            heading.level === 3 ? "pl-3 md:pl-4" : ""
          } ${activeHeadingId === heading.id ? 'toc-active-item' : ''}`}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleLinkClick(e, heading.id)}              
              className={`
                flex items-center transition-colors duration-150 ease-in-out
                ${heading.level === 2 ? "text-[#583B1F] hover:text-[#C19A6B] font-medium" : "text-[#735B43] hover:text-[#C19A6B] text-sm"}
                ${activeHeadingId === heading.id ? '!text-[#C19A6B] font-semibold' : ''}
              `}
            >
              {heading.level === 2 && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1.5 text-[#C19A6B] flex-shrink-0" // Adicionado flex-shrink-0
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    strokeWidth={activeHeadingId === heading.id ? 3 : 2} // Mais grosso se ativo
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {heading.level === 3 && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-2 w-2 mr-1.5 text-[#735B43] flex-shrink-0" // Adicionado flex-shrink-0
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="8" />
                </svg>
              )}
              <span className="truncate">{heading.text}</span> {/* Adicionado truncate para textos longos */}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div ref={tocRef} className="mb-8 md:p-5 md:bg-[#F8F5F0] md:rounded-lg md:border md:border-[#C19A6B]/20 md:shadow-sm">
      {/* Botão Sanduíche para Mobile */}
      <div className="md:hidden p-3 bg-[#F8F5F0] rounded-lg border border-[#C19A6B]/20 shadow-sm">
        <button
          onClick={toggleToc}
          className="w-full flex items-center justify-between text-lg font-semibold text-[#583B1F]"
          aria-expanded={isTocOpen}
          aria-controls="toc-content-mobile"
        >
          <span className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2 text-[#C19A6B]" 
              fill="none"
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
            Índice do Artigo
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-[#C19A6B] transition-transform duration-200 ${isTocOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isTocOpen && (
          <div id="toc-content-mobile">
            {renderTocContent()}
          </div>
        )}
      </div>

      {/* Índice Visível para Telas Maiores */}
      <div className="hidden md:block">
        {renderTocContent()}
      </div>
    </div>
  );
}

// Adicione este CSS ao seu arquivo global de estilos (ex: globals.css ou article-styles.css)
/*
.toc-active-item > a {
  color: #A0522D !important; // Sienna, ou sua cor de destaque preferida
  font-weight: 600 !important;
}

.toc-active-item > a svg {
  stroke: #A0522D !important; // Cor do stroke do SVG
  color: #A0522D !important; // Cor do fill do SVG (para o círculo)
}
*/
